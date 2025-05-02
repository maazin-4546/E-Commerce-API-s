const Users = require("../models/Users");
const Orders = require("../models/Order");
const { find } = require("../services/services");


const getAllUsers = async (req, res) => {
    try {
        const allUsers = await find(Users);
        return res.status(200).send({
            success: true,
            message: "Users fetched successfully",
            users: allUsers
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch users",
            error: error.message,
        });
    }
};


const getAllOrders = async (req, res) => {
    try {
        const orders = await find(Orders);
        return res.status(200).send({
            success: true,
            message: "Orders fetched successfully",
            orders: orders
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: "Failed to fetch Orders",
            error: error.message,
        });
    }
};


const approveSellers = async (req, res) => {
    try {
        const userId = req.params.id;
        const { isApproved = true } = req.body;

        const updatedUser = await Users.findByIdAndUpdate(
            userId,
            { isApproved },
        );

        if (!updatedUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'User approval status updated',
            user: updatedUser,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to update user approval',
            error: error.message,
        });
    }
};


const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;

        const deleteUser = await Users.findByIdAndDelete(userId)

        if (!deleteUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).send({
            success: true,
            message: 'User deleted',
            user: deleteUser,
        });

    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to delete user approval',
            error: error.message,
        });
    }
};


const allSellers = async (req, res) => {
    try {
        const sellers = await Users.find({ role: 'seller' });

        return res.status(200).send({
            success: true,
            message: 'Seller list fetched successfully',
            sellers,
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).send({
            success: false,
            message: 'Failed to fetch sellers',
            error: error.message,
        });
    }
};



module.exports = {
    getAllUsers,
    approveSellers,
    deleteUser,
    allSellers,
    getAllOrders
}