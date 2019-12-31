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
        momentum: true,
        refreshTime: 25,
        maxEaseTime: 1,
    }
    self.options = Object.assign({}, defaultOptions, o);

    //self.stationary = null;
    // self.easing = null;
    self.mouseTracking = [];
    self.current = [];
    self.animation = null;
    // console.log(self.options);
    self.mouseDown = false;

    // console.log(this.parentNode);
    self.style.position = 'absolute';


    function getTransformMatrix() {
        return new WebKitCSSMatrix(window.getComputedStyle(self).webkitTransform);
    }

    self.addEventListener('mousedown', function (e) {
        let matrix = getTransformMatrix();
        if(self.animation){
            self.style.transform = 'translate3d('+matrix.m41+'px,'+matrix.m42+'px,0px)';
            self.animation.pause();
            self.animation.cancel();
           
        }
        //;
        // self.style.transition = '';
        
        //console.log(self.style.transform);

        self.mouseDown = true;
        self.startX = e.pageX - matrix.m41;
        self.startY = e.pageY - matrix.m42;

        self.current = [e.pageX, e.pageY];
        self.mouseTracking = [self.current, self.current];
        // console.log("START" + self.mouseTracking);
    });


    function conformToBounds(translateObject) {
        let parentInfo = self.parentNode.getBoundingClientRect();
        let childInfo = self.getBoundingClientRect();

        let translateX = translateObject.x;
        let translateY = translateObject.y;
        switch (self.options.containment) {
            case 'parent':
                translateObject.x = Math.max(Math.min(translateX, parentInfo['width'] - childInfo['width'] - self.offsetLeft), - self.offsetLeft);
                translateObject.y = Math.max(Math.min(translateY, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
                break;
            case 'document':
                break;
            case 'window':
                break;
        }
        // var z = Math.abs(translateX - translateObject.x) > 1e-2 || Math.abs(translateY - translateObject.y) > 1e-2;
        // if (z) {
        //     // console.log(translateX,translateObject.x,translateY,translateObject.y);
        // }
        // return z;

        // ; translateX !== translateObject.x || translateY !== translateObject.y;
    }
    
    document.addEventListener('mouseup', function (e) {
        if (self.mouseDown) {
            //console.log('start');
            // , offset: 0.7
            // https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats
            // https://developer.mozilla.org/en-US/docs/Web/API/Element/animate



            let deltaX = (self.mouseTracking[1][0] - self.mouseTracking[0][0]);
            let deltaY = (self.mouseTracking[1][1] - self.mouseTracking[0][1]);


            let totalX = 1200;
            let totalY = 900;
            console.log(deltaX,deltaY)
            let matrix = getTransformMatrix();
            // console.log(matrix.m41 + 'px,' + matrix.m42);



            let parentInfo = self.parentNode.getBoundingClientRect();
            let childInfo = self.getBoundingClientRect();
    
            let translateX = totalX;
            let translateY = totalY;
            switch (self.options.containment) {
                case 'parent':
                    translateX = Math.max(Math.min(translateX, parentInfo['width'] - childInfo['width'] - self.offsetLeft), - self.offsetLeft);
                    translateY = Math.max(Math.min(translateY, parentInfo['height'] - childInfo['height'] - self.offsetTop), - self.offsetTop);
                    break;
                case 'document':
                    break;
                case 'window':
                    break;
            }

            var offset = [0, translateX/totalX, translateY/totalY, 1].sort();
            console.log(offset)

            var trans = ['translate3d(' + matrix.m41 + 'px,' + matrix.m42 + 'px,0)', 'translate3d('+translateX+'px,'+translateY+'px,0)', 'translate3d('+translateX+'px,350px,0)', 'translate3d('+translateX+'px,150px,0)'];
            console.log(trans)
            //console.log(totalX,totalY,translateX,translateY);
            self.animation = self.animate({
                transform: trans,
                offset: offset, // Shorthand for [ 0, 0.8, 1 ]
                // easing: [ 'ease-in', 'ease-out' ],
            }, {
                duration: 1000,
                fill: 'both', //keep ?
                // easing: 'cubic-bezier(0.165, 0.84, 0.44, 1)'
            });











            // console.log(getTransformMatrix().m41);
            // setTimeout(function () {
                
            //     console.log(getTransformMatrix().m41);
            // }, 2000);

            //console.log(getTransformMatrix());
            // .animate([
            //     // keyframes
            //     { transform: 'translateY(0px)' }, 
            //     { transform: 'translateY(-300px)' }
            //   ], { 
            //     // timing options
            //     duration: 1000,
            //     iterations: Infinity
            //   });
            // setTimeout(function () {
            //     //x.pause();
            //      x.cancel();
            // },2000);
            // console.log(self);
            // let duration = 4000;
            // self.style.transition = 'transform '+duration+'ms cubic-bezier(0.165, 0.84, 0.44, 1)';
            // self.style.transform = 'translate3d(' + (200) + 'px,' + (700) + 'px,0)';
            // //let matrix = new WebKitCSSMatrix(self.style.webkitTransform);

            // // console.log(new WebKitCSSMatrix(.webkitTransform));
            // console.log(getTransformMatrix());


            // let refreshTime = 4;
            // let counter = 0;
            // let matrix = null;
            // let apple = {
            //     x:0,
            //     y:0,
            // }
            // var i = setInterval(() => {
            //     matrix = getTransformMatrix();
            //     // // console.log(counter);
            //     apple.x = matrix.m41;
            //     apple.y = matrix.m42;

            //     // console.log(apple);
            //     if(conformToBounds(apple)){
            //         console.log(apple);
            //         // console.log((duration-counter));
            //         self.style.transition = 'transform '+(duration-counter)+'ms cubic-bezier(0.165, 0.84, 0.44, 1)';
            //         self.style.transform = 'translate3d(' + (apple.x) + 'px,' + (apple.y) + 'px,0)';
            //     };
            //     // translate(155, 4422);

            //     if (counter >= duration) {
            //         clearInterval(i);
            //     }
            //     counter += refreshTime;
            // }, refreshTime);

            // setTimeout(() => {
            //     console.log(getTransformMatrix());
            //     self.style.transform = 'translate3d(' + (0) + 'px,' + (200) + 'px,0)';
            // }, 2500);
            //     console.log(self.mouseTracking);
            //     let deltaX = (self.mouseTracking[1][0] - self.mouseTracking[0][0]);
            //     let deltaY = (self.mouseTracking[1][1] - self.mouseTracking[0][1]);
            //     let angle = Math.atan2(-deltaY, deltaX);

            //     // 
            //    // let speed = 1;//1000 * Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / self.options.refreshTime;

            //     let speedX = deltaX; //pixels per second
            //     let speedY = deltaY;
            //     console.log(speedX,speedY);
            //     // console.log();

            //     var counter = 0;

            //     var duration = 1500;//((-1) / ((speed / 1920) + 1) + 1) * 1000;
            //     console.log("DURATION: " + duration);

            //     var cubicBezier = [0.165, 0.84, 0.44, 1];// = new CubicBezier(0.165, 0.84, 0.44, 1);
            //     // var gradientAt0 =0.165/0.84;


            //     //console.log("SPEED: " + speed);
            //     // console.log("gradientAt0: " +gradientAt0);

            //     let matrix = getTransformMatrix();





            /////////////////////////////////
            //console.log(matrix);
            // var finalPixelsToGo = duration/1000;
            // self.style.transition = 'transform 1.5s cubic-bezier('+cubicBezier.join(', ')+')';
            // self.style.transform = 'translate3d(' + (speedX*finalPixelsToGo*1+matrix.m41) + 'px,' + (speedY*finalPixelsToGo*1+matrix.m42) + 'px,0)';

            // setTimeout(function(){

            // },1000);
            // var x = setInterval(function () {
            //     var percentage = counter / duration;
            //     //console.log(cubic(percentage));
            //     
            //     self.style.transform = 'translate3d(' + (speedX*finalPixelsToGo*cubic(percentage)+matrix.m41) + 'px,' + (speedY*finalPixelsToGo*cubic(percentage)+matrix.m42) + 'px,0)';




            //     counter += self.options.refreshTime;
            //     if (counter > duration) {
            //         clearInterval(x);
            //     }
            //     // var app = (cubic(counter / duration))*speed/self.options.refreshTime;
            //     // 
            //     // console.log(counter / duration, app);
            //     // if ( <= duration) {

            //     // } else {
            //     //     clearInterval(x);
            //     // }
            //     // setTimeout(function(){console.log('done')},1000);
            // }, self.options.refreshTime);

            // self.mouseTracking = [];
        }
        self.mouseDown = false;
    });

    setInterval(function () {
        if (self.mouseDown) {
            self.mouseTracking.push(self.current);
            //console.log(self.current);
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

            //var zzz = 'translate3d(50px, 50px,0)';
            self.style.transform = 'translate3d(' + x + ',' + y + ',0)';
            // self.style.webkitTransform = zzz;
            // self.style.msTransform = zzz;
            // console.log(self.style.transform);
            // console.log('translate3d(' + x + ',' + y + ',0)');
            // console.log(e.pageX, e.pageY);
        }

    });
    // console.log(this);
    // this.innerHTML = 'aaa';
    // ;


    function translate(x, y) {


    }
}




// var t0 = performance.now();

// for(var i = -1000;i<=5000;i++){
//     x(i/1000);
//     // console.log();
// }
// var t1 = performance.now();
// console.log("Call  took " + (t1 - t0) + " milliseconds.");


NodeList.prototype.DraggableJS = function (n) {
    this.forEach((i) => i.DraggableJS(n));
}


// function(i){
//     console.log(i.constructor.name);
//     i.DraggableJS();
// }
// console.log(Element);