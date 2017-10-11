const raf = ( func ) => {
  const funcCaller = function() {
    requestAnimationFrame( funcCaller );
    return func();
  };

  requestAnimationFrame( funcCaller );
};
export default raf;
