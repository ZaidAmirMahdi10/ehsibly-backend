// functions/invoices.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  try {
    const { startDate, endDate } = event.queryStringParameters;
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
      body: JSON.stringify(invoices),
    };
  } catch (error) {
    console.error('Error fetching invoices:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  } finally {
    await prisma.$disconnect();
  }
};

