const request = require("async-request");


const ticketmasterEventsHandler = (events) => {
	const saneEventObjects = events.map( event => {
		return {
			eventName: event.name,
		}
	})

	console.log(saneEventObjects);
}


const ticketMasterScraper = async (name) => {
	
		const ticketMasterData = await request(`http://app.ticketmaster.com/discovery/v2/events.json?keyword=${name}&apikey=uUFkAesEVbPUn0m1UQZRn8Ji6LKVkc3A`)
		const data = JSON.parse(ticketMasterData.body);
		let has = true;

		let events = data._embedded ? has : !has;

	  	if(events) {
	  		ticketmasterEventsHandler(data._embedded.events);
	  	}
	
};

module.exports = ticketMasterScraper;