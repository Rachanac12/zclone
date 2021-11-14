    import React from 'react';
    import '../Styles/home.css';
    import axios from 'axios';
    import {withRouter} from 'react-router-dom';
    class Wallpaper extends React.Component{
        constructor(){
            super();
            this.state={
                restaurants:[],
                suggestions: []
            }
        }
        handleChangeLocation=(event)=>{
            const locationId=event.target.value;
            sessionStorage.setItem('locationId',locationId);
            axios({
                url: `http://localhost:1588/restaurants/${locationId}`,
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(response => {
                    this.setState({ restaurants: response.data.restaurants })
                })
                .catch()

        }
        handleInput=(event) =>{
            let{restaurants}= this.state;
            const  searchField = event.target.value;
            restaurants = restaurants.filter((item)=>item.name.toLowerCase().includes(searchField.toLowerCase()));
            this.setState({suggestions:restaurants});

        }
        selectedText =(resId)=>{
            this.props.history.push(`/details?restaurant=${resId}`);
        }
        renderRestaurants =() =>{
            const{suggestions} = this.state;

            if (suggestions.length == 0){
                return null;
            }
            return(
                <ul className="list-group li-style">
                    {
                        suggestions.map((item,index)=>{
                        return <li className="list-group-item list-group-item-secondary" key={index} onClick={()=>this.selectedText(item._id)}>
                            <img src={`./${item.image}`} className="li-img" height="40px" width="40px"/>
                            {`${item.name} - ${item.locality} , ${item.city}`}
                        </li>
                        })
                    }
                </ul>
                
            )
            
        }
        render(){
            
            const {locationsData} =this.props;
            return(
                <div>
                    <img className="img-main1" src="./Assets/bg3x.png" height="450px" width="100%"/>
                    <div className="container center1">
                            <div className="row">
                                <div style={{height:"100px",width:"115px"}} className="col-sm-12 col-md-12 col-lg-12 logo1 text-center mx-auto" align="center">e!</div>
                            </div>
                            <div className="row">
                                <p className="col-sm-12 col-md-12 col-lg-12 mini1 text-center">Find the best restaurants, cafes and bars</p>
                            </div>
                            <div className="row">
                                        <select className="text-loc1 text-center form-select" onChange={this.handleChangeLocation} style={{display:"inline-block"}}>
                                                <option value="0">Please select a Location</option>
                                                {
                                                    locationsData.map((item,index)=>{
                                                        return <option key={index+1} value={item.location_id}>{`${item.name},${item.city}`}</option>
                                                    })
                                                }
                                        </select>
                                    
                                        <div className="col-sm-12 col-md-12 col-lg-6 col-xs-6 text-center" style={{display:"inline-block"}}>
                                            <span className="fal fa-search icon-check1" ></span>
                                        <input className="search-loc1" type="text" placeholder="Search for restaurants" onChange={this.handleInput}/>
                                        {this.renderRestaurants()}
                                        </div>
                            </div>
                    </div>
                </div>
            )
        }
    }
    export default withRouter(Wallpaper);