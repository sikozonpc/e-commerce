import { ProductCreatedEvent, Publisher, Subjects } from "@ecomtiago/common";

export class ProductCreatedPublisher extends Publisher<ProductCreatedEvent> {
  readonly subject = Subjects.ProductCreated;

}