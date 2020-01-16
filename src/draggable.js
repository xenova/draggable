Element.prototype.DraggableJS = function (o) {
    const self = this;

    const defaultOptions = {
        axis: 'xy',
        init: function (e) {
        },
        start: function (e) {
        },
        drag: function (e) {
        },
        end: function (e) {
        },
        grid: false
    }
    self.options = Object.assign({}, defaultOptions, o);
    self.mouseDown = false;
    self.style.cssText += 'position:absolute;will-change: transform;transform-style:preserve-3d; -webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;';
    self.parentNode.style.cssText += 'will-change: transform;transform-style: preserve-3d;position: relative;';

    addMultipleEventListener(self, 'touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    addMultipleEventListener(self, 'mousedown touchstart', function (e) {
        let event = getPointerEvent(e);
        let matrix = getTransformMatrix(self);
        let cmp = getTransformMatrix(self.parentNode);
        let childInfo = self.getBoundingClientRect();
        let bodyInfo = document.body.getBoundingClientRect();

        self.mouseDown = pointerEventDown(e);
        self.start = [event.pageX - matrix.m41 * cmp.m11, event.pageY - matrix.m42 * cmp.m22];
        self.startOffset = [event.offsetX || event.pageX - (childInfo.left - bodyInfo.left), event.offsetY || event.pageY - (childInfo.top - bodyInfo.top)]

        self.options.start.call(self, e);
    });


    addMultipleEventListener(document, 'mouseup touchend', function (e) {

        if (self.mouseDown) {
            self.mouseDown = false;

            if (self.options.grid && self.options.grid.dragEndSnap) {
                let cm = getTransformMatrix(self);
                snapToGrid(cm.m41, cm.m42);
            }

            self.options.end.call(self, e);

        }
    });

    addMultipleEventListener(document, 'mousemove touchmove', function (e) {
        if (self.mouseDown) {
            let event = getPointerEvent(e);
            let parentInfo = self.parentNode.getBoundingClientRect();
            let childInfo = self.getBoundingClientRect();
            let cm = getTransformMatrix(self);
            let cmp = getTransformMatrix(self.parentNode);

            let x = (event.pageX - self.start[0]) / cmp.m11;
            let y = (event.pageY - self.start[1]) / cmp.m22;

            function restrict(value, axis) {
                let offsetPosition = (axis == 'x') ? (self.offsetLeft) : (self.offsetTop);
                let offsetLength = (axis == 'x') ? (self.clientWidth) : (self.clientHeight);
                let parentOffsetLength = (axis == 'x') ? (self.parentNode.clientWidth) : (self.parentNode.clientHeight);
                let length = (axis == 'x') ? ('width') : ('height');
                let transform = (axis == 'x') ? (cm.m41) : (cm.m42);;
                let scale = (axis == 'x') ? (cm.m11) : (cm.m22);
                let tStyle = (getComputedStyle(self).transformOrigin.match(/(\d+)/gm)).map((i) => parseInt(i));
                let transformOrigin = ((axis == 'x') ? tStyle[0] : tStyle[1]) / offsetLength;

                let k = (1 - scale) * offsetLength;
                let k1 = k * transformOrigin;
                let k2 = k * (1 - transformOrigin);

                let b = (transform + offsetPosition) + k1;
                let d = (parentOffsetLength - offsetLength) - (transform + offsetPosition) + k2;

                let a = (childInfo[axis] - parentInfo[axis] - b);
                let c = ((childInfo[axis] + childInfo[length]) - (parentInfo[axis] + parentInfo[length]) + d);

                let ax = parentInfo[axis] - childInfo[axis] + transform;
                let bx = parentInfo[length] - childInfo[length] + ax;

                return Math.min(Math.max(value, ax + a), bx + c);
            }

            x = (self.options.axis.toLowerCase().indexOf('x') > -1) ? restrict(x, 'x') : cm.m41;
            y = (self.options.axis.toLowerCase().indexOf('y') > -1) ? restrict(y, 'y') : cm.m42;

            if (self.options.grid && self.options.grid.dragSnap) {
                snapToGrid(x, y);
            } else {
                translate(cm, x, y);
            }

            self.options.drag.call(self, e);
        }
    });


    function snapToGrid(x, y) {
        let colWidth = (self.parentNode.clientWidth / self.options.grid.columns);
        let rowWidth = (self.parentNode.clientHeight / self.options.grid.rows);

        let paddingLeft = (self.clientWidth - colWidth) / 2;
        let paddingTop = (self.clientHeight - rowWidth) / 2;

        x = Math.round((x + self.offsetLeft - (self.clientWidth / 2 - self.startOffset[0])) / colWidth) * colWidth - paddingLeft;
        y = Math.round((y + self.offsetTop - (self.clientHeight / 2 - self.startOffset[1])) / rowWidth) * rowWidth - paddingTop;

        self.setPosition(x, y);
    }

    self.setGridPosition = function (row, col) {
        if (self.options.grid) {
            let colWidth = (self.parentNode.clientWidth / self.options.grid.columns);
            let rowWidth = (self.parentNode.clientHeight / self.options.grid.rows);

            let paddingLeft = (self.clientWidth - colWidth) / 2;
            let paddingTop = (self.clientHeight - rowWidth) / 2;

            x = Math.round(col * colWidth - paddingLeft);
            y = Math.round(row * rowWidth - paddingTop);

            self.setPosition(x, y);
        }
    }

    function addMultipleEventListener(element, events, handler, args) {
        events.split(' ').forEach(e => element.addEventListener(e, handler, args))
    }
    function getTransformMatrix(element) {
        return new WebKitCSSMatrix(window.getComputedStyle(element).webkitTransform);
    }
    function getPointerEvent(e) {
        if (e instanceof MouseEvent) {
            return e;
        } else if (e instanceof TouchEvent) {
            let event = e.originalEvent || e;
            return event.touches[0] || event.changedTouches[0] || null;
        } else {
            return null;
        }
    }

    function pointerEventDown(e) {
        if (e instanceof MouseEvent) {
            return (e.buttons === undefined ? e.which === 1 : e.buttons === 1);
        } else {
            return (e instanceof TouchEvent);
        }
    }

    self.getPosition = function () {
        let matrix = getTransformMatrix(this);
        let left = {};
        left.pixels = matrix.m41 + this.offsetLeft;
        left.percentage = left.pixels / this.parentNode.clientWidth;

        let top = {};
        top.pixels = matrix.m42 + this.offsetTop;
        top.percentage = top.pixels / this.parentNode.clientHeight;

        return {
            left: left,
            top: top,
        };
    }

    self.setTransformPosition = function(x,y){
        translate(getTransformMatrix(self), x, y);
    }
    self.setPosition = function (left, top) {
        let x = parseFloat('' + left) - self.offsetLeft;
        let y = parseFloat('' + top) - self.offsetTop;
        self.setTransformPosition(x,y);

    }
    function translate(cm, x, y) {
        self.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';
    }
    self.options.init.call(self);
}

NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}