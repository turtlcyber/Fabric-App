const express = require('express');
const router = express.Router();

const { 
    addFabric, 
    addUpdateFabricImages,
    deleteFabricImage,
    getAllFabricList,
    updateFabric,
    deleteFabric
} = require('../../controllers/fabricController');

// GET DASHBOARD
router.post("/api/v1/addFabric/:key", addFabric);

// ADD/UPDATE BANNER IMAGES
router.post("/api/v1/addOrUpdateFabricImages/:fabricId", addUpdateFabricImages);

// DELETE FABRIC IMAGES
router.delete("/api/v1/deleteFabricImage/:fabricId/:imageId", deleteFabricImage);

// GET ALL FABRIC LIST
router.get("/api/v1/getAllFabricList", getAllFabricList);

// UPDATE FABRIC
router.put("/api/v1/updateFabric/:fabricId", updateFabric);

// DELETE FABRIC
router.delete("/api/v1/deleteFabric/:fabricId", deleteFabric);


module.exports = router;