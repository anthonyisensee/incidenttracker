// Creates and appends the components for a bulma modal user prompt
export function createModal(id, prompt) {

  const container = document.createElement('div')
  container.classList.add('modal', 'is-active')
  container.setAttribute('id', id)
  document.body.append(container)

  const escape = document.createElement('button')
  escape.classList.add('modal-close', 'is-large')
  escape.setAttribute('aria-label', 'close')
  container.append(escape)

  const background = document.createElement('div')
  background.classList.add('modal-background')
  container.append(background)

  const content = document.createElement('div')
  content.classList.add('modal-content')
  container.append(content)

  const box = document.createElement('div')
  box.classList.add('box')
  content.append(box)

  const label = document.createElement('label')
  label.classList.add('label', 'is-size-5')
  label.innerText = prompt

  const control_label = document.createElement('div')
  control_label.append(label)
  box.append(control_label)

  const input = document.createElement('input')
  input.classList.add('input', 'is-normal')
  input.setAttribute('type', 'text')

  const control_input = document.createElement('div')
  control_input.classList.add('control', 'is-expanded')
  control_input.append(input)

  const button = document.createElement('button')
  button.classList.add('button', 'is-centered')
  button.setAttribute('id', `${id}_submit`)
  button.innerText = 'OK'

  const control_button = document.createElement('div')
  control_button.classList.add('control')
  control_button.append(button)

  const field = document.createElement('div')
  field.classList.add('field', 'has-addons', 'mt-3')
  field.append(control_input, control_button)
  box.append(field)

  // Add a click event on various child elements to delete the parent modal
  const altCloseModal = (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []).forEach(($close) => {

    const $target = $close.closest('.modal')

    $close.addEventListener('click', () => {

      deleteModal($target)

    })

  }) 

  // Add a keyboard event to close all modals
  const keyboard_close_modal = document.addEventListener('keydown', (event) => {

    if (event.key === "Escape") { closeAllModals() }

  })

}  

// Creates bulma modals to confirm the user wishes to reset local storage
export function confirmReset(id, prompt, correctResponse = undefined) {

  createModal(id, prompt)

  return new Promise((resolve) => { // Waits for the user to click on the confirm button

    document.getElementById(`${id}_submit`).addEventListener('click', () => {

      if (correctResponse) {

        const response = document.getElementById(id).querySelector('input').value

        if (response === correctResponse) {

          resolve(response)

          deleteModal(undefined, id)

        } else { deleteModal(undefined, id) }

      } else {

        resolve(true)

        deleteModal(undefined, id)

      }
  
    })

  })

} 

// Processes a new user incident and places into local storage 
export function modalPrompt (storage, prompt) {

  const id = 'service_name_container'

  createModal(id, prompt)

  const modal = document.getElementById(id)
  const submit = document.getElementById(`${id}_submit`)
  const input = modal.querySelector('input')

  submit.addEventListener('click', () => {

    const incident = input.value

    storage.set("service_name", incident)

    document.querySelectorAll('span.service-name').forEach(el => {
        el.innerHTML = incident
    })

    deleteModal(undefined, id)

  })

}

// Removes a modal from the dom
export function deleteModal(element, id = undefined) {

  const modalToDelete = id ? document.getElementById(id) : element

  modalToDelete.remove()

}

// Functions to open and close a modal
export function openModal($el) {

  $el.classList.add('is-active')

}

export function closeModal($el) {

  $el.classList.remove('is-active')

}

export function closeAllModals() {

  (document.querySelectorAll('.modal') || []).forEach(($modal) => {

    deleteModal($modal);

  })

}


  
  
