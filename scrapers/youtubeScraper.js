const request = require("async-request");

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

const youtubeScraper = async (youtubeChannelId,youtubeUser) => {
	const youtubeKey = `AIzaSyBeiiNR-feYHP2uC90LKZWVFlGx7IQ9ztE`;
	const youtubeParameter = youtubeChannelId ? `id=${youtubeChannelId}` : `forUsername=${youtubeUser}`;
	const youtubeUrl = `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&${youtubeParameter}&key=${youtubeKey}`
	const youtubeUserData = await request(youtubeUrl);
	const playlistId = JSON.parse(youtubeUserData.body).items[0].contentDetails.relatedPlaylists.uploads;
	const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails,status&playlistId=${playlistId}&key=${youtubeKey}`;
	const playlistData = await request(playlistUrl);
	const videos = JSON.parse(playlistData.body).items;
	const limitedVideoArray = returnLimitedVideos(videos);
	const saneVideoArray = returnSaneVideoData(limitedVideoArray);
	return saneVideoArray;
}

module.exports = youtubeScraper;
