// Dome user data (later coming form db)
const users = [
  {
    id: "1",
    name: "Krystyna",
    email: "krysiczka22@wp.pl",
    age: 27
  },
  {
    id: "2",
    name: "Sara",
    email: "emila@asdas.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com"
  }
];

const posts = [
  {
    id: "12",
    title: "Summer",
    body: "What a beautiful weather",
    published: true,
    author: "1"
  },
  {
    id: "13",
    title: "Winter",
    body: "Cant wait for more sun",
    published: false,
    author: "1"
  },
  {
    id: "14",
    title: "Spring",
    body: "Flowers started flourish",
    published: true,
    author: "3"
  }
];

const comments = [
  {
    id: "21",
    text: "It was nice trip",
    author: "3",
    post: "12"
  },
  {
    id: "22",
    text: "That was perfect tour",
    author: "2",
    post: "13"
  },
  {
    id: "23",
    text: "Our guide was the best",
    author: "2",
    post: "14"
  },
  {
    id: "24",
    text: "See you next time guys! It was fabulous...",
    author: "1",
    post: "12"
  }
];

const db = {
  users,
  posts,
  comments
};

export { db as default };
