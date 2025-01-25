const express = require('express');
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const { registerHandler, loginHandler, updateHandler, deleteHandler, infoHandler } = require("../controllers/userController");

//      register route
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.put('/update/:userId', verifyUser, updateHandler);
router.delete('/delete/:userId', verifyUser, deleteHandler);
router.get('/info/:userId', infoHandler);

module.exports = router;
