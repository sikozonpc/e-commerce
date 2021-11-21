import { ProductDocument } from '../../models/product';
import { OrderProduct } from '../../plugins/orders/create';

export const findProductWithNotEnoughStock = async (
  fetchedProducts: ProductDocument[],
  requestProducts: OrderProduct[],
) => fetchedProducts.find((product) => {
  const requestedProduct = requestProducts.find(p => p.id === product.id);
  if (!requestedProduct) return;

  const hasEnoughStock = product.quantity < requestedProduct.quantity;
  if (hasEnoughStock) return true;
});

export function areProductsValid(products: (ProductDocument | null)[]): products is ProductDocument[] {
  return !products.includes(null);
}
