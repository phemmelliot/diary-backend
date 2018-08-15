import {
  createUser, logIn, getProfile, updateProfile,
} from '../controller/userController';
import checkAuth from '../middleware/checkAuth';

export default function route(app) {
  app.post('/api/v1/user/signup', createUser);

  app.post('/api/v1/user/login', logIn);

  app.get('/api/v1/user/profile', checkAuth, getProfile);

  app.put('/api/v1/user/profile', checkAuth, updateProfile);
}
