// functions/getInvoice.js
const { PrismaClient } = require('@prisma/client');
const serverless = require('serverless-http');
const express = require('express');

const prisma = new PrismaClient();
const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, user-id, authorization'); // Add authorization to allowed headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.get('/.netlify/functions/getInvoice', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Log the userId from the request headers
    const userIdHeader = req.headers['user-id'];
    console.log('Received userId from headers:', userIdHeader);

    let invoices;

    if (!userIdHeader) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = parseInt(userIdHeader, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    if (startDate && endDate) {
      invoices = await prisma.invoice.findMany({
        where: {
          userId: {
            equals: userId,
          },
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });
    } else {
      invoices = await prisma.invoice.findMany({
        where: {
          userId: {
            equals: userId,
          },
        },
      });
    }

    res.json(invoices);
    console.log('GET /invoices - Response sent');
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
