class Textbox {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();

		this.el_textbox = document.createElement("div");
		this.el_textbox.classList.add("textbox");
		this.el_textbox.ondblclick = this.edit;

		this.drag_box = new DragContainer(this.x, this.y);
		this.drag_box.appendTo(page);

		this.drag_box.getContentElement().appendChild(this.el_textbox);

		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}

	edit (ev) {
		
	}
}