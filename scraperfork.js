const puppeteer = require("puppeteer");
const request = require("async-request");

require("./connection.js")

const youtubeScraper = require("./scrapers/youtubeScraper.js");
const instagramScraper = require("./scrapers/instagramScraper.js");
const wikiScraper = require("./scrapers/wikiScraper.js");
const scrapeTwitter = require("./scrapers/twitterScraper.js");
const ticketMasterScraper = require("./scrapers/ticketmasterScraper.js");
const scrapeArtists = require("./scrapers/artistScraper.js");

const artists = require("./models/artist.js");

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
		case "scrape twitter":
			dataWorker((artist) => {
				scrapeTwitter(artist);
			});
			break;
		case "scrape ticketmaster":
			dataWorker((artist,index) => {
				setTimeout(() => {
					ticketMasterScraper(artist.name, artist.id)
				},2000*index)
			});
		break;
		case "scrape artists":
			scrapeArtists();
			break;
	}
}


























const dataWorker = async (socialmediaScraperFunction) => {
	const artistData = await artists.findAll();

	artistData.forEach((artist,index) => {
		socialmediaScraperFunction(artist,index);
	});
};