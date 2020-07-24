# Draggable
A lightweight JavaScript framework for creating draggable HTML elements - using CSS Transform!

## Getting Started
### Linking to the script
Add a reference to the script by either linking to https://xenova.github.io/draggable/dist/draggable.min.js, or by downloading the [script](dist/draggable.min.js) and using it offline.

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
| `axis` | Specifies which axis/axes the element will be fixed to | `'x'`, `'y'`, `'xy'` | `'xy'` |
| `init` | Called when `DraggableJS()` is run on an element  | Any function | `function(e){}` |
| `start` | Specifies the function to be called when the drag event starts | Any function | `function(e){}` |
| `drag` | Specifies the function to be called when the item is being dragged | Any function | `function(e){}` |
| `end` | Specifies the function to be called when the drag event ends | Any function | `function(e){}` |
| `grid` | Specifies whether a grid is to be used (snapping to grid) | An object with the required values: <br> `rows: [int], columns: [int], dragEndSnap: [boolean], dragSnap: [boolean],`  | `false` |

##### Example:
```javascript
let options = {
  axis: 'xy',
  init: function(e){
    console.log('.DraggableJS() called');
  },  
  start: function(e){
    console.log('Drag started');
  },  
  drag: function(e){
    console.log('Drag in progress');
  },
  end: function(e){
    console.log('Drag ended');
  },
  grid:{
    rows: 4,
    columns: 5,
    dragEndSnap: true,
    dragSnap: false
  }
};
document.querySelectorAll('.draggable').DraggableJS(options);

```

### Methods
Functions for draggable elements:

| Method | Description | 
| --- | --- |
| `getPosition()` | Returns the current position of the element, relative to its parent |
| `setPosition(left, top)` | Sets an element's position in pixels, relative to its parent |
| `setGridPosition(row, col)` | Sets an element's grid position, when `grid` is enabled |


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
  
* ##### `setGridPosition(row, col)`:
  ```javascript
  let element = document.getElementById('drag');
  element.setGridPosition(3, 4);
  ```
  
## Examples
1. Default Settings [View](https://codepen.io/xenova/full/MWYOMZB)
2. Axis Lock [View](https://codepen.io/xenova/full/MWYQjXL)
3. Events [View](https://codepen.io/xenova/full/oNgEzaL)
4. Methods [View](https://codepen.io/xenova/full/zYxRKbY)
5. Full Example (Chess) [View](https://codepen.io/xenova/full/PowQbPe). (No Game Logic)

Click "View" to view a demo. (Change view to "Editor View" to view source code)
