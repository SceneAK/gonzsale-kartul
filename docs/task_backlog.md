Please sort by importance
# Gonzsale Website
## Route Management
- cleanup frontend static route & backend route
## Deployment & Prep
- Deploy backend + mysql + nginx/apache
- learn how to customize DNS settings &
- Get ssl certificate LET'S ENCRYPT
- Retest all functions

# FRONTEND
## Create New Pages
- Polish Create Product Page
- Store page (single)

## Integration
- Create Product Page Integration
- Get Orders page Integration
- Place Order (Logged in) Integration
- Store Page (single) Integration
- Create Store Page Integrate + logic when STORE_MANAGER but no owned store. 
- Product Catalog connected with product_availability

## Mailing
- Delete Product
- Limit number of variants
## order.js
- get singular order
- Mailing Customers when order status changes, when product gets deleted, when  
- Change Password
# Security Concerns & Abuse Protection
- Limit number of variants
- Express-Rate-Limiter
- Cors check reconfig


# BACKEND
## Sequelize Transition
.Image 
.Users
    .UserStorage
.Stores
- Products
    - ProductImages
    - Variants
- Orders
    - OrderVariants
- Transaction
    
## Seperate images
- Test the qrImage and image seperation
- test createMulter's field()

## Propper Error Handling
- Ensure pino .log server's response error message correctly. Currently it just says  "Server responded with error code 500/400/whatever lah"
- Check all route's potential error throw.
- Custom Error classes extending ApplicationError (maybe a bit much?)

## Complete Functions
    - Delete Product
    - Delete Store
    - Edit Profile

## Optimize update logic for product variant and product images

## Add paranoid delete for
- Transaction
- Orders, Order items, order variants
- Products, variants

## Payment Gateway
- rename transaction table to basic_tansactions table

## Additional Stuff
- Add Shipping option
- Statistical Analysis for Seller Account
- Request Home page Items (promotional content)
