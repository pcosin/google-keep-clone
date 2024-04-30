const $form = document.querySelector('#form');
const $title = document.querySelector('#note-title');
const $text = document.querySelector('#note-text');
const $buttons = document.querySelector('#form-buttons');

const $submit = document.querySelector('#submit-button');
const $close = document.querySelector('#form-close-button');

const $notes = document.querySelector('#notes');
const $placeholder = document.querySelector('#placeholder');

const $modal = document.querySelector('.modal');
const $closeModal = document.querySelector('.modal-close-button');
const $modalTitle = document.querySelector(".modal-title");
const $modalText = document.querySelector(".modal-text");

const $colorTooltip = document.querySelector('#color-tooltip');


let notes = JSON.parse(localStorage.getItem('notes')) || [];

renderNotes()
OpenInput()

let title = '';
let text = '';
let id = '';

$submit.addEventListener('click', handlerSubmit);
$closeModal.addEventListener('click', closeModal);
$close.addEventListener('click', (event) => {
    event.stopPropagation();
    closeForm()
});

document.body.addEventListener('mouseover', event => {
    openTooltip(event);  
 });

 document.body.addEventListener('mouseout', event => {
    closeTooltip(event);  
 });

 $colorTooltip.addEventListener('mouseover', function() {
    this.style.display = 'flex';  
  })
  
  $colorTooltip.addEventListener('mouseout', function() {
     this.style.display = 'none'; 
  })

  $colorTooltip.addEventListener('click', event => {
    const color = event.target.dataset.color; 
    if (color) {
      editNoteColor(color);  
    }
 })



function OpenInput() {
    document.addEventListener('click', function (event) {
        const isClicked = $form.contains(event.target);
        if(isClicked) {
            openForm()
        } else {
            closeForm();
        }
        openModal(event)     
        selecNote(event)
        deleteNote(event)
    
    });
}

function closeForm() {
        $form.classList.remove('form-open');
        $title.style.display = 'none';
        $buttons.style.display = 'none'
        resetValues()
}

function openForm() {
    $form.classList.add('form-open');
    $title.style.display = 'block';
    $buttons.style.display = 'block';
}

function openModal(event) {
    if (event.target.matches('.toolbar-delete')) return;  

   const closest = event.target.closest('.note');
   closest && $modal.classList.toggle('open-modal');
}

function closeModal() {
    $modal.classList.toggle('open-modal');  
    editNote()
   
}

function selecNote(event) {
    const $selectedNote = event.target.closest('.note');
    if (!$selectedNote) return;

    const [$title, $text] = $selectedNote.children;
     title = $title.innerText;
     text = $text.innerText;
     $modalTitle.value = title;
     $modalText.value = text;
     id = Number($selectedNote.dataset.id);   
    editNote(id)
}

function editNote() {
    const title = $modalTitle.value;
    const text = $modalText.value;
    notes = notes.map(note => note.id === id ? {...note, title, text} : note);
    localStorage.setItem('notes', JSON.stringify(notes))
    renderNotes()
}

function editNoteColor(color) {
    notes = notes.map(note =>
      note.id === Number(id) ? { ...note, color } : note
    );
    renderNotes();
  }

function handlerSubmit(event) {
    event.preventDefault(); 
    const title = $title.value;
    const text = $text.value;
    const hasNote = title || text;
    if(hasNote) {
        addNote({title, text});
        renderNotes()
        closeForm()
    } 
}

function resetValues() {
    $title.value = '';
    $text.value = '';
}

function addNote(note) {
    const newNote = {
        title: note.title,
        text: note.text,
        color: 'white',
        id: notes.length > 0 ? notes[notes.length - 1].id + 1 : 1
    }
    notes = [...notes, newNote]
    localStorage.setItem('notes', JSON.stringify(notes))    
}

function deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches('.toolbar-delete')) return;
    const id = event.target.dataset.id;
    notes = notes.filter(note => note.id !== Number(id));
    localStorage.setItem('notes', JSON.stringify(notes))
    renderNotes()
}

function openTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    id = event.target.dataset.id; 
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left;
    const vertical = window.scrollY - 20;
    $colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    $colorTooltip.style.display = 'flex';

}

function closeTooltip(event) {
    if (!event.target.matches('.toolbar-color')) return;
    $colorTooltip.style.display = 'none';  
  }

function renderNotes() {  
    $placeholder.style.display = notes.length > 0 ? 'none' : 'flex';

    $notes.innerHTML = notes.map(note => {
      return  `<div style="background: ${note.color};" class="note" data-id = ${note.id}>
        <div class="${note.title && 'note-title'}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
          <svg class="toolbar-color" data-id=${ note.id } xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" d="M10.847 21.934C5.867 21.362 2 17.133 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10c0 5.157-3.283 4.733-6.086 4.37c-1.618-.209-3.075-.397-3.652.518c-.395.626.032 1.406.555 1.929a1.673 1.673 0 0 1 0 2.366c-.523.523-1.235.836-1.97.751M11.085 7a1.5 1.5 0 1 1-3 0a1.5 1.5 0 0 1 3 0M6.5 13a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m11 0a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3m-3-4.5a1.5 1.5 0 1 0 0-3a1.5 1.5 0 0 0 0 3" clip-rule="evenodd"/></svg>
          <button class="btn-delete"> 
            <svg class="toolbar-delete" data-id=${ note.id } xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 256 256">
                <path d="M216 48h-36V36a28 28 0 0 0-28-28h-48a28 28 0 0 0-28 28v12H40a12 12 0 0 0 0 24h4v136a20 20 0 0 0 20 20h128a20 20 0 0 0 20-20V72h4a12 12 0 0 0 0-24M100 36a4 4 0 0 1 4-4h48a4 4 0 0 1 4 4v12h-56Zm88 168H68V72h120Zm-72-100v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0m48 0v64a12 12 0 0 1-24 0v-64a12 12 0 0 1 24 0"/>
            </svg>  
            </button>       
        </div>
        </div>
        </div>`
           
}).join('');

}




