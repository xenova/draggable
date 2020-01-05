Element.prototype.DraggableJS = function (o) {
    const self = this;

    //default options
    const defaultOptions = {
        axis: 'xy', //x, y, xy

        start: function (e) {
        },
        drag: function (e) {
        },
        end: function (e) {
        }
    }
    /**
     * Future additions:
     *  - Containment (parent, document, window)
     *  - Momentum (true/false)
     *  - Axis (z)
     */

    self.options = Object.assign({}, defaultOptions, o);
    self.mouseDown = false;
    self.style.cssText = 'position:absolute;will-change: transform;transform-style:preserve-3d; -webkit-touch-callout: none; -webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;';
    self.parentNode.style.cssText = 'will-change: transform;transform-style: preserve-3d;';

    addMultipleEventListener(self, 'touchmove', function (e) {
        e.preventDefault();
    }, { passive: false });

    addMultipleEventListener(self, 'mousedown touchstart', function (e) {
        let event = getPointerEvent(e);
        let matrix = getTransformMatrix(self);
        let cmp = getTransformMatrix(self.parentNode);

        self.mouseDown = pointerEventDown(e);
        self.start = [event.pageX - matrix.m41 * cmp.m11, event.pageY - matrix.m42 * cmp.m22];
        self.options.start.call(e);
    });

    addMultipleEventListener(document, 'mouseup touchend', function (e) {
        if (self.mouseDown) {
            self.mouseDown = false;
            self.options.end.call(e);
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
                let offsetLength = (axis == 'x') ? (self.offsetWidth) : (self.offsetHeight);
                let parentOffsetLength = (axis == 'x') ? (self.parentNode.offsetWidth) : (self.parentNode.offsetHeight);
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

            self.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';

            self.options.drag.call(e);
        }
    });

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
        left.percentage = left.pixels / this.parentNode.offsetWidth;

        let top = {};
        top.pixels = matrix.m42 + this.offsetTop;
        top.percentage = top.pixels / this.parentNode.offsetHeight;

        return {
            left: left,
            top: top,
        };
    }

    self.setPosition = function (left, top) {
        let x = parseFloat('' + left) - self.offsetLeft;// 
        let y = parseFloat('' + top) - self.offsetTop;//

        let cm = getTransformMatrix(self);
        self.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';

    }
}

NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}