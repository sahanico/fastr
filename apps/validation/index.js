const http = require('http');
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

app.get('/verification/email/:verificationToken', async (req, res) => {
  try {
    const user = await db.User.findOne({ verificationToken: req.params.verificationToken });
    if (!user) res.status(400).send({ message: 'Verification failed. No user Found' });
    user.emailVerified = true;
    user.verificationToken = undefined;
    await user.save();
    res.status(200).
      sendFile('/home/ubuntu/workspaces/taxdollar/taxdollar-verification/success.html');
  } catch (e) {
    console.log('error: ', e);
  }
});

app.get('/verification/reset-password/:userId', async (req, res) => {
  const user = await db.User.findOne({ userId: req.params.userId });
  if (!user) res.status(400).send({ message: 'Reset failed. No user Found' });
  res.status(200).
    sendFile('/home/ubuntu/workspaces/taxdollar/taxdollar-verification/reset-password.html');
});

app.post('/verification/reset-password/:userId/reset', async (req, res) => {
  const password = req.body.password
  console.log('req.data: ', req.body);
  try {
    const user = await db.User.findOne({ userId: req.params.userId });
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
      user.passwordHash = bcrypt.hashSync(password)
    }
    console.log('user: ', user);
    await user.save();
    res.status(200).
      sendFile('/home/ubuntu/workspaces/taxdollar/taxdollar-verification/success.html');
  } catch (e) {
    console.log('error: ', e);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at https://${hostname}:${port}/`);
});
