const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserModel = require('../models/user.schema');

dotenv.config();

//      api service for user register
const registerUser = async (name, email, mobile, password) => {
  const isUserExist = await UserModel.findOne({ email });

  if (isUserExist) {
    const error = new Error('A User already exist with this email');
    error.status = 400;
    throw error; //Throwing the error to the controller
  }

  //  Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await UserModel.create({
    name,
    email,
    mobile,
    password: hashPassword,
  });

  return newUser; // Return created user object
};

//      api service for user login
const loginUser = async (email, password) => {
  const isUserValid = await UserModel.findOne({ email });

  if (!isUserValid) {
    const error = new Error('This email is not associated with any account');
    error.status = 400;
    throw error;
  }

  const isPasswordValid = await bcrypt.compare(password, isUserValid.password);

  if (!isPasswordValid) {
    const error = new Error('Credential is wrong');
    error.status = 400;
    throw error;
  }

  //   Set the mongodb user id as payload
  const payload = {
    id: isUserValid._id,
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET);

  return {
    token,
    userId: isUserValid._id,
    name: isUserValid.name,
    email: isUserValid.email,
  };
};

//      api service for update the user
const updateUser = async (name, email, mobile, userId) => {
  const isUserValid = await UserModel.findById(userId);

  if (!isUserValid) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  };

  // Update userName if new provided
  if (name) {
    isUserValid.name = name;
  };

  // Update email if new provided
  if (email) {
    isUserValid.email = email;
  };

  // Update the mobile if new provided
  if (mobile) {
    isUserValid.mobile = mobile;
  };

  const result = await isUserValid.save();
  return result;
};

//      api service for delete the user
const deleteUser = async (userId) => {
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  };

  return await UserModel.findByIdAndDelete(userId);
};

const infoUser = async (userId) => {
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  };

  const result = await UserModel.findById(userId);

  return result;
};


module.exports = { registerUser, loginUser, updateUser, deleteUser, infoUser };
