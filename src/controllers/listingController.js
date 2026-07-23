const prisma = require('../utils/prismaClient');

// Create a listing (agent only)
const createListing = async (req, res) => {
  try {
    const { title, description, price, location, bedrooms, bathrooms, images } = req.body;

    if (!title || !description || !price || !location || !bedrooms || !bathrooms) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: parseInt(price),
        location,
        bedrooms: parseInt(bedrooms),
        bathrooms: parseInt(bathrooms),
        images: images || [],
        agentId: req.userId,
      },
    });

    res.status(201).json({ message: 'Listing created successfully', listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get all listings (with optional location/price filters)
const getListings = async (req, res) => {
  try {
    const { location, minPrice, maxPrice, bedrooms } = req.query;

    const where = {};

    if (location) {
      where.location = { contains: location };
    }
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = parseInt(minPrice);
      if (maxPrice) where.price.lte = parseInt(maxPrice);
    }
    if (bedrooms) {
      where.bedrooms = parseInt(bedrooms);
    }

    const listings = await prisma.listing.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        agent: { select: { name: true, phone: true } },
      },
    });

    res.status(200).json({ count: listings.length, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get a single listing by ID
const getListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id: parseInt(id) },
      include: {
        agent: { select: { name: true, phone: true, email: true } },
      },
    });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.status(200).json({ listing });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Get listings posted by the logged-in agent
const getMyListings = async (req, res) => {
  try {
    const listings = await prisma.listing.findMany({
      where: { agentId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({ count: listings.length, listings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

// Delete a listing (only the agent who owns it)
const deleteListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({ where: { id: parseInt(id) } });

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (listing.agentId !== req.userId) {
      return res.status(403).json({ error: 'You can only delete your own listings' });
    }

    await prisma.listing.delete({ where: { id: parseInt(id) } });

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { createListing, getListings, getListingById, getMyListings, deleteListing };