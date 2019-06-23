const input = document.querySelector("input");

const container = document.querySelector(".comments")

const xhrHandler = (self) => {
	const xhr = new XMLHttpRequest();

	xhr.open("POST", "/api/instagramcomment");
	xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xhr.send(`id=1&content=${self.value}`);
	container.insertAdjacentHTML("beforeend",`<p class="comment">${self.value}</p>`)
	self.value = "";
}

const keyHandler = function(e) {
	const {keyCode} = e;
	if(keyCode === 13) {
		xhrHandler(this)
	}
}

console.log(input)

input.addEventListener("keyup",keyHandler);


