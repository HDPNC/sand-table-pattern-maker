/**
 * Calculate coordinates for a Spiral
 *
 * @param float start_x Starting X position (in G-code coordinates)
 * @param float start_y Starting Y position (in G-code coordinates)
 * @param float start_r Starting radius, where 0 is [x,y]
 * @param float start_theta Starting theta angle, between 0 and TWO_PI.
 *   0-degrees corresponds to the positive X direction and rotates counter clockwise
 *   (i.e. PI/2 is the positive y direction)
 * @param float offset This is the distance between successive loops of the spiral
 * @param integer sides This determines how many sides the spiral has. For example,
 *   if sides equals 4 then for every iteration of "step", theta will be incremented
 *   by 1/4 of 360 degrees, resulting in for samples per 360 degrees. Must be greater
 *   than 3. 
 * @param float twist This is a multiplication factor for theta that modifies the
 *   angle every iteration, resulting in a "twisting" effect on the spiral
 *
 **/
function calcSpiral(start_x, start_y, start_r, start_theta, offset, sides, twist) {

  // Set initial values
  var x;
  var y;
  var r = start_r;
  var theta = start_theta; 

  // Calculate the maximum radius
  var max_r = min(max_x/2, max_y/2);
  
  // Initialize shape path array
  // This stores the x,y coordinates for each step
  var path = new Array();

  // Iteration counter.
  var step = 0;

  // Continue as long as the design stays within bounds of the plotter
  // This isn't quite right yet. I need to look into the coordinate translations
  // while (r < max_r && x > width/2-max_x/2 && x < width/2+max_x/2 && y > height/2-max_y/2 && y < height/2-max_y/2) {
  while (r < max_r) {

     // Rotational Angle (steps per rotation in the denominator)
    theta = start_theta + (step/sides) * TWO_PI;

    // Increment radius
    r = start_r + offset * (theta/TWO_PI);

    // Convert polar position to rectangular coordinates
    x = start_x + (r * cos(theta * twist));
    y = start_y + (r * sin(theta * twist));

    // Add coordinates to shape array
    path[step] = [x,y];

    // Calculate total distance traveled
    if (step > 0) {
      distance += sqrt(pow(x - path[step-1][0], 2) + pow(y - path[step-1][1], 2));
    }

    // Increment iteration counter
    step++;
  }
  
  return path; 
}
