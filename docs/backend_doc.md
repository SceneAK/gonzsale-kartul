# Notable Things
The following will contain some notable logic, design decisions/quirks, and bugs of the backend app alongside other potentially helpful information.
## Setup
- Install all node dependencies + MySQL Service
- Edit .env file to include SECRET_KEY, JWT_SECRET_KEY, PORT, MYSQL_URI
- Run Node Server/setups/secretKey.js to generate a secret key in console

## Database
- Uses MySQL Service, refer to **setup.sql** for the design
- Uses AUTO INCREMENT for most of the primary keys because anything sensitive is locked behind an account. Who cares if people can see how many products are made in this website.

## ReqSchemas
- Each controller+route has a req schema validation. reqSchemas are multiple JOI schemas that validate req keys mushed into one object. req  keys like body, params, file etc. 
- validate() itterates through these keys and validates the corresponding req keys' values. 
- Schemas .number() and such automatically attempts to convert into that data type (important for form-data requests, because all fields are text/string)
- In the validator middlware, Schema.validate use coersion to force convert types. Expect Formdata strings to be converted (except for objects)

## Modules
Notable points per "module"s of this app, including their controllers, routes, and schemas.
### Product
- Create Product expects formdata file of key 'product_imgSrc'
- GetProducts expects req.body to contain filters to the get request, product_category is also added from req params /:product_category.
### User
- Users with NULL passwords are considered guest users. They are users who have put their email for an order, but have yet to register.
### Order
- Place Order expects formdata file of key 'transaction_proof'
### Form-data & Uploads
- Server immediately stores uploaded files to __dir/public/${relativeFilePath}
- Access the files using gonzsale.com/source/${relativeFilePath}
- Files are stored in the database as their relative path to the public directory: Controllers must buildUrl() from the relative path when sending them back to the client.
- Limits are imposed on each user account:
    - Controller's responsibility: 
        - calling updateUsed(files, userId) updating used storage space. 
        - unlink() the files if an error has occurred.
    - Note that updateUsed() and unlink() take files because it's usually used after errors in incoming requests, meaning the files are directly accessible through req.files/file, meanwhile unlinkStored() uses relative paths because it's usually used on files already stored in the db

### Token Authentication
- auth.js exports a middleware (verifyUser) which authenticates the header authtoken, then fills the *authUser.id* in req. This is intended to be run before an operation requiring user_id and authentication, returning an error if unauthorized.
- *Some route controllers expects this middleware to run right before and depends on authUser.id.*
- The normal checkAuthToken returns the ID or an error. Used for Logins and such
### User
- Besides handling user data updates, handles user sign-in and sign-up.
- Uses bcrypt for encrypting user passwords and comparing.
- Kind of connected / tangled with tokenAuth, because signIn sets the cookies and tokenAuth expects 'token' in req.signedCookies.
- Schema's regex allows passwords and names to have chinese japanese characters, why the heck not?
### Store
- createStore (and update/endit store too) expects formdata file of key 'store_imgSrc'
- Although it's possible in the current system for Users to own multiple stores, we expect only one store per user.


# TASK BACKLOG
## transaction.js
.Get Transaction.
- (Payment Gateway??)

## order.js
- Order notes
.Place Order Guest
.Get Orders (only orders w/ auth-ed user_id as buyer/seller)
.Update Order (only for auth-ed sellers, to update the order status etc)
- Mailing Customers when order status changes.

## TEST EVERYTHING
- product
.order (place order guest not tested yet)
.user (get logic needs work, potentially requires rework on user_id)
- transaction

## Document the return format of each route
- Product
- User
- Store
- Order
- Transaction

## store.js
.Edit store details
- Delete Store
- store_qris

## product variant handling
- Limit number of variants
.implement variants

## user.js
- Edit Profile
- Change Password, maybe use mailer?
