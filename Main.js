import * as Modal from './Modal.js'
import { LocalStorageInterface } from "./LocalStorageInterface.js";
import { Incident } from "./Incident.js"


document.addEventListener('DOMContentLoaded', () => {

    const storage = new LocalStorageInterface()
    const incidents_container = document.getElementById("incidents_container")

    // Manage the name of the service for which incidents are being tracked.
    let service_name = storage.get("service_name")

    if (!service_name) {

        const modal_id = 'service_name_container'

        const modal_prompt = 'Enter the name of the service you wish to track incidents for:'

        Modal.inputUserIncident(storage, modal_id, modal_prompt) // Creates a user prompt to save incident name to local storage

        // service_name = prompt("Enter the name of the service you wish to track incidents for:")

        // storage.set("service_name", service_name)

    }

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
            
            const milliseconds = (current_time - latest_time)
            const seconds = Math.floor(milliseconds / 1000)
            const minutes = Math.floor(seconds / 60)
            const hours = Math.floor(minutes / 60)
            const days = Math.floor(hours / 24)
            // const months = Math.floor(days / 30)
            // const years = Math.floor(days / 365)

            const difference_unit_labels = ["day", "hour", "minute", "second"]
            const difference_values  = [days, hours % 24, minutes % 60, seconds % 60]

            let position_first_value_not_zero = difference_values.length - 1    // Sets a default so "0 seconds" will appear

            for (let i = 0; i < difference_values.length; i++) {

                if (difference_values[i] != 0) {

                    position_first_value_not_zero = i
                    
                    break

                }

            }

            output_string = ""

            for (let i = position_first_value_not_zero; i < difference_values.length; i++) {

                let add_to_end_of_string = ", "    // Separator for most cases

                const displaying_two_or_more_units = position_first_value_not_zero <= difference_values.length - 2
                const is_and_concatenation = i == difference_values.length - 2
                const displaying_only_two_units = position_first_value_not_zero == difference_values.length - 2

                if (displaying_two_or_more_units && is_and_concatenation) {

                    if (displaying_only_two_units) {

                        add_to_end_of_string = " and "

                    } else {

                        add_to_end_of_string = add_to_end_of_string + " and "

                    }

                }

                const is_final_concatenation = i == difference_values.length - 1

                if (is_final_concatenation) {

                    add_to_end_of_string = ""

                }

                const this_unit_plural = difference_values[i] != 1

                if (this_unit_plural) {

                    add_to_end_of_string = "s" + add_to_end_of_string

                }

                output_string += `${difference_values[i]} ${difference_unit_labels[i]}` + add_to_end_of_string

            }

        }

        time_since_last_incident_span.innerHTML = output_string

    }

    setTimeSinceLastIncident()
    setInterval(setTimeSinceLastIncident, 1000)    // Run every second

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

        const incident_description = incident.description ? incident.description : `<span class="is-italic">No description</span>`

        return `<p>${incident.date} - ${incident_description}</p>`

    }

    document.getElementById("reset_everything").addEventListener("click", () => {

        Modal.resetProtocol(storage) // Three step protocol to reset local storage by prompting the user for confirmation

        // if (confirm("Are you sure you want to reset everything?")) {

        //     if (confirm("Are you absolutely sure you want to reset everything? This can NOT be undone.")) {

        //         if (prompt(`Type "Anthony is the best" to confirm that you definitely, absolutely, certainly wish to reset everything.`) == "Anthony is the best") {
                    
        //             storage.remove("service_name")
        //             storage.remove("incidents")
        //             location.reload()

        //         }

        //     }

        // }

    })

})
