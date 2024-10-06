// const http = require("http");
const fs = require("fs");
const express = require("express");
const app = express();

app.use(express.json());

// function to Read data
function readDataFromFile(callback) {
  fs.readFile("data.json", "utf-8", (err, data) => {
    if (err) {
      console.error("Error with reading data:", err);
      callback([]);
      return;
    }
    callback(JSON.parse(data));
  });
}

// function to Write data
function writeDataToFile(data, callback) {
  fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error("Error with writing new data:", err);
      return;
    }
    callback();
  });
}

// Get all posts
app.get("/api/posts", (req, res) => {
  readDataFromFile((data) => {
    res.send({ data: data });
  });
});

// create post
app.post("/api/posts", (req, res) => {
  readDataFromFile((data) => {
    const date = new Date();
    const random = Math.ceil(30125 * Math.random());
    const newData = { id: random, date: date, ...req.body };
    // const newData = { id: data.length + 1, date: date, ...req.body };
    data.push(newData);
    writeDataToFile(data, () => {
      res.send({ message: "Data saved successfully." });
    });
  });
  console.log(req.body);
});

// Update post
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  readDataFromFile((data) => {
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      const newPost = {
        ...data[index],
        title: req.body.title || data[index].title,
        description: req.body.description || data[index].description,
        author: req.body.author || data[index].author,
        date: req.body.date || data[index].date,
      };

      data[index] = newPost;

      writeDataToFile(data, () => {
        res.json({
          message: "Post updated successfully",
          newPost: newPost,
        });
      });
    } else {
      res.status(404).json({ message: "Post is not found" });
    }
  });
});

// Delete post
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);

  readDataFromFile((data) => {
    const index = data.findIndex((item) => item.id === id);

    if (index !== -1) {
      const filteredData = data.filter((item) => item.id !== id);

      writeDataToFile(filteredData, () => {
        res.json({ message: "Post deleted successfully" });
      });
    } else {
      res.status(404).json({ message: "Post not found" });
    }
  });
});

//========================================================================
let port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
