const express = require('express');
const router = express.Router();

const { 
    getDashboard, 
    updateBannerImages, 
    deleteBannerImage, 
    getAdminDashboard 
} = require('../../controllers/dashboard');

// GET DASHBOARD
// router.get("/api/v1/getDashboard/:userId?", getDashboard);


// GET ADMIN DASHBOARD
router.get("/api/v1/getAdminDashboard", getAdminDashboard);

// ADD/UPDATE BANNER IMAGES
router.put("/api/v1/addOrUpdateBanner/:key", updateBannerImages);

// DELETE BANNER IMAGE
router.delete("/api/v1/deleteBanner/:imageId/:key", deleteBannerImage);


module.exports = router;