const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: { type: String, unique: true },
    name: String,
    number: String,
    fatherName: String,
    motherName: String,
    age: Number,
    gender: String,
    address: {
        state: String,
        city: String,
        district: String,
        pinCode: String,
        fullAddress: String
    },
    photoPath: String,
    signaturePath: String,
    extraDocPath: String,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);