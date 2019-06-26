const request = require("request");

const artist = require("../models/artist.js");

const scrapeArtists = () => {
	const options = {
		url: "https://api.druid.datalegend.net/datasets/albertmeronyo/linernote/services/linernote/sparql?format=json&query=%20PREFIX+ln%3A+%3Chttp%3A%2F%2Fwww.linernote.com%2Fvocab%2F%3E%0APREFIX+example%3A+%3Chttp%3A%2F%2Fwww.example.org%2Frdf%23%3E%0A%0A%23SELECT+COUNT(%3Fln_artist)+WHERE+%7B%0A+%23%3Fln_artist+ln%3Awikipedia_uri+%3Fwikipedia_uri+.%0A+%23%3Fln_artist+ln%3Amusicbrainz_uri+%3Fmusicbrainz_uri+.%0A+%23%3Fln_artist+ln%3Aband_name+%3Fname+.%0A+%23%3Fln_artist+ln%3Aspotify_uri+%3Fspotify+.%0A+%23FILTER+(%3Fname+%3D+'Rihanna')%0A%23%7D+%0A%0ASELECT+*+WHERE+%7B%0A+%3Fln_artist+ln%3Aband_name+%3Fname+.%0A+%3Fln_artist+ln%3Awebsite_uri+%3Fwebsite+.%0A+%3Fln_artist+ln%3Aspotify_uri+%3Fspotify+.%0A+%3Fln_artist+ln%3Ayoutube_uri+%3Fyoutube+.%0A+%3Fln_artist+ln%3Asoundcloud_uri+%3Fsoundcloud+.%0A+%3Fln_artist+ln%3Afacebook_uri+%3Ffacebook+.%0A+%3Fln_artist+ln%3Ainstagram_uri+%3Finstagram+.%0A+%3Fln_artist+ln%3Aticketmaster_uri+%3Fticketmaster+.%0A+%3Fln_artist+ln%3Awikipedia_uri+%3Fwikipedia+.%0A+%3Fln_artist+ln%3Amusicbrainz_uri+%3Fmusicbrainz+.%0A+%3Fln_artist+ln%3Apitchfork_uri+%3Fpitchfork+.%0A+%3Fln_artist+ln%3Agenius_uri+%3Fgenius+.%0A+%3Fln_artist+ln%3Abandsintown_uri+%3Fbandsintown+.%0A+%3Fln_artist+ln%3Atwitter_uri+%3Ftwitter%0A%7D+%0AORDER+BY+%3Fname%0ALIMIT+100",
		headers:{
			"Accept" : "application/sparql-results+json"
		} 
	}

	request(options, (e,r,b) => {
		const json = JSON.parse(b);

		const data = json.results.bindings;

		const sanitationWorker = (object) => {
			const keys = Object.keys(object);
			let obj = {};

			for(let i = 0; i < keys.length; i++) {
				if(keys[i] !== "ln_artist") {
					obj[keys[i]] = object[keys[i]].value;
				};
			};

			return obj;
		} 

		const sane = data.map(sanitationWorker);

		sane.forEach((i) => {
			artist.create({
				name: i.name,
			    website: i.website,
			    spotify: i.spotify,
			    youtube: i.youtube,
			    soundcloud: i.soundcloud,
			    facebook: i.facebook,
			    instagram: i.instagram,
			    ticketmaster: i.ticketmaster,
			    wikipedia: i.wikipedia,
			    musicbrainz: i.musicbrainz,
			    pitchfork: i.pitchfork,
			    genius: i.genius,
			    bandsintown: i.bandsintown,
				twitter: i.twitter
			})
		})
	})
}
	

module.exports = scrapeArtists;