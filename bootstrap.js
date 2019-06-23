module.exports = async (res,id) => {
	const instaComment = require("./models/instaComment.js");
	const instaPost = require("./models/instaPost.js");

	


	const data = await instaPost.findAll({where:{id: 1}, include: [{
		model: instaComment,
		as:"comments"
	}]}).catch(err => {
		console.error(err);
	});

	res.render("index",{data:data[0]});

	//res.send(data)
};