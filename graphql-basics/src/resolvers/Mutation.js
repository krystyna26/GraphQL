import uuidv4 from "uuid/v4";

const Mutation = {
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

  updateUser(parent, args, { db }, info) {
    // destructured args
    const { id, data } = args;
    const user = db.users.find(user => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some(user => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;
    }

    if (typeof data.name === "string") {
      user.name = data.name;
    }

    if (typeof data.age !== "undefined") {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some(user => user.id === args.data.author);

    if (!userExists) {
      throw new Error("User not found!");
    }

    const post = {
      id: uuidv4(),
      title: args.data.title,
      body: args.data.body,
      published: args.data.published,
      author: args.data.author
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish("post", {
        post: {
          mutation: "CREATED",
          data: post
        }
      });
    }

    return post;
  },

  updatePost(parent, args, { db, pubsub }, info) {
    // title, body, published
    const { id, data } = args;
    const post = db.posts.find(post => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not exists");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost
          }
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post
          }
        });
      }
    } else if (post.published) {
      // update
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post
        }
      });
    }
    return post;
  },

  deletePost(parents, args, { db, pubsub }, info) {
    // check if post exist
    const postIndex = db.posts.findIndex(post => post.id === args.id);

    if (postIndex == -1) {
      throw new Error("Post not found");
    }

    // remove post
    const [post] = db.posts.splice(postIndex, 1);
    console.log("deleted post", deletedPost);

    // posts.find((post=> post.id === postExists.id))

    // remove all comments belonging to post
    db.comments = db.comments.filter(comment => {
      return comment.post !== args.id;
    });

    if (post.publish) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post
        }
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    // console.log('users', db)
    const userExists = db.users.some(user => user.id === args.data.author);
    const postExists = db.posts.some(
      post => post.id === args.data.post && post.published
    );

    if (!userExists || !postExists) {
      throw new Error("Unable to find user and post");
    }

    const comment = {
      id: uuidv4(),
      // ...args.data
      // replaced
      text: args.data.text,
      author: args.data.author,
      post: args.data.post
    };

    db.comments.push(comment);
    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment
      }
    });

    return comment;
  },

  deleteComment(parents, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      comment => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment not found");
    }
    const [deletedComment] = db.comments.splice(commentIndex, 1);
    pubsub.publish(`comment ${deletedComment.post}`, {
      comment: {
        mutation: "DELETED",
        data: deletedComment
      }
    });

    return deletedComment;
  },

  updateComment(parent, args, { db, pubsub }, info) {
    const { id, data } = args;
    const commentExists = db.comments.find(comment => comment.id === id);

    if (!commentExists) {
      throw new Error("Comment does not exists");
    }

    if (typeof data.text === "string") {
      commentExists.text = data.text;
    }

    pubsub.publish(`comment ${commentExists.post}`, {
      comment: {
        mutation: "UPDATED",
        data: commentExists
      }
    });

    return commentExists;
  }
};

export { Mutation as default };
