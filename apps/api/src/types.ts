import { Request } from 'express';

export type SendEmail = {
  to: string;
  subject: string;
  html: string;
  from: string | undefined;
};

export type PlatformRequest = Request & {
  auth: {
    id: string;
    role: string;
    ownsToken: (token: string) => boolean;
  };
};
