import { describe, it, expect } from '@jest/globals';
import app from '../app';
import request from 'supertest';
import db from "../db";

describe("Test example", () => {
  it("PUT /api/user/signup", (done) => {
    request(app)
      .put("/api/user/signup")
      .send({
        firstName: 'Tester',
        lastName: 'Signup',
        email: 'test@test.com',
        phoneNumber: '1231231234',
        address: '123 Fake Street',
        password: 'password',
        confirmPassword: 'password',
        acceptedTerms: true,
      })
      // .expect(200)
      .end(async (err, res) => {
        const user = await db.User.findOne({ email: 'test@test.com' });
        const userRecord = await db.Record.findOne({ object: 'user', 'data.email': 'test@test.com' });
        const accountMemberRecord = await db.Record.findOne({ object: 'account_member', 'data.email': 'test@test.com' });
        const accountRecord = await db.Record.findOne({ object: 'account', 'data.email': 'test@test.com' });
        expect(user.email).toEqual('test@test.com')
        expect(userRecord.data.email).toEqual('test@test.com')
        expect(accountMemberRecord.data.email).toEqual('test@test.com')
        expect(accountRecord.data.email).toEqual('test@test.com')
        if (err) return done(err);
        return done();
      });
  });
});
