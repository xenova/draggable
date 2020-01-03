// Element.prototype.apple = function(n){
//     console.log(this);
//     console.log(n);
// }

// require('')

Element.prototype.DraggableJS = function (o) {
    const self = this;
    //default options
    const defaultOptions = {
        containment: 'none', //parent, none
        axis: 'xy', //x, y, xy
        //momentum: true,
        //refreshTime: 10,
        //maxEaseTime: 1,
    }
    self.options = Object.assign({}, defaultOptions, o);

    self.mouseDown = false;

    // console.log(this.parentNode);
    self.style.position = 'absolute';


    function getTransformMatrix(element) {
        return new WebKitCSSMatrix(window.getComputedStyle(element).webkitTransform);
    }

    self.addEventListener('mousedown', function (e) {


        self.startTime = performance.now();
        var matrix = getTransformMatrix(self);
        let cmp = getTransformMatrix(self.parentNode);

        //console.log(cmp);
        self.mouseDown = true;
        self.startX = (e.pageX - matrix.m41 * cmp.m11); // - matrix.m41, self.offsetLeft
        //console.log(self.startX);

        self.startY = e.pageY - matrix.m42 * cmp.m22;//- self.offsetTop;

    });

    document.addEventListener('mouseup', function (e) {
        self.mouseDown = false;
    });

    //.throttle(10)
    Function.prototype.throttle = function (milliseconds, context) {
        var baseFunction = this,
            lastEventTimestamp = null,
            limit = milliseconds;

        return function () {
            var self = context || this,
                args = arguments,
                now = performance.now();

            if (!lastEventTimestamp || now - lastEventTimestamp >= limit) {
                lastEventTimestamp = now;
                baseFunction.apply(self, args);
            }
        };
    };


    document.addEventListener('mousemove', function (e) {
        if (self.mouseDown &= (e.buttons === undefined ? e.which === 1 : e.buttons === 1)) {

            // var styles = window.getComputedStyle(self);
            // let cmp = getTransformMatrix(self.parentNode);
            // // console.log(Math.asin())


            // var xPerc = (e.pageX - self.startX) / self.parentNode.offsetWidth;
            // var yPerc = (e.pageY - self.startY) / self.parentNode.offsetHeight;

            // switch (self.options.containment) {
            //     case 'parent':
            //         xPerc = Math.min(Math.max(xPerc, 0), (1 - self.offsetWidth / self.parentNode.offsetWidth));
            //         yPerc = Math.min(Math.max(yPerc, 0), (1 - self.offsetHeight / self.parentNode.offsetHeight));
            //         // console.log(Math.max(x,-(childInfo.x+parentInfo.x)))
            //         // x = Math.max(Math.min(x, parentInfo['width'] - childInfo['width'] - self.offsetLeft-(childInfo['width']-self.offsetWidth)/2), - (childInfo.x+parentInfo.x));
            //         // y = Math.max(Math.min(y, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
            //         break;
            //     case 'document':
            //         break;
            //     case 'window':
            //         break;
            // }
            // //console.log(xPerc, yPerc)
            // // console.log((e.pageX - self.startX),(self.parentNode.offsetWidth-self.offsetWidth));
            // self.style.left = 100 * xPerc + '%';
            // self.style.top = 100 * yPerc + '%';





            //////////////////////////////////////

            //console.log((e.pageY - self.startY) / self.offsetHeight);
            let parentInfo = self.parentNode.getBoundingClientRect(self.parentNode);
            let childInfo = self.getBoundingClientRect(self);
            let cm = getTransformMatrix(self);
            let cmp = getTransformMatrix(self.parentNode);
            // console.log(cmp);
            // cmp.m11 -> scaleX
            // cmp.m22 -> scaleY

            // console.log(self.offsetLeft,childInfo['left']);
            let x = (e.pageX - self.startX) / cmp.m11;

            //console.log(x);
            let y = (e.pageY - self.startY) / cmp.m22;
            // console.log('x: '+x);
            // console.log(x);

            // console.log(self.offsetLeft,childInfo['width'],self.offsetWidth);
            // console.log(-);
            // console.log(x+childInfo['width'],childInfo['x']);
            // console.log(x);//-(childInfo.x+parentInfo.x)
            // console.log(childInfo)
            // Math.min()

            // var torigin = window.getComputedStyle(self).transformOrigin.split(' ').map(function(i){
            //     return parseInt(i);
            // });


            function restrict(value, axis, element, cm, childInfo, parentInfo) {
                var offsetPosition = (axis == 'x') ? (element.offsetLeft) : (element.offsetTop);
                var offsetLength = (axis == 'x') ? (element.offsetWidth) : (element.offsetHeight);
                var parentOffsetLength = (axis == 'x') ? (element.parentNode.offsetWidth) : (element.parentNode.offsetHeight);
                var length = (axis == 'x') ? ('width') : ('height');
                var transform = (axis == 'x') ? (cm.m41) : (cm.m42);;
                var scale = (axis == 'x') ? (cm.m11) : (cm.m22);
                var tStyle = (getComputedStyle(self).transformOrigin.match(/(\d+)/gm)).map((i) => parseInt(i));
                var transformOrigin = ((axis == 'x') ? tStyle[0] : tStyle[1]) / offsetLength;
                // console.log(transformOrigin)

                var k = (1 - scale) * offsetLength;
                var k1 = k * transformOrigin;
                var k2 = k * (1 - transformOrigin);
                
                var b = (transform + offsetPosition) + k1;
                var d = (parentOffsetLength - offsetLength) - (transform + offsetPosition) + k2;

                var a = (childInfo[axis] - parentInfo[axis] - b);//(b <= 0) ? (childInfo[axis] - parentInfo[axis] - b) : 0;
                var c = ((childInfo[axis] + childInfo[length]) - (parentInfo[axis] + parentInfo[length]) + d);// (d <= 0) ? ((childInfo[axis] + childInfo[length]) - (parentInfo[axis] + parentInfo[length]) + d) : 0

                var ax = parentInfo[axis] - childInfo[axis] + transform;
                var bx = parentInfo[length] - childInfo[length] + ax;


                // a = Math.max(a,0);
                // console.log(ax);
                return Math.min(Math.max(value, ax + a), bx + c);
            }

            switch (self.options.containment) {
                case 'parent':

                    console.log('==========');
                    x = restrict(x, 'x', self, cm, childInfo, parentInfo);
                    y = restrict(y, 'y', self, cm, childInfo, parentInfo);

                    // var k = Math.floor(((1 - cm.m11) * self.offsetWidth) / 2);
                    // var b = (cm.m41 + self.offsetLeft) + k;
                    // var d = (self.parentNode.offsetWidth - self.offsetWidth) - (cm.m41 + self.offsetLeft) + k;
                    // var a = (b <= 0) ? (childInfo['x'] - parentInfo['x'] - b) : 0;
                    // var c = (d <= 0) ? ((childInfo['x'] + childInfo['width']) - (parentInfo['x'] + parentInfo['width']) + d) : 0

                    // var ax = parentInfo['x'] - childInfo['x'] + cm.m41;
                    // var bx = parentInfo['width'] - childInfo['width'] + ax;
                    // x = Math.min(Math.max(x, ax + a), bx + c);

                    //console.log(x)


                    ///////////////
                    //console.log(cm);
                    // var b = cm.m42 + self.offsetTop;
                    // var d = (self.parentNode.offsetHeight - self.offsetHeight) - (b)
                    // var k = ((1 - cm.m22) * self.offsetHeight) / 2;
                    // var a = (b <= 0) ? (childInfo['y'] - parentInfo['y'] - b - k) : 0;
                    // var c = (d <= 0) ? ((childInfo['y'] + childInfo['height']) - (parentInfo['y'] + parentInfo['height']) + d + k) : 0

                    // var ay = parentInfo['y'] - childInfo['y'] + cm.m42;
                    // var by = parentInfo['height'] - childInfo['height'] + ay;
                    // y = Math.min(Math.max(y, ay + a), by + c);








                    //Math.min(,123);//cmp.m11;
                    // console.log(parentInfo['width']);

                    // console.log(parentInfo['width']/self.parentNode.offsetWidth);
                    //console.log(parentInfo['height'],self.parentNode.offsetHeight);
                    // console.log(parentInfo['height']/self.parentNode.offsetHeight);
                    //console.log(Math.acos(parentInfo['width']/self.parentNode.offsetWidth))

                    // console.log((parentInfo['height'] - self.parentNode.offsetHeight) / 2, (parentInfo['width'] * self.parentNode.offsetHeight / self.parentNode.offsetWidth));
                    // var pixelsOnScreenshot = parentInfo['width'] * ((parentInfo['height'] - self.parentNode.offsetHeight) / 2) / (parentInfo['width'] * self.parentNode.offsetHeight / self.parentNode.offsetWidth);
                    // //136

                    // var angle = Math.acos(parentInfo['width'] / self.parentNode.offsetWidth)
                    //console.log(angle);

                    // console.log(parentInfo['height'], self.parentNode.offsetHeight);

                    // console.log(parentInfo['width']/2);



                    // console.log(cmp);
                    // cmp.m14,cmp.34 <- for perspective 
                    // 0.000828221
                    // -0.0038637
                    // console.log(childInfo['x'],parentInfo['x'],cm.m41);
                    // var a = 24;

                    // var k = (parentInfo['height'] - self.parentNode.offsetHeight) / 2;

                    // var angle = Math.acos(parentInfo['width']/self.parentNode.offsetWidth);
                    // console.log(angle);

                    // var angle = Math.acos(self.parentNode.offsetHeight/parentInfo['height']);
                    // console.log(angle);
                    // console.log((parentInfo['height'] - self.parentNode.offsetHeight) / 2);


                    // var a = 87;
                    // a = k/(0.784)

                    // a = Math.ceil(k/(2))

                    // console.log(parentInfo['height'], self.parentNode.offsetHeight, (parentInfo['height'] - self.parentNode.offsetHeight));
                    // console.log(parentInfo['width']);
                    // console.log(parentInfo['height']/self.parentNode.offsetHeight)

                    // if()
                    // console.log(self.parentNode.offsetWidth,parentInfo['width']);
                    //console.log(childInfo['height'],self.offsetHeight);







                    // +48
                    // var x1 = self.offsetLeft - (childInfo['width'] / cmp.m11 - self.offsetWidth) / 2;
                    // //console.log(cmp.m11,cmp.m11*1.08);
                    // var x2 = parentInfo['width'] / (cmp.m11) - childInfo['width'] / (cmp.m11) - x1;
                    // x = Math.min(Math.max(x, -x1-15), x2-21);
                    // // console.log(-x1-15,-x1);


                    // var y1 = self.offsetTop - (childInfo['height']/ cmp.m22 - self.offsetHeight) / 2;
                    // var y2 = parentInfo['height']/ cmp.m22 - childInfo['height']/ cmp.m22 - y1;
                    // y = Math.min(Math.max(y, -y1), y2);
                    // console.log(Math.max(x,-(childInfo.x+parentInfo.x)))
                    // x = Math.max(Math.min(x, parentInfo['width'] - childInfo['width'] - self.offsetLeft-(childInfo['width']-self.offsetWidth)/2), - (childInfo.x+parentInfo.x));
                    // y = Math.max(Math.min(y, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
                    break;
                case 'document':
                    break;
                case 'window':
                    break;
            }

            x = (self.options.axis.toLowerCase().indexOf('x') > -1) ? x : 0;
            y = (self.options.axis.toLowerCase().indexOf('y') > -1) ? y : 0;

            // console.log(x,y)
            self.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';
            // translate3d(' + x + ',' + y + ',0)'
            //}
        }
    });
}

NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}
