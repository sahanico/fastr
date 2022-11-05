import fs from 'fs';
import path from 'path';

import axios from 'axios';
import PDFLIB from 'pdf-lib';
import _ from 'underscore';

import db from '../db';
import sendEmail from '../send-email';

async function getProcessByName(name: any) {
  const process = await db.Design.findOne({ name });
  if (process) {
    return process;
  }
  return false;
}

async function runFindRecordStep(step: {
  meta: {
    findRecord: {
      object: { text: any };
      conditions: { lhs: any; equality: any; rhs: any }[];
    };
  };
}) {
  const objectName = step.meta.findRecord.object.text;
  const { lhs, equality, rhs } = step.meta.findRecord.conditions[0];
  let record = null;
  if (lhs.type === 'field') {
    if (equality.condition === '==') {
      if (rhs.type === 'literal') {
        const key = `data.${lhs.value}`;
        record = await db.Record.findOne({
          object: objectName,
          [key]: rhs.value,
        });
      } else if (rhs.type === 'variable') {
        // todo
      }
    }
  }

  if (record) {
    return record;
  }
  return false;
}

async function runCreatePdf(
  step: { meta: { object: any; template: any; fields: any } },
  pool: any
) {
  // determine step object

  const {
    object: stepObject,
    template: stepTemplate,
    fields: stepFields,
  } = step.meta;

  const { value: varName } = stepObject;
  const { path: fileName } = stepTemplate;

  // get the pdf form
  const templatePath = path.join('.', 'files', fileName);

  const existingPdfBytes = fs.readFileSync(templatePath);
  const pdfDoc = await PDFLIB.PDFDocument.load(existingPdfBytes);

  const form = pdfDoc.getForm();

  // get the varName from pool
  let variable: { data: { [x: string]: string | undefined } };
  _.each(pool, (item) => {
    if (item.name === varName) {
      variable = item;
    }
  });
  // @ts-ignore
  if (!variable) return false;
  _.each(Object.keys(stepFields), (fieldName) => {
    if (stepFields[fieldName]) {
      const field = form.getTextField(fieldName);
      try {
        field.setText(variable.data[fieldName]);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('e: ', e);
      }
    }
  });

  form.flatten();

  const now = Date.now();

  fs.writeFileSync(
    path.join('.', 'files', `${now}_${varName}.pdf`),
    await pdfDoc.save()
  );

  return { file: `${now}_${varName}.pdf` };
}

async function runEmailStep(
  step: {
    meta: {
      email: { to: { type?: any; value?: any }; subject: any; message: string };
    };
  },
  pool: { [p: string]: void | { data: { [p: string]: any } } }
) {
  let subject;
  let to;
  let message = '';
  const { value } = step.meta.email.to;
  if (step.meta.email.to.type === 'variable') {
    // @ts-ignore
    to = pool[value.variable.name].data[value.variable.field];
  } else {
    // if it is a literal
    to = value.literal;
  }

  if (step.meta.email.subject) {
    subject = step.meta.email.subject;
  }

  if (step.meta.email.message) {
    message = step.meta.email.message;
  }
  const html = `<p> ${message},</p>`;
  await sendEmail({
    to,
    subject,
    html,
    from: undefined,
  });
}

async function runApiStep(
  step: {
    meta: {
      api: { body: any; type?: any; url?: any };
      headers: string | any[];
    };
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _pool: { [p: string]: void | { data: { [p: string]: any } } }
) {
  const { url } = step.meta.api;
  const apiType = step.meta.api.type;
  const apiData = step.meta.api;
  const headers = {};
  for (let i = 0; i < step.meta.headers.length; i++) {
    if (step.meta.headers[i].type === 'literal') {
      // @ts-ignore
      headers[step.meta.headers[i].key] = step.meta.headers[i].value;
    }
  }

  const body = {};
  // @ts-ignore
  for (let i = 0; i < apiData.body.length; i++) {
    if (apiData.body[i].type === 'literal') {
      // @ts-ignore
      body[apiData.body[i].key] = apiData.body[i].value;
    }
  }

  if (apiType === 'Get') {
    const res = await axios({
      method: 'get',
      url,
      headers,
      data: body,
    });
    if (res.status === 200) {
      return res.data;
    }
  } else if (apiType === 'Post') {
    const res = await axios({
      method: 'post',
      url,
      headers,
      data: body,
    });
    if (res.status === 200) {
      return res.data;
    }
  }
  return false;
}

async function runProcess(
  process: { meta: { steps: string | any[] } },
  pool: { [x: string]: void | { data: { [x: string]: any } } },
  inputs: any
) {
  let result;
  for (let i = 0; i < process.meta.steps.length; i++) {
    const step = process.meta.steps[i];
    if (step.type === 'find_record') {
      const record = await runFindRecordStep(step);
      // eslint-disable-next-line no-param-reassign
      pool[step.name] = record;
    } else if (step.type === 'send_email') {
      const email = await runEmailStep(step, pool);
      // eslint-disable-next-line no-param-reassign
      pool[step.name] = email;
    } else if (step.type === 'api_call') {
      result = await runApiStep(step, pool);
    } else if (step.type.value === 'create_pdf') {
      // @ts-ignore
      result = await runCreatePdf(step, pool, inputs);
    }
  }
  return result;
}

export default {
  runProcess,
  getProcessByName,
};
