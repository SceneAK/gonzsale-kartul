Please sort by importance
# Gonzsale Website
## Route Management
- cleanup frontend static route & backend route

## Deployment & Prep
- learn how to customize DNS settings &
- Get ssl certificate LET'S ENCRYPT
- Retest all functions

# FRONTEND

- Create Store Looks Ugly
## Missing Pages
- Store page (single)

## Integrationn
.Automatic refresh token
DONE Integrated Order & Guest Orders

# BACKEND
## orders
- Mailing Customers when order status changes, when product gets deleted 

## Request Home page Items (promotional content)

## Fix
DONE Transaction Order does not require UserID

## Re-CAPTCHA
- Write System
- User & Guest Creation
- Checkout Page

## users
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
- Implement propper signout & blacklisting 
- Payment Gateway
- Use paranoid delete
- AI generated product titles lmaoo

# Security Concerns & Abuse Protection
- Limit number of variants
- Express-Rate-Limiter
- Cors check reconfig
// todo: check if user has association with the order