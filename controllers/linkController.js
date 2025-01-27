const dotenv = require('dotenv');
const useragent = require('useragent');
const {
  deleteLink,
  updateLink,
  getAllLinks,
  searchByRemarks,
  createLink,
  getAllClicks,
  getLinkById,
  getAllClicksForDashboard,
  addShortLinkClick
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
  const page = parseInt(req.query.page) || 1; // Default to 1 if page is not provided

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  }

  try {
    const { links, totalItems } = await getAllLinks(userId, page);

    // Calculate totalPages
    const limit = 8;
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: 'Links Fetched Successfully',
      result: links,
      totalPages,
      currentPage: page,
      totalItems
    });
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
  };

  if (!originalUrl || !remarks) {
    return res
      .status(400)
      .json({ message: 'Both originalUrl and remarks are required' });
  };

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  };

  try {
    const result = await createLink(req.body, userId);

    return res.status(201).json({ message: 'Link Created Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      update link handler
const updateLinkHandler = async (req, res) => {
  const { originalUrl, remarks, linkExpiryDate } = req.body;

  const linkId = req.query.id;

  if (!originalUrl && !remarks && !linkExpiryDate) {
    return res.status(400).json({ message: 'No valid fields to update' });
  };

  if (!linkId) {
    return res.status(400).json({ message: 'Link ID is missing or invalid' });
  };

  try {
    const result = await updateLink(linkId, req.body);

    return res.status(200).json({ message: 'Details Updated Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      delete link handler
const deleteLinkHandler = async (req, res) => {
  const linkId = req.query.id;

  if (!linkId) {
    return res.status(400).json({ message: 'Link ID is missing or invalid' });
  };

  try {
    await deleteLink(linkId);

    return res.status(200).json({ message: 'Link deleted Successfully' });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occured' });
  }
};

//    get a link by id handler
const getLinkHandler = async (req, res) => {
  const linkId = req.query.id;

  if (!linkId) {
    return res.status(400).json({ message: 'Link ID is missing or invalid' });
  };

  try {
    const result = await getLinkById(linkId);

    return res
      .status(200)
      .json({ message: 'Link Fetched Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occured' });
  }
};

//      get all the clicks info for dashboard
const getAllClicksForDashboardHandler = async (req, res) => {
  const userId = req.query.id;

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  };

  try {
    const result = await getAllClicksForDashboard(userId);

    return res
      .status(200)
      .json({ message: 'Clicks Fetched Successfully', result });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occurred' });
  }
};

//      get all the clicks handler
const getAllClicksHandler = async (req, res) => {
  const userId = req.query.id;
  const page = parseInt(req.query.page) || 1; // Default to 1 if page is not provided

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing or invalid' });
  };

  try {
    const { links, totalItems } = await getAllClicks(userId, page);
    // const result = await getAllClicks(userId, page);

    // Calculate totalPages
    const limit = 8;
    const totalPages = Math.ceil(totalItems / limit);
    
    return res.status(200).json({
      message: 'Clicks Fetched Successfully',
      result: links,
      totalPages,
      currentPage: page,
      totalItems
    });
  } catch (error) {
    console.error(error);

    if (error.status) {
      return res.status(error.status).json({ message: error.message });
    };

    return res.status(500).json({ message: 'An error occurred' });
  }
};

//      get the click count handler
const clickShortLinkHandler = async (req, res) => {
  const { shortenUrl } = req.params;

  // Extract IP address from the request
  const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const cleanedIpAddress = ipAddress && ipAddress.split(',')[0].trim(); // Handle the forwarded IP chain

  // Extract device information (user agent) from the request
  const userAgent = req.headers['user-agent'];

  // Use useragent library to parse the user agent string
  const agent = useragent.parse(userAgent);

  // Check the device type (Android, iOS, Desktop)
  let userDevice = 'Unknown Device';


  // Access the OS family
  const osFamily = agent.os.family ? agent.os.family.toLowerCase() : null;

  if (osFamily) {
    if (osFamily.includes('android')) {
      userDevice = 'android';
    } else if (osFamily.includes('ios')) {
      userDevice = 'ios';
    } else {
      userDevice = 'desktop'; // Default to desktop if no mobile OS is detected
    }
  };

  console.log(agent);
  console.log(agent.family);
  console.log('OS Family:', agent.os.family);
  console.log("device", userDevice);
  
  if (!shortenUrl || !userDevice || !cleanedIpAddress) {
    return res.status(400).json({
      message: 'Shorten URL, userDevice, and IP address are required',
    });
  };

  try {
    // Add click to the database
    const originalUrl = await addShortLinkClick(shortenUrl, { userDevice, ipAddress: cleanedIpAddress });

    if (originalUrl === 'EXPIRED') {
      return res.status(410).json({ message: 'This short URL has expired' });
    };

    return res.redirect(originalUrl); 
  } catch (error) {
    console.error(error);
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
  getLinkHandler,
  getAllClicksForDashboardHandler,
  clickShortLinkHandler
};
