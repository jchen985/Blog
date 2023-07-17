//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");  // Node.js utility library for String functions

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

// ###
const posts = [];  // global array to store all posts
const samplePost = {title: "Sample", story: "Wahoo!"};
posts.push(samplePost);

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



app.get("/", function(req, res){

  let shortPosts = truncatePosts(posts);
  
  res.render("home", {
    startingContent: homeStartingContent,
    allPosts: shortPosts
  });

})

app.get("/about", function(req, res){
  res.render("about", {
    aboutContent: aboutContent
  });
})

app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent: contactContent
  })
})

app.get("/compose", function(req, res){
  res.render("compose");
})

app.post("/compose", function(req, res){
  
  const post = {
    title: req.body.postTitle,
    story: req.body.postStory
  };

  posts.push(post);

  res.redirect("/");

})

// dynamic routing with Express routing parameters
app.get("/posts/:route", (req, res) =>{

  let pageTitle = req.params.route;
  // ###
  console.log("enter: " + pageTitle);
  console.log(posts);

  posts.forEach(post =>{
    console.log("checking: " + post.title + " vs " + pageTitle);  // ###
    // convert routing params and post title into same formatings...
    // .lowerCase() converts hyphens'-' and camel cases into spaces ' '
    // '-', '--', '_', and '__' at head and tail are disgarded
    if (_.lowerCase(post.title) === _.lowerCase(pageTitle)){
      console.log("MATCH");  // ###
      res.render("post", {
        title: post.title,
        story: post.story
      })
      return;
    }
  });

})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

/* truncate all posts' paragraph to 100 char with "..." at the tail
return: a new array of JS objects {title, story} 
*/
function truncatePosts (thePosts){

  let homePosts = thePosts;

  homePosts.forEach(post =>{
    let shortStory = _.truncate(post.story, {length: 100});
    post.story = shortStory;
  });

  return homePosts;

}