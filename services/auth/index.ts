import { connect } from './db';
import { createServer, startServer } from './src/server';

(async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('Env MONGO_URI not found!');
  }
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY is required');
  }

  try {
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