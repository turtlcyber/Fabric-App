const mongoose = require('mongoose');


const deletedPropertySchema = new mongoose.Schema({
    propertyId: {
        type: String,
    },

    deletedPropertyData: {
        type: String,
    },

    reason: {
        type: String,
    },

    feedback: {
        type: String,
    },

    deletedAt: {
        type: String,
    }
}, {timestamps: true});


module.exports = mongoose.model("DeletedProperty", deletedPropertySchema);