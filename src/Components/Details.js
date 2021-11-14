import React from 'react';
import axios from 'axios';
import queryString from 'query-string';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import Modal from 'react-modal';
import "react-responsive-carousel/lib/styles/carousel.min.css"; 
import { Carousel } from 'react-responsive-carousel';
import '../Styles/details.css';

const cs={
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height:'600px',
        width:'400px'

    },
};

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        
    },
};


class Details extends React.Component{
    constructor(){
        super();
        this.state={
            restaurants:{},
            resId:undefined,
            menuItems:[],
            resname:"",
            itemsModalIsOpen: false,
            galleryModalIsOpen:false,
            formModalisOpen:false,
            paymentmodalisopen:false,
            subTotal:0,
            firstName:"",
            lastName:"",
            email:"",
            contact_num:undefined,
            address:undefined
        }
    }
    componentDidMount(){
    const qs=queryString.parse(this.props.location.search);
    const {restaurant}=qs;  
    axios({
        url: `http://evening-temple-85571.herokuapp.com/restaurant/${restaurant}`,
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => {
            this.setState({ restaurants: response.data.restaurants,resId:restaurant,resname: response.data.restaurants.name})
        })
        .catch()
    }
    handleOrder=()=>{
        const {resId,menuItems}=this.state;
        axios({
            url: `http://evening-temple-85571.herokuapp.com/menuitems/${resId}`,
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
            this.setState({ menuItems: response.data.items });
        })
        .catch()
        this.setState({ menuItems,itemsModalIsOpen:true });
    }
    handleModal=(state,value)=>{
        this.setState({[state]:value});
    }
    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.menuItems];
        const item = items[index];

        if (operationType == 'add') {
            item.qty += 1;
        }
        else {
            item.qty -= 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ menuItems: items, subTotal: total });
        console.log(items);
    }
    handleChange=(event,state)=>{
            this.setState({[state]:event.target.value})
    }
    
    isDate(val) {
        
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        return typeof val === 'object'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }
    buildForm = ({ action, params }) => {
        const form = document.createElement('form')
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', key)
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })
        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }

    getData = async (data) => {
        try {
            const response = await fetch(`http://localhost:1588/payment`, {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (err) {
            return console.log(err);
        }
    }

    Payment = () => {
        const { subTotal, email } = this.state;

        const paymentObj = {
            amount: subTotal,
            email
        };

        this.getData(paymentObj).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/order/process",
                params: response
            }
            this.post(information)
        })
    }
    handleorders = () => {
        const { email, password, firstName, lastName, contact_num, address, menuItems, subTotal, resId,resname } = this.state;
        const orderObj = {
            email,
            password,
            firstName,
            lastName,
            contact_num,
            address,
            menuItems,
            subTotal,
            restaurantId: resId,
            resname:resname
        };
        axios({
            url: 'http://evening-temple-85571.herokuapp.com/orders',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: orderObj

        })
            .then(response => {
                if (!email || !firstName || !lastName || !address || !contact_num) {
                    alert(response.data.message);
                 }
               else{ 
                this.setState({
                    email,
                    password,
                    firstName,
                    lastName,
                    contact_num,
                    address,
                    menuItems,
                    subTotal,
                    restaurantId:resId,
                    resname,
                    paymentmodalisopen: true,
                    formModalisOpen:false
                });
            }
               
            })
            .catch(err => console.log(err))


    }
    render(){
        const {restaurants,itemsModalIsOpen,menuItems,galleryModalIsOpen,subTotal,formModalisOpen,name,email,contact_number,address,paymentmodalisopen} =this.state;
        return(
            <div>
                
                <div className="container">
                <div><img  src={`./${restaurants.image}`} style={{marginTop:"1%",height:"430px",width:"100%"}}/><button className="inside-d" onClick={()=>this.handleModal('galleryModalIsOpen',true)} >Click to see image gallery</button></div><br/><br/>
                <div className="quick">{restaurants.name}</div><br/>
                <button className="button-order btn btn-danger" onClick={this.handleOrder}>Place Online Order</button>

               <section>
                <ul className="nav nav-tabs" role="tablist">
                <li class="nav-item" role="presentation">
                    <a class="nav-link active" id="home-tab" data-bs-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Overview</a>
                </li>
                <li class="nav-item" role="presentation">
                     <a class="nav-link" id="contact-tab" data-bs-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                </li>
                
              </ul>
              <div className="tab-content">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div className="content">
                            <div className="start">About this place</div>
                            <div className="cuisine">Cuisine</div>
                            <div className="value">{restaurants && restaurants.cuisine &&  restaurants.cuisine.map(item=>`${item.name},`)}</div>
                            <div className="cuisine">Average Cost</div>
                            <div className="value">&#8377;{restaurants.min_price} for two people(approx)</div><br/><br/>
                        </div>
                </div>
                <div class="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                  <div className="content">
                            <div className="start">Phone Number</div>
                            <div className="value-phone">+{restaurants.contact_number}</div>
                            <div className="cuisine">{restaurants.name}</div>
                            <div className="content">{`${restaurants.locality},${restaurants.city}`}</div>
                        </div>
                </div>
                
              </div>
      
            </section>
            <br/><br/>
                
                </div>
                <Modal
                        isOpen={itemsModalIsOpen}
                        style={customStyles}
                       
                    >
                        <div className="see">
                            <div style={{ padding: '20px' }} >
                            <div className="fas fa-times" style={{float:"right"}} onClick={()=>this.handleModal('itemsModalIsOpen',false)}></div>
                            <div >
                                    <h3 className="restaurant-name">{restaurants.name}</h3>
                                    <h3 className="item-total">SubTotal :&#8377;{subTotal}</h3>
                                    <button className="btn btn-danger order-button" style={{marginBottom:"30px"}} onClick={()=>{
                                        this.handleModal('itemsModalIsOpen',false) 
                                        this.handleModal('formModalisOpen',true)
                                        }}> Pay Now</button>
                                    {menuItems.map((item, index) => {
                                        return <div className="card">
                                            <div className="card-body" style={{ padding: '15px 20px 5px 20px' }} >
                                                <div className="row">
                                                    <div className="col-xs-6 col-sm-6 col-md-9 col-lg-9 ">
                                                        <span className="D-body">
                                                            <h5 className="item-name" >{item.name}</h5>
                                                            <h5 className="item-price">&#8377;{item.price}</h5>
                                                            <p className="item-descp">{item.description}</p>
                                                        </span>
                                                    </div>
                                                    <div className="col-xs-6 col-sm-6 col-md-3 col-lg-3"> <img style={{height: "110px",width: "148px"}}className="card-img-center title-img" src={`../${item.image}`} />
                                                        {item.qty == 0 ? 
                                                        <div>
                                                            <button className="btn btn-outline-primary add-button" style={{marginLeft:"46px"}} onClick={() => this.addItems(index, 'add')}>Add</button>
                                                        </div> :
                                                            <div className=" add-number" style={{marginLeft: "50px"}}>
                                                                <button className="btn btn-sub p-0" style={{ width: '20px', height: '29px', color: '#61b246' }} onClick={() => this.addItems(index, 'subtract')}>-</button>
                                                                <span className="add" style={{ backgroundColor: 'white', width: '20px', marginLeft: '3px' }}>{item.qty}</span>
                                                                <button className="btn btn-add p-0" style={{ width: '29px', height: '29px', border: "none", marginLeft: '5px', color: '#61b246' }} onClick={() => this.addItems(index, 'add')}>+</button>
                                                            </div>}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                    })}
                                    <div className="card">

                                    </div>
                                
                            </div>
                            </div>
                        </div>
                        
                </Modal>
                <Modal
                        isOpen={galleryModalIsOpen}
                        style={customStyles}
                       
                    >
                        <div>
                            <div className="fas fa-times" style={{float:"right"}} onClick={()=>this.handleModal('galleryModalIsOpen',false)}></div>
                            <div>
                            <Carousel showThumbs={false}>
                                {restaurants && restaurants.thumb && restaurants.thumb.map(image=>{
                                    return <div>
                                    <img src={`./${image}`}/>
                                </div>
                                })}
                            </Carousel>
                            </div>
                        </div>
                        
                    </Modal>
                    <Modal
                        isOpen={formModalisOpen}
                        style={customStyles}
                       
                    >
                        <div>
                            <div className="fas fa-times" style={{float:"right"}} onClick={()=>this.handleModal('formModalisOpen',false)}></div>
                           <h3>{restaurants.name}</h3>
                           <div>
                               <label className="form-label">FirstName</label>
                               <input type="text" placeholder="Enter your first name" className="form-control is-invalid" required onChange={(event)=>this.handleChange(event,'firstName')}/>
                           </div>
                           <div>
                               <label className="form-label">LastName</label>
                               <input type="text" placeholder="Enter your last name" className="form-control is-invalid" required onChange={(event)=>this.handleChange(event,'lastName')}/>
                           </div>
                           <div>
                               <label className="form-label">Email</label>
                               <input type="text" placeholder="Enter your Email" className="form-control is-invalid" required onChange={(event)=>this.handleChange(event,'email')}/>
                           </div>
                           <div>
                               <label className="form-label">Contact Number</label>
                               <input type="tel" placeholder="Enter your Contact Number" className="form-control" onChange={(event)=>this.handleChange(event,'contact_num')}/>
                           </div>
                           <div>
                               <label className="form-label">Address</label>
                               <textarea placeholder="Enter your Address" className="form-control" onChange={(event)=>this.handleChange(event,'address')}/>
                           </div>
                           <button className="btn btn-outline-danger" onClick={this.handleorders}>Proceed</button>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={paymentmodalisopen}
                        style={customStyles}

                    >
                        <div className="fas fa-times" style={{float:"right"}} onClick={()=>this.handleModal('paymentmodalisopen',false)}></div>
                        <div>
                        <div className="payheading">{restaurants.name}</div>
                        <h3 style={{fontSize:"18px"}}>SubTotal: {subTotal}</h3>
                        <div>
                        {menuItems.length >1 ?menuItems.filter((item)=>item == item.qty=== item.qty<1).map((item, index) => {
                        
                        return <div key={index}>
                                            <div>
                                            <img style={{borderRadius:'50px',padding:'3px',marginLeft:'11px'}} src={`./${item.image}`} height="50px" width="50px" />
                                                <span className="payitem-name">{item.name}Quantity:-{item.qty}</span>
                                            </div>
                                        </div>
                                    }): null }


                        </div>
                           
                    <button className="btn btn-danger"style={{float:"right"}} onClick={this.Payment}>PAY</button>
                      
                    </div>
                    </Modal>
                
            </div>
        )
    }

}
export default withRouter(Details);
