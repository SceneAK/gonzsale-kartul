export class Product {
    constructor(data){
        this.id = data.id,
        this.storeId = data.storeId,
        this.name = data.name,
        this.description = data.description,
        this.category = data.category,
        this.isAvailable = data.isAvailable || false;
    }
    getStoreId(){
        return this.storeId;
    }
}