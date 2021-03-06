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
// require mongoose
const mongoose = require("mongoose");

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

// Use MongoDB and mongoose
// open a connection to locally running instance of our mongoDB via an url
// see the mongoose quickstart guide: https://mongoosejs.com/docs/index.html
mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

// Define a new mongoose schema for the blog posts
// a schema maps to a MongoDB collection and defines the shape of the documents in that collection
const postSchema = {
  title: String,
  content: String
};

// Compile the schema into a model / create a model
// In order to use the postSchema, we need to convert it into a model we can work with like so:
const Post = mongoose.model("Post", postSchema);
// the model takes two arguments: 1) singular version of the collection name, 2) schema used to create the collection
// See mongoose docs on models: https://mongoosejs.com/docs/models.html



// *** HOME route / root route ***
app.get("/", function(req, res){

  // looks inside the "views" folder for a file called "home"[.ejs]
  // the views folder has to be at the root of our project folder and at the same hierarchical level as app.js, i.e. the server file
  // we are also passing in a JavaScript object, a key-value pair, inside a pair of curly braces
  // this allows for the homeStartingContent to be rendered in the paragraph in home.ejs

  // Using the mongoose find() method we can log all the posts inside our posts collection
  //    by tapping into the Post model, which represents our items collection
  // using a set of empty curly braces we specify that we want to find all the posts in
  //    our collection (i.e. there are no conditions)
  Post.find({}, function(err, posts){
    res.render("home", {
      contentHome: homeStartingContent,
      posts: posts
    });
  });
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
  // this new post document is modelled after the mongoose Post model
  const post = new Post ({
    title: req.body.newPostTitle,
    content: req.body.newPostContent
  });

  // save document to database instead of pushing it to the posts array like previously
  // we save each new document (i.e. blog post) in our posts collection
  post.save(function (err){
    if(!err) {
      res.redirect("/");
    }
  });


  // *** PREVIOUS CODE *** (from before using mongoose)
  // const post = {
  //   newPostTitle: req.body.newPostTitle,
  //   newPostContent: req.body.newPostContent,
  //   newPostRoute: _.kebabCase(req.body.newPostTitle)
  // }

  // add the new post title and content to the posts array
  // posts.push(post);

  // *** END OF PREVIOUS CODE ***

});


// learning how to use routing in express / creating a dynamic website

// specify the route parameters in the path of the route like so:
  // app.get('/users/:userId/books/:bookId', function (req, res) {
  //   res.send(req.params)
  // })
// https://expressjs.com/en/guide/routing.html > Route Parameters
app.get("/posts/:postId", function(req, res) {

  const requestedPostId = req.params.postId;

  Post.findOne({_id:requestedPostId}, function(err, post){

    // once a matching post is found, you can render its title and content in the post.ejs page

      res.render("post", {
        title: post.title,
        content: post.content
      });

  });


  // *** OLD CODE ***
  // const requestedTitle = _.kebabCase(req.params.postId);
  //
  // posts.forEach(function(post) {
  //
  //   // use lodash to make the actual title of the post kebab-cased for the comparison
  //   // kebab case: the-quick-brown-fox-jumps-over-the-lazy-dog"
  //   const actualTitle = _.kebabCase(post.newPostTitle);
  //
  //   // for every title the user might check the code checks whether there's a blog post entry with the same name
  //   if (actualTitle === requestedTitle) {
  //     console.log("Match found!");
  //     res.render("post", {
  //       // if the if statement is true for any post pass this post's newPostTitle
  //       title: post.newPostTitle,
  //       content: post.newPostContent
  //     });
  //   } else {
  //     console.log("Match not found.");
  //   }
  // });
  // *** END OF OLD CODE ***

}); // closing brackets app.get request for posts route

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
