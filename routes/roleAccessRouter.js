const Router = require('express');
const router = new Router();
const roleAccessController = require('../controllers/roleAccessController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAccessCompanyMiddleware = require("../middleware/checkAccessCompanyMiddleware");

router.post('/', authMiddleware, checkAccessCompanyMiddleware, roleAccessController.create);
router.get('/', authMiddleware, checkAccessCompanyMiddleware, roleAccessController.get);
router.get('/one', authMiddleware, checkAccessCompanyMiddleware, roleAccessController.getOne);


module.exports = router;