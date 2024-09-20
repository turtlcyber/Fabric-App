const userModel = require('../models/userModel');
const enquiryModel = require('../models/enquiryModel');

const { adminSecretKey } = require('../config/config');
const fabricModel = require('../models/fabricModel');


// SUBMIT ENQUIRY
const submitEnquiry = async (req, res) => {
    try {
        let { userId, fabircId, questions, enquiryData } = req.body;

        let enquiryId;
        let isEnquiryAlreadyExist;

        do {
            enquiryId = Math.floor(1000000000 + Math.random() * 8999999999);
            isEnquiryAlreadyExist = await enquiryModel.findOne({ enquiryId });
        } while (isEnquiryAlreadyExist);

        let enquiryObj = {
            enquiryId,
            userId,
            fabircId,
            questions,
            enquiryData
        }

        let newEnquiry = await enquiryModel.create(enquiryObj);

        return res.status(200).send({
            status: true,
            message: "Success",
            data: newEnquiry
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// GET ALL ENQUIRIES
const getAllEnquiries = async (req, res) => {
    try {
        let { key } = req.params;

        if (!key) {
            return res.status(400).send({ status: false, message: "key is required"});
        };

        if (key !== adminSecretKey) {
            return res.status(403).send({ status: false, message: "Not Authorized"});
        }

        let enquiries = await enquiryModel.find({});

        let enqArr = [];
        if (enquiries.length) {
            for (let enquiry of enquiries) {
                let fabric = await fabricModel.findOne({  _id: enquiry.fabricId.toString() });
                let user = await userModel.findOne({ userId: enquiry.userId });

                let enqObj = {
                    enquiry: enquiry,
                    fabric: fabric,
                    user: user
                };

                enqArr.push(enqObj);
            }
        }

        return res.status(200).send({
            status: true,
            message: "Success",
            data: enqArr,
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    }
};


// DELETE ENQUIRY
const deleteEnquiry = async (req, res) => {
    try {
        let { enquiryId } = req.params;

        if (!enquiryId) {
            return res.status(400).send({ status: false, message: "Enquiry Id is required"});
        };

        let deletedEnquiry = await enquiryModel.deleteOne({ _id: enquiryId });

        if (!deletedEnquiry) {
            return res.status(400).send({ status: false, message: "Enquiry not found"});
        };

        return res.status(200).send({
            status: true,
            message: "Enquiry deleted successfully",
        });
    } catch (error) {
        return res.status(400).send({ status: false, message: error.message });
    };
};


module.exports = {
    submitEnquiry,
    getAllEnquiries,
    deleteEnquiry
};
