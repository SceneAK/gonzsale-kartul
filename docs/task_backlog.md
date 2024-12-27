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
## Seperate images
- Seperate product_images table
- Test the store_QR_imgSrc and store_imgSrc seperation
- test createMulter's field()
- Create product_images (image_id, product_id, imageSrc, image_order)
- change how images are added in createProduct, editProduct
- change how images are served in getProduct, getProducts

## Design Rework & Refactoring
- Split store Images into their own store_images table (store_id, store_imgSrc, store_QR_imgSrc)
- Split product images into their own product_images table (image_id, product_id, product_image)
- Get Products Filtered maybe rethink whether or not it should be in body or params?
- Refactor entire shit. Centralized logic along with centralized SQL queries please i beg
    - User Mysql query maker or somthing
- order has duplicate with store: getStoreOwnedBy...
## Complete Functions
    - Delete Product
    - Delete Store
    - Edit Profile

## Payment Gateway
- rename transaction table to basic_tansactions table

## Dynamic Try-Catch error handling

## Optimize update logic for product variant and product images

## Add paranoid delete for 

## Add Address Functionality
- add product_deliver_method ENUM('GONZAGA', 'TO_ADDRESS'); 
    - If an order is placed on a product with 'TO_ADDRESS', server requires user to provide an address. 
- add user_address table 

##　Request Home page Items (promotional content)

## Statistical Analysis for Seller Account
