# NOTABLE LOGIC AND DESIGN CHOICES
## General
- Refer to setup.sql for database design and field names accessed in controllers
- Run Node Server/setups/secretKey.js to generate a secret key in console

## Modules
### Interactions
- Scripts under './controllers' contains the route logic behind API requests such as getProduct, createUser, etc... 
- Scripts under './routes' only compiles related routes into one route and exports it.
### upload.js
- uses multer to process form-data
- Expects authentication before 
- Server stores uploaded files to __dir/public/${relativeFilePath}
- Access the files using gonzsale.com/source/${relativeFilePath}
- Each User has a specified limit, which is tracked every upload and deletion of files. 
- Key name for image uploads is _image_, and _images_
### product.js
- create product expects imagesRouter from upload.js., and calling create product expects form-data
### tokenAuth.jS
- auth.js exports a middleware (verifyAuthToken_middle) which authenticates the header authtoken, then fills the *authenticatedUserId* in req. This is intended to be run before an operation requiring user_id and authentication, returning an error if unauthorized.
- *Some route controllers expects this middleware to run right before and depends on authenticatedUserId.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### user.js
- Besides handling user data updates, handles user sign-in and sign-up.
- Uses bcrypt for encrypting user passwords and comparing.





# BACKLOG
## user.js
- Edit Profile
- Change Password, maybe use mailer?
## store.js
>> Edit store details

Write Tests for general API calls, and then temporary test for getFile(url)

> Delete Store
## order.js
> Create Order
> Get Orders (only orders w/ auth-ed user_id as buyer/seller)
- Cancel Order maybe
- Update Order (only for auth-ed sellers, to update the order status etc)
## Transaction System
- (Proof based)
- (Payment Gateway Integration)
> Note Transaction
- Get Transaction
## Product Pricing
> Set up multiple pricing models?
