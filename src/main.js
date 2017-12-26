var nwGUI = require('nw.gui');
var nwFS = require('fs');
var nwWIN = nwGUI.Window.get();

var app = {
	pages: [],
	elements: [],
	bookmarks: [],
	placer_type: '',
	skip_click: false, // used for when clicking out of an element
	current_file: '',

	settings: {
		page_width: 8.5,
		page_height: 11
	},

	getElement: function(sel) {
		return document.querySelector(sel);
	},

	getElements: function(sel) {
		return document.querySelectorAll(sel);
	},

	close: function() {
		nwWIN.close();
	},

	addPage: function() {
		var number = app.pages.length;
		app.pages.push(new Page(app, number));
	},

	getPage: function(number) {
		return app.pages[number];
	},

	clearDocument: function() {
		for (var e = 0; e < app.elements.length; e++) {
			app.elements[e].remove();
		}
		app.elements = [];

		for (var p = 0; p < app.pages.length; p++) {
			app.pages[p].remove();
		}
		app.pages = [];
	},

	addBookmark: function() {

	},

	inToPx: function(inches) {
		return Length.toPx(app.getElement("body"), inches.toString()+"in");
	},

	add: {
		Textbox: function(page, x, y) { app.elements.push(new Textbox(app, page, x, y)); },
		Equation: function(page, x, y) { app.elements.push(new Equation(app, page, x, y)); }
	},

	load: {
		Textbox: function(data) {app.elements.push(Textbox.load(app, data));},
		Equation: function(data) {app.elements.push(Equation.load(app,data));}
	},

	placeSelectedElement: function(page, x, y) {
		if (app.placer_type != '') {
			app.add[app.placer_type](page, x, y);
		}
	},

	setPlacerType: function(type) {
		if (app.add[type]) {
			app.placer_type = type;
			console.log(type,' selected');
		} else {
			app.placer_type = '';
			console.log("nothing selected");
		}
	},

	onPageClick: function(ev) {
		if (ev.target.classList.contains("page")) {
			// click to remove focus from current element
			if (app.skip_click) {
				app.skip_click = false;
				dispatchEvent("loseFocus", {except: except_guid});

			} else {
				var edit_space_rect = ev.srcElement.getBoundingClientRect();
				app.placeSelectedElement(ev.srcElement, ev.clientX - edit_space_rect.x, ev.clientY - edit_space_rect.y)
			}
		} else {
			app.skip_click = true;
			var except_guid = ev.target.closest(".drag-container").getElementsByClassName('content')[0].children[0].dataset.guid;
			dispatchEvent("loseFocus", {except: except_guid});
		}
	},

	// give guid to child nodes
	spreadGUID: function(element, in_guid) {
		var child_nodes = element.getContentElement().children;
		[].forEach.call(child_nodes, function(node){
			node.dataset.guid = in_guid;
		})
	},

	save: function() {
		var save_data = {page_count:app.pages.length, elements:[]};

		for (var a = 0; a < app.elements.length; a++) {
			if (app.elements[a].save) {
				var el_save_data = app.elements[a].save();
				save_data.elements.push(el_save_data);
			}
		}

		// write save file
		if (app.current_file == '') {
			// show save dialog
			blanke.chooseFile("nwsaveas", function(file) {
				app.current_file = file;
				nwFS.writeFile(file, JSON.stringify(save_data));
			}, "mynotes.bdoc");
		} else {
			nwFS.writeFile(app.current_file, JSON.stringify(save_data));
		}
	},

	open: function() {
		blanke.chooseFile("", function(file){
			app.current_file = file;
			nwFS.readFile(file, function(err, data){
				app.clearDocument();

				var load_data = JSON.parse(data);
				// pages
				for (var p = 0; p < load_data.page_count; p++) {
					app.addPage();
				}
				// elements
				for (var e = 0; e < load_data.elements.length; e++) {
					var el_data = load_data.elements[e];
					if (app.load[el_data.type]) app.load[el_data.type](el_data);
				}
			});
		});
	}
}

nwWIN.on('loaded', function() {
	//nwWIN.showDevTools();

	app.getElement("html").style.setProperty("--page-width", app.inToPx(app.settings.page_width)+"px");
	app.getElement("html").style.setProperty("--page-height", app.inToPx(app.settings.page_height)+"px");

	// add first page
	app.addPage();
	app.getElement("#edit-space > .page-tools").addEventListener("click", function(ev){
		ev.stopPropagation();

		var type_selected = ev.srcElement.dataset.type;

		// behaves like radio buttons
		var checkboxes = app.getElements("#edit-space > .page-tools input");
		[].forEach.call(checkboxes, function(checkbox){
			// wanted checkbox
			if (checkbox.dataset.type == type_selected) {
				// set placer
				if (checkbox.checked == true) app.setPlacerType(type_selected);
				else app.setPlacerType();
			}

			// other checkbox
			else {
				checkbox.checked = false;
			}
		});
	});
});