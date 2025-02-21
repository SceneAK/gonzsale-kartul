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
DONE Update order status bulk
    > Error with variant selection fo some reason
    > Refresh the page
    > Filter by notes too

# BACKEND
DONE fetching product+variant via variantId
DONE Prepare to switch to https & ssl certificate
    NO (AT LEAST NOT NOW) Maybe switch to nginx?
DONE prepare reCaptcha v2 middleware & env
    . test it when deployed
DONE .env template
> Change database name to lowercase 
> Product Images aren't in order of uploads for some reason
> Turn display product into an SSR
    DONE reconfigure custom multer storage

- Store payment method & transaction extension tables are over engineered.
- Bulk Delete Images
- Bulk Edit Variants

## orders
. Mailing Customers when order status changes, when product gets deleted 

## Request Home page Items (promotional content)
- Design the system

## Preorder specific data
> Make frontend tell you if it's preorder

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