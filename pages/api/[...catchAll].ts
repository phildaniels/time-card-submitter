import type { NextApiRequest, NextApiResponse } from 'next';
import { Backend } from './server/main';

export default async (request: NextApiRequest, response: NextApiResponse) =>
  new Promise(async (resolve) => {
    const listener = await Backend.getListener();
    listener(request, response);
    request.on('finish', resolve);
  });
