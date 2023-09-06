//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lowerCase = require('lodash.lowercase');
const mongoose = require('mongoose')

const homeStartingContent = "Hey! Welcome to your daily blog diary. Compose blogs as you please...";

const aboutContent = "The days of the web development era. The robot's on halt for time being as its torso is under maintenence. It's August of 2022 and here we are, rejoicing the end of 2nd year university exams. \nThought of making this project to lose out myself over some stuff, to keep it as a diary for nostalgic trips and such. Wish you the best!";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")

const blogSchema = mongoose.Schema({
  title: String,
  content: String
})

const Blog = mongoose.model("Blog", blogSchema)

let posts = []

app.get("/", function (req, res) {
  console.log("New home request by: " + req.hostname)
  Blog.find({}, function (err, results) {
    res.render("home.ejs", {
      title: "Home",
      content: homeStartingContent,
      posts: results
    })
  })
})

app.get("/about", function (req, res) {
  console.log("New about request by: " + req.hostname)
  res.render("about.ejs", {
    title: "About",
    content: aboutContent
  })
})

app.get("/compose", function (req, res) {
  console.log("New publish request by: " + req.hostname)
  res.render("compose.ejs", {
    title: "Compose"
  })
})

app.post("/compose", function (req, res) {

  const blog = new Blog({
    title: req.body.title,
    content: req.body.postBody
  })
  blog.save(function (err) {
    if (!err) {
      res.redirect("/")
    }
  });
})

app.get("/clear", function (req, res) {
  posts = []
  Blog.deleteMany({}, function (err) {
    if (err) {
      console.log("Some error or shit in deleting records");
    } else {
      console.log("Udha diye")
    }
  })
  res.redirect("/")
})

app.get("/posts/:postName", function (req, res) {
  var postReq = req.params.postName;  //actually PostName holds PostID
  // console.log(postReq)
  // posts.forEach(post => {
  //   if(lowerCase(post.title) == postReq) {
  //     console.log("Match found")
  //     res.render("post", {
  //     title: post.title,
  //     content: post.body
  //   })
  //   }
  // })
  Blog.findOne({ _id: postReq }, function (err, results) {
    if (!err) {
      res.render("post", {
        title: results.title,
        content: results.content
      })
    }
  })
})

app.listen(8000, function () {
  console.log("Server started on port 8000");
});
