// functions/updateInvoice.js
const { PrismaClient } = require('@prisma/client');
const serverless = require('serverless-http');
const express = require('express');

const prisma = new PrismaClient();
const app = express();

// CORS middleware (place it before your route handlers)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, authorization'); // Add authorization to allowed headers
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

app.use(express.json()); // Middleware to parse JSON requests

app.put('/.netlify/functions/updateInvoice/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      invoiceNumber,
      customerName,
      companyName,
      containerNumber,
      amountDinar,
      amountOtherCurrency,
      otherCurrency,
      bankName,
      received,
      left,
      swift,
      date,
      notes,
    } = req.body;

    const updatedInvoice = await prisma.invoice.update({
      where: { id: parseInt(id, 10) },
      data: {
        invoiceNumber,
        customerName,
        companyName,
        containerNumber,
        amountDinar,
        amountOtherCurrency,
        otherCurrency,
        bankName,
        received,
        left,
        swift,
        date,
        notes,
      },
    });

    res.json(updatedInvoice);
    console.log('PUT /updateInvoice - Response sent');
    console.log(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
