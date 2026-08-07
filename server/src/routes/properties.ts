import express, { Request, Response } from 'express';
import { body, validationResult, query } from 'express-validator';
import Property from '../models/Property.js';
import { authenticateToken, AuthRequest } from '../middleware/auth.js';

const router = express.Router();

// Get all properties with filters
router.get('/', async (req: Request, res: Response) => {
  try {
    const { type, wilaya, city, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

    const filter: any = { status: 'available' };

    if (type) filter.type = type;
    if (wilaya) filter['location.wilaya'] = wilaya;
    if (city) filter['location.city'] = city;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: String(search) };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(filter);

    res.json({
      success: true,
      data: properties,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch properties',
      error,
    });
  }
});

// Get single property
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name email phone profileImage');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    res.json({
      success: true,
      data: property,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch property',
      error,
    });
  }
});

// Create property (authenticated)
router.post(
  '/',
  authenticateToken,
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('type').isIn(['apartment', 'house', 'villa', 'land', 'commercial']),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('location.wilaya').notEmpty(),
    body('location.city').notEmpty(),
    body('location.address').notEmpty(),
    body('features.area').isNumeric(),
  ],
  async (req: AuthRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
      const property = new Property({
        ...req.body,
        owner: req.user?.id,
      });

      await property.save();

      res.status(201).json({
        success: true,
        message: 'Property created successfully',
        data: property,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create property',
        error,
      });
    }
  }
);

// Update property (authenticated)
router.put('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property',
      });
    }

    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      success: true,
      message: 'Property updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update property',
      error,
    });
  }
});

// Delete property (authenticated)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check ownership
    if (property.owner.toString() !== req.user?.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property',
      });
    }

    await Property.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Property deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete property',
      error,
    });
  }
});

export default router;
