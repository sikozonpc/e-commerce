import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface ProductAttributes {
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

const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);
export { Product };

