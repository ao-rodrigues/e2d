const extend = (ctx, ...methods) => {
  const extensions = ctx[Symbol.for('extensions')] || (ctx[Symbol.for('extensions')] = {});
  Object.assign(extensions, ...methods);
};

export default extend;