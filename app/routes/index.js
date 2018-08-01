import route from './entry_routes';

const entryRoutes = route;

export default function router(app) {
  entryRoutes(app);
  // Other route groups could go here, in the future
}
