// const _ = require('underscore');
//
// const auth = require('./data/auth.json');
// const users = require('./data/users.json');
//
// const newUsers = [];
// _.each(users, (user, index) => {
//   const authUser = _.findWhere(auth, { localId: user.userId });
//   if (authUser) {
//     try {
//       newUsers.push({
//         userId: user.userId,
//         phoneNumber: user.phoneNumber,
//         email: user.email,
//         name: user.username,
//         emailVerified: true,
//         legacyPasswordHash: authUser.passwordHash,
//         legacySalt: authUser.salt,
//         lastSignedInAt: new Date(
//           parseInt(authUser.lastSignedInAt)
//         ).toISOString(),
//         createdAt: new Date(parseInt(authUser.createdAt)).toISOString(),
//         authType: 'legacy',
//         role: 'User',
//         approved: true,
//         balance: 0,
//         acceptedTerms: false,
//         addressLine1: '',
//         addressLine2: '',
//         postalCode: '',
//       });
//     } catch (e) {
//       console.log('e: ', e);
//       console.log('index: ', index);
//     }
//   }
// });
// const userString = JSON.stringify(newUsers);
//
// const fs = require('fs');
//
// fs.writeFile('./data/users-2021-02-22.json', userString, () => {});
