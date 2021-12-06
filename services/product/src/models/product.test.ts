import { Product } from './product';

describe('Product model', () => {
  it('should implement Optimistic concurrency control', async () => {
    const product = Product.build({ title: 'sample title', price: 5, quantity: 42 });
    await product.save();

    const firstInstance = await Product.findById(product.id);
    const secondInstance = await Product.findById(product.id);

    firstInstance!.set({ price: 10 });
    secondInstance!.set({ price: 15 });

    await firstInstance!.save();

    // save the second fetched product and expect an error
    try {
      await secondInstance!.save();
    } catch (err) {
      return;
    }

    throw new Error('should not reach this point, OCC might not be working');
  });

  it('should increment the version number on multiple saves', async () => {
    const product = Product.build({ title: 'sample title', price: 5, quantity: 42 });
    await product.save();

    expect(product.version).toEqual(0);

    await product.save();
    expect(product.version).toEqual(1);
    await product.save();
    expect(product.version).toEqual(2);
  });
});