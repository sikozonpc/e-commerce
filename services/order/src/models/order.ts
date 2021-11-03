import mongoose from 'mongoose';
import { ProductDocument } from './product';

export enum OrderStatus {
  Created = 'created',
  Cancelled = 'cancelled',
  AwaitingPayment = 'awaiting:payment',
  Complete = 'complete'
}

interface OrderModelAttributes {
  status: OrderStatus;
  expiresAt: Date;
  products: ProductDocument[];
  userId: string;
}

export interface OrderModelDocument extends mongoose.Document, OrderModelAttributes { }

interface OrderModelModel extends mongoose.Model<OrderModelDocument> {
  build: (attrs: OrderModelAttributes) => OrderModelDocument;
}

const orderSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created,
  },
  expiresAt: {
    type: mongoose.Schema.Types.Date,
  },
  userId: {
    type: String,
    required: true,
  },
  product: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'product',
    }
  ],
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
});


orderSchema.statics.build = (attrs: OrderModelAttributes) => new Order(attrs);

const Order = mongoose.model<OrderModelDocument, OrderModelModel>(
  'Order',
  orderSchema
);

export { Order };

