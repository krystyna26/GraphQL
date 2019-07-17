# GraphQL

run `npm start`

go to `localhost:4000` and try writing some queries

```
query{
  users {
    id
    name
    email
    age
    posts {
      id
      title
    }
  }
}
```

mutations

```
mutation {
  updateUser(id: "1", data: {email: "emila@asdas.com"}){
    id
    name
    email
    age
  }
}
```

installing prisma: npm install -g prisma@1.12.0

from graphql-prisma directory run: prisma init prisma (to create 3 files in graphql-prisma), with arrow choose: 'use existing db', postgresql, no, grab 'host', 'port', 'user' and 'password', number and 'name' from heroku, hit yes for use SSL, do not generate, schema.graphql

inside the project the file 'datamodel.graphql' is similar to schema.graphql

in docker-compose.yml remove schema and change to ssl: true

```
  1. Open folder: cd prisma
  2. Start your Prisma server: docker-compose up -d
  3. Deploy your Prisma service: prisma deploy
```

after that go to localhost:4466 (another instance of graphQL playground coneccted to graphQL API) and create new user mutation: 

```
mutation {
createUser(
data: {
  name: "Lana Banana"
}){
id
name
}
}
```
and run

go to pgAdmin and refresh schema
schema/defaults$defaults/Tables/User (right click view/edit data -> All rows)

create another user in playground and refresh pgAdmin to see another user being added into db

new playground:
```
query{
users{
id
name
}}
```
in response you should get all users (2 so far)

```
mutation{
updateUser(
  where: {
    id: ""
  },
  data: {
    name: "Lana withouth Banana"
  } 
){
  id
  name
}
}
```

In 'datamodel.graphql' we can set customer type of user. After that we need to run 'prisma deploy' to update schema



```
type User {
  id: ID! @unique
  first_name: String!
  last_name: String!
  age: Int
  from: String
  avatar_url: Photos
  email: String! @unique
  password_hash: String!
  comments: [Comment!]!
  posts: [Post!]!
  trips: [Trip!]!
}

type Post {
  id: ID! @unique
  title: String!
  body: String!
  published: Boolean!
  author: User!
  comments: [Comment!]!
}

type Comment {
  id: ID! @unique
  trip_id: ID!
  user_id: ID!
  content: String!
}

type Trip {
  id: ID! @unique
  user_id: ID!
  traveled_from: String!
  traveled_to: String!
  travel_started_at: DateTime!
  travel_ended_at: DateTime!
  stops: [Stop!]!
  comments: [Comment!]!
  budget: Int
  num_of_people: Int
  kids: Boolean
  seniors: Boolean
  walking: Boolean
  driving: Boolean
  fast_pace: Boolean
  rate: Int
  pictures: [Photos!]!
  times_taken: Int!
}

type Photos {
  id: ID! @unique
  trip_id: ID
  user_id: ID
  url: String!
  caption: String
}

type Stop {
  id: ID! @unique
  trip_id: ID!
  destination: String!
  description: String
  cost: Float
  completed: Boolean!
}
```



https://xd.adobe.com/view/b8261d75-dcfe-446c-4a1e-bb20f600d84c-ce17/screen/bba7cc4e-5990-482d-b6e7-334b03950d92/Web-1366-8
