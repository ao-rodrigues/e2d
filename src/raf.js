const raf = (func) => {
  const funcCaller = function() {
    requestAnimationFrame(funcCaller);
    return func();
  };

  requestAnimationFrame(funcCaller);
};

module.exports = raf;