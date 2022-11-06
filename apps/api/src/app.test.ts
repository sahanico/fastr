import { describe, expect, it } from '@jest/globals';
import request from 'supertest';

import app from './app';

describe('Test example', () => {
  it('GET /', (done) => {
    request(app).get('/').expect('Content-Type', /json/).expect(200, done);
    expect(1).toBe(1);
  });
});
