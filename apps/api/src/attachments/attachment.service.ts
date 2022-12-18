import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';
import _ from 'underscore';

import db from '../db';
import { PlatformRequest } from '../types';

async function uploadAttachment(req: PlatformRequest | Request, res: Response) {
  const doc = { path: [] };
  const time = new Date().getTime();
  const data: { name: string; path: string }[] = [];
  // @ts-ignore
  if (req.files) {
    // @ts-ignore
    // eslint-disable-next-line no-restricted-syntax, guard-for-in, no-unreachable-loop
    for (const file in req.files) {
      const name = `${time}_${file}`;
      // @ts-ignore
      const fileData = req.files[file];
      _.each(Object.keys(fileData), (key) => {
        const pathUri = fileData[key].path;
        const attachmentPath = path.join('.', 'files', `${name}.${key}`);
        data.push({ name: `${file}.${key}`, path: `${name}.${key}` });
        fs.rename(pathUri, attachmentPath, (err) => {
          // eslint-disable-next-line no-console
          console.log('err: ', err);
        });
        doc.path.push(attachmentPath as never);
      });

    }
    // eslint-disable-next-line no-await-in-loop
    await db.Record.findOne({ _id: req.body.record });
    // eslint-disable-next-line no-await-in-loop
    await db.Record.updateOne(
      { _id: req.body.record },
      { 'data.attachments': data }
    );

    return res.sendStatus(200);
  }
  return res.sendStatus(500);
}

async function downloadAttachment(
  req: PlatformRequest | Request,
  res: Response
) {
  // @ts-ignore
  // eslint-disable-next-line no-undef
  const filePath = path.join('.', 'files', req.body.path);
  res.contentType('application/octet-stream');
  return res.download(filePath);
}

async function getAttachmentsByRecordId(payload: { recordId: any }) {
  return db.Attachment.findOne({ record: payload.recordId });
}

export default {
  uploadAttachment,
  downloadAttachment,
  getAttachmentsByRecordId,
};
