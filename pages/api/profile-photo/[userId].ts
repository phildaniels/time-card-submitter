import { NextApiRequest, NextApiResponse } from 'next';
import { pipeline, Readable } from 'stream';
import { axios } from '../../../utils/http-server';
import { Blob } from 'buffer';
import { promisify } from 'util';
const asyncPipeline = promisify(pipeline);

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;
  try {
    const photoResponse = await axios.get<Readable>(
      `https://graph.microsoft.com/v1.0/users/${userId}/photo/$value`,
      {
        responseType: 'stream',
      }
    );
    const { data } = photoResponse;
    await asyncPipeline(data, res);
  } catch (e) {
    console.log('[userId].ts error was', e);
    res.status(500).send('something went wrong');
  }
};

export default handler;
