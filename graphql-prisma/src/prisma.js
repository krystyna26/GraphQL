import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index';

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: "thinkpositivesecret",
    fragmentReplacements
})

export {prisma as default};
// query, mutations, subscription, exists

// null is for operational argument (needed for mutations) (it can be filter or sort)
// 2nd arg is selection set - string - what do I want from each user (id, name, email)
// data represents response from API (right side of playground)
// prisma.query.users(null, '{ id name posts { id title } }').then((data)=> {
//   // 2nd arg is call replacer function, this can allow us to remove or replace property
//   // 3rd args determines how many spaces we want to use to indent our object
//   console.log(JSON.stringify(data, undefined, 2 ))
//   // now data is much easier to read - thanks to JSON.stringify
// })

// prisma.query.comments(null, '{ id text author {id name } }').then((data)=> {
//   console.log(JSON.stringify(data, undefined, 2))
// })

// first post is created, then we fetch all users, after that all users are returned in console
// prisma.mutation.createPost({
//   data: {
//     title: "Graphql 101",
//     body: "Empty body here",
//     published: false,
//     author: {
//       connect: {
//         id: "cjyemjfdy00fb0934cdu8l994"
//       }
//     }
//   }
// }, '{ id title body published }').then((data)=>{
//   console.log(data);
//   return prisma.query.users(null, '{  id name posts { id title body }}')
// }).then((data)=>{
//   console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.mutation.updatePost({
//   data: {
//     body: "Challenge body edited",
//     published: true
//   },
//   where : {
//     id: "cjyeucwgh03cs0934dhqe8ay7"
//   }
// }, '{ id title body published }').then((data) => {
//   console.log('UPDATED POST')
//     console.log(data)
//     return prisma.query.posts(null, '{ id title body published }')
// }).then((data) => {
//   console.log('ALL POSTS');
//   console.log(data)
// })


// 1. create a new post 
// 2. fetch all of the info about the author (user)
// const createPostForUser = async (authorId, data) => {
//   const userExists = await prisma.exists.User({
//     id: authorId
//   })

//   if(!userExists) {
//     throw new Error('User not found')
//   }

//   const post = await prisma.mutation.createPost({
//     data: {
//       // that '...data' contains all title, body and published
//       ...data,
//       author: {
//         connect: {
//           id: authorId
//         }
//       }
//     }
//   }, '{ author { id name email posts { id title published } } }')
  // the above line replaced the 'user' below. Now we have to change 'return user' to post.author
  // const user = await prisma.query.users({
  //   where: {
  //     id: authorId
  //   }

  // }, '{ id name email posts { id title published } }')

//   return post.author
// }

// createPostForUser('cjyelt7xp000v0934o229y6xj', {
//   title: "Great book to read too",
//   body: "The War of Art 2",
//   published: true
// }).then((user) => {
//   console.log('USER', JSON.stringify(user, undefined, 2));
// }).catch((error) => {
//   console.log('ERROR', error.message);
// })

// const updatePostForUser = async (postID, dataToUpdate) => {
//   const postExists = await prisma.exists.Post({ id: postID})

//   if(!postExists){
//     throw new Error('Post not exist')
//   }

//   const updatedPost = await prisma.mutation.updatePost({
//     data: dataToUpdate,
//     where: {
//       id: postID
//     }
//     // we need id for this post to fetch associated user
//   }, '{ author { id name email posts { id title published } } }')

  // const associatedUser = prisma.query.user({
  //   where: {
  //     // id is stored above in updatedPost obj
  //     id: updatedPost.author.id
  //   }
  //   // we need to fetch all associated used with belows data
  // }, '{ id name email posts { id title published} }')

  // return associatedUser;
//   return updatedPost.author
// }

// updatePostForUser('cjyexco4x05ad0934gpnx9hmz', { published: false }).then((user) => {
//   console.log('USER ASSOCIATED:', JSON.stringify(user, undefined, 2));
// }).catch((error) => {
//   console.log('ERROR:', error.message);
// })


// checking if user exists
// prisma.exists.User({
//   id: "cjyem6eq1006i0934wderx5sy"
// }).then((exists) => {
//   console.log(exists);
  
// })