const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};

const validatePassword = (password) => {
  if(password.length < 6 || password === ''){
    return false;
  } else {
    return true
  }
}

const isEmpty = (input) => {
  if (input === undefined){
    return true;
  }
  else if (input.replace(/\s/g, '').length) {
    return false;
  } else {
    return true;
  }
}

export { validateEmail, validatePassword, isEmpty };
