const express = require('express');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server Initalized!');
});


app.listen(3000)
console.log('Server is running on port http://localhost:3000');