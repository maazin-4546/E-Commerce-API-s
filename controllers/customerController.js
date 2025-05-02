const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { findOne, findById } = require("../services/services");



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Name, email, and password are required" });
        }

        let existingUser = await findOne(Users, { email });

        if (existingUser) {
            return res.status(400).send({ message: "User already registered" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new Users({
            name,
            email,
            password: hashedPassword,
        })

        await newUser.save()

        res.status(200).send({
            sucess: true,
            message: "User registered successfully",
            user: newUser
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({ sucess: false, message: "Failed to register user", error: error.message });
    }
}


const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).send({ message: "Both email and password are required" });
        }

        const checkUser = await findOne(Users, { email });
        if (!checkUser) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        if (!checkUser.isApproved) {
            return res.status(401).send({ message: "Still not approved by Admin" });
        }

        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: checkUser._id, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).send({
            success: true,
            message: "Login successful",
            token,
            user: {
                userId: checkUser._id,
                name: checkUser.name,
                email: checkUser.email,
                role: checkUser.role,
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return res.status(500).send({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
        });

        return res.status(200).send({
            success: true,
            message: 'Logout successful',
        });

    } catch (error) {
        console.error("Logout Error:", error.message);
        return res.status(500).send({
            success: false,
            message: 'Logout failed',
            error: error.message,
        });
    }
};


const updateUserProfile = async (req, res) => {
    try {
        const userId = req.user._id;
        const { name, email, password } = req.body;

        if (!name && !email && !password) {
            return res.status(400).send({ message: "At least one field (name, email, or password) is required to update" });
        }

        const user = await findById(Users, userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
        }

        await user.save();

        return res.status(200).send({
            success: true,
            message: "Profile updated successfully",
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        });

    } catch (error) {
        console.error("Profile Update Error:", error.message);
        return res.status(500).send({
            success: false,
            message: "Profile update failed",
            error: error.message,
        });
    }
}



module.exports = {
    registerUser,
    loginUser,
    updateUserProfile,
    logoutUser
}