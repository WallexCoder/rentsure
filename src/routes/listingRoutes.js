const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const agentMiddleware = require('../middleware/agentMiddleware');
const {
  createListing,
  getListings,
  getListingById,
  getMyListings,
  deleteListing,
} = require('../controllers/listingController');

router.get('/', getListings);                                          // public - browse all
router.get('/mine', authMiddleware, agentMiddleware, getMyListings);    // agent's own listings
router.get('/:id', getListingById);                                    // public - single listing
router.post('/', authMiddleware, agentMiddleware, createListing);      // agent only - create
router.delete('/:id', authMiddleware, agentMiddleware, deleteListing); // agent only - delete own

module.exports = router;