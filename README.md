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

##### HTML:
```html
<div class="container">
  <div id="drag" class="draggable"></div>
  <div class="draggable"></div>
</div>
```

##### JAVASCRIPT:
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

##### Example:
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

### Methods
Functions for draggable elements:

| Method | Description | 
| --- | --- |
| `getPosition()` | Returns the current position of the element, relative to its parent |
| `setPosition(left, top)` | Sets an element's position, relative to its parent |


* ##### `getPosition()`:
  ```javascript
  
  let element = document.getElementById('drag');
  let position = element.getPosition();
  console.log(position);
  ```

  ###### Example output:
  ```console
  {
    left: {
      pixels: 100
      percentage: 0.125
    },
    top: {
      pixels: 10
      percentage: 0.02
    }
  }
  ```

* ##### `setPosition(left, top)`:
  ```javascript
  
  let element = document.getElementById('drag');
  element.setPosition(100,200); // In pixels
  ```
