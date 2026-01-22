const express = require('express');
const app = express(); 
const controller = require('../controllers/competitionController');

app.get('/', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ดึงข้อมูลการแข่งขันทั้งหมด (รองรับ keyword ในการค้นหา)'
  controller.getCompetitions
);

app.get('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ดึงข้อมูลการแข่งขันตาม ID'
  controller.getCompetitionById
);

app.get('/:id/slots', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ตรวจสอบจำนวนที่ว่าง (Slots) ของการแข่งขัน'
  controller.getSlots
);

app.post('/', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'สร้างการแข่งขันใหม่'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลสำหรับการสร้างการแข่งขัน',
      schema: { 
        $name: 'ROV Tournament 2026', 
        $date: '2026-02-15', 
        $maxPlayer: 50, 
        detail: 'รายละเอียดเพิ่มเติม' 
      }
  } */
  controller.createCompetition
);

app.put('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'แก้ไขข้อมูลการแข่งขัน'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลที่ต้องการแก้ไข',
      schema: { 
        name: 'Updated Name', 
        date: '2026-03-01', 
        maxPlayer: 60, 
        detail: 'แก้ไขรายละเอียด' 
      }
  } */
  controller.updateCompetition
);

app.delete('/:id', 
  // #swagger.tags = ['Competitions']
  // #swagger.description = 'ลบการแข่งขันออกจากระบบ'
  controller.deleteCompetition
);

module.exports = app;