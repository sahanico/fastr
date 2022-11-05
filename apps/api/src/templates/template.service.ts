import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
import PDFLIB from 'pdf-lib';

import db from '../db';
import { PlatformRequest } from '../types';

async function uploadTemplate(req: PlatformRequest, res: Response) {
  const doc = { path: [] };
  const time = new Date().getTime();
  // @ts-ignore
  const { files } = req;
  if (files) {
    let data;
    // eslint-disable-next-line guard-for-in,no-restricted-syntax
    for (const file in files) {
      const name = `${time}_${file}`;
      // @ts-ignore
      const fileData = req.files[file];
      const fileType = Object.keys(fileData)[0];
      const pathUri = fileData[fileType].path;
      const templatePath: string = path.join(
        '.',
        'files',
        `${name}.${fileType}`
      );
      await fs.renameSync(pathUri, templatePath);
      doc.path.push(templatePath as never);

      const existingPdfBytes = fs.readFileSync(templatePath);
      const pdfDoc = await PDFLIB.PDFDocument.load(existingPdfBytes);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      const fieldNames: string[] = [];
      fields.forEach((field) => {
        const getName = field.getName();
        fieldNames.push(getName);
      });
      data = {
        name: `${file}.${fileType}`,
        path: `${name}.${fileType}`,
        fields: fieldNames,
        label: req.body.label,
        description: req.body.description,
      };
      const object = await db.ObjectDictionary.findOne({
        name: req.body.object,
      });
      const { templates } = object._doc;
      templates.push(data);
      await db.ObjectDictionary.findOneAndUpdate(
        { name: req.body.object },
        { templates }
      );
    }
    return res.sendStatus(200);
  }
  return res.sendStatus(500);
}

async function downloadTemplate(req: PlatformRequest | Request, res: Response) {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const filePath = path.join(appRoot, 'files', req.body.path);
  res.contentType('application/octet-stream');
  return res.download(filePath);
}

async function getTemplatesByObject(payload: { object: any }) {
  return db.Template.findOne({ object: payload.object });
}

export default {
  uploadTemplate,
  downloadTemplate,
  getTemplatesByObject,
};
