import { Modal } from "./Modal.mjs"

// Top level object designed to load all components necessary for the rest of the application.
export class App {

    constructor() {

        document.addEventListener("DOMContentLoaded", e => {

            this.loadApp()

        })


    }

    loadApp() {

        // Load in all services, each with their latest incident
        this.loadServices()

        // Attach functionality to service buttons
        this.attachServicesFunctionality()

    }

    loadServices() {



    }

    attachServicesFunctionality() {

        const newServicesButton = document.getElementById("new-service")

        newServicesButton.addEventListener("click", e => {

            const modal = new Modal

        })

    }

}

// Instantiate the class to load the application.
const application = new App()
