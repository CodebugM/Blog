//jshint esversion:6

// This is the main server file

// Import the modules we are going to be using
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
//jQuery
const jQuery = require("jquery");
// lodash: Load the full build
// utility app for JavaScript that makes it easier to work within node apps
const _ = require('lodash');

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// creates our app using express
const app = express();

// Tells the app that is generated using express to use ejs as its view engine
app.set('view engine', 'ejs');

// body parser has to be set up before we can access req.body.X anywhere below
app.use(bodyParser.urlencoded({extended: true}));

// our static files are inside the public folder
app.use(express.static("public"));

// global array called 'posts' that stores all new individual posts
let posts = [];


// *** HOME route / root route ***
app.get("/", function(req, res){

  // looks inside the "views" folder for a file called "home"[.ejs]
  // the views folder has to be at the root of our project folder and at the same hierarchical level as app.js, i.e. the server file
  // we are also passing in a JavaScript object, a key-value pair, inside a pair of curly braces
  // this allows for the homeStartingContent to be rendered in the paragraph in home.ejs

  res.render("home", {
    contentHome: homeStartingContent,
    newPosts: posts
  });
  // console.log(posts);
});

// targets the about route
app.get("/about", function(req, res){
  res.render("about", {contentAbout: aboutContent});
});

// targets the contact route
app.get("/contact", function(req, res){
  res.render("contact", {contentContact: contactContent});
});

// targets the compose route - not part of the menu
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  // the content of what is submitted with the name newPost is assigned to the variable newPostContent

  // JavaScript object containing both the title and the content of a new post
  const post = {
    newPostTitle: req.body.newPostTitle,
    newPostContent: req.body.newPostContent,
    newPostRoute: _.kebabCase(req.body.newPostTitle)
  }

  // add the new post title and content to the posts array
  posts.push(post);

  res.redirect("/");
});


// learning how to use routing in express / creating a dynamic website

// specify the route parameters in the path of the route like so:
  // app.get('/users/:userId/books/:bookId', function (req, res) {
  //   res.send(req.params)
  // })
// https://expressjs.com/en/guide/routing.html > Route Parameters
app.get("/posts/:postId", function(req, res) {

  const requestedTitle = _.kebabCase(req.params.postId);
  //const requestedTitle = req.params.postId;

  posts.forEach(function(post) {

    // use lodash to make the actual title of the post kebab-cased for the comparison
    // kebab case: the-quick-brown-fox-jumps-over-the-lazy-dog"
    const actualTitle = _.kebabCase(post.newPostTitle);

    // for every title the user might check the code checks whether there's a blog post entry with the same name
    if (actualTitle === requestedTitle) {
      console.log("Match found!");
      res.render("post", {
        // if the if statement is true for any post pass this post's newPostTitle
        title: post.newPostTitle,
        content: post.newPostContent
      });
    } else {
      console.log("Match not found.");
    }
  });
}); // closing brackets app.get request for posts route

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
