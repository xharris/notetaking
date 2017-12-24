class Textbox {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();

		this.el_page = document.createElement("div");
		this.el_page.style.top = this.y+"px";
		this.el_page.style.left = this.x+"px";
		this.el_page.classList.add("textbox");
		this.el_page.dataset.guid = this.guid;

		page.appendChild(this.el_page);

		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}
}