const todoModal = require('../modals/todoModal');
const expenseModel = require('../modals/expense')

// GET TODOS
const getTodos = async (req, res) => {
    try {
        const todos = await todoModal.find({ user: req.user.id });
        return res.status(200).json(todos);
    } catch (error) {
        console.error("Fetch todos error", error);
        return res.status(500).json("server error");
    }
};

// CREATE TODO
const createTodo = async (req, res) => {
    try {
        const { title, description, priority, cost } = req.body;

        if (!title || !description) {
            return res.status(400).json({
                error: "Validation failed",
                message: "title and description are required"
            });
        }

        const task = await todoModal.create({
            title,
            description,
            priority,
            user: req.user.id,
            cost
        });
        if (task.cost) {
            await expenseModel.create({
                amount: task.cost,
                category: 'other',
                user: req.user.id,
                todo: task._id
            })
        }

        return res.status(201).json(task);
    } catch (error) {
        console.error("Create task error", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({
                error: "Validation failed",
                details: error.errors
            });
        }

        return res.status(500).json({
            error: "server error",
            details: error.message
        });
    }
};

// UPDATE TODO
const updateTodo = async (req, res) => {
    try {
        const updated = await todoModal.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id }, // ownership check
            { completed: true },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json("didnt updated");
        }

        return res.status(200).json(updated);
    } catch (error) {
        return res.status(500).json("server error");
    }
};

// DELETE TODO
const deleteTodo = async (req, res) => {
    try {
        const deleted = await todoModal.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!deleted) {
            return res.status(404).json("list not find");
        }

        return res.status(200).json("deleted");
    } catch (error) {
        return res.status(500).json("server error");
    }
};

module.exports = {
    getTodos,
    createTodo,
    updateTodo,
    deleteTodo
};