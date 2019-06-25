const Query = {
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
      const title = post.title.toLowerCase().includes(args.query.toLowerCase());
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
};

export { Query as default };
