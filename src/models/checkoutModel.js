const mongoose = require("mongoose");

const checkoutSchema = new mongoose.Schema(
    {
        customerId: { type: String },
        f_name: { type: String },
        l_name: { type: String },
        email: { type: String },
        mobile: { type: String },
        address: { type: String },
        apartment: { type: String },
        city: { type: String },
        post_code: { type: String },
        state: { type: String },
        state_code: { type: String },
        countryName: { type: String },
        countryCode: { type: String },
        productList: [
            {
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
                    },
                ],
                moreDetails: [
                    {
                        type: mongoose.Schema.Types.Mixed,
                    },
                ],
            },
        ],
        totalProduct: { type: Number },
        CGST: { type: Number },
        SGST: { type: Number },
        paymentType: { type: String },
        tax: { type: Number },
        total: { type: Number },
        grandTotal: { type: Number },
        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected", "Shipped", "Completed", "Cancelled"],
            default: "Pending"
        },
        question: { type: String },
        feedback: { type: String }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);
