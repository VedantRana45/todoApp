const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    // cpassword: {
    //     type: String,
    //     required: [true, "Password is required"],
    // },
    notes: [
        {
            title: {
                type: String,
                required: [true, "Title is Required"],
            },
            description: {
                type: String,
                required: [true, "Description is Required"],
            },
            noteCraetedAt: {
                type: Date,
                default: Date.now,
            }
        }
    ],
    craetedAt: {
        type: Date,
        default: Date.now,
    }
});


userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})


userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE,
    })
}


userSchema.methods.comparePassword = async function (loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
}


module.exports = mongoose.model("User", userSchema);