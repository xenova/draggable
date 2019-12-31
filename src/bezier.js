function CubicBezier(x1, y1, x2, y2) {
  x1 = Math.min(Math.max(0, x1), 1);
  x2 = Math.min(Math.max(0, x2), 1);
  function solveCubic(a, b, c, d) {
    if (Math.abs(a) < 1e-8) { // Quadratic case, ax^2+bx+c=0
      a = b; b = c; c = d;
      if (Math.abs(a) < 1e-8) { // Linear case, ax+b=0
        a = b; b = c;
        if (Math.abs(a) < 1e-8) // Degenerate case
          return [];
        return [-b / a];
      }

      var D = b * b - 4 * a * c;
      if (Math.abs(D) < 1e-8)
        return [-b / (2 * a)];
      else if (D > 0)
        return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
      return [];
    }

    // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
    var p = (3 * a * c - b * b) / (3 * a * a);
    var q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
    var roots;

    if (Math.abs(p) < 1e-8) { // p = 0 -> t^3 = -q -> t = -q^1/3
      roots = [Math.cbrt(-q)];
    } else if (Math.abs(q) < 1e-8) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
      roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
    } else {
      var D = q * q / 4 + p * p * p / 27;
      if (Math.abs(D) < 1e-8) {       // D = 0 -> two roots
        roots = [-1.5 * q / p, 3 * q / p];
      } else if (D > 0) {             // Only one real root
        var u = Math.cbrt(-q / 2 - Math.sqrt(D));
        roots = [u - p / (3 * u)];
      } else {                        // D < 0, three roots, but needs to use complex numbers/trigonometric solution
        var u = 2 * Math.sqrt(-p / 3);
        var t = Math.acos(3 * q / p / u) / 3;  // D < 0 implies p < 0 and acos argument in [-1..1]
        var k = 2 * Math.PI / 3;
        roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
      }
    }

    // Convert back from depressed cubic
    for (var i = 0; i < roots.length; i++)
      roots[i] -= b / (3 * a);

    return roots;
  }
  return function (i) {
    i = Math.min(Math.max(0, i), 1);
    var n = solveCubic(1 + 3 * x1 - 3 * x2, 3 * x2 - 6 * x1, 3 * x1, -i).filter(function (i) {
      return i >= (0 - 1e-8) && i <= (1 + 1e-8); //get root between 0 and 1
    })[0] || 0;
    return Math.min(Math.max(0, (3 * n * Math.pow(1 - n, 2) * y1) + (3 * Math.pow(n, 2) * (1 - n) * y2) + (Math.pow(n, 3))), 1);
  };
}
