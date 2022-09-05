const Router = require('express');
const router = new Router();
const companyRouter = require('./companyRouter');
const userRouter = require('./userRouter');
const roleAccessRouter = require('./roleAccessRouter');
const clientsRouter = require('./clientsRouter');
const stockRouter = require('./stockRouter');

router.use('/company', companyRouter);
router.use('/user', userRouter);
router.use('/role', roleAccessRouter);
router.use('/client', clientsRouter);
router.use('/stock', stockRouter);

module.exports = router;