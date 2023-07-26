const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WIKIDB", { useNewUrlParser: true });

const articleSchema = {
    title: String,
    content: String,
};

const Article = mongoose.model("Article", articleSchema);

app.route("/articles")
    .get(async function (req, res) {
        try {
            const articles = await Article.find({});
            res.send(articles);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    })
    .post(async function (req, res) {
        try {
            const newArticle = new Article({
                title: req.body.title,
                content: req.body.content
            });

            const savedArticle = await newArticle.save();
            console.log("New article saved:", savedArticle);
            res.status(201).send(savedArticle);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    })
    .delete(async function (req, res) {
        try {
            const deletionCriteria = { isDeleted: true };
            const deletedArticles = await Article.deleteMany(deletionCriteria);
            console.log("Number of deleted articles:", deletedArticles.deletedCount);
            res.send("Successfully deleted all articles!");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
////////////////////////////////////////////////////REQUEST TARGETTING A SPECIFIC ARTICLE/////////////////////////////////////////////////////////////////
app.route("/articles/:articleTitle")

    .get(async function (req, res) {
        try {
            const articleTitle = req.params.articleTitle;
            const article = await Article.findOne({ title: articleTitle });
            if (!article) {
                return res.status(404).send("Article not found");
            } console.log("Found article:", article);
            res.send(article);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
app.route("/articles/:articleTitle")
    .put(async function (req, res) {
        try {
            const articleTitle = req.params.articleTitle;
            const updatedData = {
                title: req.body.title,
                content: req.body.content
            };
            const updatedArticle = await Article.findOneAndUpdate(
                { title: articleTitle },
                updatedData,
                { new: true }
            );
            if (!updatedArticle) {
                return res.status(404).send("Article not found");
            }
            console.log("Updated article:", updatedArticle);
            res.send(updatedArticle);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });
app.route("/articles/:articleTitle")
    .patch(async function (req, res) {
        try {
            const articleTitle = req.params.articleTitle;

            const updatedFields = {

                title: req.body.title,
                content: req.body.content
            };

            const updatedArticle = await Article.findOneAndUpdate(
                { title: articleTitle },
                { $set: updatedFields },
                { new: true }
            );

            if (!updatedArticle) {
                return res.status(404).send("Article not found");
            }
            console.log("Updated article:", updatedArticle);

            res.send(updatedArticle);
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });

app.route("/articles/:articleTitle")
    .delete(async function (req, res) {
        try {
            const articleTitle = req.params.articleTitle;
            const deletedArticle = await Article.findOneAndDelete({ title: articleTitle });
            if (!deletedArticle) {
                return res.status(404).send("Article not found");
            }
            console.log("Deleted article:", deletedArticle);
            res.send("Article deleted successfully");
        } catch (err) {
            console.error(err);
            res.status(500).send("Internal Server Error");
        }
    });






app.listen(3000, function () {
    console.log("Server started at port 3000");
});