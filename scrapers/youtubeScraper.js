const request = require("async-request");
const youtubeModel = require("../models/youtubePost.js");

const getYoutubeIdentifier = (youtubeUrl) => {
	return youtubeUrl.split("/")[4];
}

const returnLimitedVideos = (videos) => {
	const limitedVideos = [];
	videos.forEach(video => {
		if(limitedVideos.length < 3) {
			limitedVideos.push(video);
		};
	});
	return limitedVideos;
}

const returnSaneVideoData = (videoArray) => {
	return videoArray.map(video => {
		return {
			videoId: video.contentDetails.videoId,
			publishDate: video.contentDetails.videoPublishedAt
		}
	})
}

const buildParameter = (youtubeUrl) => {
	let apiParameter = "";
	const identifier = getYoutubeIdentifier(youtubeUrl);
	if(youtubeUrl.indexOf("user") > -1) {
		apiParameter = `forUsername=${identifier}`;
	}else if(youtubeUrl.indexOf("channel") > -1) {
		apiParameter = `id=${identifier}`;
	}

	return apiParameter;
}

const fillDatabase = (array,id) => {
	array.forEach(youtubePost => {
		console.log(id)
		youtubeModel.create({
			artistId:id,
			video_id: youtubePost.videoId,
			post_date: youtubePost.publishDate
		})
	});
};

const youtubeScraper = async (artist) => {
	const {youtube,id} = artist;
	const youtubeKey = `AIzaSyBeiiNR-feYHP2uC90LKZWVFlGx7IQ9ztE`;
	const youtubeParameter = buildParameter(youtube);
	const youtubeUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${youtubeParameter}&key=${youtubeKey}`
	const youtubeUserData = await request(youtubeUrl);
	const playlistId = JSON.parse(youtubeUserData.body).items[0].contentDetails.relatedPlaylists.uploads;
	const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistId}&key=${youtubeKey}`;
	const playlistData = await request(playlistUrl);
	const videos = JSON.parse(playlistData.body).items;
	const limitedVideoArray = returnLimitedVideos(videos);
	const saneVideoArray = returnSaneVideoData(limitedVideoArray);
	fillDatabase(saneVideoArray,id);
}

module.exports = youtubeScraper;
