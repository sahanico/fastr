import crypto from 'crypto';

import bcrypt from 'bcryptjs';
import { FirebaseScrypt } from 'firebase-scrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import db from '../db';
import Role from '../role';
import sendEmail from '../send-email';
import { PlatformRequest } from '../types';

import { PlatformUser } from './user.model';

function generateJwtToken(user: { id: string }) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign(
    { sub: user.id, id: user.id },
    process.env.JWT_SECRET || 'abcd',
    {
      expiresIn: '3600m',
    }
  );
}

function randomTokenString() {
  return crypto.randomBytes(40).toString('hex');
}

function generateRefreshToken(user: { id: string }, ipAddress: string) {
  // create a refresh token that expires in 1 hour
  return new db.RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + 60 * 60 * 1000),
    createdByIp: ipAddress,
  });
}

function basicDetails(user: PlatformUser) {
  const {
    email,
    verificationToken,
    _id,
    passwordHash,
    authType,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  } = user;
  return {
    email,
    verificationToken,
    _id,
    passwordHash,
    authType,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  };
}

async function authenticate({
  email,
  password,
  ipAddress,
}: {
  email: string;
  password: string;
  ipAddress: string;
}) {
  const user = await db.User.findOne({ email });
  const userRecord = await db.Record.findOne({ _id: user._id });
  if (user._doc.authType === 'legacy') {
    const firebaseParameter = {
      signerKey:
        'h/h6oax0PvR8Kjyz1ZGEnzD4lPacK/EdIJr/d6zFJ9bj2lSSDQVOY+vSrAYZfe9Lc9WSgzPfFLpD+/aV5dLk7w==',
      saltSeparator: 'Bw==',
      rounds: 8,
      memCost: 14,
    };
    const scrypt = new FirebaseScrypt(firebaseParameter);
    const verify = await scrypt.verify(
      password,
      user._doc.legacySalt,
      user._doc.legacyPasswordHash
    );
    if (!verify) {
      throw new Error('Username or password is incorrect');
    }
  } else if (!user || !bcrypt.compareSync(password, user._doc.passwordHash)) {
    throw new Error('Username or password is incorrect');
  }

  const jwtToken = generateJwtToken(user);
  const token = generateRefreshToken(user, ipAddress);

  // save refresh token
  await token.save();

  // return basic details and tokens
  return {
    ...basicDetails(user),
    ...userRecord._doc.data,
    jwtToken,
    refreshToken: token.token,
    expiresIn: '15m',
  };
}

async function getRefreshToken(token: string) {
  const rToken = await db.RefreshToken.findOne({ token }).populate('user');
  if (!rToken || !rToken.isActive) throw new Error('Invalid token');
  return rToken;
}

// eslint-disable-next-line import/no-unused-modules
export async function refreshToken({
  token,
  ipAddress,
}: {
  token: string;
  ipAddress: string;
}) {
  const rtoken = await getRefreshToken(token);
  const { user } = rtoken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  rtoken.revoked = Date.now();
  rtoken.revokedByIp = ipAddress;
  rtoken.replacedByToken = newRefreshToken.token;
  await rtoken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

async function revokeToken({
  token,
  ipAddress,
}: {
  token: string;
  ipAddress: string;
}) {
  const rToken = await getRefreshToken(token);

  // revoke token and save
  rToken.revoked = Date.now();
  rToken.revokedByIp = ipAddress;
  await rToken.save();
}

async function getAll() {
  const users = await db.User.find();
  return users.map((x: PlatformUser) => basicDetails(x));
}

async function getAllRoleUser() {
  const users = await db.User.find({ role: 'User' });
  return users.map((x: PlatformUser) => basicDetails(x));
}

async function getAllRoleAdmin() {
  const users = await db.User.find({ role: 'Admin' });
  return users.map((x: PlatformUser) => basicDetails(x));
}

async function getUser(id: string) {
  if (!db.isValidId(id)) throw new Error('User not found');
  const user = await db.User.findById(id);
  if (!user) throw new Error('User not found');
  return user;
}

async function getById(id: string) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function updateUserTermsAndConditions(
  req: PlatformRequest,
  payload: Record<string, any>
) {
  // todo: update user record, not user.
  const user = await db.User.findOneAndUpdate(
    { userId: req.params.id },
    payload
  );
  const jwtToken = generateJwtToken(user);
  if (user) {
    return {
      ...basicDetails(user._doc),
      ...payload,
      jwtToken,
    };
  }
  return false;
}

async function updateUserProfile(
  req: PlatformRequest,
  payload: Record<string, any>
) {
  // todo: user profile is controlled by user record
  const user = await db.User.findOneAndUpdate(
    { userId: req.params.id },
    payload
  );
  await db.Record.findOneAndUpdate(
    { 'userId: ': req.params.id },
    {
      object: 'account',
      data: payload,
    }
  );
  const jwtToken = generateJwtToken(user);
  if (user) {
    return {
      ...basicDetails(user._doc),
      ...payload,
      jwtToken,
    };
  }
  return false;
}

async function getRefreshTokens(userId: string) {
  // check that user exists
  await getUser(userId);
  // return refresh tokens for user
  return db.RefreshToken.find({ user: userId });
}

async function sendAlreadyRegisteredEmail(
  email: string
  // origin = 'https://www.taxdollar.ca'
) {
  const message = `<p>If you don't know your password please visit the <a href="https://www.taxdollar.ca/sign_in">
        Sign in page and click the forgot password button</a>
        </p>`;

  await sendEmail({
    to: email,
    subject: 'Tax Dollar Sign-up Verification - Email Already Registered',
    html: `<h4>Email Already Registered</h4>
               <p>Your email <strong>${email}</strong> is already registered.</p>
               ${message}`,
    from: undefined,
  });

  return 'email-exists';
}

function hash(password: string) {
  return bcrypt.hashSync(password, 10);
}

async function signup(params: {
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  password: string;
  address: string;
  phoneNumber: string;
}) {
  const userExists = await db.User.findOne({ email: params.email });
  if (userExists) {
    // send already registered error in email to prevent user enumeration
    return sendAlreadyRegisteredEmail(params.email);
  }
  // create user object
  // eslint-disable-next-line no-param-reassign
  params.name = `${params.firstName} ${params.lastName}`;
  const fullName = params.name;
  const date = new Date().toISOString();
  const verificationToken = randomTokenString();
  const userId = new mongoose.Types.ObjectId();
  const user = new db.User({
    _id: userId,
    email: params.email,
    verificationToken,
    passwordHash: hash(params.password),
    authType: 'current',
    createdAt: date,
    createdBy: userId.toString(),
    updatedAt: date,
    updatedBy: userId.toString(),
  });
  // save user
  await user.save();

  const accountRecordId = new mongoose.Types.ObjectId();
  const accountMemberRecordId = new mongoose.Types.ObjectId();

  // Create User, Account, and Account Member Records
  const userRecord = new db.Record({
    _id: userId,
    object: 'user',
    data: {
      email: params.email,
      firstName: params.firstName,
      lastName: params.lastName,
      name: fullName,
      address: params.address,
      role: Role.User,
      approved: false,
      userId: userId.toString(),
      createdAt: date,
      updatedAt: date,
      createdBy: userId.toString(),
      updatedBy: userId.toString(),
      emailVerified: false,
      acceptedTermsDate: date,
      acceptedTerms: true,
      userImage: '',
      account: accountRecordId.toString(),
      accountMember: accountMemberRecordId.toString(),
      phoneNumber: params.phoneNumber,
    },
    createdAt: date,
  });
  await userRecord.save();

  const accountRecord = db.Record({
    _id: accountRecordId,
    object: 'account',
    data: {
      name: fullName,
      balance: 0,
      account_member: [accountMemberRecordId.toString()],
      email: params.email,
      address: params.address,
      phone_number: params.phoneNumber,
      createdAt: date,
      updatedAt: date,
      createdBy: userId.toString(),
      updatedBy: userId.toString(),
    },
  });
  await accountRecord.save();
  const accountMemberRecord = db.Record({
    _id: accountMemberRecordId,
    object: 'account_member',
    data: {
      full_name: fullName,
      phone_number: params.phoneNumber,
      address: params.address,
      account: accountRecordId.toString(),
      user: userId.toString(),
      createdAt: date,
      updatedAt: date,
      createdBy: userId.toString(),
      updatedBy: userId.toString(),
      email: params.email,
    },
  });

  await accountMemberRecord.save();
  try {
    await sendEmail({
      to: params.email, // todo: change email address to const email
      subject: 'Taxdollar - Sign Up Successful',
      html: `<p>Dear ${fullName},</p>\n<p>This is an email  confirmation of the new account you signed up 
        in www.taxdollar.ca</p>\n
        </p>\n<p><b>What to expect Next:</b> </p>\n
        </p>\n<p>An admin will approve your newly created account
        before you can continue to use our exciting services to fulfill all your tax needs ! </p>
        </p>\n<p>You will receive an email confirmation of the approval.</p>\n \n
        </p>\n\n<p>Thank you for choosing Tax Dollar Inc.</p>\n

        <p>Sincerely,</p>\n<p>&nbsp;</p>\n<p>Your
        Tax Dollar Team.
         </p>\n<p>--</p>\n<div>TAXDOLLAR INC.</div>\n<div>25 Watline Av Suite GR #1
         </div>\n<div>Mississauga, ON</div>\n<div>L4Z 2Z1</div>\n<div>Phone : 905 502 9300</div>`,
      from: undefined,
    });
  } catch (e) {
    // eslint-disable-next-line
    console.log('e: ', e);
  }

  return 'created';
}

async function verifyEmail({ token }: { token: string }) {
  // todo: verifyEmail on user record, not user collection
  const user = await db.User.findOne({ verificationToken: token });

  if (!user) throw new Error('Verification failed');
  const userRecord = await db.User.findOne({ _id: user._id });
  userRecord.emailVerified = true;
  user.verificationToken = undefined;
  await userRecord.save();

  user.emailVerified = true;
  user.verificationToken = undefined;
  return user.save();
}

async function getApprovalRequests() {
  // todo: find user records, not users.
  const users = await db.User.find({ approved: false });
  if (users) {
    return users.map((x: PlatformUser) => basicDetails(x));
  }
  return false;
}

async function sendVerificationEmail(
  user: PlatformUser,
  origin = 'https://www.taxdollar.ca'
) {
  let message;

  if (origin) {
    const verifyUrl = `${origin}/verification/email/${user.verificationToken}`;
    message = `<p>Please click the below link to verify your email address:</p>
                   <p><a href="${verifyUrl}">${verifyUrl}</a></p>`;
  } else {
    message = `<p>Please use the below token to verify your email address with the <code>/user/verify-email</code> api route:</p>
                   <p><code>${user.verificationToken}</code></p>`;
  }
  return sendEmail({
    to: user.email,
    subject: 'Tax Dollar Sign-up Verification - Verify Email',
    html: `<h4>Verify Email</h4>
               <p>Thanks for registering!</p>
               ${message}`,
    from: undefined,
  });
}

async function approveUser(userId: string) {
  // todo: update user Record,
  const user = await db.User.findOne({ userId });
  const userRecord = await db.User.findOne({ _id: user._id });
  if (!userRecord.approved) {
    userRecord.approved = true;
    await userRecord.save();
  }

  if (!user.approved) {
    user.approved = true;
    await user.save();
    await sendVerificationEmail(user);
    return true;
  }
  return false;
}

async function resetPassword(req: PlatformRequest) {
  const user = await db.User.findOne({ email: req.params.email });
  if (user) {
    await sendEmail({
      to: req.params.email,
      subject: 'Tax Dollar - Reset Password',
      html: `<h4>Reset Password</h4>
               <p>Please 
               <a href="www.taxdollar.ca/verification/reset-password/${user.userId}">
                click here
               </a> (www.taxdollar.ca/verification/reset-password/${user.userId})
               to reset your password</p>`,
      from: undefined,
    });
    return true;
  }

  return false;
}

async function displayAllUsers() {
  // todo: update user record, not user.
  return db.User.find();
}

export default {
  displayAllUsers,
  approveUser,
  resetPassword,
  getApprovalRequests,
  verifyEmail,
  signup,
  getRefreshTokens,
  updateUserProfile,
  updateUserTermsAndConditions,
  getById,
  getAllRoleAdmin,
  getAllRoleUser,
  getAll,
  revokeToken,
  authenticate,
  refreshToken,
};
