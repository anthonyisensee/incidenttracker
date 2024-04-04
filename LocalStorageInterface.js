export class LocalStorageInterface {

    add(key, value) {
            
        try {

            const json_value = JSON.stringify(value)
            localStorage.setItem(key, json_value)
        
        } catch (error) {
            
            // TODO: implement error handling for QuotaExceededError when 5MiB local storage limit exceeded
            console.error(error)
        
        }
    
    }

    set = this.add

    get(key) {

        const json_value = localStorage.getItem(key)
        return JSON.parse(json_value)

    }

    remove(key) {

        localStorage.removeItem(key)

    }

}
