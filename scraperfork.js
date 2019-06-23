const puppeteer = require("puppeteer");
const request = require("async-request");

require("./connection.js");

const artists = require("./models/artist.js");
//const instagramPosts = require("./models/instaPost.js");
const wikiModel = require("./models/wikiDescription.js");
const youtubeModel = require("./models/youtubePost.js");
const instagramPosts = require("./models/instaPost.js")

const youtubeScraper = require("./scrapers/youtubeScraper.js");


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
			console.log("scraping youtube");
			break;
		case "scrape instagram":
			dataWorker();
			break;
	}
}


const edgeSanitationWorker = async (entry) => {
	const {node} = entry;
	const {edge_liked_by,shortcode,taken_at_timestamp} = node;
	const data = await request(`https://api.instagram.com/oembed/?url=http://instagr.am/p/${shortcode}&omitscript=true`);
	return {
		likes:edge_liked_by.count,
		timestamp:taken_at_timestamp,
		shortcode: shortcode,
		html:JSON.parse(data.body).html
	}
}


const wikiScraper = async (wikiUrl) => {

	const wikiSlug = wikiUrl.replace("https://en.wikipedia.org/wiki/","");


	const wikiData = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`);

	return JSON.parse(wikiData.body).extract;
}

const ticketMasterScraper = async (name) => {
	setTimeout(async () => {
		const ticketMasterData = await request(`http://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&apikey=uUFkAesEVbPUn0m1UQZRn8Ji6LKVkc3A`)
		const data = JSON.parse(ticketMasterData.body);
	  
	  console.log(data._embedded)
	},5000)
};





const getYoutubeIdentifier = (youtubeUrl) => {
	return youtubeUrl.split("/")[4];
}


const instagramScraper = async (instagramUrl,id) => {

	try{
		const instagramResponseData = await request(instagramUrl+"?__a=1");

		if(instagramResponseData.statusCode < 400) {
			const instagramPost = JSON.parse(instagramResponseData.body).graphql.user.edge_owner_to_timeline_media.edges;

		

			const saneInstagramData = await instagramPost.map(edgeSanitationWorker);

			const resolvedPromises = await Promise.all(saneInstagramData);


			resolvedPromises.forEach(resolve => {
					// instagramPosts.create({
					// 	artistId: id,
					// 	shortCode: resolve.shortcode,
					// 	html: resolve.html,
					// 	timestamp: resolve.timestamp,
					// 	likes: resolve.likes
					// })

					console.log(resolve.shortcode)
				})
		}

		
	}catch(error) {
		console.error(error)
	}
	
		
}


// (async () => {

// 	const data = await artists.findAll({
// 		raw:true
// 	});

	


	


// 	for(let i = 0; i < data.length; i++) {


// 		//instagramScraper(data[i].instagram,data[i].id);

// 		//console.log(data[i].id);
// 		// const browser = await puppeteer.launch();
// 		// const page = await browser.newPage();
// 		// await page.goto(data[i].instagram);

// 		// const scrapeData = await page.evaluate(() => {
			
// 		// 	try{
// 		// 		return _sharedData.entry_data.ProfilePage[0].graphql.user.edge_owner_to_timeline_media.edges
// 		// 	}catch(error) {
// 		// 		console.error(error);
// 		// 	};
			
		

// 		// })
// 		// await browser.close();

// 		// console.log(scrapeData);
// 		// if(scrapeData) {
// 		// 	const scrapy = scrapeData.map(edgeSanitationWorker);
// 		// 	const res = await Promise.all(scrapy);
			
// 		// 	let id = data[i].id;



// 		// 	res.map(i => {
// 		// 		instagramPosts.create({
// 		// 			artistId: id,
// 		// 			shortCode: i.shortcode,
// 		// 			html: i.html,
// 		// 			timestamp: i.timestamp,
// 		// 			likes: i.likes
// 		// 		})
// 		// 	})
// 		// }
		
// 		// const wikiText = await Promise.resolve(wikiScraper(data[i].wikipedia));
		
// 		// wikiModel.create({
// 		// 	artistId: data[i].id,
// 		// 	wiki_description: wikiText
// 		// });

// 		// setTimeout(function(){ticketMasterScraper(data[i].name)},1000*data[i].id)



// 		// let youtubePromises = null;


// 		// if(data[i].youtube.indexOf("channel") >= 0) {
// 		// 	const identifier = getYoutubeIdentifier(data[i].youtube);
// 		// 	youtubePromises = youtubeScraper(identifier,false);
// 		// }else if(data[i].youtube.indexOf("user") >= 0){
// 		// 	const identifier = getYoutubeIdentifier(data[i].youtube);
// 		// 	youtubePromises = youtubeScraper(false,identifier)
// 		// }

// 		// const resolvedPromises = await Promise.resolve(youtubePromises);


// 		// resolvedPromises.forEach(video => {
// 		// 	console.log(video)
// 		// 	youtubeModel.create({
// 		// 		artistId: data[i].id,
// 		// 		video_id: video.videoId,
// 		// 		post_date: video.publishDate
// 		// 	});
// 		// });
// 	}
	


	







// })();

const dataWorker = async (socialmediaScraperFunction) => {
	const artistData = await artists.findAll();

	artistData.forEach((artist, index) => {
		const id = index+1;
		instagramScraper(artist.instagram,id)


	});
};