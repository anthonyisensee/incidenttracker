export class Incident {

    constructor(incidentObject) {
        
        this.date = incidentObject.date ?? (new Date()).toISOString()
        this.description = incidentObject.description ?? ""

    }

}
