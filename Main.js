import { LocalStorageInterface } from "./LocalStorageInterface.js";
import { Incident } from "./Incident.js"

document.addEventListener('DOMContentLoaded', () => {

    let incidents = []
    
    const incidents_container = document.getElementById("incidents_container")
    
    // const storage = new LocalStorageInterface()

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

            incidents = []

            incidents_container.innerHTML = ""

        }

    })




    

})