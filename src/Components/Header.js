import React from 'react';
import '../Styles/header.css';
import {withRouter} from 'react-router-dom';
import GoogleLogin from 'react-google-login';
import Modal from 'react-modal';
import axios from 'axios';

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

const customStyles1 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '198px',
        width: '337px'
    },
};

const customStyles2 = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '502px'
        },
};

class Header extends React.Component{
    constructor()
    {
        super();
        this.state={
            isLoginModalIsOpen:false,
            isLoggedIn:false,
            LoggedInUser:undefined,
            LoginForm:false,
            createModal:false,
            email:'',
            password:'',
            firstName:'',
            lastName:'',
            contact_num:undefined,
            user:[],
            profileObj: []
            
        }
    }
    handleaccountDetail =(email) =>{
        this.props.history.push(`/accounts?email=${email}`);
        }
    handleNavigate=()=>{
        this.props.history.push('/');
    }
    handleLogin=()=>{
        this.setState({isLoginModalIsOpen:true,createModal:false})
    }
    responseGoogle = (response) => {
        this.setState({LoggedInUser:response.profileObj.name,isLoggedIn:true,isLoginModalIsOpen:false})
    }
    handleLogOut=()=>{
          this.setState({isLoggedIn:false,LoggedInUser:undefined})
          this.props.history.push('/');
    }
    handleModal=(state,value)=>{
        this.setState({[state]:value});
    }
    handleLLogin=()=>{
        this.setState({LoginForm:true,isLoginModalIsOpen:false,createModal:false})
    }
    
    createAcc=()=>{
        this.setState({createModal:true})
    }
    handleInputChange = (event,state)=>{
        this.setState({[state] : event.target.value});
    }
    handleSignUp = ()=>{
        const {  email, password, firstName, lastName,contact_num} = this.state;
        const signUpObj = {
            email,
            password,
            firstName,
            lastName,
            contact_num
        };
           axios({
            url:'http://evening-temple-85571.herokuapp.com/usersignup',
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: signUpObj

        })
        .then(response => {
                alert(response.data.message)
                this.setState({
                    email,
                    password,
                    firstName,
                    lastName,
                    contact_num,
                    
                });
                if(response.data.message==="User already exists")
                    this.setState({  createModal:true,LoginForm:false})
                else
                    this.setState({  createModal:false,LoginForm:true})
                
         })
        .catch(err => console.log(err))
         


    }
    
    login = () => {
        this.setState({isLoggedIn:true,LoginForm:false})
    }
    handleLoggedin = () => {
        const { email, password} = this.state;
        const loginObj = {
            email,
            password,
        };
        axios({
            method: 'POST',
            url: 'http://evening-temple-85571.herokuapp.com/login',
            headers: { 'Content-Type': 'application/json' },
            data: loginObj
        })
            .then(response => {
                this.setState({
                    isLoggedIn: response.data.isAuthenticated,
                    email,
                    password,
                    LoggedInUser: email,
                    LoginForm: false,
                });
                alert(response.data.message);
                if(response.data.message==="Invalid mailID or Password")
                    this.setState({
                        LoginForm: true
                    })


            })
            .catch(err => console.log(err))

    }
    render(){
        const {isLoginModalIsOpen,isLoggedIn,LoggedInUser,LoginForm,createModal,email,password,firstName,lastName,contact_num}=this.state;
        return(
            
            <div className="header">
                <div className="header-logo" onClick={this.handleNavigate}>
                    <b>e!</b>
                </div>
                
                {isLoggedIn ? 
                    <div className="user-login">
                        <div className="login-u" onClick={()=>this.handleaccountDetail(email)}>{LoggedInUser}</div>
                        <div className="signup-u" onClick={this.handleLogOut}>LogOut</div>
                    </div> : 
                    <div className="user-login">
                        <div className="login-u" onClick={this.handleLogin}>Login</div>
                        <div className="signup-u" onClick={this.createAcc}>Create Account</div>
                    </div>
                }
                <Modal
                        isOpen={isLoginModalIsOpen}
                        style={customStyles1}
                    ><div>
                        <div className="loginModal">Login</div><br/>
                        <div className="fas fa-times" style={{float:"right",top:"13px"}} onClick={()=>this.handleModal('isLoginModalIsOpen',false)}></div>
                        <GoogleLogin
                            clientId="178248779100-ul7rsjebnck4trpkbo5qpv1678g0u9o9.apps.googleusercontent.com"
                            buttonText="Continue with Google"
                            onSuccess={this.responseGoogle}
                            onFailure={this.responseGoogle}
                            cookiePolicy={'single_host_origin'}
                            
                        />
                        <div className="container position">
                        <div className="path"></div>
                        <div className="or">OR</div>
                        <div className="already">Already have an Account?<button className="btn btn-danger" onClick={this.handleLLogin}>Sign In</button></div>
                        </div>
                    </div>
                </Modal>
                <Modal
                        isOpen={LoginForm}
                        style={customStyles}
                    ><div>
                        <div className="fas fa-times" style={{float:"right",top:"13px"}} onClick={()=>this.handleModal('LoginForm',false)}></div>
                        <div>
                            <label className="form-label"  >Email:</label>
                            <input type="text" placeholder="name@example.com" className="form-control is-invalid" required onChange={(event) => this.handleInputChange(event, 'email')} />
                        </div>
                        <div>
                            <label className="form-label">Password</label>
                            <input type="password" placeholder="********" className="form-control is-invalid" required onChange={(event) => this.handleInputChange(event, 'password')}/>
                        </div>
                        <button className="btn btn-danger" onClick={this.handleLoggedin}>LOGIN</button>
                    </div>
                 </Modal>
                 <Modal
                        isOpen={createModal}
                        style={customStyles2}
                    ><div>
                       
                        <div className="fas fa-times" style={{float:"right",top:"13px"}} onClick={()=>this.handleModal('createModal',false)}></div>
                         <div>
                            <label className="form-label">FirstName:</label>
                            <input type="text" className="form-control" onChange={(event) => this.handleInputChange(event, 'firstName')}/>
                        </div>
                        <div>
                            <label className="form-label">LastName:</label>
                            <input type="text" className="form-control"  onChange={(event) => this.handleInputChange(event, 'lastName')} />
                        </div>
                        <div>
                            <label className="form-label">Email</label>
                            <input type="email" className="form-control"  placeholder="name@example.com" onChange={(event) => this.handleInputChange(event, 'email')} />
                        </div>
                        <div>
                            <label className="form-label">Password:</label>
                            <input type="password" className="form-control" placeholder="********" onChange={(event) => this.handleInputChange(event, 'password')} />
                        </div>
                        <div>
                            <label className="form-label">Contact Number</label>
                            <input type="tel" className="form-control" onChange={(event) => this.handleInputChange(event, 'contact_num')} />
                        </div>
                        <button className="btn btn-danger" style={{float:"right",cursor:"pointer",marginTop:"10px"}} onClick={this.handleSignUp}>Register</button>
                        <div className="container position1">
                        <div className="path"></div>
                        <div className="or">OR</div>
                        <div className="already">Already have an Account?<span style={{color:"red",fontWeight:"bold",cursor:"pointer"}} onClick={this.handleLLogin}>Sign In</span></div>
                        </div>
                    </div>
                </Modal>
            </div>
        )
    }
}

export default withRouter(Header);
