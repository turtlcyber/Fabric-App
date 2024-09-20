const express = require('express');
const router = express.Router();

const { 
    createCheckout,
    getUserAllBookings,
    cancelOrderById,
    getAllOrders,
} = require('../../controllers/checkoutController');

// CREATE CHECKOUT
router.post("/api/v1/createCheckout", createCheckout);

// GET ALL ORDERS OF A USER
router.get("/api/v1/getAllOrdersOfAUser/:userId", getUserAllBookings);

// CANCEL ORDER BY ORDER ID
router.put("/api/v1/cancelOrder/:orderId", cancelOrderById);

// GET ALL ORDERS
router.get("/api/v1/getAllorders", getAllOrders);


module.exports = router;