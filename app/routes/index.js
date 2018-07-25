import route from './entry_routes';

const entryRoutes = route;

export default function router(app, array) {
  entryRoutes(app, array);
  // Other route groups could go here, in the future
}
