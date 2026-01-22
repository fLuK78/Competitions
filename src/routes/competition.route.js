const express = require('express');
const app = express(); 
const controller = require('../controllers/competitionController');

app.get('/', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ดึงข้อมูลการแข่งขันทั้งหมด'
  controller.getCompetitions
);

app.get('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ดึงข้อมูลการแข่งขันตาม ID'
  controller.getCompetitionById
);

app.get('/:id/slots', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ตรวจสอบจำนวนที่ว่าง'
  controller.getSlots
);

app.post('/', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'สร้างการแข่งขันใหม่'
  controller.createCompetition
);

app.put('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'แก้ไขข้อมูลการแข่งขัน'
  controller.updateCompetition
);

app.delete('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ลบการแข่งขัน'
  controller.deleteCompetition
);

module.exports = app;