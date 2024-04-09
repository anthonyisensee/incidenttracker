// Creates and appends the components for a bulma modal user msg
export function createModal(id, msg, prompt_title = undefined, type = 'default') {

  /*
  Modal element tree

  modal
    |---> background
    |---> card 
            |---> header
            |       |---> title (optional)
            |---> body
            |       |---> message
            |       |---> input (optional)
            |---> footer
                    |---> controls
                            |---> positive (btn)
                            |---> negative (btn)
  */

  const modal = document.createElement('div')
  modal.classList.add('modal', 'is-active')
  modal.setAttribute('id', id)
  document.body.append(modal)

  const background = document.createElement('div')
  background.classList.add('modal-background')
  modal.append(background)

  const card = document.createElement('div')
  card.classList.add('modal-card')
  modal.append(card)

  const header = document.createElement('header')
  header.classList.add('modal-card-head', 'py-4')
  card.append(header)

  const body = document.createElement('section')
  body.classList.add('modal-card-body', 'py-4')
  prompt_title || type === 'req-input' ? card.append(body) : undefined

  const footer = document.createElement('footer')
  footer.classList.add('modal-card-foot', 'py-2')
  card.append(footer)

  const title = document.createElement('p')
  prompt_title ? title.classList.add('modal-card-title') : title.classList.add('modal-card-title', 'is-size-6')
  prompt_title ? title.innerText = prompt_title : title.innerText = msg
  header.append(title)

  const message = document.createElement('p') 
  message.classList.add('label', 'is-size-6')
  prompt_title ? message.innerText = msg : undefined
  body.append(message)

  if (type === 'req-input') {
    const input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.classList.add('input', 'is-focused')
    body.append(input)
  }

  const controls = document.createElement('div')
  controls.classList.add('buttons', 'is-flex', 'is-justify-content-end', 'is-flex-grow-1')
  footer.append(controls)

  const button_positive = document.createElement('button')
  button_positive.classList.add('button')
  button_positive.setAttribute('id', `${id}_submit`)
  button_positive.innerText = 'OK'
  controls.append(button_positive)

  const button_negative = document.createElement('button')
  button_negative.classList.add('button', 'exit')
  button_negative.setAttribute('id', `${id}_cancel`)
  button_negative.innerText = 'Cancel'
  controls.append(button_negative)

  
  // Add a click event on various child elements to delete the parent modal
  const altCloseModal = (document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot, .exit') || []).forEach(($close) => {

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
export function confirmReset(id, msg, correctResponse = undefined, type = undefined) {

  createModal(id, msg, undefined, type)

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
export function modalPrompt (storage, msg) {

  const id = 'service_name_container'
  const title = 'Incident Name'

  createModal(id, msg, title, 'req-input')

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


  
  
