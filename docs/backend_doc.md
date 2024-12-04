# NOTABLE LOGIC AND DESIGN CHOICES
## General
- Refer to setup.sql for database design and field names accessed in controllers
- Run Node Server/setups/secretKey.js to generate a secret key in console
- Users with NULL passwords are considered guest users. They are users who have put their email for an order, but have yet to register.

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
    - If all operation is successful, then the controller should updateUsed() to update used storage space. 
    - Else, on error, unlink() the files in request.
    - This gives control which files to keep or unlink.
    - Note that updateUsed and unlink accept files because it's usually used after errors in incoming requests, meaning the files are directly accessible through req.files/file, meanwhile unlinkStored() uses relative paths instead of files because it's usually used on files already stored, no access to req.files/file  
- Key name for image uploads is _image_, and _images_
### product.js
- when creating, expect formdata, res.body = {product_name, product_description, product_category}
- create product expects imagesRouter from upload.js., and calling create product expects form-data
### tokenAuth.jS
- auth.js exports a middleware (verifyAuthToken_mid) which authenticates the header authtoken, then fills the *authenticatedUserId* in req. This is intended to be run before an operation requiring user_id and authentication, returning an error if unauthorized.
- *Some route controllers expects this middleware to run right before and depends on authenticatedUserId.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### user.js
- Besides handling user data updates, handles user sign-in and sign-up.
- Uses bcrypt for encrypting user passwords and comparing.




# BACKLOG
## Tests
> Write Tests! All route & API calls. 

## file uploads
- Product, Store, and Upload.js. Store filenames/relative paths only, reconstruct urls when sending to client.

## product variant handling
- Limit number of variants
- code up the variants
- 

## store.js
.Edit store details (Untested)
- Delete Store
- User is verified to make a store. 

## order.js
.Place Order Account
.Place Order Guest
.Get Orders (only orders w/ auth-ed user_id as buyer/seller)
//.Update Order (only for auth-ed sellers, to update the order status etc)
- Mailing Customers when order status changes.

## Transaction System
> (Proof based)
- (Payment Gateway??)
.ProcessTransaction

Email Validator instead of isValidEmail. 
Product has field CanOrder-> order implementation

## user.js
- Edit Profile
- Change Password, maybe use mailer?
- transition to cookies






// Remove URLS from req.url;
// Make a function that converts array of relative file paths into url form
// Move Store's unlink to upload.js
// 