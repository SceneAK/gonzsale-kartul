// mockApi.js
import { users, stores, products, orders, transactions } from './mockDataFile.js';

export const mockApi = {
    getUsers: () => Promise.resolve(users),

    getStores: () => Promise.resolve(stores),

    getProducts: (category) => {
        // Filter products by category
        const filteredProducts = products.filter(product => product.product_category === category);

        // If no products are found, resolve with an empty array
        if (filteredProducts.length === 0) {
            console.warn(`No products found for category: ${category}`);
            return Promise.resolve([]);
        }

        // Enrich filtered products with store data
        const enrichedProducts = filteredProducts.map(product => {
            const store = stores.find(store => store.store_id === product.store_id);
            return {
                ...product,
                store_name: store ? store.store_name : "Unknown Store", // Add store_name if found
            };
        });

        // Return the enriched products
        return Promise.resolve(enrichedProducts);
    },

    getOrders: () => Promise.resolve(orders),

    getTransactions: () => Promise.resolve(transactions),
};
