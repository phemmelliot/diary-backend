import route from './entryRoutes';
import secondRoute from './userRoute';

const entryRoutes = route;
const userRoute = secondRoute;

export default function router(app) {
  entryRoutes(app);
  userRoute(app);
  // Other route groups could go here, in the future
}
