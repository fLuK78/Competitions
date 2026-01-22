const express = require('express');
const app = express();
const controller = require('../controllers/approvalController');

app.put('/:id/approve',
  // #swagger.tags = ['Approvals']
  // #swagger.description = 'อนุมัติการลงทะเบียน (Staff/Admin)'
  controller.approveRegistration
);

app.put('/:id/reject',
  // #swagger.tags = ['Approvals']
  // #swagger.description = 'ไม่อนุมัติการลงทะเบียน (Staff/Admin)'
  controller.rejectRegistration
);

module.exports = app;