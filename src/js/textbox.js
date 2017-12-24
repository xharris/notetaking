class Textbox {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();

		this.el_textbox = document.createElement("div");
		this.el_textbox.classList.add("textbox");
		this.el_textbox.dataset.guid = this.guid;

		this.drag_box = new DragContainer(this.x, this.y);
		this.drag_box.appendTo(page);

		this.drag_box.setOnDblClick(function(e){
			var this_ref = e.target.ondblclick_ref;
			this_ref.edit();
		}, this);

		this.drag_box.getContentElement().appendChild(this.el_textbox);

		this.editor = new Quill(this.el_textbox, {
			placeholder: "Text..."
		});

		var this_ref = this;
		document.addEventListener("loseFocus", function(e) {
			if (e.detail.except != this_ref.guid) {
				this_ref.loseFocus();
			}
		});

		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}

	edit () {
		console.log('take away drag')
		this.el_textbox.classList.add("edit-mode")
		this.editor.enable();
		this.editor.focus();
		this.drag_box.disableDrag();
	}

	loseFocus () {
		console.log('give back drag')
		this.el_textbox.classList.remove("edit-mode")
		this.editor.disable();
		this.drag_box.enableDrag();
	}
}