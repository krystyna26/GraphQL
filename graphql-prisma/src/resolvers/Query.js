import getUserId from "../utils/getUserId";
import { request } from "https";

const Query = {
  // { db } === context.db
  // info contains all information about fields we requested
  users(parent, args, { db, prisma }, info) {
    const operationalArgs ={};
    if(args.query){
      operationalArgs.where = {
        // name_contains is taken from playground
        // name_contains: args.query
        OR: [{
          name_contains: args.query
        }
        // , {
        //   email_contains: args.query 
        // }
      ]
      }
    }
    
    // for the second arg you can use: nothing, string or object
    return prisma.query.users(operationalArgs, info)

    // another approach

  //   if (!args.query) { return db.users; }
  //   return users.filter(user => { return user.name.toLowerCase().includes(args.query.toLowerCase()); });
  },

  async myPosts(parent, args, { prisma, request } , info){
    const userId = getUserId(request);

    const opArgs =  {
      where:{
        author: {
          id: userId
        }
      }
    };

    if(args.query){
      opArgs.where.OR = [{
        title_contains: args.query
      }, {
        body_contains: args.query
      }]
    };

    return prisma.query.posts(opArgs, info);
  },

  posts(parent, args, { db, prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    };

    if(args.query){
      opArgs.where.OR = [{
        title_contains: args.query 
      },{
        body_contains: args.query
      }]
    }

    return prisma.query.posts(opArgs, info)
    // if (!args.query) {
    //   return db.posts;
    // }
    // return db.posts.filter(post => {
    //   const title = post.title.toLowerCase().includes(args.query.toLowerCase());
    //   const body = post.body.toLowerCase().includes(args.query.toLowerCase());
    //   return title || body;
    // });
  },

  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },

  async post(parent, args, {prisma, request}, info) {
    const userId = getUserId(request, false); // return string or undefined

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        },{
          author: { 
            id: userId
          }
        }]
      }
    }, info)

    if(posts.length === 0){
      throw new Error("Post not found")
    }

    return posts[0]
    
    // {
    //   id: "1",
    //   title: "GraphQL",
    //   body: "",
    //   published: false
    // };
  },

  me(parent, args, {prisma, request }, info) {
    const userId = getUserId(request);

    return prisma.query.user({
      where: {
        id: userId
      }
    })
    // {
    //   id: "123980",
    //   name: "Mike",
    //   email: "mike@mike.com"
    // };
  }
};

export { Query as default };
