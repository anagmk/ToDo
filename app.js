const express = require('express')
const app = express()
const PORT = 3001
const mongoose = require('mongoose'); 
require('dotenv').config();

const todoRouter = require('./routes/todos');
const connectDb = require('./DB/todoDb');
const userRouter = require('./routes/user')
const protect = require('./midleware/auth')

connectDb();

app.use(express.json())
app.use(express.static('public'))

app.use('/api/todos',protect,todoRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log("Server running")
});