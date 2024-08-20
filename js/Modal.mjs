export class Modal {

    constructor(title, content, buttons, functionRunAfterCreation) {

        const html = `
            <div class="modal is-active">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">${title}</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        ${content}
                    </section>
                    <footer class="modal-card-foot">
                        <div class="buttons">
                            ${buttons}
                        </div>
                    </footer>
                </div>
            </div>
        `

        const modalContainer = document.getElementById('modal-container')

        modalContainer.innerHTML += html

        // Remove modal
        modalContainer.querySelectorAll('button.delete, div.modal-background').forEach(el => {
            
            el.addEventListener('click', event => {

                document.querySelector('.modal').remove()

            })

        })

        functionRunAfterCreation()

    }

}
