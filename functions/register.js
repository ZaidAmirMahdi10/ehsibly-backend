// functions/register.js
const { PrismaClient } = require('@prisma/client');
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

app.post('/.netlify/functions/register', express.json(), async (req, res) => {
  try {
    const { email, username, password, phoneNumber } = req.body;

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password,
        phoneNumber,
      },
    });

    res.json(newUser);
    console.log('User registered successfully');
    console.log(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
