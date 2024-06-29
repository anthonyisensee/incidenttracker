import { Modal } from './Modal.js'
import { LocalStorageInterface } from "./LocalStorageInterface.js";
import { Incident } from "./Incident.js"


document.addEventListener('DOMContentLoaded', () => {

    setColorSchemeOnDOMContentLoaded()

    const storage = new LocalStorageInterface()
    const incidents_container = document.getElementById("incidents_container")

    // Manage the name of the service for which incidents are being tracked.
    let service_name = storage.get("service_name")

    if (service_name) {

        document.querySelectorAll('span.service-name').forEach(el => {
            el.innerHTML = service_name
        })

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

    document.getElementById("set_service_name").addEventListener("click", () => {

        const promptUserIncidentName = new Modal('Enter the name of the service you wish to track incidents for.', 'Set Service Name')

        promptUserIncidentName.prompt((input) => {

            storage.set("service_name", input)

            document.querySelectorAll('span.service-name').forEach(el => { el.innerHTML = input })

        })

    })

    
    // Reset protocol that creates bulma modals that confirm user wishes to clear local data
    document.getElementById('reset_everything').addEventListener("click", () => {

        function deleteEverything() {

            storage.remove("service_name")
            storage.remove("incidents")
            storage.remove("user_color_scheme_preference")
            location.reload()

        }

        const modal = new Modal(undefined, "Reset Everything", "Confirm")
        const messages = ['Do you wish to reset local storage?', 'Resetting will delete all data. Are you sure?', 'Please type "YES" to delete everything.']
        modal.multipleConfirm(messages, "YES", deleteEverything)

    })

    function setColorSchemeTo(value) {

        if (value == "light" || value == "dark") {

            document.querySelector('html').dataset.theme = value

            // Set any icons on buttons meant to toggle color scheme to what clicking the button will toggle the scheme to.
            const colorSchemeEmoji = value == "light" ? "🌙" : "☀️"

            document.querySelector('#toggle_color_scheme .color-scheme-emoji').innerHTML = colorSchemeEmoji

        }

    }

    // If the user has at some point set a default color scheme, set it when the page is rendered.
    function setColorSchemeOnDOMContentLoaded() {

        const storage = new LocalStorageInterface()

        if (storage.get("user_color_scheme_preference")) {

            // User has previously set a preference, add it to the 
            const userColorSchemePreference = storage.get("user_color_scheme_preference")

            setColorSchemeTo(userColorSchemePreference)

        }

    }

    let clearableTimeoutIds = []

    function toggleColorScheme() {

        const storage = new LocalStorageInterface()

        const oldUserColorSchemePreference = storage.get("user_color_scheme_preference")

        let newUserColorSchemePreference = null

        // Check to see if user has previously set a color scheme preference. If not, determine the switch based on the browser color scheme.
        if (storage.get("user_color_scheme_preference")) {

            newUserColorSchemePreference = oldUserColorSchemePreference == 'dark' ? 'light' : 'dark'


        } else {

            newUserColorSchemePreference = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'light' : 'dark'

        }

        storage.set("user_color_scheme_preference", newUserColorSchemePreference)

        setColorSchemeTo(newUserColorSchemePreference)

        // Lay an easter egg to the console
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {

            if (newUserColorSchemePreference == 'light') {
                
                console.clear()

                const messages = [
                    "You realize you've made a very poor decision.",
                    "You can feel your weight against the back of your chair.",
                    "The light blasts from your monitor. It's pinning you back!",
                    "You can barely move.",
                    "You MUST change the color scheme back. If you do not, dire consequences will befall you!!",
                    "Your hand twitches as you reach for the 'Change Color Scheme' button. Will you be able to make it?!",
                    "You're not sure you will..."
                ]

                const secondsBetweenMessages = 3

                clearableTimeoutIds = []

                for (let i = 0; i < messages.length; i++) {

                    const timeout = setTimeout(() => console.log(messages[i]), 1000 * i * secondsBetweenMessages)

                    clearableTimeoutIds.push(timeout)

                }

            } else {

                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && newUserColorSchemePreference == 'dark') {
                    
                    // Just in case the user switches back before the other messages get a chance to play, cancel them so they don't play after the final messages
                    clearableTimeoutIds.forEach(id => {
                        clearTimeout(id)
                    })

                    console.log("Cool darkness washes over you. Ahhh, finally. Sweet, sweet relief.")

                    setTimeout(() => console.log("The abominable ability to purposefully switch away from dark mode was requested by Max Lara. Max, if you really mean to use light mode instead of dark mode you should probably visit a psychiatrist. Or--at the very least--an optometrist."), 5000)
        
                }

            }

        }

    }

    // Attach functionality to change color scheme button
    document.getElementById('toggle_color_scheme').addEventListener('click', () => toggleColorScheme())

})


