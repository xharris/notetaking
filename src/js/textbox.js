class Textbox {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();
		this.text = "Text...";
		this.markdown_options = {
			simpleLineBreaks: true,
			strikethrough: true,
			excludeTrailingPuncuationFromURLs: true
		}

		this.el_textbox = document.createElement("textarea");
		this.el_textbox.classList.add("textbox");
		this.el_textbox.dataset.guid = this.guid;
		this.el_textbox.obj_ref = this;
		this.el_textbox.addEventListener('input', this.onInput, false);
	    this.el_textbox.addEventListener('keydown',function(e){
	        var TABKEY = 9;
	        if(e.keyCode == TABKEY) {
	            this.value += "    ";
	            if(e.preventDefault) {
	                e.preventDefault();
	            }
	            return false;
	        }
	    },false);
	    this.setText(this.text);

	    this.el_markdown = document.createElement("div")
	    this.el_markdown.classList.add("markdown-body");

		this.drag_box = new DragContainer(this.x, this.y);
		this.drag_box.appendTo(page);

		this.drag_box.setOnDblClick(function(e){
			var this_ref = e.target.ondblclick_ref;
			this_ref.edit();
		}, this);

		this.drag_box.getContentElement().appendChild(this.el_textbox);
		this.drag_box.getContentElement().appendChild(this.el_markdown);
		this.drag_box.setContentType("textbox");

		/*
		this.editor = new Quill(this.el_textbox, {
			placeholder: "Text...",
			modules: {
				toolbar: [
					
						['bold','italic','underline','strike'],
						['blockquote', 'code-block'],
						[{ 'list': 'ordered'}, { 'list': 'bullet' }]
					
				]
			},
			theme: 'snow'
		});
		*/

		// give guid to child nodes
		var child_nodes = this.drag_box.getContentElement().children;
		var this_guid = this.guid;
		[].forEach.call(child_nodes, function(node){
			node.dataset.guid = this_guid;
		})

		var this_ref = this;
		document.addEventListener("loseFocus", function(e) {
    		DragContainer.resetBoxOutlines();		
			if (e.detail.except != this_ref.guid) {
				this_ref.loseFocus();
			}
		});

		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}

	onInput (e) {
		var this_ref = e.target.obj_ref;
		this_ref.text = e.target.value;
	}

	setText (text) {
		this.el_textbox.value = text;
	}

	enable () {
		//this.editor.enable();
		//this.editor.focus();
	}

	disable () {
		//this.editor.disable();
		this.text = this.el_textbox.value;
		var converter = new showdown.Converter(this.markdown_options);
		var html = converter.makeHtml(this.text);	
		this.el_markdown.innerHTML = html;
	}

	edit () {
		this.el_textbox.classList.add("edit-mode")
		this.enable();
		this.drag_box.disableDrag();
	}

	loseFocus () {
		this.el_textbox.classList.remove("edit-mode")
		this.disable();
		this.drag_box.enableDrag();
	}
}