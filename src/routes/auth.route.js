const express = require('express');
const app = express(); 
const authController = require('../controllers/authController');

app.get('/users', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'ดึงรายชื่อผู้ใช้ทั้งหมดในระบบ'
  authController.getAllUsers
);

app.post('/register', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'สมัครสมาชิกใหม่ (Player/Admin)'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลสำหรับการสมัครสมาชิก',
      schema: { 
        $name: 'fLuK7899', 
        $email: 'fluk@example.com', 
        $password: '123456', 
        role: 'Player' 
      }
  } */
  authController.register
);

app.post('/login', 
  // #swagger.tags = ['Auth']
  // #swagger.description = 'เข้าสู่ระบบเพื่อรับสิทธิ์การใช้งาน'
  /* #swagger.parameters['body'] = {
      in: 'body',
      description: 'ข้อมูลสำหรับการเข้าสู่ระบบ',
      schema: { 
        $email: 'fluk@example.com', 
        $password: '123456' 
      }
  } */
  authController.login
);

module.exports = app;