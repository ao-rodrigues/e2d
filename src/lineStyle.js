import lineCapCall from './lineCap';
import lineDashCall from './lineDash';
import lineDashOffsetCall from './lineDashOffset';
import lineJoinCall from './lineJoin';
import lineWidthCall from './lineWidth';
import miterLimitCall from './miterLimit';

function lineStyle(props, ...children) {
  children = props.lineCap ? lineCapCall(props.lineCap, children) : children;
  children = props.lineDash ? lineDashCall(props.lineDash, children) : children;
  children =
    props.lineDashOffset == null ? children : lineDashOffsetCall(props.lineDashOffset, children);
  children = props.lineJoin ? lineJoinCall(props.lineJoin, children) : children;
  children = props.lineWidth == null ? children : lineWidthCall(props.lineWidth, children);
  return props.miterLimit == null ? children : miterLimitCall(props.miterLimit, children);
}

export default lineStyle;
