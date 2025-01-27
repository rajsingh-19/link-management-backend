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
router.get('/getAllLinks', verifyUser, getAllLinksHandler);
router.get('/search', verifyUser, searchByRemarksHandler);
router.get('/getAllClicks', verifyUser, getAllClicksHandler);
router.get('/getAllClicksForDashboard', verifyUser, getAllClicksForDashboardHandler);
router.get('/getLink', verifyUser, getLinkHandler);
router.get('/:shortenUrl', clickShortLinkHandler);

module.exports = router;
