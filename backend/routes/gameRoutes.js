const express = require('express');
const router = express.Router();
const {
  getPublicGames,
  getPublicGameById,
  getAdminGames,
  getAdminGameById,
  createGame,
  updateGame,
  deleteGame,
  bulkDeleteGames,
} = require('../controllers/gameController');
const { protectAdmin } = require('../middleware/auth');

// Public routes
router.get('/', getPublicGames);

// Admin endpoints (supporting both /api/games/admin/... and /api/admin/games/...)
router.get('/admin/all', protectAdmin, getAdminGames);
router.post('/admin/bulk-delete', protectAdmin, bulkDeleteGames);
router.delete('/admin/bulk', protectAdmin, bulkDeleteGames);
router.get('/admin/:id', protectAdmin, getAdminGameById);
router.post('/admin', protectAdmin, createGame);
router.put('/admin/:id', protectAdmin, updateGame);
router.delete('/admin/:id', protectAdmin, deleteGame);

// Additional admin root mappings when mounted at /api/admin/games
router.get('/all', protectAdmin, getAdminGames);
router.post('/bulk-delete', protectAdmin, bulkDeleteGames);
router.delete('/bulk', protectAdmin, bulkDeleteGames);
router.post('/', protectAdmin, createGame);
router.get('/:id', (req, res, next) => {
  // If it's an admin authenticated request or public
  if (req.headers.authorization) {
    return protectAdmin(req, res, () => getAdminGameById(req, res, next));
  }
  return getPublicGameById(req, res, next);
});
router.put('/:id', protectAdmin, updateGame);
router.delete('/:id', protectAdmin, deleteGame);

module.exports = router;
