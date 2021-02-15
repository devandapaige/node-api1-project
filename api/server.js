// BUILD YOUR SERVER HERE
const express = require("express");
const db = require("./users/model");

const server = express();
//express middleware
server.use(express.json());

//POST new user
server.post("/api/users", async (req, res) => {
  const name = req.body.name;
  const bio = req.body.bio;
  const newUser = await db.insert({
    name: name,
    bio: bio,
  });
  //name & bio both needed to same user
  if (!name || !bio) {
    res.status(400).json({
      message: "Please provide both name and bio for the user",
    });
  } else if (newUser) {
    //if the newUser is able to be saved: 201 message:
    res.status(201).json(newUser);
    console.log(newUser);
  } else {
    //500 message for an error with saving the new user to the database:
    res.status(500).json({
      message: "There was an error while saving the user to the database",
    });
  }
});

//GET an array of all the users:
server.get("/api/users", async (req, res) => {
  const users = await db.find();
  if (users) {
    res.json(users);
    console.log(users);
  } else {
    res.status(500).json({
      message: "The users information could not be retrieved",
    });
  }
});

//GET users by ID
server.get("/api/users/:id", async (req, res) => {
  const id = req.params.id;
  const user = await db.findById(id);
  if (user) {
    res.json(user);
    console.log(user);
  } else {
    res.status(404).json({
      message: "The user with the specified ID does not exist",
    });
    res
      .status(500)
      .json({ message: "The user information could not be retrieved" });
  }
});

//DELETE user by ID
server.delete("/api/users/:id", async (req, res) => {
  const user = await db.findById(req.params.id);
  if (user) {
    await db.remove(user.id);
    res.status(204).end();
  } else if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  } else {
    res.status(500).json({ message: "The user could not be removed" });
  }
});

//PUT / edit user by ID
server.put("/api/users/:id", async (req, res) => {
  const user = await db.findById(req.params.id);
  const name = req.body.name;
  const bio = req.body.bio;
  //name & bio both needed to same user
  if (!name || !bio) {
    res.status(400).json({
      message: "Please provide both name and bio for the user",
    });
  } else if (user) {
    const updateUser = await db.update(user.id, {
      name: name,
      bio: bio,
    });
    res.json(updateUser);
  } else if (!user) {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist" });
  } else {
    res.status(500).json({
      message: "The user information could not be modified",
    });
  }
});

module.exports = server;
