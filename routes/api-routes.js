var db = require("../models");

var axios = require("axios");
var cheerio = require("cheerio");
module.exports = function (app) {
    app.get("/", function (req, res) {
        db.Article.find({ isSaved: false }).sort({createdDate:-1})
            .then(function (dbArticles) {
                var obj = {
                    dbArticle: dbArticles
                }
                res.render("index", obj);
            })
            .catch(function (err) {
                res.json(err);
            });

    });

    app.get("/home", function (req, res) {
        db.Article.find({ isSaved: false })
            .then(function (dbArticles) {
                var obj = {
                    dbArticle: dbArticles
                }
                res.render("index", obj);
            })
            .catch(function (err) {
                res.json(err);
            });

    });



    app.get("/savedArticles", function (req, res) {
        res.render("saved");
    });

    // A GET route for scraping the livescience website
    app.get("/scrapeArticles", function (req, res) {
        
        var criteria=[
        "news",
        "technology",
        "health",
        "environment",
        "strange-news",
        "animals",
        "history",
        "culture",
       " space"
        ];
        var randomCriteria = criteria[Math.floor(Math.random()*criteria.length)];
        axios.get("https://www.livescience.com/"+randomCriteria+"?type=article").then(function (response) {
            var $ = cheerio.load(response.data);
            
            $(".mod-copy").each(function (i, element) {
               
                var result = {};
                var parentDiv = $(this).parent();
                result.link = "https://www.livescience.com" + parentDiv
                    .children("h2").children("a")
                    .attr("href");
                result.headline = parentDiv
                    .children("h2").children("a")
                    .text().trim();
                   
                 var tempString= parentDiv
                    .children("p")
                    .text().trim();
                    result.summary=tempString.replace('  Read More','');

                db.Article.create(result)
                    .then(function (dbArticle) {
                        console.log(dbArticle);
                       
                    })
                    .catch(function (err) {
                       
                        console.log(err);
                       
                    });
            });
            
            return true;

        }).then(function(response){
            return res.redirect("/");
        });
    });

    app.get("/articleSaved/:id", function (req, res) {
        db.Article.findOneAndUpdate({ _id: req.params.id }, { isSaved: true }, { new: true })
            .then(function (dbArticle) {
                
                console.log("updated");
                res.json(dbArticle);

            })
            .catch(function (err) {
              
                res.json(err);
            });

    });

    app.get("/removeSaved/:id", function (req, res) {
        db.Article.findOneAndRemove({ _id: req.params.id })
            .then(function (dbresponse) {
               
                dbresponse.notes.forEach(element => {
                    db.Note.remove({ _id: element }, function (err, numeffected) {
                        if (err) {
                            console.log(err);

                        }
                    });

                });

                res.json(dbresponse);

            })
            .catch(function (err) {
               
                res.json(err);
            });

    });
    app.get("/mySavedArticles", function (req, res) {
        console.log("inside");
        db.Article.find({ isSaved: true })
            .then(function (dbresults) {
               
                console.log(dbresults);
                console.log("inside");
                var articleObject = {
                    savedArticleList: dbresults
                }
                res.render("saved", articleObject);
            })
            .catch(function (err) {
                
                res.json(err);
            });

    });

    
    app.post("/saveNote/:id", function (req, res) {
       
        db.Note.create(req.body)
            .then(function (dbNote) {
               
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { notes: dbNote._id } }, { new: true });
            })
            .then(function (dbArticle) {

                console.log(dbArticle);
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            });
    });

    app.get("/getNotes/:id", function (req, res) {
       
        db.Article.findOne({ _id: req.params.id })
           
            .populate("notes")
            .then(function (dbArticle) {
               
                res.json(dbArticle);
            })
            .catch(function (err) {
               
                res.json(err);
            });
    });

    app.get("/deleteNote/:id", function (req, res) {
        db.Article.update({},
            { $pull: { notes: req.params.id } },
            function (err, numeffected) {
                if (err)
                    return res.json(err);
                db.Note.remove({ _id: req.params.id })
                    .then(function (affectedRows) {
                        console.log("affectedRows" + affectedRows);
                        res.json(affectedRows);

                    })
                    .catch(function (err) {
                    
                        res.json(err);
                    });

            });
    });


};