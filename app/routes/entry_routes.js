export default function route(app, entries) {
  const badRequest = { status: 400, message: 'Bad Request' };
  // Get Request for a single entry
  app.get('/v1/entries/:id', (req, res) => {
    const entry = entries[req.params.id];
    if (entry === undefined || entry === null) {
      badRequest.description = 'Entry does not exist';
      res.status(400).send(badRequest);
    } else {
      res.status(200).send(entry);
    }
  });
  // Get request for all entries in the array
  app.get('/v1/entries', (req, res) => {
    const db = { entries, size: entries.length };
    res.status(200).send(db);
  });
  // Show welcome message
  app.get('/v1', (req, res) => {
    res.status(200).send('Welcome to mydiary api, for get all entries put /entries, for get one entry put /entries/id, for delete put /entries/id, for update put /entries/id, for post put /entries ');
  });
  // Post Request for an entry
  app.post('/v1/entries', (req, res) => {
    const entry = { title: req.body.title, text: req.body.text };
    const reply = { status: '200', message: 'Entry Uploaded Successfully' };
    if (req.body.text == null || req.body.title == null) {
      badRequest.description = 'Body or title cannot be empty';
      res.status(400).send(badRequest);
    } else {
      entries.push(entry);
      res.status(200).send(reply);
    }
  });
  // Put Request to modify the content of an entryRoutes
  app.put('/v1/entries/:id', (req, res) => {
    const entry = { text: req.body.body, title: req.body.title };
    entries.splice(req.params.id, 1, entry);
    const reply = { status: '200', message: 'Entry Modified Successfully' };
    res.status(200).send(reply);
  });
  // Delete Request to delete an entry
  app.delete('/v1/entries/:id', (req, res) => {
    if (entries[req.params.id] != null) {
      const reply = { status: '200', message: 'Entry Deleted Successfully' };
      if (entries[req.params.id] == null || entries[req.params.id] === undefined) {
        badRequest.description = 'Entry does not exist';
        res.status(400).send(badRequest);
      } else {
        entries.splice(req.params.id, 1);
        res.status(200).send(reply);
      }
    } else {
      res.status(400).send(badRequest);
    }
  });
}
