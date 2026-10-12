const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
    },

    email :  {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },

    password: {
        type: String,
        required: true,
        minlength: 8
    },

    blogs: [{ type: mongoose.Types.ObjectId, ref: "Blog", required: true }],
})

module.exports =  mongoose.model("User", userSchema);
