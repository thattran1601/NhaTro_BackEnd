const express = require('express');
const router = express.Router();
const contractController = require('../controllers/hopdong.controller');

router.get('/', contractController.getAllContracts);
router.post('/', contractController.createContract);
router.put('/:MaHD', contractController.updateContract);

module.exports = router;