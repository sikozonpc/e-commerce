import Hapi from '@hapi/hapi';
import { plugins } from './plugins';

const server: Hapi.Server = Hapi.server({
  port: 3000,
  host: '0.0.0.0',
});

export async function createServer(): Promise<Hapi.Server> {
  await server.register(plugins);
  await server.initialize();

  return server;
}

export async function startServer(server: Hapi.Server): Promise<Hapi.Server> {
  await server.start();
  return server;
}

process.on('unhandledRejection', (error) => {
  console.log(error);
  process.exit(1);
})
