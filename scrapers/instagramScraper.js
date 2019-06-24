const request = require("async-request");
const instagramPosts = require("../models/instaPost.js");
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

const instagramScraper = async (instagramUrl,id) => {
	try{
		const instagramResponseData = await request(instagramUrl+"?__a=1");
		if(instagramResponseData.statusCode < 400) {
			const instagramPost = JSON.parse(instagramResponseData.body).graphql.user.edge_owner_to_timeline_media.edges;
			const saneInstagramData = await instagramPost.map(edgeSanitationWorker);
			const resolvedPromises = await Promise.all(saneInstagramData);
			resolvedPromises.forEach(resolve => {
					instagramPosts.create({
						artistId: id,
						shortCode: resolve.shortcode,
						html: resolve.html,
						timestamp: resolve.timestamp,
						likes: resolve.likes
					})
				})
		}
	}catch(error) {
		console.error(error)
	}
}

module.exports = instagramScraper;