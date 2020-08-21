const express = require('express'); // requirement
const connectDB = require('./config/db'); // getting the db.js file
const path = require('path');

const app = express(); // calling out express

// Connecting database
connectDB();

// Init Middleware
app.use(express.json({ extened: false }));

// Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000; // when we deploy to heroku this port number will be used.

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
