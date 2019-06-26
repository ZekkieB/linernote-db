#!/usr/bin/env node
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const fs = require("fs");
const cors = require("cors");
const bodyParser = require("body-parser")

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors());
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
const ticketmasterEvents = require("./models/ticketmasterEvent.js");

artist.hasMany(instaPosts, {as:"instagramPosts"});
artist.hasMany(youtubeVideos, {as:"youtube-videos"});
artist.hasMany(tweets, {as:"tweets"});
artist.hasMany(ticketmasterEvents, {as:"events"})
artist.hasOne(wikiModel);
instaPosts.belongsTo(artist);
youtubeVideos.belongsTo(artist);
tweets.belongsTo(artist);
ticketmasterEvents.belongsTo(artist);

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
		attributes:["id","name"],
		limit:15
	}).then(results => {
		res.cookie("test","foobar")
		res.send(results);
	});
});

app.get("/api/v1/artist", (req,res) => {
	const id = req.query.id ? parseInt(req.query.id) : null;
	const name = req.query.name;
	console.log(id)
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
		},{
			model:ticketmasterEvents,
			as:"events"
		}],where:{
			$or:[{
				id:id,
			},{
				name:{
				$like:`%${name}%`
			}
			}
		]
		}
	}).then(results => {
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
	let {artistId,userId} = req.query;
	artistId = parseInt(artistId);
	userId = parseInt(userId)
	userFollowing.create({
		artistId:artistId,
		userId:userId,
	});

	res.send("{status:OK}");
})

app.delete("/api/v1/user/unfollow", (req,res) => {
	const userId = parseInt(req.body.userId);
	const artistId = parseInt(req.body.artistId);

	userFollowing.destroy({
		where:{
			userId:userId,
			artistId:artistId
		}
	}).then(() => {
		res.send("lolol")
	});
})


// sc






