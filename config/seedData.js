const mongoose = require("mongoose");
require("dotenv").config();
const User = require("../models/User");
const Shop = require("../models/Shop");
const ProductVariant = require("../models/ProductVariant");
const Product = require("../models/Product");
const Payment = require("../models/Payment");
const OrderItem = require("../models/OrderItem");
const Order = require("../models/Order");
const CustomDesign = require("../models/CustomDesign");
const Category = require("../models/Category");
const CartItem = require("../models/CartItem");
const Cart = require("../models/Cart");

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB);
        console.log('MongoDB connected for seeding.');

        // 1. Clear existing data in reverse dependency order
        console.log('Clearing existing data...');
        await CartItem.collection.drop();
        await Cart.collection.drop();
        await CustomDesign.collection.drop();
        await ProductVariant.collection.drop();
        await Product.collection.drop();
        await Category.collection.drop();
        await Shop.collection.drop();
        await User.collection.drop();
        await Order.collection.drop();
        await OrderItem.collection.drop();
        console.log('All collections cleared.');

        // 2. Create Sample Users
        const users = await User.insertMany([
            { username: 'john_doe', email: 'john.doe@example.com', password: 'hashedpassword1', phone: 1234567890, address: '123 Main St', role: 'customer' },
            { username: 'jane_admin', email: 'jane.admin@example.com', password: 'hashedpassword2', phone: 9876543210, address: '456 Admin Ave', role: 'admin' },
            { username: 'shop_owner1', email: 'shop.owner1@example.com', password: 'hashedpassword3', phone: 1122334455, address: '789 Shop Blvd', role: 'shop' },
            { username: 'shop_owner2', email: 'shop.owner2@example.com', password: 'hashedpassword4', phone: 5544332211, address: '101 Commerce Rd', role: 'shop' },
            { username: 'alice_customer', email: 'alice.c@example.com', password: 'hashedpassword5', phone: 1122334466, address: '10 Customer Lane', role: 'customer' },
        ]);
        const [john, jane, shopOwner1, shopOwner2, alice] = users;
        console.log(`Created ${users.length} users.`);

        // 3. Create Sample Shops (requires users with 'shop' role)
        const shops = await Shop.insertMany([
            { name: 'My Awesome Shop', platform: 'Shopify', user_id: shopOwner1._id },
            { name: 'Fashion Hub', platform: 'Etsy', user_id: shopOwner2._id },
        ]);
        const [myAwesomeShop, fashionHub] = shops;
        console.log(`Created ${shops.length} shops.`);

        // 4. Create Sample Categories
        const categories = await Category.insertMany([
            { name: 'Electronics', description: 'Gadgets and electronic devices' },
            { name: 'Apparel', description: 'Clothing and fashion accessories' },
            { name: 'Home Goods', description: 'Items for home and living' },
            { name: 'Custom Prints', description: 'Personalized printed items' },
        ]);
        const [electronics, apparel, homeGoods, customPrints] = categories;
        console.log(`Created ${categories.length} categories.`);

        // 5. Create Sample Products (requires categories)
        const products = await Product.insertMany([
            { name: 'Smartphone X', description: 'Latest model smartphone', price: 799.99, stock_quantity: 50, image_url: 'https://example.com/smartphone.jpg', category_id: electronics._id },
            { name: 'Cotton T-Shirt', description: '100% pure cotton t-shirt', price: 19.99, stock_quantity: 200, image_url: 'https://example.com/tshirt.jpg', category_id: apparel._id },
            { name: 'Designer Coffee Mug', description: 'Ceramic coffee mug with unique design', price: 12.50, stock_quantity: 100, image_url: 'https://example.com/mug.jpg', category_id: homeGoods._id },
            { name: 'Laptop Pro', description: 'High performance laptop', price: 1200.00, stock_quantity: 30, image_url: 'https://example.com/laptop.jpg', category_id: electronics._id },
        ]);
        const [smartphoneX, cottonTShirt, coffeeMug, laptopPro] = products;
        console.log(`Created ${products.length} products.`);

        // 6. Create Sample Product Variants (requires shops and products)
        const productVariants = await ProductVariant.insertMany([
            { name: 'Smartphone X (Blue)', platform: 'Online Store', shop_id: myAwesomeShop._id, product_id: smartphoneX._id },
            { name: 'Cotton T-Shirt (Large, Red)', platform: 'Online Store', shop_id: fashionHub._id, product_id: cottonTShirt._id },
            { name: 'Laptop Pro (16GB RAM)', platform: 'Online Store', shop_id: myAwesomeShop._id, product_id: laptopPro._id },
        ]);
        console.log(`Created ${productVariants.length} product variants.`);

        // 7. Create Sample Custom Designs (requires users and products)
        const customDesigns = await CustomDesign.insertMany([
            { design_name: 'Johns Custom T-Shirt Design', color: 'Blue', text: 'Hello World!', image_url: 'https://example.com/design1.jpg', status: true, user_id: john._id, base_product_id: cottonTShirt._id },
            { design_name: 'Alices Personalized Mug', color: 'White', text: 'Best Mom Ever', image_url: 'https://example.com/design2.jpg', status: true, user_id: alice._id, base_product_id: coffeeMug._id },
            { design_name: 'Admin Logo Design', color: 'Black', text: 'Admin Logo', image_url: 'https://example.com/design3.jpg', status: false, user_id: jane._id, base_product_id: cottonTShirt._id },
        ]);
        const [johnsDesign, alicesDesign, adminDesign] = customDesigns;
        console.log(`Created ${customDesigns.length} custom designs.`);

        // 8. Create Sample Carts (requires users)
        const carts = await Cart.insertMany([
            { user_id: john._id },
            { user_id: alice._id },
        ]);
        const [johnsCart, alicesCart] = carts;
        console.log(`Created ${carts.length} carts.`);

        // 9. Create Sample Cart Items (requires carts, products, and custom designs)
        const cartItems = await CartItem.insertMany([
            { quantity: 1, unit_price: smartphoneX.price, cart_id: johnsCart._id, product_id: smartphoneX._id },
            { quantity: 2, unit_price: cottonTShirt.price, cart_id: johnsCart._id, product_id: cottonTShirt._id },
            { quantity: 1, unit_price: coffeeMug.price + 5, cart_id: alicesCart._id, custom_design_id: alicesDesign._id }, // Assuming custom designs add to price
            { quantity: 1, unit_price: laptopPro.price, cart_id: alicesCart._id, product_id: laptopPro._id },
        ]);
        console.log(`Created ${cartItems.length} cart items.`);

        // 10. Create Sample Orders (requires users)
        const orders = await Order.insertMany([
            {
                order_date: new Date(),
                status: 'Processing',
                total_amount: (smartphoneX.price * 1) + (cottonTShirt.price * 2), // Calculate based on items
                shipping_address: '123 Main St, Anytown, USA',
                payment_method: 'Online',
                user_id: john._id,
            },
            {
                order_date: new Date(Date.now() - 86400000), // One day ago
                status: 'Done',
                total_amount: (coffeeMug.price + 5) + laptopPro.price,
                shipping_address: '10 Customer Lane, Othercity, USA',
                payment_method: 'Online',
                user_id: alice._id,
            },
            {
                order_date: new Date(Date.now() - (2 * 86400000)), // Two days ago
                status: 'Cancel',
                total_amount: cottonTShirt.price,
                shipping_address: '456 Admin Ave, Thirdville, USA',
                payment_method: 'Online',
                user_id: jane._id,
            }
        ]);
        const [johnsOrder, alicesOrder, janeOrder] = orders;
        console.log(`Created ${orders.length} orders.`);

        // 11. Create Sample Order Items (requires orders, products, and custom designs)
        const orderItems = await OrderItem.insertMany([
            // Items for John's order
            { quantity: 1, unit_price: smartphoneX.price, order_id: johnsOrder._id, prouct_id: smartphoneX._id, custom_design_id: null }, // product_id, not prouct_id
            { quantity: 2, unit_price: cottonTShirt.price, order_id: johnsOrder._id, prouct_id: cottonTShirt._id, custom_design_id: null }, // product_id, not prouct_id

            // Items for Alice's order
            { quantity: 1, unit_price: coffeeMug.price + 5, order_id: alicesOrder._id, prouct_id: coffeeMug._id, custom_design_id: alicesDesign._id }, // product_id, not prouct_id
            { quantity: 1, unit_price: laptopPro.price, order_id: alicesOrder._id, prouct_id: laptopPro._id, custom_design_id: null }, // product_id, not prouct_id

            // Items for Jane's cancelled order
            { quantity: 1, unit_price: cottonTShirt.price, order_id: janeOrder._id, prouct_id: cottonTShirt._id, custom_design_id: adminDesign._id }, // product_id, not prouct_id
        ]);
        console.log(`Created ${orderItems.length} order items.`);

        console.log('Sample data seeding complete!');

    } catch (error) {
        console.error('Error seeding database:', error);
        if (error.code === 11000) { // MongoDB duplicate key error
            console.error('Possible duplicate key error: Ensure unique fields are unique in sample data or clear data before re-seeding.');
        }
    } finally {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed.');
        }
    }
};

// Run the seeding function
seedDB();
