import { ProductDeletedEvent, Publisher, Subjects } from "@ecomtiago/common";

export class ProductDeletedPublisher extends Publisher<ProductDeletedEvent> {
  readonly subject = Subjects.ProductDeleted;

}