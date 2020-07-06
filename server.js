const express = require('express'); //requirement
const app = express(); //calling out express
app.get('/', (req, res) => res.send('API Running'));
const PORT = process.env.PORT || 5000; //when we deploy to heroku this port number will be used.
app.listen(PORT, () => console.log(`server started at port ${PORT}`));
