const Category = require("../models/Category");

const availableCategories = async (req, res) => {
    try {
        const categories = await Category.find();

        return res.status(200).send({
            success: true,
            message: "Categories fetched successfully",
            categories,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};



const addCategory = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Category name is required"
            });
        }

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).send({
                success: false,
                message: "Category with this name already exists"
            });
        }

        const newCategory = new Category({
            name,
            description
        });

        await newCategory.save();

        return res.status(201).send({
            success: true,
            message: "Category created successfully",
            category: newCategory
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to create category",
            error: error.message
        });
    }
};


module.exports = {

    availableCategories,
    addCategory
}