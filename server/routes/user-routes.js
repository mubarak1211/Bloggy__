const express = require("express");
const { signUp, logIn, getCurrentUser, updateCurrentUser } = require("../controller/user-controller");
const { requireAuth } = require("../middleware/require-auth");

const userRouter = express.Router();

userRouter.post("/signup", signUp);
userRouter.post("/login", logIn);
userRouter.get("/me", requireAuth, getCurrentUser);
userRouter.patch("/me", requireAuth, updateCurrentUser);

module.exports = userRouter;
