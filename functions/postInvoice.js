// functions/invoices.js

const { PrismaClient } = require('@prisma/client');
const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');

const prisma = new PrismaClient();
const app = express();
app.use(bodyParser.json());

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

app.post('/.netlify/functions/postInvoice', async (req, res) => {
  try {
    console.log('POST /invoices - Request received'); 
    const { invoiceNumber, customerName, companyName, containerNumber, amountDinar, amountOtherCurrency, otherCurrency, bankName, received, left, swift, date, notes } = req.body;

    const newInvoice = await prisma.invoice.create({
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
        notes
      },
    });

    res.json(newInvoice);
    console.log('POST /invoices - Response sent'); // Add this line
    console.log("Invoice created successfully");
    console.log(newInvoice);
  } catch (error) {
    console.error('Error adding new invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




module.exports = app;
module.exports.handler = serverless(app);

