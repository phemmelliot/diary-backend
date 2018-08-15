# Andela-Developer-Challenge - My Diary

![Homepage](screenshots/home.png)

> My diary is a webapp where users can input there thoughts, anytime, anywhere

[![Build Status](https://travis-ci.com/phemmelliot/Andela-Developer-Challenge.svg?branch=api)](https://travis-ci.com/phemmelliot/Andela-Developer-Challenge)
[![Coverage Status](https://coveralls.io/repos/github/phemmelliot/Andela-Developer-Challenge/badge.svg?branch=bug-fix-travis-coveralls)](https://coveralls.io/github/phemmelliot/Andela-Developer-Challenge?branch=bug-fix-travis-coveralls)
 [![Maintainability](https://api.codeclimate.com/v1/badges/5e357b8a94abb3859ec7/maintainability)](https://codeclimate.com/github/phemmelliot/Andela-Developer-Challenge/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/5e357b8a94abb3859ec7/test_coverage)](https://codeclimate.com/github/phemmelliot/Andela-Developer-Challenge/test_coverage)
![Issues](https://img.shields.io/github/issues/phemmelliot/Andela-Developer-Challenge.svg)
![forks](https://img.shields.io/github/forks/phemmelliot/Andela-Developer-Challenge.svg)
![shields](https://img.shields.io/github/stars/phemmelliot/Andela-Developer-Challenge.svg)

***Feel the User Experience***
![Screencast](screenshots/Screengif.gif)


## Table of Contents (Optional)

- [Usage](#usage)
- [Features](#features)
- [Contributing](#contributing)
- [Team](#team)
- [Testing](#testing)
- [License](#license)


## Usage

### Developers
- For developers seeking to use it as a backend infrastructure use this url as your base url https://phemmelliotdiary.herokuapp.com/v1 and then follow the description in [Usage](#usage) below to get started on how to implement the api endpoints in your app.    

### Other users
   Simply visit this https://phemmelliot.github.io/Andela-Developer-Challenge/UI/index.html to get started on using the services provided on the website.


## Features
  Add to Base URL above
- To create new entry use `POST /entries`, a successful response will be
     ```javascript
      { status: '200', message: 'Entry Uploaded Successfully' }
     ```
     and an unsuccessful response will be
     ```javascript
     { status: 400, message: 'Bad Request', description: 'Body or title cannot be empty' }
     ```
- To Update an entry use `PUT /entries/id`, where id is the id of entry to be updated, a successful response will be
     ```javascript
     { status: '200', message: 'Entry Modified Successfully' }
     ```
     and an unsuccessful response will be
     ```javascript
     { status: 400, message: 'Bad Request' }
     ```
- To get all entries use `GET /entries`
     a sample successful response will be
     ```javascript
     { entries: [], size: 0 }
     ```
     and an unsuccessful response will be
     ```javascript
     { status: 400, message: 'Bad Request' }
     ```
- To get one entry use `GET /entries/id`
     a sample successful response will be
     ```javascript
     { title: 'Here is the title', text: 'Here is content of an entry' }
     ```
     and an unsuccessful response will be
     ```javascript
     { status: 400, message: 'Bad Request', description: 'Entry does not exist' }
     ```
- To delete an entry use `DELETE /entries/id`
     a successful response will be
     ```javascript
     { status: '200', message: 'Entry Deleted Successfully' }
     ```
     and an unsuccessful response will be
     ```javascript
     { status: 400, message: 'Bad Request', description: 'Entry does not exist' }
     ```


## Contributing
    I would love to hear from anyone willing to contribute

## Team
   For now i am the only working on this, but what i am learning to build here i am
   learning it with some awesome folks facilitated by another awesome folk.
## Testing
   If you want naive test, you can just use `postman` to test, but real test, clone the repository, open terminal in root and do the following on terminal
   ```shell
   $ npm install
   ```
      Followed by

  ```shell
  $ npm test
  ```
## License
  None for now.
