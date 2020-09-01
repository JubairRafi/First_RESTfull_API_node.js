const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")

const app = express()

app.set("view engine", "ejs")

app.use(bodyParser.urlencoded({extended: true}))

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser: true, useUnifiedTopology: true })

const articleSchema ={
  title: String,
  content: String
}

const Article = mongoose.model("Article", articleSchema)

////request targeting all article/////
app.route("/articles")
    .get((req,res)=>{
      Article.find({},(err,foundArticle)=>{
        if (!err) {
          res.send(foundArticle)
        }
      })
    })
    .post((req,res)=>{

      const newArticle = new Article({
        title : req.body.title,
        content:req.body.content
      })
      newArticle.save(err=>{
        if(!err){
          res.send("successfully added new article")
        }else{
          res.send(err)
        }
      })
    })
    .delete((req,res)=>{
      Article.deleteMany({},(err)=>{
        if(!err){
          res.send("deleting all article")
        }else{
          res.send(err)
        }
      })
    });

/////specific articles

app.route("/articles/:articleTitle")
  .get((req,res)=>{
    Article.findOne({title:req.params.articleTitle},(err,foundArticle)=>{
      if(foundArticle){
        res.send(foundArticle)
      }else{
        res.send("no article found")
      }
    })
  })

  .put((req,res)=>{
    Article.update(
      {title:req.params.articleTitle},
      {title :req.body.title, content : req.body.content},
      {overwrite :true},(err,foundArticle)=>{
        if(!err){
          res.send("updated article")
        }
      }
    )
  });

app.listen(3000,err=>{
  console.log("ss")
})
