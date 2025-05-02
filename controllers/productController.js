const Category = require("../models/Category");
const Products = require("../models/Products");

const { findById, findByIdAndDelete } = require("../services/services");


const addProduct = async (req, res) => {
    try {
        const { title, description, price, stock, images, category } = req.body;

        if (!title || !price || !stock || !category) {
            return res.status(400).send({
                success: false,
                message: 'Title, price, stock, and category are required.'
            });
        }

        // const validCategory = await Category.findById(category);
        const validCategory = await findById(Category, category);
        if (!validCategory) {
            return res.status(400).send({
                success: false,
                message: 'Invalid category ID.'
            });
        }

        const sellerId = req.user._id;

        const newProduct = new Products({
            title,
            description,
            price,
            stock,
            images,
            category,
            seller: sellerId
        });

        await newProduct.save();

        return res.status(201).send({
            success: true,
            message: 'Product added successfully',
            product: newProduct
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to add product',
            error: error.message
        });
    }
};


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


const getSingleProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await findById(Products, id);

        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product fetched successfully',
            product
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch product',
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


const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Products.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product updated successfully',
            product: updatedProduct
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to update product',
            error: error.message
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await findByIdAndDelete(Products, id);

        if (!deletedProduct) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).send({
            success: true,
            message: 'Product deleted successfully',
            product: deletedProduct
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to delete product',
            error: error.message
        });
    }
};


const filterProductsByPrice = async (req, res) => {
    try {
        let { minPrice, maxPrice, page = 1, limit = 10 } = req.body;

        const priceFilter = {};
        if (minPrice) priceFilter.$gte = Number(minPrice);
        if (maxPrice) priceFilter.$lte = Number(maxPrice);

        const query = {};

        if (Object.keys(priceFilter).length > 0) {
            query.price = priceFilter;
        }

        const products = await Products.find(query)
            .select('title price stock') // only required fields
            .skip((page - 1) * limit)
            .limit(Number(limit));

        res.status(200).send({
            success: true,
            message: 'Products filtered successfully',
            page: Number(page),
            limit: Number(limit),
            totalProducts: products.length,
            products
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to filter products',
            error: error.message
        });
    }
};


const getOutOfStockProducts = async (req, res) => {
    try {
        const products = await Products.find({ stock: 0 })
            .select('title price stock images');

        res.status(200).send({
            success: true,
            message: 'Out of stock products fetched successfully',
            totalProducts: products.length,
            products
        });

    } catch (error) {
        console.error(error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to fetch out of stock products',
            error: error.message
        });
    }
};


const searchProducts = async (req, res) => {
    try {
        const { title, categoryName } = req.body;

        const query = {};
        
        if (title) {
            query.title = { $regex: title, $options: 'i' };
        }
        
        if (categoryName) {
            const category = await Category.findOne({ name: { $regex: categoryName, $options: 'i' } });
            if (category) {
                query.category = category._id;
            } else {                
                return res.status(200).send({
                    success: true,
                    message: 'No products found for this category',
                    products: []
                });
            }
        }

        const products = await Products.find(query)
            .populate('category', 'name') // populate category name
            .select('title price stock images category');

        res.status(200).send({
            success: true,
            message: 'Products fetched successfully',
            totalProducts: products.length,
            products
        });

    } catch (error) {
        console.error("Search Error:", error.message);
        res.status(500).send({
            success: false,
            message: 'Failed to search products',
            error: error.message
        });
    }
};




module.exports = {
    getAllProducts,
    getProductsByCategory,
    addProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    filterProductsByPrice,
    getOutOfStockProducts,
    searchProducts
}