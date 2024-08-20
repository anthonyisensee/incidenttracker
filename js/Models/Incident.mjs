export class Incident {

    constructor(incidentObject) {

        this.createdOn = incidentObject.createdOn ?? new Date()
        this.date = incidentObject.date ?? (new Date()).toISOString()
        this.description = incidentObject.description ?? ""

    }

}
