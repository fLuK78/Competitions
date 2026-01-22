const express = require('express');
const app = express();
const controller = require('../controllers/paymentController');

app.post('/', 
  // #swagger.tags = ['Payments']
  // #swagger.description = 'ชำระเงิน'
  controller.processPayment
);

app.get('/:paymentId', 
  // #swagger.tags = ['Payments']
  // #swagger.description = 'ดึงรายละเอียดการชำระเงิน'
  controller.getPaymentDetail
);

module.exports = app;