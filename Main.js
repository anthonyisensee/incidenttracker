import { LocalStorageInterface } from "./LocalStorageInterface.js";
import { Incident } from "./Incident.js"

document.addEventListener('DOMContentLoaded', () => {

    // Commonly used variables
    const storage = new LocalStorageInterface()
    const incidents_container = document.getElementById("incidents_container")

    // Manage the name of the service for which incidents are being tracked.
    let service_name = storage.get("service_name")

    if (!service_name) {

        service_name = prompt("Enter the name of the service you wish to track incidents for:")

        storage.set("service_name", service_name)

    }

    document.querySelectorAll('span.service-name').forEach(el => {
        el.innerHTML = service_name
    })

    // Load in any previously created incidents
    let incidents = []

    const stored_incidents = storage.get("incidents")

    if (stored_incidents) {

        incidents_container.innerHTML = ""

        stored_incidents.forEach(incident => {

            const classed_incident = new Incident(incident)

            incidents.push(classed_incident)

            incidents_container.innerHTML = incidentHtml(classed_incident) + incidents_container.innerHTML

        })

    }

    // Add functionality to page buttons
    document.getElementById("create_new_incident").addEventListener("click", () => {

        const incident_description_element = document.getElementById("incident_description")

        const incident_description = incident_description_element.value

        const incident = new Incident({
            description: incident_description
        })
        
        if (incidents.length == 0) {
            incidents_container.innerHTML = ""
        }

        incidents.push(incident)

        storage.set("incidents", incidents)

        incidents_container.innerHTML = incidentHtml(incident) + incidents_container.innerHTML

        // Clear incident description
        incident_description_element.value = ""
        
    })

    function incidentHtml(incident) {

        const incident_description = incident.description ? incident.description : `<span class="is-italic">No incident description provided.</span>`

        return `<p>${incident.date} - ${incident_description}</p>`

    }

    document.getElementById("clear_incidents").addEventListener("click", () => {

        if (confirm("Are you sure you want to clear all incidents? This cannot be undone.")) {

            incidents_container.innerHTML = ""
            incidents = []
            storage.remove("incidents")

        }

    })




    

})