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
- Store page (single)

## Integrationn
.Automatic refresh token
> My orders integration
> Product Edit
> Bulk Order status updating
> Reintegrate literally everything that involves product & orders

# BACKEND
## Implement Product Variants
DONE Product Image independence
DONE Product & Default VariantCreation
DONE Variant Creation
DONE Reworked product fetching
DONE Order placing
    DONE Cancel order stock replenishment logic
DONE Variant Editting
    DONE Variant isDefault logic
DONE Retest Product Editting
DONE Variant soft deletion
DONE Order soft deletion
DONE Image Deletion
DONE Include storeId in decodedAuthToken

## orders
DONE Filter based on variant, based on product, based on orderNotes (get count too)
. Mailing Customers when order status changes, when product gets deleted 

## Request Home page Items (promotional content)
- Design the system

## Preorder specific data
- Make frontend tell you if it's preorder

## Re-CAPTCHA
- Write System
- User & Guest Creation
- Checkout Page

## users
DONE Admin options in the website itself
- change password

## Optimize update logic for product variant and product images

## Refactor
- Rethink route file structure? It feels overcomplicated / weird
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