import { Application, Request, Response } from 'express';

import authorize from '../_middleware/authorize';
import Attachment from '../attachments/attachment.controller';
import Design from '../designs/design.controller';
import ObjectDictionary from '../objectDictionary/objectDictionary.controller';
import Payments from '../payments/payment.controller';
import Permission from '../permissions/permission.controller';
import Process from '../processes/process.controller';
import Record from '../records/record.controller';
import Role from '../role';
import Template from '../templates/template.controller';
import UserGroup from '../userGroups/userGroup.controller';
import User from '../users/user.controller';

// todo: fix role for designers
export default (app: Application) => {
  app.get('/api', (req: Request, res: Response) =>
    res.status(200).send({
      message: 'Default Api',
    })
  );
  app.put('/api/user/signup', User.signupSchema, User.signup);
  app.post(
    'api/user/verify-email',
    authorize(),
    User.verifyEmailSchema,
    User.verifyEmail
  );
  app.post(
    '/api/user/authenticate',
    User.authenticateSchema,
    User.authenticate
  );
  app.post('/api/user/refresh-token', User.refreshToken);
  app.post(
    '/api/user/revoke-token',
    authorize(),
    User.revokeTokenSchema,
    User.revokeToken as any
  );
  app.get('/api/user/:id', authorize(), User.getById as any);
  app.post(
    '/api/user/:id',
    authorize(),
    User.updateUserTermsAndConditions as any
  );
  app.get(
    '/api/user/:id/refresh-tokens',
    authorize(),
    User.getRefreshTokens as any
  );
  // todo: remove - no longer using
  // app.post('/api/user/:id/update-user-info', User.updateUserProfile as any);

  app.post(
    '/api/admin/approve-user/:id',
    authorize([Role.Admin]),
    User.approveUser
  );
  app.get(
    '/api/admin/:id/display-all-users',
    authorize([Role.Admin]),
    User.displayAllUsers
  );
  app.get(
    '/api/designer/:id/get-users-for-designers',
    authorize([Role.Designer]),
    User.displayAllUsers
  );
  app.post(
    '/api/designer/:id/create-user-group',
    authorize([Role.Designer]),
    UserGroup.createUserGroup
  );
  app.get(
    '/api/designer/:id/get-user-groups',
    authorize(),
    UserGroup.getUserGroups
  );
  app.post(
    '/api/designer/:id/delete-user-group-by-id',
    authorize([Role.Designer]),
    UserGroup.deleteUserGroupByID
  );
  app.post(
    '/api/designer/:id/update-user-group',
    authorize([Role.Designer]),
    UserGroup.updateUserGroup
  );
  app.get(
    '/api/admin/:id/get-all-objects',
    authorize(),
    ObjectDictionary.getAllObjects
  );
  app.post(
    '/api/admin/:id/create-object',
    authorize(),
    ObjectDictionary.createObject
  );
  app.post(
    '/api/admin/:id/update-object-by-id',
    authorize(),
    ObjectDictionary.updateObjectById
  );
  app.post(
    '/api/admin/:id/delete-object-by-id',
    authorize(),
    ObjectDictionary.deleteObjectById
  );
  app.post(
    '/api/admin/:id/get-object-by-name',
    authorize(),
    ObjectDictionary.getObjectByName
  );
  app.post(
    '/api/admin/:id/get-object-by-id',
    authorize(),
    ObjectDictionary.getObjectById
  );

  app.post(
    '/api/admin/:id/create-object-field',
    authorize(),
    ObjectDictionary.createObjectFields
  );
  app.post(
    '/api/admin/:id/update-object-field',
    authorize(),
    ObjectDictionary.updateObjectFieldById
  );
  app.post(
    '/api/admin/:id/delete-object-field',
    authorize(),
    ObjectDictionary.deleteObjectField
  );

  app.get('/api/admin/:id/get-all-designs', authorize(), Design.getAllDesigns);
  app.get('/api/admin/:id/get-design', authorize(), Design.getDesign);
  app.get(
    '/api/admin/:id/get-all-dashboard-designs',
    authorize(),
    Design.getAllDashboardDesigns
  );
  app.post('/api/admin/:id/create-design', authorize(), Design.createDesign);
  app.post('/api/admin/:id/update-design', authorize(), Design.updateDesign);
  app.post(
    '/api/admin/:id/get-design-by-name',
    authorize(),
    Design.getDesignByName
  );
  app.post(
    '/api/designer/:id/get-designs-by-type',
    authorize([Role.Designer]),
    Design.getDesignsByType
  );
  app.post(
    '/api/admin/:id/get-designs-by-object-name',
    authorize(),
    Design.getDesignsByObjectName
  );
  app.post(
    '/api/designer/:id/delete-design-by-id',
    authorize([Role.Designer]),
    Design.deleteDesignByID
  );
  app.post(
    '/api/designer/:id/delete-design-by-name',
    authorize([Role.Designer]),
    Design.deleteDesignByName
  );

  app.post('/api/admin/:id/create-record', authorize(), Record.createRecord);
  app.post('/api/admin/:id/update-record', authorize(), Record.updateRecord);
  app.get('/api/admin/:id/get-all-records', authorize(), Record.getAllRecords);
  app.post(
    '/api/admin/:id/get-records-by-object',
    authorize(),
    Record.getRecordsByObject
  );
  app.post(
    '/api/admin/:id/get-record-by-object-and-field',
    authorize(),
    Record.getRecordByObjectAndField
  );
  app.post(
    '/api/admin/:id/get-record-by-objectID',
    authorize(),
    Record.getRecordByObjectID
  );
  app.post(
    '/api/admin/:id/get-records-by-object-with-filter',
    authorize(),
    Record.getRecordsByObjectWithFilter
  );
  app.post(
    '/api/admin/:id/get-record-by-name',
    authorize(),
    Record.getRecordByName
  );
  app.post(
    '/api/admin/:id/get-summary-by-object',
    authorize(),
    Record.getSummaryByObject
  );

  app.post(
    '/api/admin/:id/update-permission',
    authorize(),
    Permission.upsertPermission
  );
  app.post(
    '/api/designer/:id/get-permission-by-name',
    authorize([Role.Designer]),
    Permission.getPermissionByName
  );
  app.get(
    '/api/user/:id/get-all-dashboard-permission',
    authorize(),
    Permission.getAllDashboardPermission
  );
  app.post(
    '/api/admin/:id/get-dashboard-by-name',
    authorize(),
    Permission.getDashboardByName
  );
  app.post(
    '/api/designer/:id/delete-permission-by-name',
    authorize([Role.Designer]),
    Permission.deletePermissionByName
  );
  app.get(
    '/api/admin/:id/approval-requests',
    authorize([Role.Admin]),
    User.getApprovalRequests
  );
  app.get('/api/user', authorize(), User.getAll);
  app.get('/api/all-role-user', authorize(), User.getAllRoleUser);
  app.get('/api/all-role-admin', authorize(), User.getAllRoleAdmin);
  app.post('/api/process/run', authorize(), Process.runProcess);

  app.post(
    '/api/admin/:id/upload-attachment',
    authorize(),
    Attachment.uploadAttachment
  );
  app.post(
    '/api/admin/:id/get-attachment-by-record-id',
    authorize(),
    Attachment.getAttachmentsByRecordId
  );
  app.post(
    '/api/admin/:id/download-attachment',
    authorize(),
    Attachment.downloadAttachment
  );

  app.post(
    '/api/admin/:id/upload-template',
    authorize(),
    // @ts-ignore
    Template.uploadTemplate
  );
  app.post(
    '/api/admin/:id/get-templates-by-object',
    authorize(),
    Template.getTemplatesByObject
  );
  app.post(
    '/api/admin/:id/download-template',
    authorize(),
    Template.downloadTemplate
  );

  app.post('/api/payments/getSessionToken', Payments.getSessionToken);
};
