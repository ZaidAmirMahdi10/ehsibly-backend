// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Add this line

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors()); // Enable CORS

app.use(express.json());

app.get('/invoices', async (req, res) => {
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
    } catch (error) {
      console.error('Error fetching invoices:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

app.post('/invoices', async (req, res) => {
  try {
    const { invoiceNumber, customerName, companyName, containerNumber, amountDinar, amountOtherCurrency, otherCurrency, bankName, received, left, swift, date, notes } = req.body;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber, 
        customerName,
        containerNumber,
        companyName, 
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
    console.log("Invoice created successfully");
    console.log(newInvoice);
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { invoiceNumber, customerName, companyName, containerNumber, amountDinar, amountOtherCurrency, otherCurrency, bankName, received, left, swift, date, notes } = req.body;

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
        notes
      },
    });

    res.json(updatedInvoice);
    console.log("Invoice updated successfully");
    console.log(updatedInvoice);
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/invoices/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.invoice.delete({
      where: { id: parseInt(id, 10) },
    });

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
