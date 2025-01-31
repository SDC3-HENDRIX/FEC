/* eslint-disable no-console */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const dotenv = require('dotenv');
const path = require('path');

const app = express();
const port = 8080;
app.use(express.json());
dotenv.config();

app.use(express.static('client/dist'));

app.use('/atelier', createProxyMiddleware({
  target: '/',
  router: {
    'localhost:8080/atelier': 'http://localhost:3000',
  },
  pathRewrite: {
    atelier: '',
  },
  onProxyReq: function onProxyReq(proxyReq, req) {
    proxyReq.setHeader('Authorization', process.env.API_KEY);
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
}));

app.use('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Catwalk is listening at port ${port}`);
});
