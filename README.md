# Draggable
A lightweight JavaScript framework for creating draggable HTML elements - using CSS Transform!

## Getting Started
### Linking to the script
Add a reference to the script by either linking to https://xenova.github.io/Draggable/dist/draggable.min.js, or by downloading the script and using it offline.

```html
<!-- Include using github -->
<script src="https://xenova.github.io/Draggable/dist/draggable.min.js"></script>

<!-- Download and include locally (use your path) -->
<script src="assets/draggable.min.js"></script>
```

### Usage
Select an element (or elements) and run the `DraggableJS()` function on it.
```javascript
// On a single element
document.getElementById('drag').DraggableJS();

// On multiple elements
document.querySelectorAll('.draggable').DraggableJS();
```

### Options
Apply options by passing in an array of zero or more of the following key-value pairs:

| Option | Description | Allowed values | Default | 
| --- | --- | --- | --- |
| `axis` | Specifies which axis/axes the element will be fixed to | `'x'`, `'y'`, `'xy'` | `axis: 'xy'` |
| `start` | Specifies the function to be called when the drag event starts | Any function | `function(){}` |
| `drag` | Specifies the function to be called when the item is being dragged | Any function | `function(){}` |
| `end` | Specifies the function to be called when the drag event ends | Any function | `function(){}` |

Code example:
```javascript
let options = {
  axis: 'xy',
  start: function(){
    console.log('Drag started');
  },  
  drag: function(){
    console.log('Drag in progress');
  },
  end: function(){
    console.log('Drag ended');
  },
};
document.querySelectorAll('.draggable').DraggableJS(options);

```
