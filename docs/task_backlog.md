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
> Create & Delete Variant
> Create & Delete Product Image
> Update order status bulk

# BACKEND
DONE fetching product+variant via variantId
DONE Prepare to switch to https & ssl certificate
    NO (AT LEAST NOT NOW) Maybe switch to nginx?
DONE prepare reCaptcha v2 middleware & env
    . test it when deployed
DONE .env template
> Turn display product into an SSR
    DONE reconfigure custom multer storage

> Store payment method & transaction extension tables are over engineered.
> Deleting product does not delete its images.
> Product Images aren't in order of uploads for some reason
> Bulk Delete Images
> Bulk Create Variants
> Bulk Edit Variants

- View Store percantik
- Percantik UI Create store NEEDS BACKEND INTEGRATION
- Checkout, storenya displaynya sama padahal storenya beda
- Order history nama headernya (COMPLETED, READY, PENDING) masih undefined dan no image
- Create Variant UI design NEEDS BACKEND INTEGRATION
- Carousel for product images NEEDS BACKEND INTEGRATION
-  Not adding a +62 format anymore, just sticking with example placeholder.
- delete image through the editproduct form, small x button near the displayed images. NEEDS BACKEND INTEGRATION

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

## Extended Less Important Backlog
- Statistical Analysis for Seller Account
- Implement propper signout & blacklisting 
- Payment Gateway

# Security Concerns & Abuse Protection
- Limit number of variants
- Express-Rate-Limiter
- Cors check reconfig
// todo: check if user has association with the order