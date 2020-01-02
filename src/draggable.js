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

        //console.log(matrix);
        self.mouseDown = true;
        self.startX = e.pageX - self.offsetLeft;
        self.startY = e.pageY - self.offsetTop;

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

            var styles = window.getComputedStyle(self);
            let cmp = getTransformMatrix(self.parentNode);
            // console.log(Math.asin())


            var xPerc = (e.pageX - self.startX) / self.parentNode.offsetWidth;
            var yPerc = (e.pageY - self.startY) / self.parentNode.offsetHeight;

            switch (self.options.containment) {
                case 'parent':
                    xPerc = Math.min(Math.max(xPerc, 0), (1 - self.offsetWidth / self.parentNode.offsetWidth));
                    yPerc = Math.min(Math.max(yPerc, 0), (1 - self.offsetHeight / self.parentNode.offsetHeight));
                    // console.log(Math.max(x,-(childInfo.x+parentInfo.x)))
                    // x = Math.max(Math.min(x, parentInfo['width'] - childInfo['width'] - self.offsetLeft-(childInfo['width']-self.offsetWidth)/2), - (childInfo.x+parentInfo.x));
                    // y = Math.max(Math.min(y, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
                    break;
                case 'document':
                    break;
                case 'window':
                    break;
            }
            //console.log(xPerc, yPerc)
            // console.log((e.pageX - self.startX),(self.parentNode.offsetWidth-self.offsetWidth));
            self.style.left = 100 * xPerc + '%';
            self.style.top = 100 * yPerc + '%';

            // console.log((e.pageY - self.startY) / self.offsetHeight);
            //     let parentInfo = self.parentNode.getBoundingClientRect(self.parentNode);
            //     let childInfo = self.getBoundingClientRect(self);
            //     let cm = getTransformMatrix(self);
            //     let cmp = getTransformMatrix(self.parentNode);
            //     console.log(cmp);


            //     // console.log(self.offsetLeft,childInfo['left']);
            //     let x = e.pageX - self.startX;

            //     console.log(x);
            //     let y = e.pageY - self.startY;
            //     // console.log('x: '+x);
            //     // console.log(x);

            //     // console.log(self.offsetLeft,childInfo['width'],self.offsetWidth);
            //     // console.log(-);
            //     // console.log(x+childInfo['width'],childInfo['x']);
            //     // console.log(x);//-(childInfo.x+parentInfo.x)
            //     // console.log(childInfo)
            //     // Math.min()

            //     // var torigin = window.getComputedStyle(self).transformOrigin.split(' ').map(function(i){
            //     //     return parseInt(i);
            //     // });




            //     // console.log(cm);
            //     switch (self.options.containment) {
            //         case 'parent':
            //             var x1 = self.offsetLeft - (childInfo['width'] - self.offsetWidth) / 2;
            //             var x2 = parentInfo['width'] - childInfo['width'] - x1;
            //             x = Math.min(Math.max(x, -x1), x2);

            //             var y1 = self.offsetTop - (childInfo['height'] - self.offsetHeight) / 2;
            //             var y2 = parentInfo['height'] - childInfo['height'] - y1;
            //             y = Math.min(Math.max(y, -y1), y2);
            //             // console.log(Math.max(x,-(childInfo.x+parentInfo.x)))
            //             // x = Math.max(Math.min(x, parentInfo['width'] - childInfo['width'] - self.offsetLeft-(childInfo['width']-self.offsetWidth)/2), - (childInfo.x+parentInfo.x));
            //             // y = Math.max(Math.min(y, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
            //             break;
            //         case 'document':
            //             break;
            //         case 'window':
            //             break;
            //     }

            //     x = (self.options.axis.toLowerCase().indexOf('x') > -1) ? x : 0;
            //     y = (self.options.axis.toLowerCase().indexOf('y') > -1) ? y : 0;

            //     // console.log(x,y)
            //     self.style.transform = 'matrix3d(' + cm.m11 + ', ' + cm.m12 + ', ' + cm.m13 + ', ' + cm.m14 + ', ' + cm.m21 + ', ' + cm.m22 + ', ' + cm.m23 + ', ' + cm.m24 + ', ' + cm.m31 + ', ' + cm.m32 + ', ' + cm.m33 + ', ' + cm.m34 + ', ' + x + ', ' + y + ', ' + cm.m43 + ', ' + cm.m44 + ')';
            //     // translate3d(' + x + ',' + y + ',0)'
            // }
        }
    });
}

NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}
