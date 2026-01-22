const express = require('express');
const app = express();
const controller = require('../controllers/userController');

app.get('/:id',
  // #swagger.tags = ['Users']
  // #swagger.description = 'ดูข้อมูลผู้ใช้'
  controller.getUserById
);

app.put('/:id',
  // #swagger.tags = ['Users']
  // #swagger.description = 'แก้ไขข้อมูลผู้ใช้'
  controller.updateUser
);

app.delete('/:id',
  // #swagger.tags = ['Users']
  // #swagger.description = 'ลบผู้ใช้'
  controller.deleteUser
);

module.exports = app;