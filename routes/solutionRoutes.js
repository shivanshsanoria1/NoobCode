const express = require('express');

const solutionController = require('../controllers/solutionController')

const router = express.Router();

router.get('/:quesId', solutionController.getSolution)

module.exports = router;