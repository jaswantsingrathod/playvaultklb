const express = require('express');
const router = express.Router();
const {
  uploadMedia,
  getAllMedia,
  deleteMedia,
  bulkDeleteMedia,
} = require('../controllers/mediaController');
const { protectAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/upload', protectAdmin, upload.single('image'), uploadMedia);
router.get('/', protectAdmin, getAllMedia);
router.post('/bulk-delete', protectAdmin, bulkDeleteMedia);
router.delete('/bulk', protectAdmin, bulkDeleteMedia);
router.delete('/:id', protectAdmin, deleteMedia);

module.exports = router;
