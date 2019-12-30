// Element.prototype.apple = function(n){
//     console.log(this);
//     console.log(n);
// }

Element.prototype.DraggableJS = function (o) {
    const self = this;


    //default options
    const defaultOptions = {
        containment: 'none', //parent, none
        axis: 'xy', //x, y, xy
        momentum: true,
        refreshTime: 25,
        maxEaseTime: 1,
    }
    self.options = Object.assign({}, defaultOptions, o);

    self.stationary = null;
    // self.easing = null;
    self.mouseTracking = [];
    self.current = [];
    console.log(self.options);
    self.mouseDown = false;

    // console.log(this.parentNode);
    self.style.position = 'absolute';



    self.addEventListener('mousedown', function (e) {
        var matrix = new WebKitCSSMatrix(self.style.webkitTransform);
        // console.log(matrix);

        self.mouseDown = true;
        self.startX = e.pageX - matrix.m41;
        self.startY = e.pageY - matrix.m42;

        self.mouseTracking = [[e.pageX, e.pageY], [e.pageX, e.pageY]];
        console.log(self.mouseTracking);
    });
    document.addEventListener('mouseup', function (e) {
        if (self.mouseDown) {
            let deltaX = (self.mouseTracking[1][0] - self.mouseTracking[0][0]);
            let deltaY = (self.mouseTracking[1][1] - self.mouseTracking[0][1]);


            let speed = 1000 * Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / self.options.refreshTime;

            // console.log(speed + ' pixels per second');
            // console.log(Math.atan2(-deltaY, deltaX));

            var counter = 0;

            var duration = ((-1) / ((speed / 1920) + 1) + 1)*1000;
            console.log("DURATION: " + duration)
            var x = setInterval(function () {
                if ((counter += self.options.refreshTime) <= duration) {
                    console.log(counter);
                } else {
                    clearInterval(x);
                }
            }, self.options.refreshTime);

            self.mouseTracking = [];
        }
        self.mouseDown = false;
    });

    setInterval(function () {
        if (self.mouseDown) {
            self.mouseTracking.push(self.current);
            self.mouseTracking.shift();
        }
    }, self.options.refreshTime);
    //per 25ms
    document.addEventListener('mousemove', function (e) {
        self.mouseDown &= (e.buttons === undefined ? e.which === 1 : e.buttons === 1);


        if (self.mouseDown) {
            self.current = [e.pageX, e.pageY];
            // self.mouseTracking.push([e.pageX, e.pageY]);
            // self.mouseTracking.shift();

            // clearTimeout(self.stationary);
            // self.stationary = setTimeout(function () {
            //     self.mouseTracking.push(self.mouseTracking[1]);
            //     self.mouseTracking.shift();
            // }, 100);


            let parentInfo = self.parentNode.getBoundingClientRect();
            let childInfo = self.getBoundingClientRect();

            // console.log(childInfo);
            let x = e.pageX - self.startX;
            let y = e.pageY - self.startY;
            switch (self.options.containment) {
                case 'parent':
                    x = Math.max(Math.min(x, parentInfo['width'] - childInfo['width'] - self.offsetLeft), - self.offsetLeft);
                    y = Math.max(Math.min(y, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
                    break;
                case 'document':
                    break;
                case 'window':
                    break;
            }

            x = (self.options.axis.toLowerCase().indexOf('x') > -1) ? (x + 'px') : 0;
            y = (self.options.axis.toLowerCase().indexOf('y') > -1) ? (y + 'px') : 0;

            self.style.transform = 'translate3d(' + x + ',' + y + ',0)';
            // console.log('translate3d(' + x + ',' + y + ',0)');
            // console.log(e.pageX, e.pageY);
        }

    });
    // console.log(this);
    // this.innerHTML = 'aaa';
    // ;
}



NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}


// function(i){
//     console.log(i.constructor.name);
//     i.DraggableJS();
// }
// console.log(Element);