import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: 'apartment' | 'house' | 'villa' | 'land' | 'commercial';
  price: number;
  currency: string;
  location: {
    wilaya: string;
    city: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  features: {
    bedrooms: number;
    bathrooms: number;
    area: number; // in m²
    garage?: number;
    garden?: boolean;
    pool?: boolean;
  };
  images: string[];
  owner: mongoose.Types.ObjectId;
  status: 'available' | 'sold' | 'rented';
  featured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    type: {
      type: String,
      enum: ['apartment', 'house', 'villa', 'land', 'commercial'],
      required: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    currency: {
      type: String,
      default: 'DZD',
    },
    location: {
      wilaya: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      latitude: Number,
      longitude: Number,
    },
    features: {
      bedrooms: {
        type: Number,
        default: 0,
      },
      bathrooms: {
        type: Number,
        default: 0,
      },
      area: {
        type: Number,
        required: true,
      },
      garage: Number,
      garden: Boolean,
      pool: Boolean,
    },
    images: [String],
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    status: {
      type: String,
      enum: ['available', 'sold', 'rented'],
      default: 'available',
    },
    featured: {
      type: Boolean,
      default: false,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for search functionality
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'location.wilaya': 1, 'location.city': 1 });

export default mongoose.model<IProperty>('Property', propertySchema);
