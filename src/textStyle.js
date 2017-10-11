import fontCall from "./font";
import textAlignCall from "./textAlign";
import textBaselineCall from "./textBaseline";
import directionCall from "./direction";

const textStyle = ( { font, textAlign, textBaseline, direction }, ...children ) => {
  children = font ? fontCall( children ) : children;
  children = textAlign ? textAlignCall( children ) : children;
  children = textBaseline ? textBaselineCall( children ) : children;
  return direction ? directionCall( children ) : children;
};

export default textStyle;
