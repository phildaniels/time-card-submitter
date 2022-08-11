import { NestFactory } from '@nestjs/core';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { AppModule } from './server/app/app.module';
import { Backend } from './server/main';

async function getNestJSRequestHandler() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.setGlobalPrefix('api');
  await app.init();
  const server = app.getHttpServer();
  const [requestHandler] = server.listeners('request') as NextApiHandler[];
  return requestHandler;
}

export default async (request: NextApiRequest, response: NextApiResponse) =>
  new Promise(async (resolve) => {
    const listener = await Backend.getListener();
    listener(request, response);
    request.on('finish', resolve);
  });
