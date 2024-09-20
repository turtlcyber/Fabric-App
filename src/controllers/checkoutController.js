const checkoutModel = require("../models/checkoutModel");
const userModel = require("../models/userModel");

// CREATE CHECKOUT
const createCheckout = async (req, res) => {
    try {
        let {
            customerId,
            f_name,
            l_name,
            email,
            mobile,
            address,
            apartment,
            city,
            countryCode,
            post_code,
            state,
            state_code,
            countryName,
            productList,
            totalProduct,
            CGST,
            SGST,
            paymentType,
            tax,
            total,
            grandTotal,
        } = req.body;

        let products = [];

        for (let productData of productList) {
            let { name, fabric, color, pattern, borderType, price, size, occasion, brand, description, categoryName, categoryId, fabricImages, moreDetails } = productData;

            products.push({
                name,
                fabric,
                color,
                pattern,
                borderType,
                price,
                size,
                occasion,
                brand,
                description,
                categoryName,
                categoryId,
                fabricImages,
                moreDetails,
            });
        }

        let checkoutData = {
            customerId,
            f_name,
            l_name,
            email,
            mobile,
            address,
            apartment,
            city,
            countryCode,
            post_code,
            state,
            state_code,
            countryName,
            productList,
            totalProduct,
            CGST,
            SGST,
            paymentType,
            tax,
            total,
            grandTotal,
        };

        let newBooking = await checkoutModel.create(checkoutData);

        return res.status(200).send({
            status: true,
            message: "checkout successfully",
            data: newBooking,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// GET ALL BOOKINGS OF A USER BY USER ID
const getUserAllBookings = async (req, res) => {
    try {
        let { userId } = req.params;
        if (!userId) {
            return res.status(400).send({ status: false, message: "userId is required" });
        }

        let user = await userModel.findOne({ userId });

        if (!user) {
            return res.status(404).send({ status: false, message: "User Not Found" });
        }

        let allBookingsOfAUser = await checkoutModel.find({ userId: user.userId });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allBookingsOfAUser,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};

// CANCEL ORDER BY ORDER ID
const cancelOrderById = async (req, res) => {
    try {
        let { orderId } = req.params;

        if (!orderId) {
            return res.status(400).send({
                status: false,
                message: 'OrderId is required'
            });
        };

        let data = req.body;

        let { status, question, feedback } = data;

        let order = await checkoutModel.findOne({ _id: orderId });

        if (!order) {
            return res.status(404).send({ status: false, message: "Order not found" });
        }

        if (order.status === "Cancelled") {
            return res.status(400).send({ status: false, message: "This order is already cancelled" });
        }

        if (order.status === "Rejected") {
            return res.status(400).send({ status: false, message: "This order is already Rejected" });
        }

        let statusArr = ["Cancelled", "Rejected"];

        if (!statusArr.includes(status)) {
            return res.status(400).send({ status: false, message: "Order status can be only 'Cancelled' or 'Rejected'" });
        }

        let orderStatus = await checkoutModel.findOneAndUpdate(
            { _id: orderId }, 
            { $set: { status: status, question: question, feedback: feedback } }, 
            { new: true }
        );

        return res.status(200).send({
            status: true,
            message: "Order cancelled successfully",
            orderStatus: orderStatus,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


// GET ALL ORDERS
const getAllOrders = async (req, res) => {
    try {
        let allOrders = await checkoutModel.find({});
        return res.status(200).send({
            status: true,
            message: "Order cancelled successfully",
            orderStatus: allOrders,
        });
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message });
    }
};


module.exports = {
    createCheckout,
    getUserAllBookings,
    cancelOrderById,
    getAllOrders
};
