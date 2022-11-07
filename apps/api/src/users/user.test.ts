import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import request from 'supertest';

import app from '../app';
import db from '../db';

const sendMailMock = jest.fn(); // this will return undefined if .sendMail() is called

// In order to return a specific value you can use this instead
// const sendMailMock = jest.fn().mockReturnValue(/* Whatever you would expect as return value */);

jest.mock('nodemailer');

const nodemailer = require('nodemailer'); // doesn't work with import. idk why

nodemailer.createTransport.mockReturnValue({
  sendMail: sendMailMock,
  verify: jest.fn(),
});

describe('Test example', () => {
  beforeEach(() => {
    sendMailMock.mockClear();
    nodemailer.createTransport.mockClear();
  });
  it('User Signs up successfully', async () => {
    const email = 'mradul@sahanico.com';
    const signupResponse = await request(app)
      .put('/api/user/signup')
      .send({
        firstName: 'Tester',
        lastName: 'Signup',
        email,
        phoneNumber: '1231231234',
        address: '123 Fake Street',
        password: 'password',
        confirmPassword: 'password',
        acceptedTerms: true,
      })
      expect(signupResponse.status).toEqual(200)
      const user = await db.User.findOne({ email });
      const userRecord = await db.Record.findOne({
        object: 'user',
        'data.email': email,
      });
      const accountMemberRecord = await db.Record.findOne({
        object: 'account_member',
        'data.email': email,
      });
      const accountRecord = await db.Record.findOne({
        object: 'account',
        'data.email': email,
      });
      expect(user.email).toEqual(email);
      expect(userRecord.data.email).toEqual(email);
      expect(userRecord.data.emailVerified).toEqual(false);
      expect(userRecord.data.approved).toEqual(false);
      expect(userRecord.data.email).toEqual(email);
      expect(accountMemberRecord.data.email).toEqual(email);
      expect(accountRecord.data.email).toEqual(email);
      expect(sendMailMock).toHaveBeenCalled();
  });
  it('log in successfully', async() => {
    const email = 'mradul@sahanico.com';
    const userRecord = await db.Record.findOne({
      object: 'user',
      'data.email': email,
    });
    await db.Record.updateOne(
      { _id: userRecord.data.userId },
      {
        'data.emailVerified': true,
        'data.approved': true
      }
    )
    expect(userRecord.data.email).toEqual(email);
    const loginRequest = await request(app)
      .post('/api/user/authenticate')
      .send({
        email,
        password: 'password',
      })
      expect(loginRequest.status).toEqual(200)
      expect(loginRequest.body.email).toEqual(email)
      expect(loginRequest.body.role).toEqual('User')
  })
});
