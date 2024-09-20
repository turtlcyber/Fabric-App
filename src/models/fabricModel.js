const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;


const fabricSchema = new mongoose.Schema({
    name: { type: String },
    fabric: { type: String },
    color: { type: String },
    pattern: { type: String },
    borderType: { type: String },
    price: { type: Number },
    size: { type: String },
    occasion: { type: String },
    brand: { type: String },
    description: { type: String },
    categoryName: { type: String },
    categoryId: { type: String },
    fabricImages: [
        {
            fileName: { type: String },
            filePath: { type: String },
        }
    ],
    moreDetails: [
        {
            type: mongoose.Schema.Types.Mixed,
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Fabric", fabricSchema);