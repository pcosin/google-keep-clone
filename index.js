const $form = document.querySelector('#form');
const $title = document.querySelector('#note-title');
const $text = document.querySelector('#note-text');
const $buttons = document.querySelector('#form-buttons');

const $submit = document.querySelector('#submit-button');
const $close = document.querySelector('#form-close-button');

const $notes = document.querySelector('#notes');
const $placeholder = document.querySelector('#placeholder');


function OpenInput() {
    document.addEventListener('click', function (event) {
        const isClicked = $form.contains(event.target);
        if(isClicked) {
            $form.classList.add('form-open');
            $title.style.display = 'block';
            $buttons.style.display = 'block';
        } else {
            closeForm();
        }
    });
}


function closeForm() {
        $form.classList.remove('form-open');
        $title.style.display = 'none';
        $buttons.style.display = 'none'
}

OpenInput()