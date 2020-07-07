const express = require('express'); //requirement

const connectDB = require('./config/db'); //getting the db.js file

const app = express(); //calling out express

//Connecting database
connectDB();

app.get('/', (req, res) => res.send('API Running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

const PORT = process.env.PORT || 5000; //when we deploy to heroku this port number will be used.

app.listen(PORT, () => console.log(`server started at port ${PORT}`));
