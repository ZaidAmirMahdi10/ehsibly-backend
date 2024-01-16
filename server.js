// server.js
const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors'); // Add this line

const prisma = new PrismaClient();
const app = express();
const PORT = process.env.PORT || 3001;
const jwt = require('jsonwebtoken');

app.use(express.json());
app.use(cors()); // Enable CORS

app.use(express.json());





app.post('/register', async (req, res) => {
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





app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log(`Login attempt for username: ${username}`);

    // Perform authentication, check if the username and password match a user in the database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user || user.password !== password) {
      console.log(`Authentication failed for username: ${username}`);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    console.log(`User ${username} authenticated successfully`);

    // Generate a token
    const token = jwt.sign({ userId: user.id }, 'your-secret-key', { expiresIn: '1h' });

    // Update the user record with the token
    await prisma.user.update({
      where: { id: user.id },
      data: { token },
    });

    console.log(`Token generated and stored for user: ${username}`);

    // Send the token back to the client
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});





// app.post('/invoices', async (req, res) => {
//   try {
//     const { userId, invoiceNumber, customerName, companyName, containerNumber, amountDinar, amountOtherCurrency, otherCurrency, bankName, received, left, swift, date, notes } = req.body;

//     const newInvoice = await prisma.invoice.create({
//       data: {
//         userId: parseInt(userId, 10), // Parse userId as an integer
//         invoiceNumber: "",
//         customerName: "",
//         containerNumber: "",
//         companyName: "",
//         amountDinar: "",
//         amountOtherCurrency: "",
//         otherCurrency: "",
//         bankName: "",
//         received: "",
//         left: "",
//         swift: "",
//         date: "",
//         notes: ""
//       },
//     });

//     res.json(newInvoice);
//     console.log("Invoice created successfully");
//     console.log(newInvoice);
//   } catch (error) {
//     console.error('Error creating invoice:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });







app.get('/invoices', async (req, res) => {
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
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/invoices', async (req, res) => {
  try {
    const { userId, invoiceNumber, customerName, companyName, containerNumber, amountDinar, amountOtherCurrency, otherCurrency, bankName, received, left, swift, date, notes } = req.body;

    const newInvoice = await prisma.invoice.create({
      data: {
        userId: parseInt(userId, 10), // Parse userId as an integer
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
