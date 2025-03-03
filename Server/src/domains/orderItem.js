import { ApplicationError } from "../common/index.js";
import { STATUSES } from "./orderItemStatuses.js";

export class OrderItem {
    constructor(data) {
        this.id = data.id;
        this.orderId = data.orderId;
        this.variantId = data.variantId;
        this.quantity = data.quantity;
        this.notes = data.notes || '';
        this.status = data.status || 'PENDING';
        this.Variant = data.Variant;
        this.Order = data.Order;
    }

    canTransitionTo(newStatus) {
        if (this.status == STATUSES.COMPLETED ||
            this.status == STATUSES.CANCELLED) {
            return false;
        }

        const currentIndex = OrderItem.STATUS_ORDER.indexOf(this.status);
        const newIndex = OrderItem.STATUS_ORDER.indexOf(newStatus);

        return newIndex > currentIndex;
    }

    getStoreIdOfProduct(){
        return this.Product.getStoreId();
    }

    validateOrderItem() {
        if (!this.Variant.Product.isAvailable) {
            throw new ApplicationError(`Order contains unavailable product "${this.Variant.Product.name}"`);
        }
        return true;
    }
}
