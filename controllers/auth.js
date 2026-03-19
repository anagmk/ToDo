const { genSalt } = require("bcrypt");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwtToken = require('jsonwebtoken')

const userModal = require('../modals/user');

const signUp = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const emailExist = await userModal.findOne({ email })
        if (emailExist) {
            res.status(400).json("Email already exist")
        } else {
            const hashPassword = await bcrypt.hash(password, saltRounds);
            const passSave = await userModal.create({ email, password: hashPassword, name })
            res.status(201).json("Pasword Hashed")
        }

    } catch (error) {
        console.error("Sign up error", error);
        res.status(500).json("Server not responding")
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await userModal.findOne({ email });
        if (!findUser) {
            return res.status(404).json({ error: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, findUser.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Password doesn't match" });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ error: "JWT_SECRET is not configured" });
        }

        const token = jwtToken.sign({ email: findUser.email, id: findUser._id }, process.env.JWT_SECRET, {
            expiresIn: "15m"
        });
        return res.status(200).json({ token });
    } catch (error) {
        console.error("Login error", error);
        return res.status(500).json({ error: "Server error", details: error.message });
    }
}

module.exports = {
    signUp, login
}