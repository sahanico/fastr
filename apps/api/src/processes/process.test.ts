import {beforeAll, beforeEach, describe, expect, it, jest} from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../db';
import data from './data.json';

const sendMailMock = jest.fn();
jest.mock('nodemailer');
const nodemailer = require('nodemailer');
nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock,
  verify: jest.fn(),
});

let auth: any;
describe('Process Tests', () => {
  beforeAll(async () => {
    const signupResponse = await request(app)
      .put('/api/user/signup')
      .send(data.userSignup)
    expect(signupResponse.status).toEqual(200);
    expect(sendMailMock).toHaveBeenCalled();
    const userRecord = await db.Record.findOne({
      object: 'user',
      'data.email': data.userLogin.email,
    });
    await db.Record.updateOne(
      { _id: userRecord.data.userId },
      {
        'data.emailVerified': true,
        'data.approved': true,
        'data.role': 'Designer'
      }
    )
    expect(userRecord.data.email).toEqual(data.userLogin.email);
    const loginResponse = await request(app)
      .post('/api/user/authenticate')
      .send(data.userLogin)
    auth = loginResponse.body;
    expect(loginResponse.status).toEqual(200)
    const createPaymentObject = await request(app)
      .post(`/api/admin/${auth.userId}/create-object`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.paymentObject)
    console.log('createPaymentObject: ', createPaymentObject.body);
    expect(createPaymentObject.status).toEqual(200);
    const createInvoiceObject = await request(app)
      .post(`/api/admin/${auth.userId}/create-object`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.invoiceObject)
    console.log('createInvoiceObject: ', createInvoiceObject.body);
    expect(createInvoiceObject.status).toEqual(200);
    const createPaymentProcess = await request(app)
      .post(`/api/admin/${auth.userId}/create-design`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.paymentProcess)
    console.log('createPaymentProcess: ', createPaymentProcess.body);
    expect(createPaymentProcess.status).toEqual(200);
    const createPaymentEvent = await request(app)
      .post(`/api/admin/${auth.userId}/create-design`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.createPaymentEvent)
    console.log('createPaymentEvent: ', createPaymentEvent.body);
    expect(createPaymentEvent.status).toEqual(200);
    const createInvoiceRecordResponse = await request(app)
      .post(`/api/${auth.userId}/create-record`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.invoiceRecord);
    expect(createInvoiceRecordResponse.status).toEqual(200)
  })
  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });
  it('Find process', async () => {
    const process = await db.Design.findOne({ name: data.paymentProcess.name })
    expect(process.label).toEqual(data.paymentProcess.label)

  });
  it('Create Declined Payment and send email', async () => {
    const createRecordResponse = await request(app)
      .post(`/api/${auth.userId}/create-record`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.createRecord);
    console.log('createRecordResponse: ', createRecordResponse.body);
    expect(createRecordResponse.status).toEqual(200)
    const payment = await db.Record.findOne({ object: 'payment' });
    expect(payment.data.invoice_no).toEqual(100);

    // todo: expect invoice.status to be unpaid
    const invoice = await db.Record.findOne({ 'data.invoice_no': 100 });
    expect(invoice.data.status).toEqual('unpaid');
    expect(sendMailMock).toHaveBeenCalled();
  });
  it('Create Approved Payment, update invoice to paid and send email', async () => {
    const createRecordResponse = await request(app)
      .post(`/api/${auth.userId}/create-record`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.createPaymentApprovedRecord);
    console.log('createRecordResponse: ', createRecordResponse.body);
    expect(createRecordResponse.status).toEqual(200)
    const payment = await db.Record.findOne({ object: 'payment' });
    expect(payment.data.invoice_no).toEqual(100);
  });
});
