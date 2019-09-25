// Heart Curve
// http://mathworld.wolfram.com/HeartCurve.html
class Heart {

  constructor() {

    this.key = "heart";

    this.name = "Heart";

    // Define the parametric equations using text inputs
    this.config = {
      "a": {
        "name": "X cof. a",
        "value": 16,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            16,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "b": {
        "name": "Y cof. b",
        "value": 13,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            13,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "c": {
        "name": "Y cof. c",
        "value": 5,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            5,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "d": {
        "name": "Y cof. d",
        "value": 2,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            2,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "e": {
        "name": "Y cof. e",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            1,
            1
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "scale": {
        "name": "scale",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            1,
            20,
            10,
            0.2
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "shrink": {
        "name": "shrink",
        "value": 1,
        "input": {
          "type": "createSlider",
          "params" : [
            0.0002,
            0.0020,
            0.0003,
            0.0001
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "twist": {
        "name": "Twist",
        "value": 1.0,
        "input": {
          "type": "createSlider",
          "params" : [
            -1,
            1,
            0,
            0.01
          ],
          "class": "slider",
          "displayValue": true
        }
      },
      "reverse": {
        "name": "Reverse",
        "value": 0,
        "input": {
          "type": "createInput",
          "attributes" : [{
            "type" : "checkbox",
            "checked" : null
          }],
          "params": [0, 1, 0],
          "displayValue": false
        }
      }
    };

    this.path = [];
  }

  /**
   * Setup the controls for the pattern.
   *
   * @return Null
   **/
  setup() {

    let controls = new Array();
    const configs = Object.entries(this.config);
    for (const [key, val] of configs) {

      // Create a new object
      var control = new Object();

      // Create the div that contains the control
      control.div = createDiv('<label>' + val.name + '</label>')
        .parent('pattern-controls')
        .addClass('pattern-control');

      // Create the control form input
      // TODO: make this dynamic
      if (val.input.type == "createSlider") {
        control.input = createSlider(val.input.params[0], val.input.params[1], val.input.params[2], val.input.params[3])
          .attribute('name', key)
          .parent(control.div)
          .addClass(val.input.class);
      } else if (val.input.type == "createInput") {
        control.input = createInput(val.input.params[0], val.input.params[1], val.input.params[2])
          .attribute("type", "checkbox")
          .attribute('name', key)
          .attribute('checkbox', null)
          .parent(control.div);
      }

      // Create a span element to display the current input's value (useful for Sliders)
      if (val.input.displayValue) {
        let radius_value = createSpan('0')
          .parent(control.div);
      }

      // Add to "controls" object
      controls.push(control);
    }
  }

  draw() {

    // Update object

    // Read in selected value(s)
    this.config.a.value = document.querySelector('#pattern-controls > div:nth-child(1) > input').value;
    this.config.b.value = document.querySelector('#pattern-controls > div:nth-child(2) > input').value;
    this.config.c.value = document.querySelector('#pattern-controls > div:nth-child(3) > input').value;
    this.config.d.value = document.querySelector('#pattern-controls > div:nth-child(4) > input').value;
    this.config.e.value = document.querySelector('#pattern-controls > div:nth-child(5) > input').value;
    this.config.scale.value = document.querySelector('#pattern-controls > div:nth-child(6) > input').value;
    this.config.shrink.value = document.querySelector('#pattern-controls > div:nth-child(7) > input').value;
    this.config.twist.value = document.querySelector('#pattern-controls > div:nth-child(8) > input').value;

    // Display selected value(s)
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(1) > span').innerHTML = this.config.a.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(2) > span').innerHTML = this.config.b.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(3) > span').innerHTML = this.config.c.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(4) > span').innerHTML = this.config.d.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(5) > span').innerHTML = this.config.e.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(6) > span').innerHTML = this.config.scale.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(7) > span').innerHTML = this.config.shrink.value;
    document.querySelector('#pattern-controls > div.pattern-control:nth-child(8) > span').innerHTML = this.config.twist.value;

    let path = this.calc(
      this.config.a.value,
      this.config.b.value,
      this.config.c.value,
      this.config.d.value,
      this.config.e.value,
      this.config.scale.value,
      this.config.shrink.value,
      this.config.twist.value
    );

    // Reverse the path
    if (document.querySelector('#pattern-controls > div:nth-child(9) > input[type=checkbox]').checked) {
      path.reverse();
    }

    // Update object
    this.path = path;

    return path;
  }

  /**
   * Calculate coordinates for the shape
   *
   * @return Array Path
   **/
  calc(a,b,c,d,e,scale,shrink,twist) {

    // Set initial values
    var x;
    var y;
    var r = 1.0;
    var t = 0.0;

    // Initialize return value - the path array
    // This stores the x,y coordinates for each step
    var path = new Array();

    // Iteration counter.
    var step = 0;

    // The number of "sides" to the circle.
    let steps_per_revolution = 80;

    // Loop through one revolution
    // while (t < 100 * TWO_PI) {
    while (r > 0) {

      // Rotational Angle (steps per rotation in the denominator)
      t = (step/steps_per_revolution) * TWO_PI;

      // Run the parametric equations
      x = r * scale * (a * pow(sin(t), 3));
      y = r * scale * (b * cos(t) - c * cos(2 * t) - d * cos(3 * t) - e * cos(4 * t));

      // Add coordinates to shape array
      path[step] = this.rotationMatrix(x, y, twist * t/steps_per_revolution);

      r -= shrink;

      // Increment iteration counter
      step++;
    }

    return path;
  }

  /**
   * Rotate points x and y by angle theta about center point (0,0)
   * https://en.wikipedia.org/wiki/Rotation_matrix
   **/
  rotationMatrix(x, y, theta) {
      return [
        x * cos(theta) - y * sin(theta),
        x * sin(theta) + y * cos(theta)
      ];
  }

}