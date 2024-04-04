import { LocalStorageInterface } from "./LocalStorageInterface.js";
import { Incident } from "./Incident.js"

document.addEventListener('DOMContentLoaded', () => {

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

    // Add time since last incident functionality.

    const time_since_last_incident_span = document.getElementById("time_since_incident")

    function setTimeSinceLastIncident() {

        let output_string = "∞"

        if (incidents.length > 0) {

            
            const current_time = new Date()
            const latest_time = new Date(incidents[incidents.length - 1].date)
            
            const milliseconds = current_time - latest_time
            const seconds = Math.floor(milliseconds / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)
            const days = Math.floor(hours / 24)
            // const months = Math.floor(days / 30)
            // const years = Math.floor(days / 365)

            const difference_unit_labels = ["day", "hour", "minute", "second"]
            const difference_values  = [days, hours % 24, minutes % 60, seconds % 60]

            let first_position_not_zero = undefined
            // Find first array position that is not zero
            for (let i = 0; i < difference_values.length; i++) {

                if (difference_values[i] != 0) {

                    first_position_not_zero = i
                    
                    break

                }

            }

            let difference_string = ""

            for (let i = first_position_not_zero; i < difference_values.length; i++) {

                difference_string += `${difference_values[i]} ${difference_unit_labels[i]}` + (difference_values[i] == 1 ? " " : "s ")

            }

            // const seconds = Math.round(time_difference) % 60
            // const minutes = Math.round(time_difference / (60)) % 60
            // const hours = Math.round(time_difference / (60 * 60)) % 24
            // const days = Math.round(time_difference / (60 * 60 * 24))

            function formatNumber(number, singleUnit) {
                
                return `${number} ${singleUnit}` + (number == 1 ? " " : "s ")

            }

            // output_string = formatNumber(days, "day") + " " + formatNumber(hours, "hour") + " " + formatNumber(minutes, "minute") + " " + formatNumber(seconds, "second")

            output_string = difference_string //`${difference_in_days} ${difference_in_hours} ${difference_in_minutes} ${difference_in_seconds}`

        }

        time_since_last_incident_span.innerHTML = output_string

    }

    setTimeSinceLastIncident()
    setInterval(setTimeSinceLastIncident, 1000)    // Run just under once every second


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
