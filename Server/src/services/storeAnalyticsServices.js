
import { Op } from "sequelize";
import dbInitPromise from "../database/initialize.js";
const { Order, OrderItem } = await dbInitPromise;

class OrderRepository{
    constructor(Order, OrderItem){
        this.Order = Order;       
        this.OrderItem = OrderItem;
    }
    // This layer should handle pagination as well when needed
    async findAll(options){
        const {includeOrderItems, dateRange, where} = options;
        const results = await this.Order.findAll({
            where: {
                ...where,  
                createdAt: this.whereDateRange(dateRange) 
            },
            include: includeOrderItems ? this.OrderItem : {},
        });
        return results.map( result => this.mapToDomain(result.toJSON()))
    }
    mapToDomain(result)
    {
        const orderData = {};
        if(result.OrderItems) {
            orderData.OrderItems = result.OrderItems.map( orderItem => new OrderItemInterface(orderItem));
        }
        return new OrderInterface(orderData);
    }
    whereDateRange(dateRange)
    {
        return {
            [Op.between]: [dateRange.startDate, dateRange.endDate]
        }
    }
}

class OrderAnalyzer {
    constructor(orders){
       this.orders = orders; 
    }
    calculateRevenue(orders) {
        let revenue = 0;
        orders.forEach(order => {
            order.OrderItems.forEach(item => {
                if(item.status == "COMPLETED"){ // Please Replace with constant
                    revenue += item.getTotal();
                }
            })
        });
        return revenue;
    } 
}

// replace with actual domain objects
class OrderInterface {
    constructor(data)
    {
        this.OrderItems = data.OrderItems;
    }
}
class OrderItemInterface{
    constructor(data)
    {
        this.quantity = data.quantity;
        this.variantPrice = data.variantPrice;
        this.status = data.status;
    }
    getTotal(){
        return this.quantity * this.variantPrice;
    }
}

async function fetchStoreAnalytics(storeId, dateRange)
{
    const repo = new OrderRepository(Order, OrderItem);
    const orders = await repo.findAll({where: {storeId}, includeOrderItems: true, dateRange}) // there might be a better solution here
    
    const analyzer = new OrderAnalyzer(orders);
    return { revenue: analyzer.calculateRevenue(orders) };
}

export default { fetchStoreAnalytics }
