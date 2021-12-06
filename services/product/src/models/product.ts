import Joi from 'joi';
import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface ProductAttributes {
  title: string;
  price: number;
  description?: string;
  quantity: number;
}

export interface ProductDocument extends mongoose.Document, ProductAttributes {
  version: number;
}

interface ProductModel extends mongoose.Model<ProductDocument> {
  build: (attrs: ProductAttributes) => ProductDocument;
  getSchema: () => Joi.Schema;
  getPatchableSchema: () => Joi.Schema;
}

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: false,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});

// Implements "Optimistic Concurrency Control"
productSchema.set('versionKey', 'version');
productSchema.plugin(updateIfCurrentPlugin);

productSchema.statics.build = (attrs: ProductAttributes) => new Product(attrs);

productSchema.statics.getSchema = () => Joi.object({
  title: Joi.string().required(),
  price: Joi.number().positive().required(),
  quantity: Joi.number().positive().required(),
  description: Joi.string(),
});

productSchema.statics.getPatchableSchema = () => Joi.object({
  title: Joi.string().optional(),
  price: Joi.number().positive().optional(),
  quantity: Joi.number().positive().optional(),
  description: Joi.string().optional(),
})

const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);
export { Product };

