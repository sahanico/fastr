import { describe, it, expect } from '@jest/globals';
import app from './app';
import request from 'supertest';

describe("Test example", () => {
  it("GET /", (done) => {
    request(app)
      .get("/")
      .expect("Content-Type", /json/)
      .expect(200, done)
    expect(1).toBe(1)
  });
});
