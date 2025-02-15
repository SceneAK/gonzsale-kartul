Please sort by importance
# Gonzsale Website
## Route Management
- cleanup frontend static route & backend route

## Deployment & Prep
- learn how to customize DNS settings
- Retest all functions

# FRONTEND
## Missing Pages
- Store page (single)

## Integrationn
.Automatic refresh token
DONE Create product + default variant + product images
DONE Create variant
> Delete Variant
DONE Edit variant

> Carrousel product images 
DONE Variant sellection 

DONE Actually Ordering Items lmao
    DONE Mycart fixing

DONE integrate filtering orders based on variant and notes

> My orders integration
DONE Product Edit
DONE Pagination integration

> Product Image deletion editting
> Bulk Order status updating

# BACKEND
DONE fetching product+variant via variantId
> Prepare to switch to https & ssl certificate
> reCaptcha v2 integration, try to make a general captcha middleware before schema validation.
> make one general SSR endpoint for og metadata
    > reconfigure custom multer storage
> Separate images from store creation & editing logic
> Store allowed payment method redesign 💀

## Important
- SSL Certificates
- Catpcha V2

## orders
. Mailing Customers when order status changes, when product gets deleted 

## Request Home page Items (promotional content)
- Design the system

## Preorder specific data
- Make frontend tell you if it's preorder

## OAuth2

## users
- change password

## Refactor
- Rethink route file structure? It feels overcomplicated / weird
DONE (kindof) Move logic that creates circular dependency to OrderManagementServices: orderItemServices.UpdateStatus + orderServices.createOrder()

## Extended Less Important Backlog
- Statistical Analysis for Seller Account
- Implement propper signout & blacklisting 
- Payment Gateway
DONE Use paranoid delete

# Security Concerns & Abuse Protection
- Limit number of variants
- Express-Rate-Limiter
- Cors check reconfig
// todo: check if user has association with the order