const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: String,
    emailVerified: Boolean,
    passwordHash: String,
    salt: String,
    lastSignedInAt: Date,
    createdAt: Date,
    phoneNumber: String,
    userId: String,
    name: String,
    role: {type: String, required: true},
    approved: Boolean,
    legacyPasswordHash: String,
    legacySalt: String,
    authType: String,
});
userSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        // remove these props when object is serialized
        delete ret._id;
        delete ret.passwordHash;
        delete ret.legacyPasswordHash;
    }
});

module.exports = mongoose.connection.useDb('taxdollar').model('User', userSchema);