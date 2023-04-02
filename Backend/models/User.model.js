const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    pass: {
        type: String,
        required: true
    },
    failedAttempts: { type: Number, default: 0 },
    lastFailedAttempt: { type: Date },
    status: { type: String, enum: ['active', 'blocked'], default: 'active' },

    blockExpires: { type: Date },

}, { timestamps: true });

const UserModel = mongoose.model("user", userSchema);

module.exports = {
    UserModel,
};
