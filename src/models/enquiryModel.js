const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const enquirySchema = new mongoose.Schema({

    enquiryId: {
        type: String,
    },
    
    userId: { 
        type: String, 
        default: "" 
    },

    fabricId: { 
        type: ObjectId,
        ref: "Fabric"
    },

    questions: [ String ],

    enquiryData: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model("Enquiry", enquirySchema);