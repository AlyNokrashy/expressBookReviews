const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username, password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    }
    return res.status(409).json({ message: "User already exists!" });
  }

  return res.status(400).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.send(JSON.stringify(books[isbn], null, 4));
});
  
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  const matches = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].author === author) matches[isbn] = books[isbn];
  });
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: "Author not found" });
  }
  res.send(JSON.stringify(matches, null, 4));
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  const matches = {};
  Object.keys(books).forEach((isbn) => {
    if (books[isbn].title === title) matches[isbn] = books[isbn];
  });
  if (Object.keys(matches).length === 0) {
    return res.status(404).json({ message: "Title not found" });
  }
  res.send(JSON.stringify(matches, null, 4));
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (Object.keys(books[isbn].reviews).length === 0) {
    return res.status(200).json({ message: "No reviews found for this book." });
  }
  res.send(JSON.stringify(books[isbn].reviews, null, 4));
});

// Tasks 10-13: Axios implementations
const axios = require("axios");
const BASE_URL = "http://localhost:5000";

// Task 10: all books, async/await
async function getAllBooks() {
  const response = await axios.get(`${BASE_URL}/`);
  console.log(JSON.stringify(response.data, null, 4));
  return response.data;
}

// Task 11: by ISBN, Promise callbacks
function getBookByISBN(isbn) {
  return axios
    .get(`${BASE_URL}/isbn/${isbn}`)
    .then((response) => {
      console.log(JSON.stringify(response.data, null, 4));
      return response.data;
    })
    .catch((error) => {
      console.error(error.message);
    });
}

// Task 12: by author, async/await
async function getBooksByAuthor(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  console.log(JSON.stringify(response.data, null, 4));
  return response.data;
}

// Task 13: by title, async/await
async function getBooksByTitle(title) {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );
  console.log(JSON.stringify(response.data, null, 4));
  return response.data;
}

module.exports.general = public_users;
module.exports.getAllBooks = getAllBooks;
module.exports.getBookByISBN = getBookByISBN;
module.exports.getBooksByAuthor = getBooksByAuthor;
module.exports.getBooksByTitle = getBooksByTitle;
