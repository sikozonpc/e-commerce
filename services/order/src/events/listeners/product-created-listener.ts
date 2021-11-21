import { Listener, ProductCreatedEvent, Subjects } from '@ecomtiago/common';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductCreatedListener extends Listener<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;
  queueGroupName = queueGroupName;
  async onMessage(data: ProductCreatedEvent['data'], msg: Message) {
    const { id, title, price, quantity } = data;

    const product = Product.build({ id, title, price, quantity });
    await product.save();

    msg.ack();
  }
}