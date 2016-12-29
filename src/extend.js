module.exports = (ctx, ...methods) => {
  let extensions = ctx[Symbol.for('extensions')];
  if (!extensions) {
    extensions = ctx[Symbol.for('extensions')] = {};
  }
  methods.forEach(
    (method) => Object.assign(extensions, method)
  );
};