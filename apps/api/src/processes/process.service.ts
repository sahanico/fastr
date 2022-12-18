import fs from 'fs';
import path from 'path';

import axios from 'axios';
import { PDFDocument } from 'pdf-lib';
import _ from 'underscore';

import db from '../db';
import sendEmail from '../send-email';
import conditionService from "../conditions/condition.service";
import userService from "../users/user.service";
import ObjectDictionaryService from "../objectDictionary/objectDictionary.service";

async function getProcessByName(name: any) {
  const process = await db.Design.findOne({ name });
  if (process) {
    return process;
  }
  return false;
}
async function createUser(step: any, pool: any) {
  console.log('step: ', step);
  // get the step.meta.user - grab the variable from pool. use the value of the field
  const variable = pool[step.meta.user.email.variable.value.name];
  return userService.create(variable.data[step.meta.user.email.field.value]);
}

async function createRecord(step: any, pool: any) {
  console.log('step: ', step);
  const object = await db.ObjectDictionary.findOne( { name: step.object });
  const record: any = {
    _id: pool['create_user'], // for inviting account members
    object: step.object,
    createdAt: new Date().toISOString(),
  }
  // compose data:
  const data: any = {};
  _.each(step.meta.fields, field => {
    console.log('field: ', field);
    if (field.type === 'field') {
    const variable = pool[field.variable.value.name];
      if (field.variable.value.name === 'create_user') {
        data[field.text] = variable.toString();
      } else {
        data[field.text] = variable.data[field.field.value];
      }
    } else if (field.type === 'literal') {
      data[field.text] = field.value;
    }

    console.log('data: ', data)
  })

  record.data = data;
  console.log('record: ', record);
  const create = await db.Record.create(record);
  if (create) {
    return record;
  }
  return false;
}

async function updateRecord(
    step: {
      label: string,
      name: string,
      type: string,
      object: string,
      meta: {
        conditions: any,
        fields: {
          text: string,
          value: string,
          variable: any,
        }[],
        variable: {
          text: string
          value: {
            name: string,
            object: string,
          }
        },
      }
    },
    pool: any,
) {
  const variable = pool[step.meta.variable.value.name];
  const object = await ObjectDictionaryService.getObjectByName({ name: step.meta.variable.value.object })
  // find and update
  let record = await db.Record.findOne({ _id: variable._id });
  if (!record) {
    record = await db.Record.findOne({ _id: variable.data.id });
  }
  if (record) {
    _.each(step.meta.fields, field => {
      // account member is array - need to append.
      const objectField = _.findWhere(object.fields, { name: field.text });
      if (objectField.type === 'object_array') {
        const value = pool[field.text].data[field.value]
        record.data[field.text].push(value);
      } else if (objectField.type === 'object') {
        const value = pool[field.text].data[field.value]
        record.data[field.text] = value;
      }  else if (objectField.type === 'user') {
        const value = pool[field.variable.value.name].data[field.value]
        record.data[field.text] = value;
      } else {
        record.data[field.text] = field.value;
      }
    })
    try {
      return db.Record.updateOne({ _id: record._id.toString() }, record);
    } catch (e) {
      console.log(e);
    }
  }
  return false;
}

async function runServiceStep(
  step: {
    object: string,
    meta: {
      service: {
        name: string,
        function: string,
        parameters: any
      };
    };
  },
  pool: any,
) {
  const { service } = step.meta;
  if (service.name === 'user') {
    if (service.function === 'approveUser') {
      // get the varName from pool
      const variable = _.filter(pool, item => item.name === step.object)
      return userService.approveUser(variable[0].data[service.parameters[0].field.value]);
    } else if (service.function === 'inviteUser') {
      const variable = _.filter(pool, item => item.name === step.object);
      return userService.inviteUser(variable[0].data[service.parameters[0].field.value])
    }
  }
  return false;
}

async function runFindRecordStep(
    step: {
      object: string,
      meta: {
        conditions: {
          statements: {
            lhs: any; operator: any; rhs: any
          }[];
        };
      };
    },
    pool: any,
) {
  const record = conditionService.runCondition(step.meta.conditions, pool)

  if (record) {
    return record;
  }
  return false;
}
async function runIfStep(
    step: {
      object: string,
      meta: {
        steps: any[],
        conditions: {
          statements: { lhs: any; operator: any; rhs: any }[]
        };
      };
    },
    pool: any,
) {
  const evaluation = await conditionService.runCondition(step.meta.conditions, pool)
  let evaluatedIfStep: any[] = [];
  if (evaluation) {
    evaluatedIfStep = await runProcess({ meta: { steps: step.meta.steps }  }, pool);
  }
  if (evaluatedIfStep.length > 0) {
    return evaluatedIfStep;
  }
  return pool;
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
  const pdfDoc = await PDFDocument.load(existingPdfBytes);

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
        if (typeof variable.data[fieldName] === 'number') {
          field.setText(variable.data[fieldName]?.toString());
        } else {
          field.setText(variable.data[fieldName]);
        }

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
  pool: any
) {
  let subject;
  let to;
  let message = '';
  const { value } = step.meta.email.to;
  if (step.meta.email.to.type === 'variable') {
    // @ts-ignore
    to = pool[value.variable.name.value.name].data[value.field];
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
  try{
    await sendEmail({
      to,
      subject,
      html,
      from: undefined,
    });
    return true;
  } catch(e) {
    return false;
  }
}

async function runApiStep(
  step: {
    meta: {
      api: { body: any; type?: any; url?: any };
      headers: string | any[];
    };
  },
  pool: any[]
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
  pool: any,
) {
  // convert pool to map
  let poolMap = pool
  if (_.isArray(pool)) {
    poolMap =_.object(_.map(pool, (x) => ([x.name, x])));
  }
  let result;
  for (let i = 0; i < process.meta.steps.length; i++) {
    const step = process.meta.steps[i];
    if (step.type === 'find_record') {
      console.log('------------------Find Record------------------');
      poolMap[step.name] = await runFindRecordStep(step, poolMap);
    } else if (step.type === 'send_email') {
      console.log('------------------Send Email------------------');
      poolMap[step.name] = await runEmailStep(step, poolMap);
    } else if (step.type === 'api_call') {
      console.log('------------------Api Call------------------');
      result = await runApiStep(step, poolMap);
    } else if (step.type === 'service_call') {
      console.log('------------------Service Call------------------');
      result = await runServiceStep(step, poolMap);
    } else if (step.type === 'if') {
      console.log('------------------If Step------------------');
      result = await runIfStep(step, poolMap);
    } else if (step.type === 'create_pdf') {
      console.log('------------------Create Pdf------------------');
      result = await runCreatePdf(step, poolMap);
    } else if (step.type === 'update_record') {
      console.log('------------------Update Record------------------');
      poolMap[step.name] = await updateRecord(step, poolMap);
    } else if (step.type === 'create_record') {
      console.log('------------------Create Record------------------');
      poolMap[step.name] = await createRecord(step, poolMap);
    } else if (step.type === 'create_user') {
      console.log('------------------Create User------------------');
      poolMap[step.name] = await createUser(step, poolMap);
    }
  }
  return result || true;
}

export default {
  runProcess,
  getProcessByName,
};
