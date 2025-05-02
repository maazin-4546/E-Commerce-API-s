const jwt = require('jsonwebtoken');
const Users = require('../models/Users');


const authorize = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.status(401).send({
                    success: false,
                    message: 'Access denied. No token provided.'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await Users.findById(decoded.userId);

            if (!user) {
                return res.status(404).send({
                    success: false,
                    message: 'User not found.'
                });
            }

            if (!user.isApproved) {
                return res.status(403).send({
                    success: false,
                    message: 'User is not approved.'
                });
            }

            if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
                return res.status(403).send({
                    success: false,
                    message: `Access denied. Required role(s): ${allowedRoles.join(', ')}`
                });
            }

            req.user = user;
            next();
            
        } catch (error) {
            console.error(error.message);
            return res.status(401).send({
                success: false,
                message: 'Invalid token.',
                error: error.message
            });
        }
    };
};


module.exports = authorize;
