export class Modal {

    modal = `
        <div class="modal is-active">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head py-3">
                    <p class="modal-card-title"></p>
                </header>
                <section class="modal-card-body py-5">
                    <p class="modal-input is-size-5 mb-1"></p>
                    <input id="modal-input" class="input">
                </section>
                <footer class="modal-card-foot py-3">
                    <div class="modal-controls is-flex is-justify-content-end is-flex-grow-1">
                        <button class="button is-danger exit" id="modal-primary-button"></button>
                        <button class="button is-info exit ml-2" id="modal-secondary-button"></button>
                    </div>
                </footer>
            </div>
        </div> 
    `

    constructor(message, title, primaryBtnText, secondaryBtnText) {

        this.title = title || 'Attention' 
        this.message = message || 'This is the default alert message. Have a great day!'
        this.requireUserInput = false
        this.primaryBtnText = primaryBtnText || 'OK'
        this.secondaryBtnText = secondaryBtnText || 'Cancel'
    }

    #createTemplate() {

        const parser = new DOMParser()
        const parsedContent = parser.parseFromString(this.modal, 'text/html')
                
        const modalTitle = parsedContent.querySelector('.modal-card-title')
        modalTitle.innerText = this.title

        const modalMessage = parsedContent.querySelector('.modal-input')
        modalMessage.innerText = this.message

        if (!(this.requireUserInput)) {

            const modalInput = parsedContent.getElementById('modal-input')
            parsedContent.getElementById('modal-input').parentNode.removeChild(modalInput)

        }

        const modalPrimaryButton = parsedContent.getElementById('modal-primary-button')
        modalPrimaryButton.innerText = this.primaryBtnText

        const modalSecondaryButton = parsedContent.getElementById('modal-secondary-button')
        modalSecondaryButton.innerText = this.secondaryBtnText

        const modalDiv = parsedContent.querySelector('.modal')
        document.body.appendChild(modalDiv)

        // Event handling to close the modal with the mouse.
        document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot, .exit').forEach(($close) => {

            const $target = $close.closest('.modal')

            $close.addEventListener('click', () => { deleteModal($target) })

        }) 

        // Event handling to close the modal with the keyboard.
        document.addEventListener('keydown', (event) => { event.key === "Escape" ? closeAllModals() : undefined }) 

    }

    prompt(userFunction = undefined, alternateFunction = undefined) {

        this.requireUserInput = true
        this.#createTemplate()

        const primaryButton = document.getElementById('modal-primary-button')
        const secondaryButton = document.getElementById('modal-secondary-button')
        const userInput = document.getElementById('modal-input')
        
        primaryButton.addEventListener('click', () => {

            if (userFunction) {

                return userFunction(userInput.value)

            }
            
        })

        secondaryButton.addEventListener('click', () => {

            if (alternateFunction) {

                return alternateFunction(userInput.value)

            }
            
        })

    }

    confirm(userFunction = undefined, alternateFunction = undefined) {

        this.#createTemplate()

        const primaryButton = document.getElementById('modal-primary-button')
        const secondaryButton = document.getElementById('modal-secondary-button')

        primaryButton.addEventListener('click', () => {

            if (userFunction) {

                userFunction(true)

            }

        })

        secondaryButton.addEventListener('click', () => {

            if (alternateFunction) {

                alternateFunction(false)

            }

        })

    }

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




  
  
