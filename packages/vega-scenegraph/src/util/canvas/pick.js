import {reverse} from '../iterate';

var trueFunc = function() { return true; };

export function pick(test) {
  if (!test) test = trueFunc;

  return function(context, scene, x, y, gx, gy) {
    var items = scene.items,
        retval = null;
    if (!items.length) return retval;

    if (context.pixelRatio > 1) {
      x *= context.pixelRatio;
      y *= context.pixelRatio;
    }

    reverse(items, function(item) {
      var b = item.bounds;
      // first hit test against bounding box
      if ((b && !b.contains(gx, gy)) || !b) return;
      // if in bounding box, perform more careful test
      if (test(context, item, x, y, gx, gy)) return retval = item, 1;
    });

    return retval;
  };
}

export function hitPath(path, filled) {
  return function(context, o, x, y) {
    var item = Array.isArray(o) ? o[0] : o,
        fill = (filled == null) ? item.fill : filled,
        stroke = item.stroke && context.isPointInStroke, lw, lc;

    if (stroke) {
      lw = item.strokeWidth;
      lc = item.strokeCap;
      context.lineWidth = lw != null ? lw : 1;
      context.lineCap   = lc != null ? lc : 'butt';
    }

    return path(context, o) ? false :
      (fill && context.isPointInPath(x, y)) ||
      (stroke && context.isPointInStroke(x, y));
  };
}

export function pickPath(path) {
  return pick(hitPath(path));
}
