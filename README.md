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

