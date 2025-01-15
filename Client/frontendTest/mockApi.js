// mockApi.js
import { users, stores, products, orders, transactions } from './mockDataFile.js';

export const mockApi = {
    signIn: (email, password) => {
        const user = users.find(u => u.user_email === email && u.user_password === password);
        if (!user) {
            return Promise.reject('Invalid email or password');
        }
        return Promise.resolve(user); // Simulate successful login
    },

    getStores: () => Promise.resolve(stores),

    getProducts: (category) => {
        console.log("Requested Category:", category); // Log the category being passed
        console.log("Available Products:", products); // Log all products before filtering

        const filteredProducts = products.filter(product => {
            console.log(`Checking product: ${product.product_name} with category: ${product.product_category}`);
            return product.product_category.toLowerCase() === category.toLowerCase();
        });

        console.log("Filtered Products:", filteredProducts); // Log the filtered products

        if (filteredProducts.length === 0) {
            console.warn(`No products found for category: ${category}`);
            return Promise.resolve([]);
        }

        const enrichedProducts = filteredProducts.map(product => {
            const store = stores.find(store => store.store_id === product.store_id);
            return {
                ...product,
                store_name: store ? store.store_name : "Unknown Store",
            };
        });

        console.log("Enriched Products:", enrichedProducts); // Log the enriched products
        return Promise.resolve(enrichedProducts);
    },

    getOrders: () => Promise.resolve(orders),

    getTransactions: () => Promise.resolve(transactions),
};
