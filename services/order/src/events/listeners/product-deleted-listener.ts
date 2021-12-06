import { Listener, ProductDeletedEvent, Subjects } from '@ecomtiago/common';
import { Message } from 'node-nats-streaming';
import { Product } from '../../models/product';
import { queueGroupName } from './queue-group-name';

export class ProductDeletedListener extends Listener<ProductDeletedEvent> {
  readonly subject = Subjects.ProductDeleted;
  queueGroupName = queueGroupName;
  async onMessage(data: ProductDeletedEvent['data'], msg: Message) {
    const { id } = data;
    await Product.findByIdAndDelete(id);
    msg.ack();
  }
}