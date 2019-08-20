// import uuidv4 from "uuid/v4";
import bcrypt from "bcryptjs";
import generatedToken from "../utils/generateToken";
import getUserId from "../utils/getUserId";
import hashPassword from "../utils/hashPassword";
import dayjs from "dayjs";

// const token = jwt.sign({ id : 46 }, 'mysecret');
// console.log(token);

// const decoded = jwt.decode(token);
// console.log(decoded);

// const decoded2 = jwt.verify(token, 'mysecret');
// console.log(decoded2);

var moment = require("moment");

const Mutation = {
  async login(parent, args, { prisma }, info) {
    const userExist = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });

    if (!userExist) {
      throw new Error("No user found");
    }

    const isMatch = await bcrypt.compare(
      args.data.password,
      userExist.password
    );
    if (!isMatch) {
      throw new Error("Password incorrect");
    }

    // shape has to match with AuthPayload shape
    return {
      user: userExist,
      token: generatedToken(userExist.id)
    };
  },

  async createUser(parent, args, { prisma }, info) {
    const hashedPassword = await hashPassword(args.data.password);

    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if (emailTaken) {
      throw new Error("Email taken.");
    }

    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }
    });

    return {
      user,
      token: generatedToken(user.id)
    };
    // ~~~~~~~~~~~~~~~~~~
    // const emailTaken = db.users.some(user => user.email === args.data.email);
    // console.log(emailTaken);
    // if (emailTaken) {
    //   throw new Error("Email taken.");
    // }

    // const user = {
    //   id: uuidv4(),
    //   name: args.name,
    //   email: args.email,
    //   age: args.age
    // };

    //how spread operator works. user obj is the same as above
    // const user = {
    //   id: uuidv4(),
    //   ...args.data
    // };

    // using spread operator
    // const one = {
    //   name: "Raba",
    //   country: "Poland"
    // };
    // const two = {
    //   population: 150000,
    //   ...one
    // };
    // db.users.push(user);
    // return user;

    // this console you can see in terminal
    // console.log(args);
  },

  async deleteUser(parent, args, { db, prisma, request }, info) {
    const userID = getUserId(request);

    const userExists = await prisma.exists.User({ id: args.id });
    if (!userExists) {
      throw new Error(" User not found");
    }
    return await prisma.mutation.deleteUser(
      {
        where: {
          id: userID
        }
      },
      info
    );
    // const userIndex = db.users.findIndex(user => {
    //   return user.id === args.id;
    // });

    // if (userIndex === -1) {
    //   throw new Error(" User not found");
    // }

    // const deletedUsers = db.users.splice(userIndex, 1);

    // db.posts = db.posts.filter(post => {
    //   // find posts belonging to deleted author
    //   const match = post.author === args.id;

    //   if (match) {
    //     db.comments = db.comments.filter(comment => {
    //       // delete comments belonging to deleted post
    //       return comment.post !== post.id;
    //     });
    //   }
    //   return !match;
    // });
    // comments = comments.filter(comment => {
    //   return comment.author !== args.id;
    // });

    // return deletedUsers[0];
  },

  async updateUser(parent, args, { db, prisma, request }, info) {
    const userId = getUserId(request);

    if (typeof args.data.password === "string") {
      args.data.password = await hashPassword(args.data.password);
    }

    return prisma.mutation.updateUser(
      {
        where: {
          id: userId
        },
        data: args.data
      },
      info
    );

    // destructured args
    // const { id, data } = args;
    // const user = db.users.find(user => user.id === id);

    // if (!user) {
    //   throw new Error("User not found");
    // }

    // if (typeof data.email === "string") {
    //   const emailTaken = db.users.some(user => user.email === data.email);

    //   if (emailTaken) {
    //     throw new Error("Email taken");
    //   }

    //   user.email = data.email;
    // }

    // if (typeof data.name === "string") {
    //   user.name = data.name;
    // }

    // if (typeof data.age !== "undefined") {
    //   user.age = data.age;
    // }

    // return user;
  },

  createPost(parent, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.mutation.createPost(
      {
        data: {
          title: args.data.title,
          body: args.data.body,
          published: args.data.published,
          author: {
            connect: {
              id: userId
            }
          }
        }
      },
      info
    );
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // const userExists = db.users.some(user => user.id === args.data.author);

    // if (!userExists) {
    //   throw new Error("User not found!");
    // }

    // const post = {
    //   id: uuidv4(),
    //   title: args.data.title,
    //   body: args.data.body,
    //   published: args.data.published,
    //   author: args.data.author
    // };

    // db.posts.push(post);

    // if (args.data.published) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "CREATED",
    //       data: post
    //     }
    //   });
    // }

    // return post;
  },

  async updatePost(parent, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);

    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    // delete all comments when unpublishing a post
    const isPublished = await prisma.exists.Post({
      id: args.id,
      published: true
    });
    if (isPublished && args.data.published === false) {
      await prisma.mutation.deleteManyComments({
        where: { post: { id: args.id } }
      });
    }

    if (!postExists) {
      throw new Error("Post does not exist for this user");
    }

    return prisma.mutation.updatePost(
      {
        where: {
          id: args.id
        },
        data: args.data
      },
      info
    );
    // title, body, published
    // const { id, data } = args;
    // const post = db.posts.find(post => post.id === id);
    // const originalPost = { ...post };

    // if (!post) {
    //   throw new Error("Post not exists");
    // }

    // if (typeof data.title === "string") {
    //   post.title = data.title;
    // }

    // if (typeof data.body === "string") {
    //   post.body = data.body;
    // }

    // if (typeof data.published === "boolean") {
    //   post.published = data.published;

    //   if (originalPost.published && !post.published) {
    //     // deleted
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "DELETED",
    //         data: originalPost
    //       }
    //     });
    //   } else if (!originalPost.published && post.published) {
    //     // created
    //     pubsub.publish("post", {
    //       post: {
    //         mutation: "CREATED",
    //         data: post
    //       }
    //     });
    //   }
    // } else if (post.published) {
    //   // update
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "UPDATED",
    //       data: post
    //     }
    //   });
    // }
    // return post;
  },

  async deletePost(parents, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);
    const postExists = await prisma.exists.Post({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!postExists) {
      throw new Error("Operation failed");
    }

    return prisma.mutation.deletePost(
      {
        where: {
          id: args.id
        }
      },
      info
    );

    // check if post exist
    // const postIndex = db.posts.findIndex(post => post.id === args.id);

    // if (postIndex == -1) {
    //   throw new Error("Post not found");
    // }

    // // remove post
    // const [post] = db.posts.splice(postIndex, 1);
    // console.log("deleted post", deletedPost);

    // // posts.find((post=> post.id === postExists.id))

    // // remove all comments belonging to post
    // db.comments = db.comments.filter(comment => {
    //   return comment.post !== args.id;
    // });

    // if (post.publish) {
    //   pubsub.publish("post", {
    //     post: {
    //       mutation: "DELETED",
    //       data: post
    //     }
    //   });
    // }

    // return post;
  },

  async createComment(parent, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);

    // create comment for published posts only
    const postExists = await prisma.exists.Post({
      id: args.data.post,
      published: true
    });
    if (!postExists) {
      throw new Error("Post does not exist");
    }

    //

    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: userId
          }
        },
        post: {
          connect: {
            id: args.data.post
          }
        }
      }
    });

    // console.log('users', db)
    // const userExists = db.users.some(user => user.id === args.data.author);
    // const postExists = db.posts.some(
    //   post => post.id === args.data.post && post.published
    // );

    // if (!userExists || !postExists) {
    //   throw new Error("Unable to find user and post");
    // }

    // const comment = {
    //   id: uuidv4(),
    //   // ...args.data
    //   // replaced
    //   text: args.data.text,
    //   author: args.data.author,
    //   post: args.data.post
    // };

    // db.comments.push(comment);
    // pubsub.publish(`comment ${args.data.post}`, {
    //   comment: {
    //     mutation: "CREATED",
    //     data: comment
    //   }
    // });

    // return comment;
  },

  async deleteComment(parents, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);

    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to delete this comment");
    }

    return prisma.mutation.deleteComment(
      {
        where: {
          id: args.id
        }
      },
      info
    );
    // const commentIndex = db.comments.findIndex(
    //   comment => comment.id === args.id
    // );

    // if (commentIndex === -1) {
    //   throw new Error("Comment not found");
    // }
    // const [deletedComment] = db.comments.splice(commentIndex, 1);
    // pubsub.publish(`comment ${deletedComment.post}`, {
    //   comment: {
    //     mutation: "DELETED",
    //     data: deletedComment
    //   }
    // });

    // return deletedComment;
  },

  async updateComment(parent, args, { db, pubsub, prisma, request }, info) {
    const userId = getUserId(request);
    const commentExists = await prisma.exists.Comment({
      id: args.id,
      author: {
        id: userId
      }
    });

    if (!commentExists) {
      throw new Error("Unable to update comment");
    }

    return prisma.mutation.updateComment(
      {
        data: args.data,
        where: {
          id: args.id
        }
      },
      info
    );
    // const { id, data } = args;
    // const commentExists = db.comments.find(comment => comment.id === id);

    // if (!commentExists) {
    //   throw new Error("Comment does not exists");
    // }

    // if (typeof data.text === "string") {
    //   commentExists.text = data.text;
    // }

    // pubsub.publish(`comment ${commentExists.post}`, {
    //   comment: {
    //     mutation: "UPDATED",
    //     data: commentExists
    //   }
    // });

    // return commentExists;
  }

  // createTrip(parent, args, { db, prisma, request }, info) {
  // const ds = dayjs(args.data.travel_started_at);
  // const de = dayjs(args.data.travel_ended_at);
  // return prisma.mutation.createTrip({
  //   travel_started_at: ds.format("MM-DD-YYYY"),
  //   travel_ended_at: de.format("MM-DD-YYYY")
  // });
  //   return prisma.mutation.createTrip({
  //     travel_started_at: moment(args.data.travel_started_at).format(),
  //     travel_ended_at: moment(args.data.travel_ended_at).format()
  //   });
  // }
};

export { Mutation as default };
