# NOTABLE LOGIC AND DESIGN CHOICES
## General
- Refer to setup.sql for database design and field names accessed in controllers
- Run Node Server/setups/secretKey.js to generate a secret key in console

## Directories
### Image Sources
- Server stores uploaded images to __dir/public/images/${filename}
- Access the files using gonzsale.com/source/${filename}

## Script Interaction
- Scripts under './controllers' contains the route logic behind API requests such as getProduct, createUser, etc... 
- Scripts under './routes' only compiles related routes into one route and exports it.

## Route Interaction
### tokenAuth.jS
- auth.js exports a middleware (checkAuthToken_middle) which authenticates the header authtoken, then fills the *authenticatedUserId* in req. This is intended to be run before an operation requiring user_id and authentication, returning an error if unauthorized.
- **Some route controllers expects this middleware to run right before and depends on authenticatedUserId.**
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### userAcc.js
- Besides handling user data updates, handles user sign-in and sign-up.
- Uses bcrypt for encrypting user passwords and comparing.