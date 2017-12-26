class Textbox {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();
		this.text = "";
		this.page = page;
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

		function insertAtCursor(myField, myValue) {
		    //IE support
		    if (document.selection) {
		        //myField.focus();
		        sel = document.selection.createRange();
		        sel.text = myValue;
		    }
		    //MOZILLA and others
		    else if (myField.selectionStart || myField.selectionStart == '0') {
		        var startPos = myField.selectionStart;
		        var endPos = myField.selectionEnd;
		        myField.value = myField.value.substring(0, startPos)
		            + myValue
		            + myField.value.substring(endPos, myField.value.length);
		    } else {
		        myField.value += myValue;
		    }
		}
	    this.el_textbox.addEventListener('keydown',function(e){
	        var TABKEY = 9;
	        if(e.keyCode == TABKEY) {
	            //this.value += "    ";
	            insertAtCursor(this, "    ");
	            if(e.preventDefault) {
	                e.preventDefault();
	            }
	            return false;
	        }
	    },false);

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
		this.drag_box.width = 150;
		this.drag_box.height = 100;

		// context menu
		this.drag_box.handle.txtbox_ref = this;
		this.drag_box.handle.addEventListener('contextmenu', function(ev){
			ev.preventDefault();
			this.txtbox_ref.onContextMenu(ev);
			return false;
		}, false);

		app.spreadGUID(this.drag_box, this.guid);

		var this_ref = this;
		document.addEventListener("loseFocus", function(e) {
    		DragContainer.resetBoxOutlines();		
			if (e.detail.except != this_ref.guid) {
				this_ref.loseFocus();
			}
		});

	    this.setText(this.text);
		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}

	onContextMenu (ev) {
		var menu = new nwGUI.Menu();
		var this_ref = this;
		menu.append(new nwGUI.MenuItem({label:'delete', click: function() {this_ref.remove();}}))
		menu.popup(ev.x, ev.y);
	}

	onInput (e) {
		var this_ref = e.target.obj_ref;
		this_ref.text = e.target.value;
	}

	setText (text) {
		this.text = text;
		this.el_textbox.value = text;
		this.refreshMarkdown();
	}
	enable () {
		//this.editor.enable();
		//this.editor.focus();
		this.el_textbox.focus();
	}

	disable () {
		//this.editor.disable();
		this.text = this.el_textbox.value;
		this.refreshMarkdown();
	}

	refreshMarkdown() {
		this.text = this.text.replaceAll(/[^\S\n]/,"&nbsp;");
		var converter = new showdown.Converter(this.markdown_options);
		var html = converter.makeHtml(this.text);	
		this.el_markdown.innerHTML = html;
	}

	edit () {
		this.text = this.text.replaceAll("&nbsp;"," ");
		this.el_textbox.value = this.text;
		this.el_textbox.classList.add("edit-mode")
		this.enable();
		this.drag_box.disableDrag();
	}

	loseFocus () {
		this.el_textbox.classList.remove("edit-mode")
		this.disable();
		this.drag_box.enableDrag();
	}

	remove () {
		this.el_textbox.remove();
		this.el_markdown.remove();
		this.drag_box.remove();
	}

	save () {
		return {
			text: this.text,
			type: 'Textbox',
			x: this.drag_box.x - this.page.getBoundingClientRect().x,
			y: this.drag_box.y - this.page.getBoundingClientRect().y,
			width: this.drag_box.width,
			height: this.drag_box.height,
			page: this.page.dataset.number
		};
	}

	static load (app, data) {
		var page = app.getPage(parseInt(data.page)).el_page;

		var textbox = new Textbox(app, page, data.x, data.y);
		textbox.drag_box.width = data.width;
		textbox.drag_box.height = data.height;
		textbox.setText(data.text);

		return textbox;
	}
}