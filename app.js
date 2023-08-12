const express = require('express');
const Mailjs = require('@cemalgnlts/mailjs');

const app = express();

app.use('/static', express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const mailjs = new Mailjs();

let currentEmail;

app.get('/api/generate', async (req, res) => {
  const result = await mailjs.createOneAccount();
  currentEmail = result.data.username;
  res.json({ email: currentEmail });
});

app.get('/api/messages', async (req, res) => {
  const messages = await mailjs.getMessages();
  res.json(messages.data);  
});

app.get('/api/message/:id', async (req, res) => {
  const message = await mailjs.getMessage(req.params.id);
  res.json(message.data);
});


app.listen(3000, () => {
  console.log('App listening on port 3000');
});