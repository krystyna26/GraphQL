import { GraphQLServer, PubSub } from "graphql-yoga";

import db from "./db";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";
import Subscription from './resolvers/Subscription';

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
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment
  },
  context: {
    // accessible from all resolvers
    db: db,
    pubsub
  }
});

server.start(() => {
  console.log("The server is up");
});

// run: npm run start
// Go to localhost:4000 an run the query
