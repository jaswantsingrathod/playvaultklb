const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  getAllMedia,
  deleteMedia,
} = require('../controllers/mediaController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protectAdmin, upload.single('image'), uploadMedia);
router.get('/', protectAdmin, getAllMedia);
router.delete('/:id', protectAdmin, deleteMedia);

module.exports = router;
