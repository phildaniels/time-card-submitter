import { ApolloServer } from 'apollo-server-micro';
import {
  ApolloServerPluginLandingPageProductionDefault,
  ApolloServerPluginLandingPageGraphQLPlayground,
} from 'apollo-server-core';
import { typeDefs } from './schemas';
import { resolvers } from './resolvers';
import Cors from 'micro-cors';
import { RequestHandler } from 'micro';
import { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';

const cors = Cors();

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageProductionDefault({})
      : ApolloServerPluginLandingPageGraphQLPlayground({}),
  ],
});

const startServer = apolloServer.start();
const handler: RequestHandler = async (
  req: IncomingMessage,
  res: ServerResponse
) => {
  if (req.method === 'OPTIONS') {
    res.end();
    return false;
  }
  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
};

export default cors(handler);
