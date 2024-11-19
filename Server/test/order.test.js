import chai from 'chai';
import chaiHttp from 'chai-http';
import {signIn} from '../src/controllers/user.js'
import orderRouter from '../src/routes/orderRoute.js';
import app from '../app.js';
const {expect} = chai;

chai.use(chaiHttp);

// Test Creating Orders first. If it passes

describe('Order route tests', ()=>{
    before(()=>{
        app.use('/', orderRouter);
    })
    
    describe('Placing Orders', ()=>{
        let authToken;
        before(()=>{
            let res = {
                json: function(obj) { authToken = obj.authToken; }
            }
            signIn({body: { user_email: "ta@music.com", user_password: "Travelers Of Musical Dreams"}}, res)
        })

        it('should correctly place orders when logged in', ()=>{
            chai.request(app)
                .post('/place/')
                .set('Authorization', `Bearer ${authToken}`)
                .send({ product_id: 0, order_qty: 2, order_variant: {color: red} })
        }) 
    })
    // describe('Getting Orders', ()=> {
    //     it('Should create (logged in) and get orders of user', ()=>{
    //         chai.request(app)
    //             .get('/')
    //             .set()
    //             .end((err, res)=>{
    //                 expect(res.body).to.have('', )
    //             })
    //     })
    // })
})