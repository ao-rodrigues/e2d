import shadowBlurCall from "./shadowBlur";
import shadowColorCall from "./shadowColor";
import shadowOffsetXCall from "./shadowOffsetX";
import shadowOffsetYCall from "./shadowOffsetY";

const shadowStyle = (
  { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY },
  ...children
) => {
  children = shadowBlur ? shadowBlurCall(children) : children;
  children = shadowColor ? shadowColorCall(children) : children;
  children = shadowOffsetX ? shadowOffsetXCall(children) : children;
  return shadowOffsetY ? shadowOffsetYCall(children) : children;
};

export default shadowStyle;
