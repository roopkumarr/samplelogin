const express = require('express');
const router = express.Router();

const Auth = require('../middlewares/authenticate');

const userController = require('../controllers/platform_user_controller');

router.post('/', userController.createUser);
router.get('/email/:email', Auth.auth, userController.getUserByEmail);
router.get('/:id', Auth.auth, userController.getUser);
router.get('/', Auth.auth, userController.getAllUsers);
router.put('/updatePassword/', userController.changePassword);
router.put('/:email', Auth.auth, userController.updateUser);
router.post('/login', userController.userLogin);

module.exports = router;