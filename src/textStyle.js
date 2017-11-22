import fontCall from './font';
import textAlignCall from './textAlign';
import textBaselineCall from './textBaseline';
import directionCall from './direction';

function textStyle(props, ...children) {
  children = props.font ? fontCall(props.font, children) : children;
  children = props.textAlign ? textAlignCall(props.textAlign, children) : children;
  children = props.textBaseline ? textBaselineCall(props.textBaseline, children) : children;
  return props.direction ? directionCall(props.direction, children) : children;
}

export default textStyle;
