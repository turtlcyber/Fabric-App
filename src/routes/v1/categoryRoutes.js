const express = require('express');
const router = express.Router();

const { 
    addCategory,
    getCategoryById,
    getFabricByKeywords,
    getAllCategories,
    updateCategory,
    deleteCategory,
 } = require('../../controllers/categoryController');

// ADD CATEGORY
router.post("/api/v1/addCategory", addCategory);

// GET CATEGORY BY ID
router.post("/api/v1/viewService/:categoryId", getCategoryById);

// SEARCH PRODUCTS BY KEYWORDS
router.post("/api/v1/allSareeSearchByKeywords/:categoryId?", getFabricByKeywords);

// GET ALL CATEGORIES
router.get("/api/v1/getAllCategories", getAllCategories);

// UPDATE CATEGORY
router.put("/api/v1/updateCategory/:categoryId", updateCategory);

// DELETE CATEGORY
router.delete("/api/v1/deleteCategory/:categoryId", deleteCategory);


module.exports = router;