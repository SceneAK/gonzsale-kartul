Please sort by importance
# Gonzsale Website
## Route Management
- cleanup frontend static route & backend route

## Deployment & Prep
- learn how to customize DNS settings &
- Get ssl certificate LET'S ENCRYPT
- Retest all functions

# FRONTEND
## Missing Pages
- Single product page
- Store page (single)

## Integration
> Get Orders page Integration
> Place Order Integration
- Automatic refresh token
- Create Store Page Integration 

# BACKEND
## Test & Debug
> Change orderitem status

## orders
> Cleanly seperate the routes. 
> Calculate overall order status
- Order Items of the same order must have unique items. cannot order the same item twice in two orderItems
- Mailing Customers when order status changes, when product gets deleted, when  

## users
-    edit user profile
- change password

## Implement product variants

## Optimize update logic for product variant and product images

## Preorder specific data

## Refactor
- Rework productImage creation and priority so that whoever uses the service completes the data first (with an exported function) before passing it to productImageServices
- Custom Error classes extending ApplicationError
- Move logic that creates circular dependency to OrderManagementServices: orderItemServices.UpdateStatus + orderServices.createOrder()

## Extended Less Important Backlog
- Statistical Analysis for Seller Account
- Request Home page Items (promotional content)
- Implement signout (set cookie as expired)
- Payment Gateway
- Use paranoid delete
- AI generated product titles lmaoo

# Security Concerns & Abuse Protection
- Limit number of variants
- Express-Rate-Limiter
- Cors check reconfig
// todo: check if user has association with the order