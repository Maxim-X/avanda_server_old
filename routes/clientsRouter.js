const Router = require('express');
const router = new Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require("../middleware/authMiddleware");
const checkAccessCompanyMiddleware = require("../middleware/checkAccessCompanyMiddleware");

router.post('/add', authMiddleware, clientController.create);
router.post('/edit', authMiddleware, checkAccessCompanyMiddleware, clientController.edit);
router.delete('/delete', authMiddleware, checkAccessCompanyMiddleware, clientController.delete);
router.get('/all', authMiddleware, checkAccessCompanyMiddleware, clientController.getAll);
router.get('/one', authMiddleware, checkAccessCompanyMiddleware, clientController.getOne);
router.post('/add_phone', authMiddleware, checkAccessCompanyMiddleware, clientController.addPhone);
router.post('/del_phone', authMiddleware, checkAccessCompanyMiddleware, clientController.delPhone);
router.get('/all_phones', authMiddleware, checkAccessCompanyMiddleware, clientController.getAllPhones);

router.post('/add_email', authMiddleware, checkAccessCompanyMiddleware, clientController.addEmail);
router.post('/del_email', authMiddleware, checkAccessCompanyMiddleware, clientController.delEmail);
router.get('/all_emails', authMiddleware, checkAccessCompanyMiddleware, clientController.getAllEmail);

router.post('/upload_images', authMiddleware,checkAccessCompanyMiddleware, clientController.uploadImages);
router.post('/delete_images', authMiddleware,checkAccessCompanyMiddleware, clientController.deleteImages);
router.get('/get_all_images', authMiddleware, checkAccessCompanyMiddleware, clientController.getAllImages);


module.exports = router;