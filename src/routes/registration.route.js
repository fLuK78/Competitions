const express = require('express');
const app = express();
const controller = require('../controllers/registrationController');

app.post('/', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ลงทะเบียนแข่งขัน'
  controller.registerCompetition
);

app.get('/player/:playerId', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ดูประวัติการสมัครของผู้เล่น'
  controller.getPlayerHistory
);

app.put('/:id/cancel', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ยกเลิกการสมัคร'
  controller.cancelRegistration
);

app.put('/:id/approve', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'อนุมัติการสมัคร (Admin/Staff)'
  controller.approveRegistration
);

app.put('/:id/reject', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ปฏิเสธการสมัคร (Admin/Staff)'
  controller.rejectRegistration
);

module.exports = app;