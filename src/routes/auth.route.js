const express = require('express');
const app = express();
const controller = require('../controllers/authController');

app.get('/users', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ดึงรายชื่อผู้ใช้ทั้งหมด'
  controller.getAllUsers
);

app.post('/register', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'สมัครสมาชิกใหม่'
  controller.register
);

app.post('/login', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'เข้าสู่ระบบ'
  controller.login
);

module.exports = app;