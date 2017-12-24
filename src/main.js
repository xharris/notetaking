var nwGUI = require('nw.gui');
var nwWIN = nwGUI.Window.get();

var app = {
	pages: [],
	elements: [],
	bookmarks: [],
	placer_type: '',
	skip_click: false, // used for when clicking out of an element

	settings: {
		page_width: 8
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
		app.pages.push(new Page(app, app.settings.page_width, app.settings.page_height, app.pages.length));
	},

	addBookmark: function() {

	},

	inToPx: function(inches) {
		return Length.toPx(app.getElement("body"), inches+"in");
	},

	add: {
		Textbox: function(page, x, y) { app.elements.push(new Textbox(app, page, x, y)); },
		Equation: function(page, x, y) {}
	},

	placeSelectedElement: function(page, x, y) {
		if (app.placer_type != '') {
			app.elements.push(app.add[app.placer_type](page, x, y));
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
			if (app.skip_click) app.skip_click = false;
			else {
				var edit_space_rect = ev.srcElement.getBoundingClientRect();
				app.placeSelectedElement(ev.srcElement, ev.clientX - edit_space_rect.x, ev.clientY - edit_space_rect.y)
			}
		} else {
			app.skip_click = true;
		}
	}
}


nwWIN.on('loaded', function() {
	nwWIN.showDevTools();

	app.settings.page_width = app.inToPx("8.5");
	app.settings.page_height = app.inToPx("11");

	app.getElement("html").style.setProperty("--page-width", app.settings.page_width+"px");
	app.getElement("html").style.setProperty("--page-height", app.settings.page_height+"px");

	// add first page
	app.addPage();

	app.getElement("#page-container .page").addEventListener("click", app.onPageClick);
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