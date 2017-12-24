class Page {
	constructor (app, page, width, height, number) {
		this.width = width;
		this.height= height;
		this.number= number;
		this.guid = guid();

		this.el_page = document.createElement("div");
		this.el_page.style.top = ((this.height)*this.number)+"px";
		this.el_page.classList.add("page");
		this.el_page.dataset.guid = this.guid;

		app.getElement("#page-container").appendChild(this.el_page);

		console.log("Page("+width+", "+height+"):"+this.guid);
	}
};
