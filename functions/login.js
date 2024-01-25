// functions/login.js
const { PrismaClient } = require('@prisma/client');
const jwt = require('jsonwebtoken');
const serverless = require('serverless-http');
const express = require('express');

const prisma = new PrismaClient();
const app = express();

// CORS middleware (place it before your route handlers)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.post('/.netlify/functions/login', express.json(), async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(`Login attempt for email: ${email}`);

    // Perform authentication, check if the email and password match a user in the database
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true, username: true, password: true },
    });

    if (!user || user.password !== password) {
      console.log(`Authentication failed for email: ${email}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User ${email} authenticated successfully`);

    // Generate a token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // Update the user record with the token
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    console.log(`Token generated and stored for user: ${email}`);

    // Send the token back to the client
    res.json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
