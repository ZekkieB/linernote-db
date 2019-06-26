#!/usr/bin/env node
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fs = require("fs");


app.use(cookieParser());
const {fork} = require("child_process");


const scraper = fork("./scraperfork.js");

require("./connection.js");
const artist = require("./models/artist.js");
const instaPosts = require("./models/instaPost.js");
const userFollowing = require("./models/userFollowing.js");
const user = require("./models/user.js");
const wikiModel = require("./models/wikiDescription.js");
const youtubeVideos = require("./models/youtubePost.js");
const tweets = require("./models/twitterPost.js");

artist.hasMany(instaPosts, {as:"instagramPosts"});
artist.hasMany(youtubeVideos, {as:"youtube-videos"});
artist.hasMany(tweets, {as:"tweets"});
artist.hasOne(wikiModel);
instaPosts.belongsTo(artist);
youtubeVideos.belongsTo(artist);
tweets.belongsTo(artist);

user.belongsToMany(artist,{through:userFollowing, as:"following"});
artist.belongsToMany(user,{through:userFollowing, as:"followers"});


app.listen(3000)
app.get("/", (req, response, next) => {
	response.cookie("auth","yoooooo")
	artist.findAll({
	include:[{model:instaPosts,attributes:["id","html"], as:"instagramPosts"}]
	}).then(res => {
		response.send(res);
	})
})





app.get("/api/v1/artists", (req,res) => {
	console.log(req.cookies.test)
	artist.findAll({
		attributes:["id","name"]
	}).then(results => {
		res.cookie("test","foobar")
		res.send(results);
	});
});

app.get("/api/v1/artist", (req,res) => {
	const id = parseInt(req.query.id);
	const name = req.query.name;
	artist.findOne({
		attributes:["id","name"],
		include:[{
			model:instaPosts,
			as: "instagramPosts",
			attributes:["id","html","shortcode"],
		},{
			model:wikiModel
		},{
			model:youtubeVideos,
			as:"youtube-videos"
		},{
			model:tweets,
			as:"tweets"
		}],
		where:{
			name:{$like:`%${name}%`}
		}
	}).then(results => {
		console.log(results)
		res.send(results);
	});
});



app.get("/api/v1/user", (req,res) => {

	const id = parseInt(req.query.id);
	console.log("=========================",req.cookies)

	user.findOne({
		include:[{
			model: artist,
			as: "following",
			attributes:["id","name"]
		}],
		where: {
			id:id
		}
	}).then(user => {
		res.send(user)
	});
})





app.post("/api/v1/user/follow", (req,res) => {

})

app.delete("/api/v1/user/unfollow", (req,res) => {

})


// sc






