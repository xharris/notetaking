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

    if (e.target.dataset.can_drag) {

      var resize_handle_box = 15;
      // get the mouse cursor position at startup:
      pos3 = e.clientX;
      pos4 = e.clientY;

      if (e.offsetX < e.target.clientWidth - resize_handle_box || e.offsetY < e.target.clientHeight - resize_handle_box) {
  	    document.onmouseup = closeDragElement;
  	    // call a function whenever the cursor moves:
  	    document.onmousemove = elementDrag;
  	  }
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
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
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

		this.content = document.createElement("div");
		this.content.classList.add("content");

		this.drag_container.appendChild(this.handle);
		this.drag_container.appendChild(this.content);

		dragElement(this.drag_container);
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

  disableDrag() {
    this.handle.dataset.can_drag = false;
  }

  enableDrag() {
    this.handle.dataset.can_drag = true;
  }
}

