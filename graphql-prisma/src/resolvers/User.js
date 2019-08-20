import getUserId from "../utils/getUserId";

const User = {
  // ----------------------------------------
  // parent here is the user object, whatever was returned from Query.users()
  email: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { request }, info) {
      const userId = getUserId(request, false);

      if (userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  },

  // fetch published posts where user is the author
  posts: {
    fragment: "fragment userId on User { id }",
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      });
    }
  }

  // fetch trips where user is the author
  // myTrips: {
  // fragment: "fragment userId on USer { id }",
  //   resolve(parent, args, { prisma }, info) {
  //     return prisma.query.trips({
  //       where: {
  //         author: {
  //           id: parent.id
  //         }
  //       }
  //     });
  //   }
  // }
  // ----------------------------------------
  // posts(parent, args, { db }, info) {
  //   return db.posts.filter(post => {
  //     return post.author === parent.id;
  //   });
  // },
  // comments(parent, args, { db }, info) {
  //   return db.comments.filter(comment => {
  //     return comment.author === parent.id;
  //   });
  // }
};

export { User as default };
