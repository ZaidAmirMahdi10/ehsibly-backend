// functions/getInvoices.js
const { PrismaClient } = require('@prisma/client');
const serverless = require('serverless-http');
const express = require('express');

const prisma = new PrismaClient();
const app = express();

// CORS middleware (place it before your route handlers)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.get('/.netlify/functions/getInvoices', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let invoices;

    if (startDate && endDate) {
      invoices = await prisma.invoice.findMany({
        where: {
          date: {
            gte: new Date(startDate),
            lte: new Date(endDate),
          },
        },
      });
    } else {
      invoices = await prisma.invoice.findMany();
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
