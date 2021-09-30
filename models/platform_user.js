const mongoose = require('mongoose');

const platformUserSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    contact_no: { type: String },
    password: { type: String },
    image_url: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, {
    timestamps: true
});

module.exports = mongoose.model('platform_user', platformUserSchema);