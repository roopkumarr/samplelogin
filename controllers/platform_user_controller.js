const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(parseInt(process.env.BCRYPTSALT));

const user = require('../models/platform_user');

// Create a user for Vivid System
module.exports.createUser = (req, res, next) => {
    user.create({
        name: req.body.name,
        email: req.body.email,
        contact_no: req.body.role,
        // password: req.body.password,
        password: bcrypt.hashSync(req.body.password, salt),
    }).then((userDetail) => {
        res.status(200).json({
            message: 'Successfully Registered User',
            statusCode: 200,
            data: userDetail,
            error: null,
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};

// Get a specific User by Id
module.exports.getUser = (req, res, next) => {
    let condition = {};
    condition._id = req.params.id;
    let project = {};
    project.password = 0;
    project.status = 0;
    project.createdAt = 0;
    project.updatedAt = 0;
    project.__v = 0;
    user.findOne(condition, project).then((userDetail) => {
        res.status(200).json({
            message: 'User Profile',
            statusCode: 200,
            data: userDetail,
            error: null,
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};

// Get a specific User by email
module.exports.getUserByEmail = (req, res, next) => {
    let condition = {};
    condition.email = req.params.email;
    let project = {};
    project.status = 0;
    project.password = 0;
    project.createdAt = 0;
    project.updatedAt = 0;
    project.__v = 0;
    user.findOne(condition, project).then((userDetail) => {
        res.status(200).json({
            message: 'User Profile',
            statusCode: 200,
            data: userDetail,
            error: null,
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};

// Get all the user
module.exports.getAllUsers = (req, res, next) => {
    let condition = {};
    let project = {};
    project.status = 0;
    project.password = 0;
    project.createdAt = 0;
    project.updatedAt = 0;
    project.__v = 0;
    user.find(condition, project).then((userDetail) => {
        res.status(200).json({
            message: 'All Users Profile',
            statusCode: 200,
            data: userDetail,
            error: null,
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};

// Update a specific user
module.exports.updateUser = (req, res, next) => {
    let condition = {};
    const objForUpdate = {};
    condition.email = req.params.email;
    if (req.body.name) objForUpdate.name = req.body.name;
    if (req.body.contact_no) objForUpdate.contact_no = req.body.contact_no;
    if (req.body.image_url) objForUpdate.image_url = req.body.image_url;
    if (req.body.status) objForUpdate.status = req.body.status;
    user.updateOne(condition, objForUpdate).then((userDetail) => {
        res.status(200).json({
            message: 'Updated the User Profile',
            statusCode: 200,
            data: 'Successfully updated!',
            // data: userDetail,
            error: null,
        });
    }).catch((err) => {
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};

// user login
module.exports.userLogin = (req, res, next) => {
    let condition = {};
    condition.email = req.body.email;
    // condition.password = req.body.password;
    let project = {};
    project.status = 0;
    // project.password = 0;
    project.createdAt = 0;
    project.updatedAt = 0;
    project.__v = 0;
    user.findOne(condition, project).lean().then((userDetail) => {
        // console.log("userDetail=====", userDetail);
        if (userDetail) {
            if (bcrypt.compareSync(req.body.password, userDetail.password)) {
                delete userDetail['password'];
                const token = jwt.sign(
                    userDetail,
                    process.env.JWTPRIVATEKEY,
                    {
                        expiresIn: process.env.TOKEN_EXPIRE,
                        algorithm: process.env.TOKEN_ALGORITHM
                    },
                );
                res.status(200).json({
                    message: 'User Profile',
                    statusCode: 200,
                    data: userDetail,
                    error: null,
                    token: token,
                });
            }
            else {
                res.status(400).json({
                    message: 'Invalid Credentials',
                    statusCode: 400,
                    data: null,
                    // error: err,
                });
            }
        } else {
            res.status(400).json({
                message: 'Invalid Credentials',
                statusCode: 400,
                data: null,
                // error: err,
            });
        }
    }).catch((err) => {
        console.log("Err=====", err);
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err.message,
        });
    });
};

// update/change user password
module.exports.changePassword = (req, res, next) => {
    let condition = {};
    condition.email = req.body.email;
    user.findOne(condition).then((userDetail) => {
        if (bcrypt.compareSync(req.body.password, userDetail.password)) {
            res.status(400).json({
                message: 'Different password needed',
                statusCode: 400,
                data: null,
                error: null,
            });
        } else {
            const objForUpdate = {};
            objForUpdate.password = bcrypt.hashSync(req.body.password, salt);
            user.updateOne(condition, objForUpdate).then((userDetail) => {
                res.status(200).json({
                    message: 'Updated the User Profile',
                    statusCode: 200,
                    data: 'Successfully updated!',
                    // data: userDetail,
                    error: null,
                });
            }).catch((err) => {
                res.status(500).json({
                    message: 'some thing went wrong',
                    statusCode: 500,
                    data: null,
                    error: err,
                });
            });
        }
    }).catch((err) => {
        console.log("Err=====", err);
        res.status(500).json({
            message: 'some thing went wrong',
            statusCode: 500,
            data: null,
            error: err,
        });
    });
};