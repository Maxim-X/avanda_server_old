const Router = require('express');
const router = new Router();
const companyController = require('../controllers/companyController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAccessCompanyMiddleware = require("../middleware/checkAccessCompanyMiddleware");

router.post('/create', authMiddleware, checkAccessCompanyMiddleware,companyController.create);
router.get('/getall', authMiddleware, checkAccessCompanyMiddleware, companyController.getAll);
router.get('/getone/:id', authMiddleware, checkAccessCompanyMiddleware, companyController.getOne);


module.exports = router