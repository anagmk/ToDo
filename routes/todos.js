const express = require("express");
const router = express.Router();
const todoModal = require('../modals/todoModal')
const authMidle = require('../midleware/auth')


router.get('/', async (req, res) => {
    try {
        const user = await todoModal.find({ user: req.user.id })
        res.status(200).json(user)
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json("server error")
    }
});

router.post('/', async (req, res) => {
    try {
        console.log(req.user)
        const { title, description, priority } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                error: "Validation failed",
                message: "title and description are required"
            });
        }

        const task = await todoModal.create({ title, description, priority, user: req.user.id });
        res.status(201).json(task);
    } catch (error) {
        console.error("Create task error", error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        res.status(500).json({ error: 'server error', details: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const data = await todoModal.findByIdAndUpdate(req.params.id, { completed: true }, { new: true });
        if (!data) {
            res.status(404).json("didnt updated")
        } else {
            res.status(200).json(data)
        }
    } catch (error) {
        res.status(500).json("server error")
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const data = await todoModal.findByIdAndDelete(req.params.id);
        if (data) {
            res.status(200).json("deleted")
        } else {
            res.status(404).json("list not find")
        }
    } catch (error) {
        res.status(500).json("server error")
    }

})


module.exports = router