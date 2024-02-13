const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const methodOverride = require("method-override");

main()
    .then(() => {
        console.log("Connected to DB");
    }).catch((err) => {
        console.log(err);
    });

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/todo");
}

app.set("views", path.join(__dirname,"views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"public")));

app.get("/", (req,res) => {
    res.send("Working root");
});

//Index Route
app.get("/todo", async (req,res) => {
    const listings = await Listing.find({});
    res.render("index.ejs", {listings});
});

//New Route
app.get("/todo/new", (req,res) => {
    res.render("new.ejs");
});

//Create Route
app.post("/todo", async (req,res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/todo");
});

//Edit Route
app.get("/todo/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
});

//Update Route
app.put("/todo/:id", async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/todo");
});

//Delete Route
app.delete("/todo/:id", async (req,res) => {
    let {id} = req.params;
    let deleteTask = await Listing.findByIdAndDelete(id);
    console.log(deleteTask);
    res.redirect("/todo");
});

app.listen(8080, () => {
    console.log("app is listening");
});