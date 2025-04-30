const Users = require("../models/Users");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Products = require("../models/Products");



const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).send({ message: "Name, email, and password are required" });
        }

        let existingUser = await Users.findOne({ email });

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

        const checkUser = await Users.findOne({ email });
        if (!checkUser) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(password, checkUser.password);
        if (!isPasswordValid) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: checkUser._id, email: checkUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "12h" }  // Shorter lifespan
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

//! --------------- Products --------------------

const getAllProducts = async (req, res) => {
    try {
        // Get all products where the seller is approved
        const products = await Products.find()
            .populate({
                path: 'seller',
                match: { role: 'seller', isApproved: true },
                select: 'name email'
            })
            .populate('category', 'name');

        // Filter out products whose seller is not approved (populate match may return null)
        const filteredProducts = products.filter(product => product.seller);

        res.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            products: filteredProducts
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch products',
            error: error.message
        });
    }
};


const getProductsByCategory = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ success: false, message: "Category ID is required" });
        }

        const products = await Products.find({ category: id })
            .populate('category', 'name') 
            .populate('seller', 'name email') 
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            products
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: "Failed to fetch products by category",
            error: error.message
        });
    }
};




module.exports = {
    registerUser,
    loginUser,
    getAllProducts,
    getProductsByCategory
}