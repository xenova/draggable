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
    }
    self.options = Object.assign({}, defaultOptions, o);

    console.log(self.options);
    this.mouseDown = false;

    // console.log(this.parentNode);
    this.style.position = 'absolute';



    this.addEventListener('mousedown', function (e) {
        var matrix = new WebKitCSSMatrix(self.style.webkitTransform);
        // console.log(matrix);

        self.mouseDown = true;
        self.startX = e.pageX - matrix.m41;
        self.startY = e.pageY - matrix.m42;
    });
    document.addEventListener('mouseup', function (e) {
        self.mouseDown = false;
    });

    document.addEventListener('mousemove', function (e) {
        self.mouseDown &= (e.buttons === undefined ? e.which === 1 : e.buttons === 1);
        // console.log(e.pageX,self.startX,(e.pageX-self.startX));
        if (self.mouseDown) {
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

            x =  (self.options.axis.toLowerCase().indexOf('x')>-1) ? (x+'px'):0;
            y =  (self.options.axis.toLowerCase().indexOf('y')>-1) ? (y+'px'):0;
            
            self.style.transform = 'translate3d(' + x + ',' + y + ',0)';
            // console.log('translate3d(' + x + ',' + y + ',0)');
            
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