const express = require('express');
const app = express();
const controller = require('../controllers/registrationController');

app.post('/', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ลงทะเบียนสมัครแข่งขัน'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลการสมัคร',
      schema: { $userId: 1, $competitionId: 1 }
  } */
  controller.registerCompetition
);

app.get('/player/:playerId', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ดึงประวัติการสมัครแข่งของผู้เล่นตาม ID'
  controller.getPlayerHistory
);

app.put('/:id/cancel', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ยกเลิกการสมัคร'
  controller.cancelRegistration
);

app.put('/:id/approve', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'อนุมัติการสมัคร (Admin)'
  controller.approveRegistration
);

app.put('/:id/reject', 
  // #swagger.tags = ['Registrations']
  // #swagger.description = 'ปฏิเสธการสมัคร (Admin)'
  controller.rejectRegistration
);

module.exports = app;