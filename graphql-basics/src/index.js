import { GraphQLServer } from "graphql-yoga";

import db from "./db";

import Query from "./resolvers/Query";
import Mutation from "./resolvers/Mutation";
import User from "./resolvers/User";
import Post from "./resolvers/Post";
import Comment from "./resolvers/Comment";

// Scalar type = String, Boolean, Int, Float, ID

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// this is original function which arguments were replace by CreateUserInput etc
// createUser(name: String!, email: String!, age: Int): User!
// createPost(title: String!, body: String!, published: Boolean!, author: ID!):Post!

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Resolvers
const resolvers = {};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment
  },
  context: {
    db: db
  }
});

server.start(() => {
  console.log("The server is up");
});

// run: npm run start
// Go to localhost:4000 an run the query
