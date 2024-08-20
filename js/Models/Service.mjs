// Defines a service, the top level data object that contains multiple incidents.
export class Service {

    constructor(serviceObject) {

        this.createdOn = incidentObject.createdOn ?? new Date()
        this.name = serviceObject.name ?? null
        this.description = serviceObject.description ?? null
        this.incidents = serviceObject.incidents ?? []

    }

}
