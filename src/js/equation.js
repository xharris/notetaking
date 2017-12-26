class Equation {
	constructor (app, page, x, y) {
		this.x = x;
		this.y = y;
		this.guid = guid();
		this.text = "";
		this.page = page;

		this.el_textbox = document.createElement("input");
		this.el_textbox.classList.add("textbox");
		this.el_textbox.dataset.guid = this.guid;
		this.el_textbox.obj_ref = this;
		this.el_textbox.addEventListener('input', this.onInput, false);

	    this.el_equation = document.createElement("div")
	    this.el_equation.classList.add("equation");
	    this.el_equation.id = "equation"+this.guid;

		this.drag_box = new DragContainer(this.x, this.y);
		this.drag_box.appendTo(page);

		this.drag_box.setOnDblClick(function(e){
			var this_ref = e.target.ondblclick_ref;
			this_ref.edit();
		}, this);

		this.drag_box.getContentElement().appendChild(this.el_textbox);
		this.drag_box.getContentElement().appendChild(this.el_equation);
		this.drag_box.setContentType("equation");
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

		this.el_textbox.addEventListener('input', function() {
			this.obj_ref.refreshMathJax();
		})

	    this.setText(this.text);
		console.log("Textbox("+x+", "+y+"):"+this.guid);
	}

	onContextMenu (ev) {
		var menu = new nwGUI.Menu();
		var this_ref = this;
		menu.append(new nwGUI.MenuItem({label:'delete', click: function() {this_ref.remove();}}))
		menu.popup(ev.x, ev.y);
	}

	refreshMathJax() {
		var node = null;
		try {
			node = math.parse(this.el_textbox.value);
		} catch (err) {
			node = this.el_textbox.value;
		}
		var latex = node ? node.toTex({parenthesis: 'keep', implicit: 'hide'}) : node;
		this.el_equation.innerHTML = "$"+latex+"$";
		MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
	}

	onInput (e) {
		var this_ref = e.target.obj_ref;
		this_ref.text = e.target.value;
	}

	setText (text) {
		this.text = text;
		this.el_textbox.value = text;
		this.refreshMathJax();
	}

	enable () {
		this.el_textbox.focus();
	}

	disable () {
		this.text = this.el_textbox.value;
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

	remove () {
		this.el_textbox.remove();
		this.el_equation.remove();
		this.drag_box.remove();
	}

	save () {
		return {
			text: this.text,
			type: 'Equation',
			x: this.drag_box.x - this.page.getBoundingClientRect().x,
			y: this.drag_box.y - this.page.getBoundingClientRect().y,
			width: this.drag_box.width,
			height: this.drag_box.height,
			page: this.page.dataset.number
		};
	}

	static load (app, data) {
		var page = app.getPage(parseInt(data.page)).el_page;

		var textbox = new Equation(app, page, data.x, data.y);
		textbox.drag_box.width = data.width;
		textbox.drag_box.height = data.height;
		textbox.setText(data.text);

		return textbox;
	}
}


