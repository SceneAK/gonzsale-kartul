# NOTABLE LOGIC AND DESIGN CHOICES
## General
- Refer to setup.sql for database design and field names accessed in controllers
- Run Node Server/setups/secretKey.js to generate a secret key in console

## Script Interaction
- Scripts under './controllers' contains the route logic behind API requests such as getProduct, createUser, etc... 
- Scripts under './routes' only compiles related routes into one route and exports it.

## Route Interaction
### Auth.jS
- auth.js exports a middleware (checkAuthToken_middle) which authenticates the header authtoken, then fills the *authenticated_user_id* in req. This is intended to be run before an operation requiring user_id and authentication, returning an error if unauthorized.
- **Some route controllers expects this middleware to run right before, because it depends on authenticated_user_id.**
- The normal checkAuthToken returns the ID or an error. Used for Logins and such, where an error is expected, unlike the middleware.
