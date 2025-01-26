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
## MAKE EVERYTHING WORK DAMNIT
- Guest Order -> create a guest account from userServices which only lasts this browsing session (via jwt token refreshes)
- Update OrderItem Status Logic

## Rework productImage creation and priority so that whoever uses the service completes the data first (with an exported function) before passing it to productImageServices

## Propper Error Handling
- Check all route's potential error throw.
- Custom Error classes extending ApplicationError (maybe a bit much?)

## Complete Functions
    - Delete Product
    - Delete Store
    - Edit Profile

## Optimize update logic for product variant and product images

## Add paranoid delete for
- Products, variants

## Payment Gateway

## Additional Stuff
- Statistical Analysis for Seller Account
- Request Home page Items (promotional content)

# Make so refunds can only be issued by store owners

## Implement signout (set cookie as expired)