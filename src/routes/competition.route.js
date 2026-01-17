const express = require('express');
const app = express(); // เปลี่ยนจาก Router เป็น app
const controller = require('../controllers/competitionController');

app.get('/', controller.getCompetitions);
app.get('/:id', controller.getCompetitionById);
app.get('/:id/slots', controller.getSlots);
app.post('/', controller.createCompetition);
app.put('/:id', controller.updateCompetition);
app.delete('/:id', controller.deleteCompetition);

module.exports = app;