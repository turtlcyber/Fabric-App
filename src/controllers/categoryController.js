const categoryModel = require("../models/categoryModel");
let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port } = require("../config/config");
const fabricModel = require("../models/fabricModel");
const { isValidObjectId } = require("mongoose");

// ADD CATEGORY
const addCategory = async (req, res) => {
    try {
        let { name, description } = req.body;

        let { category_image } = req.files;

        if (!category_image) {
            return res.status(400).send({ status: false, message: "No category Image uploaded" });
        };

        let catImgFolder = path.join(__dirname, "..", "..", "categoryImages");
        if (!fs.existsSync(catImgFolder)) {
            fs.mkdirSync(catImgFolder);
        };

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/categoryImages/";
        let imgUniqName = uuid.v4() + "." + category_image.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(catImgFolder, imgUniqName);

        await category_image.mv(imgSavingPath);

        let imgObj = {
            fileName: imgUniqName,
            filePath: imgFullUrl,
        };

        let categoryObj = {
            name,
            description,
            category_image: imgObj,
        };

        let newCategory = await categoryModel.create(categoryObj);

        return res.status(200).send({
            status: true,
            message: "Category Added",
            data: newCategory,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};

// GET CATEGORY BY CATEGORY ID
const getCategoryById = async (req, res) => {
    try {
        let { categoryId } = req.params;

        let category;
        if (categoryId) {
            if (!isValidObjectId(categoryId)) {
                return res.status(400).send({ status: false, message: "Invalid category Id"});
            }
            category = await categoryModel.findById(categoryId);
        };

        if (!category) {
            return res.status(200).send({ status: true, message: "Category Not Found" });
        };

        let allFabrics = await fabricModel.find({ categoryId: category._id });

        return res.status(200).send({
            status: true,
            message: "Success",
            data: category,
            products: allFabrics,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// GET CATEGORY BY SERVICE SEARCH {allProductSearchByKeywords}
const getFabricByKeywords  = async (req, res) => {
    try {
        let { categoryId } = req.params;
        let { search_data } = req.body;

        if (categoryId) {
            let fabrics = await fabricModel.find({ categoryId });

            return res.status(200).send({
                status: true,
                message: "Success",
                data: fabrics,
            });
        } else {
            let filter = {
                $or: [
                    { name: { $regex: search_data, $options: "i" } },
                    { fabric: { $regex: search_data, $options: "i" } },
                    { color: { $regex: search_data, $options: "i" } },
                    { pattern: { $regex: search_data, $options: "i" } },
                    { borderType: { $regex: search_data, $options: "i" } },
                    { description: { $regex: search_data, $options: "i" } },
                    { brand: { $regex: search_data, $options: "i" } },
                    { moreDetails: { $regex: search_data, $options: "i" } },
                ],
            };
    
            let fabrics = await fabricModel.find(filter);
    
            return res.status(200).send({
                status: true,
                message: "Success",
                data: fabrics,
            });
        }
        
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL CATEGORIES
const getAllCategories = async (req, res) => {
    try {
        let allCategories = await categoryModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: allCategories,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};

// UPDATE CATEGORY BY CATEGORY ID
const updateCategory = async (req, res) => {
    try {
        let { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).send({ status: false, message: "Category Id is required" });
        };

        if (!isValidObjectId(categoryId)) {
            return res.status(400).send({ status: false, message: "Invalid Category Id" });
        };

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).send({ status: false, message: "Category Not Found" });
        };

        let reqBody = req.body;

        if ("name" in reqBody) {
            category.name = reqBody.name;
        };

        if ("description" in reqBody) {
            category.description = reqBody.description;
        };

        if ("category_image" in reqBody || (req.files && req.files.category_image)) {
            let category_image = req.files.category_image;
            if (!category_image) {
                return res.status(400).send({ status: false, message: "No category images uploaded" });
            };

            let currentIpAddress = getCurrentIPAddress();
            let imgRelativePath = "/categoryImages/";
            let imgUniqName = uuid.v4() + "." + category_image.name.split(".").pop();
            let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
            let imgSavingPath = path.join(__dirname, "..", "..", "categaryImages", imgUniqName);

            let oldImgName = category.category_image.imageName;
            if (oldImgName) {
                let oldImgPath = path.join(__dirname, "..", "..", "categoryImages", oldImgName);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                };
            };
            
            await category_image.mv(imgSavingPath);

            let newImgObj = {
                imageName: imgUniqName,
                imagePath: imgFullUrl,
            };

            category.category_image = newImgObj;
        };

        await category.save();

        return res.status(200).send({
            status: true,
            message: "Category updated successfully",
            data: category,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


// DELETE CATEGORY
const deleteCategory = async (req, res) => {
    try {
        let { categoryId } = req.params;
        if (!categoryId) {
            return res.status(400).send({ status: false, message: "CategoryId is required" });
        };

        let category = await categoryModel.findById(categoryId);

        if (!category) {
            return res.status(404).send({ status: false, message: "No category found with this category Id"})
        };

        await categoryModel.deleteOne({ _id: categoryId });

        return res.status(200).send({
            status: true,
            message: "Category deleted successfully",
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = {
    addCategory,
    getCategoryById,
    getFabricByKeywords,
    getAllCategories,
    updateCategory,
    deleteCategory,
};
