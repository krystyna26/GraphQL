const Comment = {
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
};

export { Comment as default };
