import { GraphQLServer } from "graphql-yoga";
import uuidv4 from "uuid/v4";
import db from "./db";

// Scalar type = String, Boolean, Int, Float, ID

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// this is original function which arguments were replace by CreateUserInput etc
// createUser(name: String!, email: String!, age: Int): User!
// createPost(title: String!, body: String!, published: Boolean!, author: ID!):Post!

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Resolvers
const resolvers = {
  Query: {
    // { db } === context.db
    users(parent, args, { db }, info) {
      if (!args.query) {
        return db.users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    posts(parent, args, { db }, info) {
      if (!args.query) {
        return db.posts;
      }
      return db.posts.filter(post => {
        const title = post.title
          .toLowerCase()
          .includes(args.query.toLowerCase());
        const body = post.body.toLowerCase().includes(args.query.toLowerCase());
        return title || body;
      });
    },

    comments(parent, args, { db }, info) {
      return db.comments;
    },

    post() {
      return {
        id: "1",
        title: "GraphQL",
        body: "",
        published: false
      };
    },

    me() {
      return {
        id: "123980",
        name: "Mike",
        email: "mike@mike.com"
      };
    }
  },
  Mutation: {
    createUser(parent, args, { db }, info) {
      const emailTaken = db.users.some(user => user.email === args.data.email);
      console.log(emailTaken);
      if (emailTaken) {
        throw new Error("Email taken.");
      }

      // const user = {
      //   id: uuidv4(),
      //   name: args.name,
      //   email: args.email,
      //   age: args.age
      // };

      //how spread operator works. user obj is the same as above
      const user = {
        id: uuidv4(),
        ...args.data
      };

      // using spread operator
      const one = {
        name: "Raba",
        country: "Poland"
      };

      const two = {
        population: 150000,
        ...one
      };

      db.users.push(user);

      return user;

      // this console you can see in terminal
      console.log(args);
    },

    deleteUser(parent, args, { db }, info) {
      const userIndex = db.users.findIndex(user => {
        return user.id === args.id;
      });

      if (userIndex === -1) {
        throw new Error(" User not found");
      }

      const deletedUsers = db.users.splice(userIndex, 1);

      db.posts = db.posts.filter(post => {
        // find posts belonging to deleted author
        const match = post.author === args.id;

        if (match) {
          db.comments = db.comments.filter(comment => {
            // delete comments belonging to deleted post
            return comment.post !== post.id;
          });
        }
        return !match;
      });
      comments = comments.filter(comment => {
        return comment.author !== args.id;
      });

      return deletedUsers[0];
    },

    createPost(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.post.author);

      if (!userExists) {
        throw new Error("User not found!");
      }

      const post = {
        id: uuidv4(),
        title: args.post.title,
        body: args.post.body,
        published: args.post.published,
        author: args.post.author
      };

      db.posts.push(post);

      return post;
    },

    deletePost(parents, args, { db }, info) {
      // check if post exist
      const postIndex = db.posts.findIndex(post => post.id === args.id);

      if (postIndex == -1) {
        throw new Error("Post not found");
      }

      // remove post
      const deletedPost = db.posts.splice(postIndex, 1);
      console.log("deleted post", deletedPost);

      // posts.find((post=> post.id === postExists.id))

      // remove all comments belonging to post
      db.comments = db.comments.filter(comment => {
        return comment.post !== args.id;
      });

      return deletedPost[0];
    },

    createComment(parent, args, { db }, info) {
      const userExists = db.users.some(user => user.id === args.comment.author);

      const postExists = db.posts.some(
        post => post.id === args.comment.post && post.published
      );

      if (!userExists || !postExists) {
        throw new Error("Unable to find user and post");
      }

      const comment = {
        id: uuidv4(),
        text: args.comment.text,
        author: args.comment.author,
        post: args.comment.post
      };

      db.comments.push(comment);

      return comment;
    },

    deleteComment(parents, args, { db }, info) {
      const commentIndex = db.comments.findIndex(
        comment => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment not found");
      }
      const deletedComment = db.comments.splice(commentIndex, 1);

      return deletedComment[0];
    }
  },
  Post: {
    author(parent, args, { db }, info) {
      return db.users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, { db }, info) {
      return db.posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, { db }, info) {
      return db.comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    // comment is a parent
    // given a comment return a correct author
    author(parent, args, context, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, context, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context: {
    db: db
  }
});

server.start(() => {
  console.log("The server is up");
});

// run: npm run start
// Go to localhost:4000 an run the query
