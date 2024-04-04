export class Incident {

    constructor(incidentObject) {
        
        this.date = incidentObject.date ?? new Date()
        this.description = incidentObject.description ?? ""

    }

}
