module.exports = function router(app, array) {
  // Get Request for a single entry
  app.get('/entries/:id', (req, res) => {
    const entry = array[req.params.id];
    res.send(entry);
  });
  // Get request for all entries in the array
  app.get('/entries', (req, res) => {
    const db = { entries: array, size: array.length };
    res.send(db);
  });
  // Post Request for an entry
  app.post('/entries', (req, res) => {
    const entry = { text: req.body.body, title: req.body.title };
    const reply = { status: '200', message: 'Entry Uploaded Successfully' };
    array.push(entry);
    res.send(reply);
  });
  // Put Request to modify the content of an entryRoutes
  app.put('/entries/:id', (req, res) => {
    const entry = { text: req.body.body, title: req.body.title };
    array.splice(req.params.id, 1, entry);
    const reply = { status: '200', message: 'Entry Uploaded Successfully' };
    res.send(reply);
  });
  // Delete Request to delete an entry
  app.delete('/entries/:id', (req, res) => {
    array.splice(req.params.id, 1);
    const reply = { status: '200', message: 'Entry Deleted Successfully' };
    res.send(reply);
  });
};
