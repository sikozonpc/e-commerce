import { Stan } from 'node-nats-streaming';
import { connect } from './db';
import { ProductCreatedListener } from './src/events/listeners/product-created-listener';
import { ProductDeletedListener } from './src/events/listeners/product-deleted-listener';
import { natsWrapper } from './src/nats-wrapper';
import { createServer, startServer } from './src/server';

const deferCloseNatsWrapper = async (stan: Stan) => {
  new Promise<void>((resolve) => {
    stan.on('close', () => {
      console.log('NATS connection closed!');
      resolve();
      process.exit();
    });

    process.on('SIGINT', () => {
      stan.close();
      resolve();
    });
    process.on('SIGTERM', () => {
      stan.close();
      resolve();
    });
  })
}

(async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is required');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('Env MONGO_URI not found!');
  }
  if (!process.env.NATS_URL) {
    throw new Error('Env NATS_URL not found!');
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('Env NATS_CLIENT_ID not found!');
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('Env MONGO_URI not found!');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER_ID,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL,
    );
    await deferCloseNatsWrapper(natsWrapper.client);

    // Listeners
    new ProductCreatedListener(natsWrapper.client).listen();
    new ProductDeletedListener(natsWrapper.client).listen();

    let server = await createServer();

    await connect(process.env.MONGO_URI);

    server = await startServer(server);
    console.log(`Server running on ${server.info.uri}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    console.log(error);
  }
})();