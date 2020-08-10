const express = require("express");
const db = require("./database.js");
const server = express();

server.use(express.json());

server.get("/", (req, res) => {
  res.json({ message: "Hello, World" });
});

server.get("/api/users", (req, res) => {
  const users = db.getUsers();
  if (users) {
    res.json(users);
  } else {
    res
      .status(500)
      .json({ message: "The users information could not be retrieved." });
  }
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;

  const user = db.getUserById(id);

  if (user) {
    res.json(user);
  } else {
    res
      .status(404)
      .json({ message: "The user with the specified ID does not exist." });
  }
});

server.post("/api/users", (req, res) => {
  const newUser = db.createUser({
    name: req.body.name,
    bio: req.body.bio
  });

  if (!req.body.name || !req.body.bio) {
    return res.status(400).json({
      message: "Please provide name and bio for the user."
    });
  } else if (res) {
    res.status(201).json(newUser);
  } else {
    res.status(500).json({
      message: "There was an error while saving the user to the database"
    });
  }
});

server.delete("/api/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);

  if (user) {
    db.deleteUser(req.params.getUserById);
    res.status(204).json({
      message: "Delete successful."
    });
  } else if (res) {
    res.status(404).json({
      message: "The user with the specified ID does not exist."
    });
  } else {
    res.status(500).json({
      message: "The user could not be removed"
    });
  }

  db.deleteUser(req.params.id);
});

server.listen(8080, () => {
  console.log("Server started on port 8080");
});

server.put("/api/users/:id", (req, res) => {
  const user = db.getUserById(req.params.id);
  if (user) {
    const editUser = db.updateUser(req.params.id, {
      name: req.body.name,
      bio: req.body.bio
    });
    if (editUser.name && editUser.bio) {
      res.status(200).json({
        message: `User ID ${req.params.id} updated to name: ${editUser.name}, bio: ${editUser.bio} `
      });
    } else if (
      (!editUser.name && editUser.bio) ||
      (editUser.name && !editUser.bio)
    ) {
      res.status(404).json({
        errorMessage: "Please provide name and bio for the user."
      });
    } else {
      res.status(500).json({
        errorMessage: "The user information could not be modified."
      });
    }
  } else if (!user) {
    res.status(404).json({
      message: "The user with the specified ID does not exist."
    });
  } else {
    res.status(500).json({
      errorMessage: "The user information could not be modified."
    });
  }
});
