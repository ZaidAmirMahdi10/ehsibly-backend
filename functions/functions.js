// functions/invoices.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
};

exports.handler = async (event, context) => {
  try {
    const { httpMethod, queryStringParameters, body } = event;

    if (httpMethod === 'OPTIONS') {
      // Handle preflight requests
      return {
        statusCode: 200,
        headers,
        body: 'Preflight request received',
      };
    }

    if (httpMethod === 'GET') {
      // Handle GET requests
      const { startDate, endDate } = queryStringParameters;
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

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(invoices),
      };
    }

    if (httpMethod === 'POST') {
      // Handle POST requests
      const { invoiceNumber, amountDinar, amountUS, amountRNB, customerNumber, notes, swift, date } = JSON.parse(body);

      const newInvoice = await prisma.invoice.create({
        data: {
          invoiceNumber,
          amountDinar,
          amountUS,
          amountRNB,
          customerNumber,
          notes,
          swift,
          date,
        },
      });

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newInvoice),
      };
    }

    if (httpMethod === 'PUT') {
      // Handle PUT requests
      const { id } = event.pathParameters;
      const { invoiceNumber, amountDinar, amountUS, amountRNB, customerNumber, notes, swift, date } = JSON.parse(body);

      const updatedInvoice = await prisma.invoice.update({
        where: { id: parseInt(id, 10) },
        data: {
          invoiceNumber,
          amountDinar,
          amountUS,
          amountRNB,
          customerNumber,
          notes,
          swift,
          date,
        },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(updatedInvoice),
      };
    }

    if (httpMethod === 'DELETE') {
      // Handle DELETE requests
      const { id } = event.pathParameters;

      await prisma.invoice.delete({
        where: { id: parseInt(id, 10) },
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: 'Invoice deleted successfully' }),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: 'Not Found',
    };
  } catch (error) {
    console.error('Error handling request:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  } finally {
    await prisma.$disconnect();
  }
};
