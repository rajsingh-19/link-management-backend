const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const UserModel = require('../models/user.schema');
const LinkModel = require('../models/link.schema');

dotenv.config();

// api service to create a link
const createLink = async (linkData, userId) => {
  const { originalUrl, linkExpiryDate, remarks } = linkData;
  // Check if user exists
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  }

  // Get the hostname from the environment variable
  const hostname = process.env.HOSTNAME;

  if (!hostname) {
    const error = new Error(
      'HOSTNAME is not defined in the environment variables'
    );
    error.status = 500;
    throw error;
  }

  // Generate a unique code using nanoid
  const { nanoid } = await import('nanoid');
  const uniqueCode = nanoid(8);

  // Hash the unique code for additional security
  const hashedCode = await bcrypt.hash(uniqueCode, 10);

  // Combine the hostname and unique code to form the shorten URL
  const shortenUrl = `${hostname}/${uniqueCode}`;

  // Create the new link
  const newLink = new LinkModel({
    originalUrl,
    shortenUrl,
    remarks,
    linkExpiryDate,
    userId,
  });

  // Save to the database
  await newLink.save();

  return newLink;
};

// api service for delete the link
const deleteLink = async (linkId) => {
  const isLinkExist = await LinkModel.findById(linkId);

  if (!isLinkExist) {
    const error = new Error('This Link does not exist');
    error.status = 400;
    throw error;
  }

  return await LinkModel.findByIdAndDelete(linkId);
};

// api service for update the link
const updateLink = async (linkId, updateData) => {
  const { originalUrl, remarks, linkExpiryDate } = updateData;

  const isLinkExist = await LinkModel.findById(linkId);

  if (!isLinkExist) {
    const error = new Error('This Link does not exist');
    error.status = 400;
    throw error;
  }

  const updatedLink = await LinkModel.findByIdAndUpdate(
    linkId,
    { originalUrl, remarks, linkExpiryDate },
    { new: true, runValidators: true }
  );

  return updatedLink;
};

// api service to get all the links
const getAllLinks = async (userId, page = 1) => {
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const links = await LinkModel.find({ userId })
    .skip(skip)
    .limit(limit)
    .populate('clicks');

  return links;
};

// API service to get a link by its ID
const getLinkById = async (linkId) => {
  // Check if the link exists
  const link = await LinkModel.findById(linkId).populate('clicks');

  if (!link) {
    const error = new Error('No link found with the provided ID');
    error.status = 404;
    throw error;
  }

  return link;
};

// api service to search by remarks
const searchByRemarks = async (userId, remarks, page = 1) => {
  const isUserExist = await UserModel.findById(userId);

  if (!isUserExist) {
    const error = new Error('This User is not associated with any account');
    error.status = 400;
    throw error;
  }

  const limit = 10;
  const skip = (page - 1) * limit;

  const links = await LinkModel.find({
    userId,
    remarks: { $regex: remarks, $options: 'i' },
  })
    .skip(skip)
    .limit(limit)
    .populate('clicks');

  return links;
};

//      api service for geting all clicks on dashboard
const getAllClicksForDashboard = async (userId) => {
  const isUserExist = await UserModel.findById(userId);
  if (!isUserExist) {
    throw new Error('This user is not associated with any account');
  }

  const links = await LinkModel.find({ userId })
    .sort({ _id: -1 })
    .select('clicks originalUrl shortenUrl');

  const allClicks = links.reduce((acc, link) => {
    const clicksWithUrls = link.clicks.map((click) => ({
      click,
      originalUrl: link.originalUrl,
      shortenUrl: link.shortenUrl,
    }));
    return acc.concat(clicksWithUrls);
  }, []);

  return allClicks;
};

//    api service for geting all the clicks
const getAllClicks = async (userId, page = 1) => {
  const isUserExist = await UserModel.findById(userId);
    if (!isUserExist) {
      throw new Error('This user is not associated with any account');
    }

    const links = await LinkModel.find({ userId })
      .sort({ _id: -1 })
      .select('clicks originalUrl shortenUrl');

    const limit = 8;
    const skip = (page - 1) * limit;

    const allClicks = links.reduce((acc, link) => {
    const clicksWithUrls = link.clicks.map((click) => ({
      click,
      originalUrl: link.originalUrl,
      shortenUrl: link.shortenUrl,
    }));
  
    return acc.concat(clicksWithUrls);
  }, []);

  const paginatedClicks = allClicks.slice(skip, skip + limit);

  return paginatedClicks;
};


// API service to add a click to a link
const addShortLinkClick = async (shortenUrl, clickData) => {
  console.log(shortenUrl);
  const { userDevice, ipAddress } = clickData;

  // Get the hostname from the environment variable
  const hostname = process.env.HOSTNAME;
  const filterUrl = `${hostname}/${shortenUrl}`

  console.log(filterUrl);
  const link = await LinkModel.findOne({ shortenUrl: filterUrl });
  if (!link) {
    throw new Error('This link does not exist');
  };

  const newClick = { userDevice, ipAddress, clickedAt: new Date() };
  link.clicks.push(newClick);

  await link.save();
  return link;
};

module.exports = {
  deleteLink,
  updateLink,
  getAllLinks,
  searchByRemarks,
  createLink,
  getAllClicks,
  getLinkById,
  getAllClicksForDashboard,
  addShortLinkClick
};
