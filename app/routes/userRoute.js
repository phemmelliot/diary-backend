import { createUser, logIn } from '../controller/userController';

export default function route(app) {
  app.post('/api/v1/user/signup', createUser);

  app.post('/api/v1/user/login', logIn);
}
