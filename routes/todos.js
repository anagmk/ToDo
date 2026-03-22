const express = require("express");
const router = express.Router();

const {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
} = require('../controllers/todo');

const authMidle = require('../midleware/auth');

router.use(authMidle);

router.get('/', getTodos);
router.post('/', createTodo);
router.put('/:id', updateTodo);
router.delete('/:id', deleteTodo);

module.exports = router;