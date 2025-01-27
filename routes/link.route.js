const express = require('express');
const router = express.Router();
const verifyUser = require('../middleware/verifyUser');
const {
  createLinkHandler,
  updateLinkHandler,
  deleteLinkHandler,
  getAllLinksHandler,
  searchByRemarksHandler,
  getAllClicksHandler,
  getLinkHandler,
  getAllClicksForDashboardHandler,
  clickShortLinkHandler
} = require('../controllers/linkController');

router.post('/createLink', verifyUser, createLinkHandler);
router.put('/updateLink', verifyUser, updateLinkHandler);
router.delete('/deleteLink', verifyUser, deleteLinkHandler);
router.get('/getAllLinks', getAllLinksHandler);
router.get('/search', searchByRemarksHandler);
router.get('/getAllClicks', getAllClicksHandler);
router.get('/getAllClicksForDashboard', getAllClicksForDashboardHandler);
router.get('/getLink', getLinkHandler);
router.get('/:shortenUrl', clickShortLinkHandler);

module.exports = router;
