// const _ = require('underscore');
//
// const files = require('./data/files.json');
//
// const allDocuments = [];
//
// const sentDocuments = _.filter(files, (file) => {
//   return file.transaction === 'send';
// });
//
// _.each(sentDocuments, (document, index) => {
//   try {
//     let path = '';
//     if (document.storagePath) {
//       path += document.storagePath.toString().split('.com/o/')[1];
//       path = path.split('?alt')[0];
//       path = decodeURIComponent(path);
//     }
//
//     allDocuments.push({
//       description: document.notes,
//       type: document.documentType,
//       year: document.year,
//       fromUserId: document.fromUserId,
//       path: [path],
//       toUserId: document.toUserId,
//       name: document.filename,
//       timestamp: document.timestamp,
//       legacyId: document.fileId,
//       transaction: 'outbound',
//     });
//   } catch (e) {}
// });
//
// const recvDocs = _.filter(files, (file) => {
//   return file.transaction === 'recieve';
// });
//
// _.each(recvDocs, (document, index) => {
//   try {
//     let path = '';
//     if (document.storagePath) {
//       path += document.storagePath.toString().split('.com/o/')[1];
//       path = path.split('?alt')[0];
//       path = decodeURIComponent(path);
//     }
//     allDocuments.push({
//       fromUserId: document.userId,
//       path: [path],
//       name: document.filename,
//       timestamp: document.timestamp,
//       legacyId: document.fileId,
//       transaction: 'inbound',
//     });
//   } catch (e) {}
// });
//
// const fs = require('fs');
//
// fs.writeFile(
//   './data/documents-2021-02-21.json',
//   JSON.stringify(allDocuments),
//   () => {}
// );
