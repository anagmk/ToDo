const mongoose = require('mongoose');
const expense = require('../modals/expense');
const todoModal = require('../modals/todoModal');
const todo = require('../controllers/todo')

const newExp = async (req, res) => {
    try {
        const { category, description, amount, todo } = req.body;

        if (!category || !amount) {
            return res.status(400).json({
                error: "Expense creation",
                message: "category and amount are required"
            });
        }
        await expense.create({ category, description, amount, user: req.user.id, todo })
        res.status(201).json("New expense")

    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });
    }
}

const getExp = async (req, res) => {
    try {
        const user = await expense.find({ user: req.user.id })
        res.status(200).json(user)
    } catch (error) {
        res.status(500).json({ error: 'server error', details: error.message });

    }
}

const deleteExp = async (req, res) => {
    try {
        const data = await expense.findByIdAndDelete(req.params.id);
        if (data) {
            res.status(200).json("deleted")
        } else {
            res.status(404).json("Expense not find")
        }
    } catch (error) {
        res.status(500).json("server error")

    }
}

const summery = async (req, res) => {
    try {
        const cost = await expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: "$category", total: { $sum: "$amount" } } }])
        const total = await expense.aggregate([
            { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ])
        res.status(200).json({ total, breakdown: cost })
    } catch (error) {
        res.status(500).json("server error")

    }
}

module.exports = {
    newExp,
    getExp,
    deleteExp,
    summery
}