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
	const name = decodeURI(req.query.name);
	const sorted = parseBool(req.query.sorted);
	artist.findOne({
		attributes:["id","name"],
		include:[{
			model:instaPosts,
			as: "instagramPosts",
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

		return {
			artist: results.name,
			id: results.id,
			instagramPosts: results.instagramPosts.map(ig => {
				return {
					html: ig.html,
					timestamp: (ig.timestamp)*1000
				}
			}),
			youtubeVideos: results["youtube-videos"].map(yt => {
				return {
					video_id: yt.video_id,
					timestamp: new Date(yt.post_date).getTime()
				}
			}),
			events: results.events.map(tm => {
				return {
					url: tm.url,
					name: tm.event_name,
					country: tm.country,
					city: tm.city,
					image: tm.image,
					timestamp: new Date(tm.start_date).getTime()
				}
			}),
			twitterPosts:results.tweets.map(tweets => {
				return {
					html: tweets.html ,
					timestamp: new Date(tweets.post_date).getTime()
				}
				
			}),
			wikiDescription: results.wikiDescription,

		}

		
	}).then(data => {


		

		if(sorted) {
			data.sorted = returnSortedData(data);
			res.send(data)
		}else {
			res.send(data)
		}

	});
});



const sortedData = (array) => {

	const sortCondition = (a,b) => {
		return a.timestamp - b.timestamp
	};

	return array.sort(sortCondition);
}


const returnSortedData = (data) => {
	let dataArray = [];

		data.twitterPosts.forEach(i => {
			i.mediaType = "twitter";
			dataArray.push(i);
		})

		data.instagramPosts.forEach(i => {
			i.mediaType = "instagram";
			dataArray.push(i)
		})

		data.events.forEach((i => {
			i.mediaType = "event";
			dataArray.push(i)
		}));

		data.youtubeVideos.forEach(i => {
			i.mediaType = "youtube";
			dataArray.push(i)
		})

		return sortedData(dataArray);
}

const parseBool = (value) => {
	let bool = false;
	if(value === "true") {
		return ApplicationCachebool = true
	}else if(value === "false") {
		return bool
	}else {
		return undefined;
	}
}

app.get("/api/v1/user", (req,res) => {

	const id = parseInt(req.query.id);


	user.findOne({
		include:[{
			model: artist,
			as: "following",
			attributes:["id","name"],
			include: [{
			model:instaPosts,
			as: "instagramPosts",
		},{
			model:youtubeVideos,
			as:"youtube-videos"
		},{
			model:tweets,
			as:"tweets"
		},{
			model:ticketmasterEvents,
			as:"events"
		}]
		}],
		where: {
			id:id
		}
	}).then(user => {
		res.send({
			id:user.id,
			email:user.email,
			ordered:returnOrderedUserData(user.following)
		});
	});
})



const returnOrderedUserData = (following) => {
	const unorderedList = [];

	following.forEach( follow => {

		follow.tweets.forEach(tweet => {
			unorderedList.push({
				mediaType: "tweet",
				html: tweet.html,
				timestamp: new Date(tweet.post_date).getTime(),
				artist: follow.name
			});
		});

		follow["youtube-videos"].forEach(yt => {
			unorderedList.push({
				mediaType: "youtube",
				video_id: yt.video_id,
				timestamp: new Date(yt.post_date).getTime(),
				artist: follow.name
			});
		});

		follow.instagramPosts.forEach(ig => {
			unorderedList.push({
				html: ig.html,
				timestamp: ig.timestamp * 1000,
				artist: follow.name
			})
		});

		follow.events.forEach(tm => {
			unorderedList.push({
				url: tm.url,
				name: tm.event_name,
				country: tm.country,
				city: tm.city,
				image: tm.image,
				timestamp: new Date(tm.start_date).getTime(),
				artist: follow.name
			})
		})
	});


	return sortedData(unorderedList);
}




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






