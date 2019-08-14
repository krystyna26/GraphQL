import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";

import { resolvers, fragmentReplacements } from './resolvers/index';
import prisma from './prisma';

// Scalar type = String, Boolean, Int, Float, ID

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// this is original function which arguments were replace by CreateUserInput etc
// createUser(name: String!, email: String!, age: Int): User!
// createPost(title: String!, body: String!, published: Boolean!, author: ID!):Post!

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Resolvers - we moved them to separate files
// const resolvers = {};

// creating new instance and pass it to all resolvers
const pubsub = new PubSub();

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    // console.log(request.request.headers) - this is where token lives. For more look for graphQL yoga docs
    // accessible from all resolvers
    return {
      db: db,
      pubsub,
      prisma,
      request
    }
  },
  fragmentReplacements
});

server.start(() => {
  console.log("The server is up");
});

// run: npm run start
// Go to localhost:4000 an run the query
