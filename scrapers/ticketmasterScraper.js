const request = require("async-request");

const ticketmasterModel = require("../models/ticketmasterEvent.js");

const ticketmasterEventsHandler = (events) => {
	const saneEventObjects = events.map( event => {

		

		return {
			eventName: event.name,
			url:event.url,
			country:event._embedded.venues[0].country.name,
			city:event._embedded.venues[0].city.name,
			startDate: event.dates.start.dateTime ? event.dates.start.dateTime : "undefined",
			image: find16x9Picture(event.images) ? find16x9Picture(event.images) : "undefined"
		}
	})
	return saneEventObjects;
}



const find16x9Picture = (pictureArray) => {

	for(image of pictureArray) {
		const {ratio,width} = image;
		if(ratio === "16_9" && (width > 350 && width < 1200)) {
			return image.url;
			break;
		}
	}
}

const getAttractionId = async (name) => {
	const ticketMasterData = await request(`https://app.ticketmaster.com/discovery/v2/attractions.json?keyword=${name}&apikey=uUFkAesEVbPUn0m1UQZRn8Ji6LKVkc3A`)
	
	const attractions = JSON.parse(ticketMasterData.body)._embedded ? JSON.parse(ticketMasterData.body)._embedded.attractions : null;

	return attractions[0].id
}

const getEvents = async (attractionId) => {
	const ticketMasterData = await request(`http://app.ticketmaster.com/discovery/v2/events.json?attractionId=${attractionId}&apikey=uUFkAesEVbPUn0m1UQZRn8Ji6LKVkc3A`)
		const data = JSON.parse(ticketMasterData.body);
		let has = true;

		let events = data._embedded ? has : !has;

	  	if(events) {
	  		return ticketmasterEventsHandler(data._embedded.events);
	  	}else {
	  		return null;
	  	}
}


const fillDatabase = (eventArray, artistId) => {
	eventArray.forEach(event => {
		ticketmasterModel.create({
			url: event.url,
		    country: event.country,
		    city:event.city,
		    start_date: event.startDate,
		    image: event.image,
		    event_name: event.eventName,
		    artistId:artistId
		})
	})
}

const ticketMasterScraper = async (name,artistId) => {
	
		
	const attractionId = await Promise.resolve(getAttractionId(name));

	const saneEventObjects = await Promise.resolve(getEvents(attractionId));

	if(saneEventObjects !== null) fillDatabase(saneEventObjects,artistId);
};

module.exports = ticketMasterScraper;