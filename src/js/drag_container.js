// https://www.w3schools.com/howto/howto_js_draggable.asp
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  /*
  if (document.querySelector(".drag-handle[data-guid='"+elmnt.dataset.guid+"']")) {
    // if present, the header is where you move the DIV from:
    document.querySelector(".drag-handle[data-guid='"+elmnt.dataset.guid+"']").onmousedown = dragMouseDown;
  } else {
  */
    /* otherwise, move the DIV from anywhere inside the DIV:*/
    elmnt.onmousedown = dragMouseDown;
//  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.target.classList.add("dragging")
    if (e.target.dataset.can_drag) {

      var resize_handle_box = 15;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;

      //if (e.offsetX < e.target.clientWidth - resize_handle_box || e.offsetY < e.target.clientHeight - resize_handle_box) {
  	    document.onmouseup = closeDragElement;
  	    // call a function whenever the cursor moves:
  	    document.onmousemove = elementDrag;
  	  //}
    }
  }

  function elementDrag(e) {
    e = e || window.event;

    if (e.target.dataset.can_drag) {
      // calculate the new cursor position:
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      // set the element's new position:
      elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
      elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
  }

  function closeDragElement() {
    DragContainer.resetBoxOutlines();
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

// Will be called when user starts dragging an element
function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
    }
}

class DragContainer {
	constructor (x, y) {
		this.guid = guid()

		this.drag_container = document.createElement("div");
		this.drag_container.style.left = x+"px";
		this.drag_container.style.top = y+"px";
		this.drag_container.dataset.guid = this.guid;
		this.drag_container.classList.add("drag-container");

		this.handle = document.createElement("div");
		this.handle.dataset.guid = this.guid;
		this.handle.classList.add("drag-handle");
    this.handle.dataset.can_drag = true;

    this.handle.onmousedown = function() {
      _drag_init(this);
      return false;
    }

		this.content = document.createElement("div");
		this.content.classList.add("content");
    this.content.dataset.can_drag = true;

		this.drag_container.appendChild(this.handle);
		this.drag_container.appendChild(this.content);

		dragElement(this.drag_container);
	}

  static resetBoxOutlines() {
    var drag_boxes = document.querySelectorAll(".drag-container");
    [].forEach.call(drag_boxes, function(drag_box) {
      drag_box.classList.remove("dragging");
    });
  }

  static refreshBoxZIndexes() {
    // puts smaller boxes at front
  }

  setOnDblClick(func, ref_arg) {
    this.handle.ondblclick_ref = ref_arg;
    this.handle.ondblclick = func;
  }

	appendTo(element) {
		element.appendChild(this.drag_container);
	}

	getContentElement() {
		return this.content;
	}

  setContentType(type) {
    this.content.dataset.type=type;
  }

  disableDrag() {
    this.handle.dataset.can_drag = false;
    this.content.dataset.can_drag = false;
  }

  enableDrag() {
    this.handle.dataset.can_drag = true;
    this.content.dataset.can_drag = true;
  }

  remove () {
    this.drag_container.remove();
    this.handle.remove();
    this.content.remove();
  }

  get x() {
    return this.drag_container.getBoundingClientRect().x;
  }

  get y() {
    return this.drag_container.getBoundingClientRect().y;
  }

  get width() {
    return this.drag_container.getBoundingClientRect().width;
  }

  get height() {
    return this.drag_container.getBoundingClientRect().height;
  }

  set width(val) {
    this.drag_container.style.width = val+"px";
  }

  set height(val) {
    this.drag_container.style.height = val+"px";
  }
}

