const dotenv = require('dotenv');
const {
  deleteLink,
  updateLink,
  getAllLinks,
  searchByRemarks,
  createLink,
  getAllClicks,
  addClick,
} = require('../services/link.service');

dotenv.config();

//      remark handler
const searchByRemarksHandler = async (req, res) => {
  const userId = req.query.id;
  const { page, remarks } = req.query;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  }

  if (!remarks) {
    return res.status(400).json({ message: 'Please enter remarks' });
  }

  try {
    const result = await searchByRemarks(userId, remarks, page);

    return res
      .status(200)
      .json({ message: 'Links Fetched Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      get all link handler
const getAllLinksHandler = async (req, res) => {
  const userId = req.query.id;
  const page = req.query.page;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  }

  try {
    const result = await getAllLinks(userId, page);

    return res
      .status(200)
      .json({ message: 'Links Fetched Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occured' });
  }
};

//    create link handler
const createLinkHandler = async (req, res) => {
  const userId = req.user.id;
  const { originalUrl, linkExpiryDate, remarks } = req.body;

  if (!originalUrl && !remarks && !linkExpiryDate) {
    return res.status(400).json({ message: 'No valid fields to create' });
  }

  if (!originalUrl || !remarks) {
    return res
      .status(400)
      .json({ message: 'Both originalUrl and remarks are required' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  }

  try {
    const result = await createLink(req.body, userId);

    return res.status(201).json({ message: 'Link Created Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      update link handler
const updateLinkHandler = async (req, res) => {
  const { originalUrl, remarks, linkExpiryDate } = req.body;

  const linkId = req.body.id;

  if (!originalUrl && !remarks && !linkExpiryDate) {
    return res.status(400).json({ message: 'No valid fields to update' });
  }

  if (!linkId) {
    return res.status(400).json({ message: 'Link ID is missing or invalid' });
  }

  try {
    const result = await updateLink(linkId, req.body);

    return res.status(200).json({ message: 'Details Updated Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      delete link handler
const deleteLinkHandler = async (req, res) => {
  const linkId = req.query.id;

  if (!linkId) {
    return res.status(400).json({ message: 'Link ID is missing or invalid' });
  }

  try {
    await deleteLink(linkId);

    return res.status(200).json({ message: 'Link deleted Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      get all the clicks handler
const getAllClicksHandler = async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  }

  try {
    const result = await getAllClicks(userId);

    return res
      .status(200)
      .json({ message: 'Clicks Fetched Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occurred' });
  }
};

//    add click handler
const addClickHandler = async (req, res) => {
  const { shortenUrl } = req.body;

  // Extract IP address from the request
  const ipAddress =
    req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  // Extract device information (user agent) from the request
  const userAgent = req.headers['user-agent'];
  const userDevice = userAgent || 'Unknown Device';

  if (!shortenUrl || !userDevice || !ipAddress) {
    return res
      .status(400)
      .json({ message: 'Shorten URL, userDevice, and IP address are required' });
  }

  try {
    const result = await addClick(shortenUrl, { userDevice, ipAddress });

    return res
      .status(200)
      .json({ message: 'Click Added Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(500).json({ message: 'An error occurred' });
  }
};

module.exports = {
  deleteLinkHandler,
  updateLinkHandler,
  getAllLinksHandler,
  searchByRemarksHandler,
  createLinkHandler,
  getAllClicksHandler,
  addClickHandler,
};
