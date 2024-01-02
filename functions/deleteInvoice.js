// functions/deleteInvoice.js
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

app.delete('/.netlify/functions/deleteInvoice/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: 'Invoice deleted successfully' });
    console.log('DELETE /deleteInvoice - Response sent');
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);
