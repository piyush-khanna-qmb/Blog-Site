//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var lowerCase = require('lodash.lowercase');
const mongoose= require('mongoose')

const homeStartingContent = "Heya mate. To... yaadein hain. Bohot saari. College ki to hain hi hain, par school wali bhi bohot saari. Matlab bohoooottt hi saari. Ha beech me maine bhulaane ki koshish kri thi, but. But kya karein yaar. Apna hi to past hai. It defines who i am at the end of the day. So... bohot NA sochna ke baad maine decide kar liya ki mai ye saari yaadein apne robot me chhodhke jaaunga, agar ye ban jaata hai to. Filhaal CS side to mostly complete ho hi gyi hai, chatbot bhi ban gya jo last dikkat thi. Ab soch rha hu daal hi du isme 😄. So here's, presenting to you, and maybe all some day: The Gamchha Life!";

const aboutContent = "About this time. Class me baitha hu. PUEs chaalu hone wale hain 5th sem ke. Bohot pressure hai bhai yaar, padhai, CS ka kuchh nhi padha, CS me DS nhi lagayi. Robot me laga padha hu. Fatt krhi hai. Par aajkal ka mood bohot badiya hai. Mausam bhi. Itneee saare log hai naye gaane dete rehne ke liye, to naya mood chalta rehta hai. HOD ne specially attendance lagwayi hain, 63 se direct 76.4. Din me sone, 2 bje clg pohochke attendance le lena shubham sir se. Baithke openAI ki madad se Vinaayak aur Anushka ko janam-punarjanam diya. Maja chalra hai. Shaam ko roz bajrang dhaabe pe khaana. Raat ko khushi ko tuition padhaana, gaane sunna, CD padhne ki koshish krna, par firse robot programming karke popcorn khaake, raat ko 2 se 3 fb chalaake, so jaana. \n Maje kki life 😎";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb://127.0.0.1:27017/blogDB")

const blogSchema= mongoose.Schema({
  title: String,
  content: String
})

const Blog= mongoose.model("Blog", blogSchema)

let posts= []

app.get("/", function (req, res) {  
  console.log("New home request by: "+ req.hostname)
  Blog.find({}, function (err, results) 
  {
    res.render("home.ejs", {
      title: "Home",
      content: homeStartingContent,
      posts: results
    })
  })
})

app.get("/about",  function (req, res) {  
  console.log("New about request by: "+ req.hostname)
  res.render("about.ejs", {
    title: "About",
    content: aboutContent
  })
})

app.get("/compose", function (req, res) {  
  console.log("New publish request by: "+ req.hostname)
  res.render("compose.ejs", {
    title: "Compose"
  })
})

app.post("/compose", function (req, res) {  

  const blog= new Blog({
    title: req.body.title,
    content: req.body.postBody
  })
  blog.save(function (err) {  
    if(!err) {
      res.redirect("/")
    }
  });
})

app.get("/clear", function (req, res) {  
  posts= []
  Blog.deleteMany({}, function(err){
    if(err) {
      console.log("Some error or shit in deleting records");
    } else {
      console.log("Udha diye")
    }
  })
  res.redirect("/")
})

app.get("/posts/:postName", function (req, res) {  
  var postReq= req.params.postName;  //actually PostName holds PostID
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
  Blog.findOne({_id: postReq}, function (err, results) {  
    if(!err) {
      res.render("post", {
        title: results.title,
        content: results.content
      })
    }
  })
})

app.listen(8000, function() {
  console.log("Server started on port 8000");
});
