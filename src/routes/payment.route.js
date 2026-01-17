const express = require('express');
const app = express();
const controller = require('../controllers/paymentController');

app.post('/', controller.processPayment);
app.get('/:paymentId', controller.getPaymentDetail);

module.exports = app;