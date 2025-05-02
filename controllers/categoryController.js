const Category = require("../models/Category");
const { findOne, findByIdAndDelete, findById } = require("../services/services");


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


const getSingleCategory = async (req, res) => {
    try {
        const { id } = req.params;        
        const category = await findById(Category, id);

        return res.status(200).send({
            success: true,
            message: "Category fetched successfully",
            category,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch category",
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

        const existingCategory = await findOne(Category, { name });
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


const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;

        const updatedCategory = await Category.findByIdAndUpdate(
            id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!updatedCategory) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category: updatedCategory
        });

    } catch (error) {
        console.error("Update Category Error:", error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};


const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedCategory = await findByIdAndDelete(Category, id);

        if (!deletedCategory) {
            return res.status(404).send({
                success: false,
                message: "Category not found"
            });
        }

        return res.status(200).send({
            success: true,
            message: "Category deleted successfully",
            category: deletedCategory
        });

    } catch (error) {
        console.error("Delete Category Error:", error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};



module.exports = {
    updateCategory,
    availableCategories,
    addCategory,
    deleteCategory,
    getSingleCategory
}