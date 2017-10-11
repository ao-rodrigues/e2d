
import lineCapCall from "./lineCap";
import lineDashCall from "./lineDash";
import lineDashOffsetCall from "./lineDashOffset";
import lineJoinCall from "./lineJoin";
import lineWidthCall from "./lineWidth";
import miterLimitCall from "./miterLimit";

const lineStyle = ( {
  lineCap,
  lineDash,
  lineDashOffset,
  lineJoin,
  lineWidth,
  miterLimit
}, ...children ) => {
  children = lineCap ? lineCapCall( children ) : children;
  children = lineDash ? lineDashCall( children ) : children;
  children = lineDashOffset == null ? children : lineDashOffsetCall( children );
  children = lineJoin ? lineJoinCall( children ) : children;
  children = lineWidth == null ? children : lineWidthCall( children );
  return miterLimit == null ? children : miterLimitCall( children );
};

export default lineStyle;
