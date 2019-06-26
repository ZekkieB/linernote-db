const Twitter = require("twitter");
const request = require("async-request");
const twitterModel = require("../models/twitterPost.js");

const client = new Twitter({
	consumer_key: 'TDZoPtolqBHHkwEUSzHiodfnF',
	consumer_secret: 'PVzddUTZxcs465OBf2O0uBz8yjXli5OcLTRHIeM39plMGYRqPu',
	access_token_key: "2387126096-QqhTe3hmpQWFw9R6uXqNVCSP1LE97wZ6IQ4JfR6",
  	access_token_secret: "DT9PbEYmWrmqoDWCXEVsagBbyCqIzbGCZDYqQd7mJTXqS"
});


const getUserName = (url) => {
	return url.replace("https://twitter.com/","");
}

const createOembedUrl = (artist,tweetId) => {
	return `https://publish.twitter.com/oembed?url=https://twitter.com/${artist}/status/${tweetId}&omit_script=true`;
}

const fillDatabase = (array, artitstId) => {
	array = Array.from(array);

	array.forEach(tweet => {
		twitterModel.create({
			html:tweet.html,
			twitter_id: tweet.id,
			url: tweet.url,
			post_date: tweet.postDate,
			twitter_user_name:tweet.username,
			artistId: artitstId
		})
	});
}


const scrapeTwitter = async (artist) => {
	const {twitter,id} = artist;

	const username = getUserName(twitter);

	const twitterData = client.get("/statuses/user_timeline.json",{screen_name:username, count:3}).catch(err => {
		console.error(err);
	})

	const resolvedPromise = await Promise.resolve(twitterData);

	const oembed = resolvedPromise.map(async tweet => {
		const oembedUrl = createOembedUrl(username,tweet.id_str);
		const oembedData = await request(oembedUrl);
		return {
			html: JSON.parse(oembedData.body).html,
			username:username,
			id: tweet.id_str,
			url: `https://twitter.com/${username}/status/${tweet.id_str}`,
			postDate: tweet.created_at
		}
	});

	const resolvedOembed = await Promise.all(oembed);

	fillDatabase(resolvedOembed,id);
}


module.exports = scrapeTwitter;