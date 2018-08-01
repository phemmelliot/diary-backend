import {
  getEntry, getEntries, createEntry, updateEntry, deleteEntry,
} from '../controller/entryController';

export default function route(app) {
  // const badRequest = { status: 400, message: 'Bad Request' };

  // Get Request for a single entry
  app.get('/v1/entries/:id', getEntry);


  // Get request for all entries in the array
  app.get('/v1/entries', getEntries);


  // Show welcome message
  app.get('/v1', (req, res) => {
    res.status(200).send('Welcome to mydiary api, for get all entries put /entries, for get one entry put /entries/id, for delete put /entries/id, for update put /entries/id, for post put /entries ');
  });


  // Post Request for an entry
  app.post('/v1/entries', createEntry);


  // Put Request to modify the content of an entryRoutes
  app.put('/v1/entries/:id', updateEntry);


  // Delete Request to delete an entry
  app.delete('/v1/entries/:id', deleteEntry);
}
