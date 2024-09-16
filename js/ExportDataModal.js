import { LocalStorageInterface } from "./LocalStorageInterface.js"

export class ExportDataModal {

    constructor() {

        this.id = "data-export-modal"
        this.copyButtonId = "export-data-modal-copy-data-button"
        this.dataTextAreaId = "data-textarea"

        const modalHtml = `
            <div id="${this.id}" class="modal">
                <div class="modal-background"></div>
                <div class="modal-card">
                    <header class="modal-card-head">
                        <p class="modal-card-title">Export Data</p>
                        <button class="delete" aria-label="close"></button>
                    </header>
                    <section class="modal-card-body">
                        <div class="content">
                            <p><a href="https://eventtracker.anthonyisensee.com" target="_blank">Event Tracker</a> is the upgraded version of Incident Tracker. Among other features, Event Tracker has multiple views and allows you to track events across multiple different systems.</p>
                            <p>To export your data from Incident Tracker and import it into Event Tracker:</p>
                            <ol>
                                <li>Select the "Copy Data" button below.</li>
                                <li>Navigate to <a href="https://eventtracker.anthonyisensee.com/settings">Event Tracker's settings page</a>.</li>
                                <li>Click the "Import Data" button and follow the steps listed there.</li>
                            </ol>
                        </div>
                        <div class="field">
                            <div class="control">
                                <textarea id="${this.dataTextAreaId}" class="textarea" data-export-modal-is-data readonly></textarea>
                            </div>
                        </div>
                        <div class="buttons">
                            <button id="${this.copyButtonId}" class="button">Copy Data</button>
                        </div>
                    </section>
                </div>
            </div>
        `

        const modalContainer = document.getElementById("modal-container")

        modalContainer.innerHTML = modalHtml

        // Add functionality to close modal
        document.querySelectorAll(`#${this.id} :is(div.modal-background, button.delete)`).forEach(element => {

            element.addEventListener("click", () => this.close())

        })

        // Add functionality to copy button
        async function copyToClipboard(text) {

            const type = "text/plain"
            const blob = new Blob([text], { type })
            const data = [new ClipboardItem({ [type]: blob })]

            await navigator.clipboard.write(data)
            
        }

        const copyButton = document.getElementById(this.copyButtonId)
        const textArea = document.getElementById(this.dataTextAreaId)
        
        // Enable functionality on copy to clipboard button
        copyButton.addEventListener('click', e => copyToClipboard(textArea.innerHTML))

    }

    open() {

        const modal = document.getElementById(this.id)
        
        const textarea = modal.querySelector('[data-export-modal-is-data]')

        // Freshly retrieve the data and update it in the modal every time the modal is opened

        // Get incidents data
        const storage = new LocalStorageInterface()
        const service_name = storage.get("service_name")
        const stored_incidents = storage.get("incidents") ?? []

        const events = []

        // Transform incidents into event objects Event Tracker will be able to import
        stored_incidents.forEach(incident => {

            events.push({
                date: this.getDate(incident.date),
                time: this.getTime(incident.date),
                description: incident.description ?? undefined
            })

        })

        // Transform data into a format Event Tracker will be able to import
        const exportData = {
            trackers: [
                {
                    name: service_name ?? "Incident Tracker Events",
                    events: events
                }
            ]
        }

        document.getElementById(this.dataTextAreaId).innerHTML = JSON.stringify(exportData)

        // Show modal
        modal.classList.add("is-active")

    }

    close() {

        document.getElementById(this.id).classList.remove("is-active")

    }

    getDate(dateString) {

        const date = new Date(dateString)
        const yyyy = String(date.getFullYear())
        const mm = String(date.getMonth() + 1).padStart(2, "0")
        const dd = String(date.getDate()).padStart(2, "0")
        return `${yyyy}-${mm}-${dd}`
    
    }
    
    getTime(dateString) {
    
        const date = new Date(dateString)
        const hh = String(date.getHours()).padStart(2, "0")
        const mm = String(date.getMinutes()).padStart(2, "0")
        const ss = String(date.getSeconds()).padStart(2, "0")
        return `${hh}:${mm}:${ss}`
    
    }

}
