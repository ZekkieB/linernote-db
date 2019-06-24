const request = require("async-request");

const wikiModel = require("../models/wikiDescription.js");

const fillDatabase = (description,id) => {
	console.log(description);
	wikiModel.create({
		artistId: id,
		wiki_description: description
	})
}

const wikiScraper = async (artist) => {
	const {wikipedia,id} = artist;
	const wikiSlug = wikipedia.replace("https://en.wikipedia.org/wiki/","");
	const wikiData = await request(`https://en.wikipedia.org/api/rest_v1/page/summary/${wikiSlug}`);
	const wikiDescription = JSON.parse(wikiData.body).extract;

	fillDatabase(wikiDescription,id)
}

module.exports = wikiScraper;