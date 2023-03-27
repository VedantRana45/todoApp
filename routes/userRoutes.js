const express = require("express");
const { registerUser, loginUser, logout, createNotes, removeNote, getAllNotes, getUserDetails, editNote, getOneNote } = require("../controller/userController");
const { isAuthenticated } = require("../utils/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/").post(isAuthenticated, getAllNotes).put(isAuthenticated, createNotes);
router.route("/:id").delete(isAuthenticated, removeNote).put(isAuthenticated, editNote);
router.route("/me").post(isAuthenticated, getUserDetails);




module.exports = router;