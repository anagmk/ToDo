const expense = require('../controllers/expense')
const express = require('express');
const router = express.Router();

router.post('/',expense.newExp)
router.get('/', expense.getExp)
router.delete('/:id', expense.deleteExp)
router.get('/summery',expense.summery)

module.exports = router;
