// mockData.js

export const users = [
    {
        user_id: "1e4567e8-e89b-12d3-a456-426614174000",
        user_email: "john.doe@example.com",
        user_password: "hashed_password_123",
        user_name: "John Doe",
        user_phone: 1234567890,
    },
    {
        user_id: "2e4567e8-e89b-12d3-a456-426614174001",
        user_email: "jane.smith@example.com",
        user_password: "hashed_password_456",
        user_name: "Jane Smith",
        user_phone: 9876543210,
    },
];

export const stores = [
    {
        store_id: "1f4567e8-e89b-12d3-a456-426614174002",
        store_name: "Cool Shop",
        store_description: "A store for cool products.",
        store_bank_account: "123456789012",
        store_payment_method: "Bank",
        store_imgSrc: "https://example.com/images/store1.png",
        owner_user_id: "1e4567e8-e89b-12d3-a456-426614174000",
    },
    {
        store_id: "2f4567e8-e89b-12d3-a456-426614174003",
        store_name: "Fashion House",
        store_description: "Trendy fashion for everyone.",
        store_bank_account: "987654321098",
        store_payment_method: "E-Wallet",
        store_imgSrc: "https://example.com/images/store2.png",
        owner_user_id: "2e4567e8-e89b-12d3-a456-426614174001",
    },
    {
        store_id: "3f4567e8-e89b-12d3-a456-426614174004",
        store_name: "Techies Corner",
        store_description: "Gadgets and cool tech gear.",
        store_bank_account: "112233445566",
        store_payment_method: "PayPal",
        store_imgSrc: "https://example.com/images/store3.png",
        owner_user_id: "1e4567e8-e89b-12d3-a456-426614174000",
    },
    {
        store_id: "4f4567e8-e89b-12d3-a456-426614174005",
        store_name: "Vintage Wear",
        store_description: "Unique vintage clothing.",
        store_bank_account: "665544332211",
        store_payment_method: "Credit Card",
        store_imgSrc: "https://example.com/images/store4.png",
        owner_user_id: "2e4567e8-e89b-12d3-a456-426614174001",
    },
    {
        store_id: "5f4567e8-e89b-12d3-a456-426614174006",
        store_name: "EcoMart",
        store_description: "Eco-friendly products for sustainable living.",
        store_bank_account: "998877665544",
        store_payment_method: "E-Wallet",
        store_imgSrc: "https://example.com/images/store5.png",
        owner_user_id: "1e4567e8-e89b-12d3-a456-426614174000",
    }
];

export const products = [
    // Existing products
    {
        product_id: "3g4567e8-e89b-12d3-a456-426614174004",
        product_name: "Stylish T-Shirt",
        product_description: "A comfortable and stylish t-shirt.",
        product_category: "Shirts",
        product_variants: {
            size: ["S", "M", "L", "XL"],
            color: ["Red", "Blue", "Black"],
        },
        product_price: 150000,
        product_unit: "piece",
        product_availability: "AVAILABLE",
        product_imgSrc: ["https://example.com/images/tshirt1.png"],
        store_id: "1f4567e8-e89b-12d3-a456-426614174002",
    },
    {
        product_id: "4g4567e8-e89b-12d3-a456-426614174005",
        product_name: "Designer Jeans",
        product_description: "High-quality jeans with a modern fit.",
        product_category: "Pants",
        product_variants: {
            size: ["28", "30", "32", "34"],
            color: ["Blue", "Black"],
        },
        product_price: 300000,
        product_unit: "piece",
        product_availability: "PREORDER_ONLY",
        product_imgSrc: ["https://example.com/images/jeans1.png"],
        store_id: "2f4567e8-e89b-12d3-a456-426614174003",
    },
    // New products in Shirts and Pants
    ...Array.from({ length: 5 }, (_, i) => ({
        product_id: `shirt-${i + 1}`,
        product_name: `Premium Shirt ${i + 1}`,
        product_description: `High-quality shirt in various styles.`,
        product_category: "Shirts",
        product_variants: {
            size: ["S", "M", "L", "XL"],
            color: ["White", "Black", "Gray", "Blue"],
        },
        product_price: 100000 + i * 5000,
        product_unit: "piece",
        product_availability: "AVAILABLE",
        product_imgSrc: [`https://example.com/images/shirt${i + 1}.png`],
        store_id: `1f4567e8-e89b-12d3-a456-426614174002`,
    })),
    ...Array.from({ length: 5 }, (_, i) => ({
        product_id: `pants-${i + 1}`,
        product_name: `Casual Pants ${i + 1}`,
        product_description: `Comfortable and stylish pants for daily wear.`,
        product_category: "Pants",
        product_variants: {
            size: ["28", "30", "32", "34"],
            color: ["Navy", "Khaki", "Black"],
        },
        product_price: 200000 + i * 10000,
        product_unit: "piece",
        product_availability: "AVAILABLE",
        product_imgSrc: [`https://example.com/images/pants${i + 1}.png`],
        store_id: `2f4567e8-e89b-12d3-a456-426614174003`,
    })),
    // Additional products
    {
        product_id: "accessory-1",
        product_name: "Elegant Necklace",
        product_description: "Beautiful necklace for any occasion.",
        product_category: "Accessories",
        product_variants: {},
        product_price: 50000,
        product_unit: "piece",
        product_availability: "AVAILABLE",
        product_imgSrc: ["https://example.com/images/necklace.png"],
        store_id: "4f4567e8-e89b-12d3-a456-426614174005",
    },
    {
        product_id: "food-1",
        product_name: "Organic Cookies",
        product_description: "Delicious and healthy organic cookies.",
        product_category: "Food",
        product_variants: {},
        product_price: 80000,
        product_unit: "pack",
        product_availability: "AVAILABLE",
        product_imgSrc: ["https://example.com/images/cookies.png"],
        store_id: "5f4567e8-e89b-12d3-a456-426614174006",
    }
];

export const orders = [
    {
        order_id: "5h4567e8-e89b-12d3-a456-426614174006",
        product_id: "3g4567e8-e89b-12d3-a456-426614174004",
        customer_user_id: "1e4567e8-e89b-12d3-a456-426614174000",
        order_qty: 2,
        order_variant: {
            size: "M",
            color: "Blue",
        },
        order_notes: "Please deliver between 9 AM and 5 PM.",
        transaction_proof: "https://example.com/proofs/transaction1.png",
        order_status: "PROCESSING",
    },
    {
        order_id: "6h4567e8-e89b-12d3-a456-426614174007",
        product_id: "4g4567e8-e89b-12d3-a456-426614174005",
        customer_user_id: "2e4567e8-e89b-12d3-a456-426614174001",
        order_qty: 1,
        order_variant: {
            size: "32",
            color: "Black",
        },
        order_notes: "Gift wrap the package.",
        transaction_proof: "https://example.com/proofs/transaction2.png",
        order_status: "IN_GONZAGA",
    },
];

export const transactions = [
    {
        transaction_id: "7i4567e8-e89b-12d3-a456-426614174008",
        transaction_date: "2025-01-13T09:00:00Z",
        transaction_amount: 300000,
        transaction_proof: "https://example.com/proofs/transaction1.png",
        order_id: "5h4567e8-e89b-12d3-a456-426614174006",
    },
    {
        transaction_id: "8i4567e8-e89b-12d3-a456-426614174009",
        transaction_date: "2025-01-14T10:30:00Z",
        transaction_amount: 150000,
        transaction_proof: "https://example.com/proofs/transaction2.png",
        order_id: "6h4567e8-e89b-12d3-a456-426614174007",
    },
];
