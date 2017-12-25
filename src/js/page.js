class Page {
	constructor (app, width, height, number) {
		this.width = width;
		this.height= height;
		this.number= number;
		this.guid = guid();

		this.el_page = document.createElement("div");
		this.el_page.style.top = ((this.height)*this.number)+"px";
		this.el_page.classList.add("page");
		this.el_page.dataset.guid = this.guid;
		this.el_page.dataset.number = this.number;

		this.el_break = document.createElement("br");

		app.getElement("#page-container").appendChild(this.el_page);
		app.getElement("#page-container").appendChild(this.el_break);

		this.el_page.addEventListener("click", app.onPageClick);
		
		console.log("Page("+width+", "+height+"):"+this.guid);
	}

	remove () {
		this.el_page.remove();
		this.el_break.remove();
	}
};
