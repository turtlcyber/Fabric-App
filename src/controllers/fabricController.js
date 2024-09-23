const fabricModel = require('../models/fabricModel');

let { getCurrentIPAddress } = require("../uitls/utils");
const uuid = require("uuid");
const path = require("path");
const fs = require("fs");
const { port, adminSecretKey } = require("../config/config");
const { isValidObjectId } = require("mongoose");

let fabricImgFolder = path.join(__dirname, "..", "..", "fabricImages");


// ADD FABRIC
const addFabric = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "key is required" });
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        };

        let {
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
            moreDetails
        } = req.body;

        let fabData = {
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
            moreDetails
        };

        let newFabric = await fabricModel.create(fabData);

        return res.status(200).send({
            status: true,
            message: "Fabric Added Successfully",
            property: newFabric,
        });

    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// UPDATE BANNER IMAGES
const addUpdateFabricImages = async (req, res) => {
    try {
        let { fabricId } = req.params;
        if (!fabricId) {
            return res.status(400).send({ status: false, message: "Bad Request!!!" });
        };

        if (!isValidObjectId(fabricId)) {
            return res.status(403).send({ status: false, message: "Invalid fabricId!!!" });
        };

        let fabric = await fabricModel.findById(fabricId);

        if (!fabric) {
            return res.status(400).send({ status: false, message: "fabric not found" });
        }

        let { ImageModel } = req.body;

        let parsedData = JSON.parse(ImageModel);

        let itemImage = req.files.itemImage;

        if (!itemImage) {
            return res.status(400).send({ status: false, message: "No property image uploaded" });
        };

        if (!fs.existsSync(fabricImgFolder)) {
            fs.mkdirSync(fabricImgFolder);
        };

        let index = parsedData.index; //{"isNewPick":false,"index":1,"img_id":"64ffebc1f3bfc5d77220193b","imageName":"1694493633669-432139964.jpg"}
        let img_id = parsedData.img_id ? parsedData.img_id : "";
        let imageName = parsedData.imageName;
        let isNewPick = parsedData.isNewPick;

        let currentIpAddress = getCurrentIPAddress();
        let imgRelativePath = "/fabricImages/";
        let imgUniqName = uuid.v4() + "." + itemImage.name.split(".").pop();
        let imgFullUrl = `http://${currentIpAddress}:${port}${imgRelativePath}`;
        let imgSavingPath = path.join(fabricImgFolder, imgUniqName);

        if (!isNewPick) {
            let oldImage = fabric.fabricImages[index].fileName;
            if (oldImage) {
                let oldImgPath = path.join(fabricImgFolder, oldImage);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                }
            };

            await itemImage.mv(imgSavingPath);

            let updatedBannerObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            fabric.fabricImages[index] = updatedBannerObj;

            await fabric.save();

            let fabricImages = fabric.fabricImages;

            return res.status(200).send({
                status: true,
                message: "Fabric image updated successfully",
                data: fabricImages,
            });
        } else {
            await itemImage.mv(imgSavingPath);

            let newBannerObj = {
                fileName: imgUniqName,
                filePath: imgFullUrl,
            };

            fabric.fabricImages.push(newBannerObj);

            await fabric.save();

            let fabricImages = fabric.fabricImages;

            return res.status(200).send({
                status: true,
                message: "Fabric image added successfully",
                data: fabricImages,
            });
        }
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// DELETE PROPERTY IMAGE BY ID
const deleteFabricImage = async (req, res) => {
    try {
        let { fabricId, imageId } = req.params;
        if (!imageId || !fabricId) {
            return res.status(400).send({ status: false, message: "All fields are required" });
        }

        let fabric = await fabricModel.findById(fabricId);

        if (!fabric) {
            return res.status(400).send({ status: false, message: "Not Found!!!" });
        }

        // let updatedImages = fabric.fabricImages.filter((image) => image._id.toString() !== imageId);

        // if (updatedImages.length === property.property_images.length) {
        //     return res.status(400).send({ status: false, message: "Image not found" });
        // }

        // property.property_images = updatedImages;

        for (let img of fabric.fabricImages) {
            if ( imageId === img._id.toString() ) {
                let oldImage = img.fileName;
                if (oldImage) {
                    let oldImgPath = path.join(fabricImgFolder, oldImage);
                    if (fs.existsSync(oldImgPath)) {
                        fs.unlinkSync(oldImgPath);
                    }
                };

                let arr = fabric.fabricImages;
                let idx = arr.indexOf(img);
                arr.splice(idx, 1);
                fabric.fabricImages = arr;
                await fabric.save();
            }
        };

        let fabricImages = fabric.fabricImages;

        return res.status(200).send({
            status: true,
            message: "fabric image deleted successfully",
            data: fabricImages,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL FABRIC LIST
const getAllFabricList = async (req, res) => {
    try {
        // let { key } = req.params;

        // if (!key) {
        //     return res.status(400).send({ status: false, message: "Key is required" });
        // }

        // if (key !== adminSecretKey) {
        //     return res.status(403).send({ status: false, message: "NOT AUTHORIZED!!!" });
        // }

        let fabrics = await fabricModel.find({});

        return res.status(200).send({
            status: true,
            message: "Success",
            data: fabrics,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// UPDATE FABRIC
const updateFabric = async (req, res) => {
    try {
        let { fabricId } = req.params;
        if (!fabricId) {
            return res.status(400).send({
                status: false,
                message: 'fabricId is required'
            });
        };

        if (!isValidObjectId(fabricId)) {
            return res.status(400).send({
                status: false,
                message: 'Invalid fabricId'
            });
        };

        let f = await fabricModel.findById(fabricId);

        if (!f) {
            return res.status(400).send({
                status: false,
                message: 'fabric not found'
            });
        };

        let e = req.body;

        if ("name" in e) {
            f.name = e.name;
        };

        if ("fabric" in e) {
            f.fabric = e.fabric;
        };

        if ("color" in e) {
            f.color = e.color;
        };

        if ("pattern" in e) {
            f.pattern = e.pattern;
        };

        if ("borderType" in e) {
            f.borderType = e.borderType;
        };

        if ("price" in e) {
            f.price = e.price;
        };

        if ("size" in e) {
            f.size = e.size;
        };

        if ("occasion" in e) {
            f.occasion = e.occasion;
        };

        if ("brand" in e) {
            f.brand = e.brand;
        };

        if ("description" in e) {
            f.description = e.description;
        };

        if ("categoryName" in e) {
            f.categoryName = e.categoryName;
        };

        if ("categoryId" in e) {
            f.categoryId = e.categoryId;
        };

        if ("moreDetails" in e) {
            f.moreDetails = e.moreDetails;
        };

        await f.save();

        return res.status(200).send({
            status: true,
            message: "fabric Updated Successfully",
            property: f,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// DELETE FABRIC
const deleteFabric = async (req, res) => {
    try {
        let { fabricId } = req.params;
        if (!fabricId) {
            return res.status(400).send({
                status: false,
                message: 'fabricId is required'
            });
        };

        if (!isValidObjectId(fabricId)) {
            return res.status(400).send({
                status: false,
                message: 'Invalid fabricId'
            });
        };

        let f = await fabricModel.findById(fabricId);

        if (!f) {
            return res.status(400).send({
                status: false,
                message: 'fabric not found'
            });
        };

        for (let img of f.fabricImages) {
            let oldImg = img.fileName;
            if (oldImg) {
                let oldImgPath = path.join(fabricImgFolder, oldImg);
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath);
                };
            };
        };

        await fabricModel.findOneAndDelete({ _id: fabricId });
        return res.status(200).send({
            status: true,
            message: "fabric deleted successfully",
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


module.exports = {
    addFabric,
    addUpdateFabricImages,
    deleteFabricImage,
    getAllFabricList,
    updateFabric,
    deleteFabric
};