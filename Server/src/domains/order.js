import { ApplicationError } from "../common";

export class Order{
    constructor(data){
        this.id = data.id;
        this.storeId = data.storeId;
        this.customerId = data.customerId;
        this.customerName = data.customerName;
        this.customerPhone = data.customerPhone;
        this.customerEmail = data.customerEmail;
        this.OrderItems = data.OrderItems;
    }

    validateOrder(){
        if(!this.OrderItems || this.OrderItems.length == 0) throw new ApplicationError("Order must have at least one item!", 400);

        this.storeId = this.storeId || this.OrderItems[0].getStoreIdOfProduct();
        const mixedOrigin = this.OrderItems.some( item => item.getStoreIdOfProduct() != this.storeId)
        if(mixedOrigin) throw new ApplicationError("OrderItems of mixed store!", 400);
        
        return true;
    }
}