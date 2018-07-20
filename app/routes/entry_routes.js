module.exports = function router(app, array) {
  const badRequest = { status: 300, message: 'Bad Request' };
  // const serverError = { status: 500, message: 'Internal Server Error' };
  // Get Request for a single entry
  app.get('/v1/entries/:id', (req, res) => {
    const entry = array[req.params.id];
    // res.status(200).send(entry);
    if (req.params.id > array.length - 1) {
      badRequest.description = 'Entry does not exist';
      res.status(300).send(badRequest);
    } else {
      res.status(200).send(entry);
    }
    // res.status(300).send(badRequest);
    // res.status(500).send(serverError);
  });
  // Get request for all entries in the array
  app.get('/v1/entries', (req, res) => {
    const db = { entries: array, size: array.length };
    res.status(200).send(db);
    // res.status(300).send(badRequest);
    // res.status(500).send(serverError);
  });
  // Show welcome message
  app.get('/v1', (req, res) => {
    // const message = { entries: array, size: array.length };
    res.status(200).send('Welcome to mydiary api, for get all entries put /entries, for get one entry put /entries/id, for delete put /entries/id, for update put /entries/id, for post put /entries ');
    // res.status(300).send(badRequest);
    // res.status(500).send(serverError);
  });
  // Post Request for an entry
  app.post('/v1/entries', (req, res) => {
    const entry = { text: req.body.body, title: req.body.title };
    const reply = { status: '200', message: 'Entry Uploaded Successfully' };
    array.push(entry);
    if (req.body.body == null || req.body.title == null) {
      badRequest.description = 'Body or title cannot be empty';
      res.status(300).send(badRequest);
    } else {
      res.status(200).send(reply);
      // res.status(300).send(badRequest);
      // res.status(500).send(serverError);
    }
  });
  // Put Request to modify the content of an entryRoutes
  app.put('/v1/entries/:id', (req, res) => {
    const entry = { text: req.body.body, title: req.body.title };
    array.splice(req.params.id, 1, entry);
    const reply = { status: '200', message: 'Entry Modified Successfully' };
    res.status(200).send(reply);
    // res.status(300).send(badRequest);
    // res.status(500).send(serverError);
  });
  // Delete Request to delete an entry
  app.delete('/v1/entries/:id', (req, res) => {
    // badRequest.description = 'Entry does not exist';
    if (array.length - 1 >= req.params.id) {
      array.splice(req.params.id, 1);
      const reply = { status: '200', message: 'Entry Deleted Successfully' };
      if (req.params.id > array.length - 1 || req.params.id < 0) {
        badRequest.description = 'Entry does not exist';
        res.status(300).send(badRequest);
      } else {
        res.status(200).send(reply);
      }
    } else {
      res.status(300).send(badRequest);
    }

    // if (res.statusCode === 200) {
    //   res.status(200).send(reply);
    // } else if (res.statusCode === 300) {
    //   res.status(300).send(badRequest);
    // } else if (res.statusCode === 500) {
    //   res.status(500).send(serverError);
    // }
  });
};
