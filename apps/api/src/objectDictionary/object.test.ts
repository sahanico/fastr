import { beforeAll, describe, expect, it, jest } from '@jest/globals';
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
describe('Record Tests', () => {
  beforeAll(async () => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
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
  })
  it('Create Object', async () => {
    const createPaymentObject = await request(app)
      .post(`/api/admin/${auth.userId}/create-object`)
      .set('Authorization', `Bearer ${auth.jwtToken}`)
      .send(data.paymentObject)
    console.log('createPaymentObject: ', createPaymentObject.body);
    expect(createPaymentObject.status).toEqual(200);
    const paymentObject = await db.ObjectDictionary.findOne({ name: 'payment' });
    expect(paymentObject.label).toEqual('Payment');
  });
});
