const http = require('http');
const path = require('path');
const express = require('express');
const db = require('./db');
const bodyParser = require('body-parser');
const cors = require('cors');
const hostname = '0.0.0.0';
const port = 3011;
const app = express();
const server = http.createServer(app);
const FirebaseScrypt = require('firebase-scrypt');
const bcrypt = require('bcryptjs');

app.use(cors({
  credentials: true,
  exposedHeaders: ['Set-Cookie'],
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
process.on("uncaughtException", function(err) {
  console.error(err);
});
app.get('/verification/email/:verificationToken', async (req, res) => {
  try {
    const user = await db.User.findOne({ verificationToken: req.params.verificationToken });
    const userRecord = await db.Record.findOne({ object: 'user', 'data.userId': user._id.toString() });

    if (!user) res.status(400).send({ message: 'Verification failed. No user Found' });
    userRecord.data.emailVerified = 'true';
    await db.Record.updateOne({ _id: userRecord._id }, userRecord);
    const currentFilePath = __filename;
    const currentDirectory = path.dirname(currentFilePath);
    const file = path.join(currentDirectory, 'success.html');
    res.status(200).sendFile(file);
  } catch (e) {
    console.log('error: ', e);
  }
});

app.get('/verification/reset-password/:userId', async (req, res) => {
  const user = await db.User.findOne({ userId: req.params.userId });
  if (!user) res.status(400).send({ message: 'Reset failed. No user Found' });

  const currentFilePath = __filename;
  const currentDirectory = path.dirname(currentFilePath);
  const file = path.join(currentDirectory, 'reset-password.html');
  res.status(200).
    sendFile(file);
});

app.post('/verification/reset-password/:userId/reset', async (req, res) => {
  const password = req.body.password
  console.log('req.data: ', req.body);
  try {
    const user = await db.User.findOne({ _id: req.params.userId });
    if (!user) res.status(400).send({ message: 'Reset failed. No user Found' });
    console.log('user: ', user)
    if (user.authType === 'legacy') {
      const firebaseParameter = {
        signerKey: 'h/h6oax0PvR8Kjyz1ZGEnzD4lPacK/EdIJr/d6zFJ9bj2lSSDQVOY+vSrAYZfe9Lc9WSgzPfFLpD+/aV5dLk7w==',
        saltSeparator: 'Bw==',
        rounds: 8,
        memCost: 14,
      }
      const scrypt = new FirebaseScrypt.FirebaseScrypt(firebaseParameter)
      user.legacyPasswordHash = await scrypt.hash(password, user.legacySalt)
    } else {
      console.log('password: ', password);
      console.log('password hash before: ', user.passwordHash);
      user.passwordHash = bcrypt.hashSync(password)
      console.log('password hash: ', user.passwordHash);
      const compare4 = bcrypt.compareSync(password, user.passwordHash);
      console.log('compare4: ', compare4);
    }
    console.log('user: ', user);
    const savedUser = await db.User.updateOne({ _id: user._id.toString() }, user);
    console.log('savedUser: ', savedUser);

    const currentFilePath = __filename;
    const currentDirectory = path.dirname(currentFilePath);
    const file = path.join(currentDirectory, 'success.html');
    res.status(200).
      sendFile(file);
  } catch (e) {
    console.log('error: ', e);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});
