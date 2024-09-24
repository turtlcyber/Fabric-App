const categoryModel = require("../models/categoryModel");
const bannerImageModel = require("../models/bannerImageModel");
const enquiryModel = require('../models/enquiryModel');
const { getCurrentIPAddress } = require("../uitls/utils");

const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");
const fabricModel = require("../models/fabricModel");
const userModel = require("../models/userModel");
const checkoutModel = require('../models/checkoutModel');

let bannerFolder = path.join(__dirname, "..", "..", "bannerImages");

// DASHBOARD API
const getDashboard = async (req, res) => {
    try {
        let { userId } = req.params;

        let categories = await categoryModel.find({});

        let bannerObj = await bannerImageModel.findOne();

        let bannerImages = bannerObj.bannerImages;

        let myAllOrders = null;
        if (userId) {
            myAllOrders = await checkoutModel.find({ customerId: userId }); 
        };

        return res.status(200).send({
            status: true,
            message: "Success",
            categoryList: categories,
            bannerImages: bannerImages,
            myAllOrders,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ADMIN DASHBOARD
const getAdminDashboard = async (req, res) => {
    try {
        let categories = await categoryModel.find({});
        let bannerObj = await bannerImageModel.findOne();
        let bannerImages = bannerObj.bannerImages;
        let allOrders = await checkoutModel.find({});
        return res.status(200).send({
            status: true,
            message: "Success",
            categoryList: categories,
            bannerImages: bannerImages,
            allOrders
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// UPDATE BANNER IMAGES
const updateBannerImages = async (req, res) => {
    try {
        let { key } = req.params;
        if (!key) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let bannerObj = await bannerImageModel.findOne({});

        if (!bannerObj) {
            bannerObj = await bannerImageModel.create({bannerImages: []});
        }

        let { ImageModel } = req.body;

        let parsedData = JSON.parse(ImageModel);

        let bannerImage = req.files.bannerImage;

        if (!bannerImage) {
            return res.status(400).send({ status: false, message: "No banner image uploaded" });
        }

        if (!fs.existsSync(bannerFolder)) {
            fs.mkdirSync(bannerFolder);
        };

        let index = parsedData.index; //{"isNewPick":false,"index":1,"img_id":"64ffebc1f3bfc5d77220193b","imageName":"1694493633669-432139964.jpg"}
        let img_id = parsedData.img_id ? parsedData.img_id : "";
        let imageName = parsedData.imageName;
        let isNewPick = parsedData.isNewPick;

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/bannerImages/";
        let imgUniqName = uuid.v4() + "." + bannerImage.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(bannerFolder, imgUniqName);

        if (!isNewPick) {
            let oldImage = bannerObj.bannerImages[index].imageName;
            if (oldImage) {
                let oldImgPath = path.join(bannerFolder, oldImage);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            };
            
            await bannerImage.mv(imgSavingPath);

            let updatedBannerObj = {
                imageName: imgUniqName,
                imagePath: imgFullUrl,
            };

            bannerObj.bannerImages[index] = updatedBannerObj;

            await bannerObj.save();

            let bannerImages = bannerObj.bannerImages;

            return res.status(200).send({
                status: true,
                message: "Banner updated successfully",
                data: bannerImages,
            });
        } else {
            await bannerImage.mv(imgSavingPath);

            let newBannerObj = {
                imageName: imgUniqName,
                imagePath: imgFullUrl,
            };

            bannerObj.bannerImages.push(newBannerObj);

            await bannerObj.save();

            let bannerImages = bannerObj.bannerImages;

            return res.status(200).send({
                status: true,
                message: "Banner added successfully",
                data: bannerImages,
            });
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// DELETE BANNER IMAGE BY ID
const deleteBannerImage = async (req, res) => {
    try {
        let { imageId, key } = req.params;
        if (!imageId || !key) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        }

        let bannerObj = await bannerImageModel.findOne();

        if (!bannerObj) {
            return res.status(400).send({ status: false, message: "Not Found!!!" });
        }

        if (bannerObj.bannerImages.length) {
            for (let i = 0; i < bannerObj.bannerImages.length; i++) {
                if (imageId === bannerObj.bannerImages[i]._id.toString()) {

                    let imgName = bannerObj.bannerImages[i].imageName;
                    if (imgName) {
                        let imgPath = path.join(bannerFolder, imgName);
                        if (fs.existsSync(imgPath)) {
                            fs.unlinkSync(imgPath);
                        };
                    }
                    
                    let arr = bannerObj.bannerImages;
                    arr.splice(i, 1);
                    bannerObj.bannerImages = arr;
                    await bannerObj.save();
                };
            };
        };

        let bannerImages = bannerObj.bannerImages;

        return res.status(200).send({
            status: true,
            message: "Banner deleted successfully",
            data: bannerImages,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = {
    getDashboard,
    getAdminDashboard,
    updateBannerImages,
    deleteBannerImage,
};
