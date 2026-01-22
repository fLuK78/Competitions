const express = require('express');
const app = express();
const controller = require('../controllers/paymentController');

app.post('/', 
  // #swagger.tags = ['Payments']
  // #swagger.description = 'ชำระเงินค่าสมัคร'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลการชำระเงิน',
      schema: { $registrationId: 1, $amount: 500.00, $method: 'Bank Transfer' }
  } */
  controller.processPayment
);

app.get('/:paymentId', 
  // #swagger.tags = ['Payments']
  // #swagger.description = 'ดึงรายละเอียดการชำระเงินตาม ID'
  controller.getPaymentDetail
);

module.exports = app;