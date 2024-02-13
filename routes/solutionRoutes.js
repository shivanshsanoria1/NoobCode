const express = require('express');

const solutionController = require('../controllers/solutionController')

const router = express.Router();

router.get('/:ques_id', solutionController.getSolution)

module.exports = router;