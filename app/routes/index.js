const entryRoutes = require('./entry_routes');

module.exports = function router(app, array) {
  entryRoutes(app, array);
  // Other route groups could go here, in the future
};
