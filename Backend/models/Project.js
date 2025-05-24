const mongoose = require('mongoose');

const prjSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    ID: {
        type: String,              // Using String for alphanumeric OTP
        required: true,
        unique: true               // Ensures uniqueness at DB level
    },
    description: {
        type: String,
        trim: true
    },
    components: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Component"
        }
    ],
    team: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now           // Use function, not Date.now()
    },
    projectGuide: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

// ✅ Correct export using mongoose.model()
module.exports = mongoose.model("Project", prjSchema);
