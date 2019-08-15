import getUserId from '../utils/getUserId';

const Subscription = {
  // count: {
  //   subscribe(paren, args, { pubsub }, info) {
  //     let count = 0;

  //     // 1000 miliseconds === 1 second
  //     setInterval(() => {
  //       count++;
  //       pubsub.publish("count", {
  //         count: count
  //       });
  //     }, 1000);

  //     return pubsub.asyncIterator("count");
  //   }
  // },

  comment: {
    subscribe(parent, { postId }, { db, pubsub, prisma }, info) {

      // data flows from Prisma -> Node -> Client (GraphQL Playground)

      return prisma.subscription.comment({
        where:{
          node: {
            post:{
              id: postId
            }
          }
      }}, info)
      // ~~~~~~~~~~~~~~~~~~~~~~~~~
      // const post = db.posts.find(post => post.id === postId && post.published);

      // if (!post) {
      //   throw new Error("Post not found");
      // }

      // return pubsub.asyncIterator(`comment ${postId}`);
    }
  },

  post: {
    subscribe(parent, args, { pubsub, prisma }, info) {
      return prisma.subscription.post({
        where: {
          node: {
            published: true
          }
        }
      }, info)
      // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // return pubsub.asyncIterator(`post}`);
    }
  },

  myPost: {
    subscribe(parent, args, { prisma, request}, info){
      const userId = getUserId(request);

      return prisma.subscription.post({
        where: {
          node: {
            author: {
                id: userId
            }
          }
        }
      }, info)
    }
  }
};

export { Subscription as default };
