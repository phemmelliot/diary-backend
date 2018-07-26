window.onscroll = function () { myFunction(); };

const header = document.getElementById('myHeader');
const sticky = header.offsetTop;
function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add('sticky');
  } else {
    header.classList.remove('sticky');
  }
}

// Get the modal
const modal = document.getElementById('myModal');
const addModal = document.getElementById('addModal');
const addClose = document.getElementById('addClose');

// Get the <span> element that closes the modal
const span = document.getElementsByClassName('close')[0];


const wrapper = document.getElementById('myWrapper');
const cards = wrapper.getElementsByTagName('DIV');
let i;
for (i = 0; i < cards.length; i++) {
  cards[i].onclick = function () {
    modal.style.display = 'block';
  };
}

const editBtn = document.getElementById('editBtn');
const saveBtn = document.getElementById('saveBtn');
const editTitle = document.getElementById('editTitle');
const editText = document.getElementById('editText');

editBtn.onclick = function(){
  editTitle.contentEditable = 'true';
  editText.contentEditable = 'true';
  saveBtn.innerHTML = 'SAVE';
}

saveBtn.onclick = function(){
  editTitle.contentEditable = 'false';
  editText.contentEditable = 'false';
  modal.style.display = 'none';
}


//This is for a adding a new entry

const closeBtn = document.getElementById('closeBtn');
const addSaveBtn = document.getElementById('addSaveBtn');
const addTitle = document.getElementById('addTitle');
const addText = document.getElementById('addText');

const addFab = document.getElementById('addFab');

addFab.onclick = function(){
  addModal.style.display = 'block';
  addTitle.innerHTML = "Here goes your title";
  addText.innerHTML = "And here you can pour down your thoughts";
  addTitle.contentEditable = 'true';
  addText.contentEditable = 'true';
}

closeBtn.onclick = function(){
  addModal.style.display = 'none';
}


// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = 'none';
};

addClose.onclick = function () {
  addModal.style.display = 'none';
};
