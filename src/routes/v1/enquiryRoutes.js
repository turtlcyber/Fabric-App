const express = require('express');
const router = express.Router();

const { submitEnquiry, deleteEnquiry, getAllEnquiries } = require('../../controllers/enquiryController');

// SUBMIT ENQUIRY
router.post("/api/v1/submitEnquiry", submitEnquiry);

// GET ALL ENQUIRIES
router.get("/api/v1/getAllEnquiries/:key", getAllEnquiries);

// DELETE ENQUIRY
router.delete("/api/v1/deleteEnquiry/:enquiryId", deleteEnquiry);

module.exports = router;