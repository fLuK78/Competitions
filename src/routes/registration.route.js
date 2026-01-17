const express = require('express');
const app = express();
const controller = require('../controllers/registrationController');

app.post('/', controller.registerCompetition);
app.get('/player/:playerId', controller.getPlayerHistory);
app.put('/:id/cancel', controller.cancelRegistration);
app.put('/:id/approve', controller.approveRegistration);
app.put('/:id/reject', controller.rejectRegistration);

module.exports = app;