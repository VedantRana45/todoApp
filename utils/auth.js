const catchAsyncError = require("../middleware/catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require('../model/userModel');

exports.isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return (res.status(401).json({ message: "Please Login" }));
    }

    const decodedData = jwt.verify(token, process.env.SECRET_KEY);

    req.user = await User.findById(decodedData.id)
    // console.log(req.user);
    next();
})