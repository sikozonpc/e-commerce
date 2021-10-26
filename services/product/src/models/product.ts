import mongoose from 'mongoose';

interface ProductAttributes {
  title: string;
  price: number;
  description?: string;
}

export interface ProductDocument extends mongoose.Document, ProductAttributes { }

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

productSchema.statics.build = (attrs: ProductAttributes) => new Product(attrs);

const Product = mongoose.model<ProductDocument, ProductModel>('Product', productSchema);
export { Product };

