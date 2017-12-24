var nwGUI = require('nw.gui');
var nwWIN = nwGUI.Window.get();

var app = {
	getElement: function(sel) {
		return document.querySelector(sel);
	},

	close: function() {
		nwWIN.close();
	}
}

const Page = require('./js/page');

nwWIN.on('loaded', function() {
	nwWIN.showDevTools();
});