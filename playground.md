mutation {
  createUser(
    data: {
      name: "Krystyna"
      email: "krycha@example.com"
    }
  ){
    id
    name
    email
  }
}

query {
  users {
    id
    name
    email
    posts {
      id
    }
  }
}

OR

query {
  users {
   ...userFields
  }
}

fragment userFields on User {
  id
  name
  email
}

mutation {
  updateUser(
    where:{
      id: "cjyelt7xp000v0934o229y6xj"
    },
    data:{
      name: "Edited Krystyna"
    }
  ) {
    id
    name
  }
}

mutation {
  deleteUser(
    where: {
      id: "cjyem32bh004409344o4hpnvv"
    }
  ) {
    id
    name
  }
}

mutation {
  createPost(data:{
    title: "Prisma post",
    body: "",
    published: false,
    author: {
      connect: {
        id: "cjyelt7xp000v0934o229y6xj"
      }
    }
  }){
    id
    title
    body
    published
    author{
      id
      name
    }
  }
}

mutation {
  updatePost(
    where: {
      id: "cjyemangc009f0934v6miim3j"
    },
    data: {
      published: true
    }
  ) {
    id
    title
    body
    published
  }
}

mutation {
  createComment(
    data: {
      text: "A comment from Prisma GraphQL",
      author: {
        connect: {
          id: "cjyemjfdy00fb0934cdu8l994"
        }
      },
      post: {
        connect: {
          id: "cjyemangc009f0934v6miim3j"
        }
      }
    }
  ) {
    id
    text
    author{
      id
      name
    }
  }


  mutation {
  login(
    data: {
      email: "krystyna@example.com",
      password: "red12345"
    }
  ) {
    user {
      id
      name
    }
    token
  }
}