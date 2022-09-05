const Router = require('express');
const router = new Router();
const stockController = require('../controllers/stockController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAccessCompanyMiddleware = require("../middleware/checkAccessCompanyMiddleware");
const clientController = require("../controllers/clientController");

router.post('/add', authMiddleware,checkAccessCompanyMiddleware, stockController.create);
router.post('/edit', authMiddleware,checkAccessCompanyMiddleware, stockController.edit);
router.get('/all', authMiddleware,checkAccessCompanyMiddleware, stockController.getAll);
router.get('/one', authMiddleware,checkAccessCompanyMiddleware, stockController.getOne);
router.delete('/delete', authMiddleware, checkAccessCompanyMiddleware, stockController.delete);

router.post('/upload_images', authMiddleware,checkAccessCompanyMiddleware, stockController.uploadImages);
router.post('/delete_images', authMiddleware,checkAccessCompanyMiddleware, stockController.deleteImages);
router.get('/get_all_images',checkAccessCompanyMiddleware, authMiddleware, stockController.getAllImages);


router.get('/get_rental_points',checkAccessCompanyMiddleware, authMiddleware, stockController.getRentalPoints);
router.get('/get_rental_category',checkAccessCompanyMiddleware, authMiddleware, stockController.getRentalCategory);
router.get('/get_rental_status',checkAccessCompanyMiddleware, authMiddleware, stockController.getRentalStatus);

module.exports = router