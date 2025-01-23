const express = require('express');
const router = express.Router();
const verifyUser = require("../middleware/verifyUser");
const { registerHandler, loginHandler, updateHandler, deleteHandler, infoHandler } = require("../controllers/userController");

//      register route
router.post('/login', loginHandler);
router.post('/register', registerHandler);
router.put('/update', verifyUser, updateHandler);
router.delete('/delete', verifyUser, deleteHandler);
router.get('/info', infoHandler);

module.exports = router;
