let raf = (func) => {
  let funcCaller = function() {
    requestAnimationFrame(funcCaller);
    func();
  };

  requestAnimationFrame(funcCaller);
};

module.exports = raf;