var nwGUI = require('nw.gui');
var nwWIN = nwGUI.Window.get();

nwWIN.on('loaded', function() {
	nwWIN.showDevTools();
});