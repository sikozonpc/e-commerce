import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

export interface ProductAttributes {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

export interface ProductDocument extends mongoose.Document, Omit<ProductAttributes, 'id'> {
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

productSchema.statics.build = (attrs: ProductAttributes) => {
  const { id, ...props } = attrs;
  return new Product({
    _id: id,
    ...props,
  });
}

const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);
export { Product };

