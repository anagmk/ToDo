const express = require('express')
const app = express()
const PORT = process.env.PORT || 3001
const mongoose = require('mongoose'); 
require('dotenv').config();

const todoRouter = require('./routes/todos');
const connectDb = require('./DB/todoDb');
const userRouter = require('./routes/user')
const protect = require('./midleware/auth')
const expenseRouter = require('./routes/expense')

connectDb();

app.use(express.json())
app.use(express.static('public'))

app.use('/api/todos',protect,todoRouter);
app.use('/api/user', userRouter);
app.use('/api/expense', protect,expenseRouter);

app.listen(PORT, () => {
    console.log("Server running")
});