const User = require('../model/userModel');
const catchAsyncError = require('../middleware/catchAsyncError');
const sendToken = require('../middleware/sendToken');


exports.registerUser = catchAsyncError(async (req, res) => {
    const { name, email, password, cpassword } = req.body;

    if (!name || !email || !password || !cpassword) {
        return (res.status(422).json({ message: "Please fill All the Data." }));
    }

    if (password !== cpassword) {
        return (res.status(422).json({ message: "Password are not same." }));
    }

    const data = await User.findOne({ email: email });
    if (data) {
        return (res.status(422).json({ message: "Email Already Exist." }));
    }

    const user = await User.create({
        name, email, password
    })

    sendToken(user, 201, res);
}
)


exports.loginUser = catchAsyncError(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return (res.status(200).json({ message: "Please Fill all the Data" }));
    }

    const user = await User.findOne({ email: email });

    if (!user) {
        return (res.status(401).json({ message: "Invalid Email or Password" }));
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return (res.status(401).json({ message: "Invalid Email or Password" }));
    }

    sendToken(user, 200, res);
})


exports.logout = catchAsyncError(async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: "Logged Out",
    })
})


exports.createNotes = catchAsyncError(async (req, res) => {
    const { title, description } = req.body;

    if (!title) {
        return (res.status(422).json({ message: "Please Enter the Title." }));
    }

    const newNote = await User.updateOne({ _id: req.user._id }, {
        $push: {
            notes: {
                title: title,
                description: description
            }
        }
    }, { new: true });

    const user = await User.findById(req.user._id);

    res.status(200).json({
        message: "Note created successfully.",
        user
    })
})


exports.getAllNotes = catchAsyncError(async (req, res) => {

    let user;
    if (req.user) {
        user = await User.findById(req.user._id);
    } else {
        user = null;
    }

    res.status(200).json({
        notes: user.notes
    })
})


exports.removeNote = catchAsyncError(async (req, res) => {
    const newNote = await User.updateOne({ _id: req.user._id }, {
        $pull: {
            notes: {
                _id: req.params.id,
            }
        }
    }, { new: true });

    const { notes } = await User.findById(req.user._id);

    res.status(200).json({
        message: "Note created successfully.",
        notes
    })
})

exports.getUserDetails = catchAsyncError(async (req, res) => {
    let user;
    if (req.user) {
        user = await User.findOne({ _id: req.user._id });
    }
    else {
        user = null;
    }

    res.status(200).json({
        user
    })
})