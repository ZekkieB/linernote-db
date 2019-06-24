const puppeteer = require("puppeteer");
const request = require("async-request");

require("./connection.js");

const artists = require("./models/artist.js");
//const instagramPosts = require("./models/instaPost.js");
const wikiModel = require("./models/wikiDescription.js");
const youtubeModel = require("./models/youtubePost.js");
const instagramPosts = require("./models/instaPost.js")


const youtubeScraper = require("./scrapers/youtubeScraper.js");
const instagramScraper = require("./scrapers/instagramScraper.js");
const wikiScraper = require("./scrapers/wikiScraper.js");

const rl = require("readline").createInterface({
	input: process.stdin,
	output:process.stdout
})

rl.prompt(true);

rl.on("line", (cliCommand) => {
	commandLineOptions(cliCommand)
	rl.prompt(true)
});






const commandLineOptions = (command) => {
	switch(command){
		case "scrape youtube":
			dataWorker((artist) => {
				const {youtube} = artist;
				youtubeScraper(artist);
			})
			break;
		case "scrape instagram":
			dataWorker((artist) => {
				const {instagram,id} = artist;
				instagramScraper(instagram,id);
			});
			break;
		case "scrape wiki":
			dataWorker((artist) => {
				wikiScraper(artist);
			});
			break;
	}
}






const ticketMasterScraper = async (name) => {
	setTimeout(async () => {
		const ticketMasterData = await request(`http://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&apikey=uUFkAesEVbPUn0m1UQZRn8Ji6LKVkc3A`)
		const data = JSON.parse(ticketMasterData.body);
	  console.log(data._embedded)
	},5000)
};



















const dataWorker = async (socialmediaScraperFunction) => {
	const artistData = await artists.findAll();

	artistData.forEach((artist) => {
		socialmediaScraperFunction(artist);
	});
};