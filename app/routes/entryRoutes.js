import {
  getEntry, getEntries, createEntry, updateEntry, deleteEntry,
} from '../controller/entryController';
import checkAuth from '../middleware/checkAuth';

export default function route(app) {
  // const badRequest = { status: 400, message: 'Bad Request' };

  // Get Request for a single entry
  app.get('/api/v1/entries/:id', checkAuth, getEntry);


  // Get request for all entries in the array
  app.get('/api/v1/entries', checkAuth, getEntries);


  // Post Request for an entry
  app.post('/api/v1/entries', checkAuth, createEntry);


  // Put Request to modify the content of an entryRoutes
  app.put('/api/v1/entries/:id', checkAuth, updateEntry);


  // Delete Request to delete an entry
  app.delete('/api/v1/entries/:id', checkAuth, deleteEntry);
}
