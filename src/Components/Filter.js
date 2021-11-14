import React from 'react';
import '../Styles/filter.css';
import queryString from 'query-string';
import axios from 'axios';

class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations: [],
            pageCount:[],
            location: undefined,
            mealtype: undefined,
            cuisine: [],
            lcost: undefined,
            hcost: undefined,
            sort: undefined,
            lrating:undefined,
            hrating:undefined,
            
        }
    }
                componentDidMount() {
                const qs = queryString.parse(this.props.location.search);
                const { mealtype, location } = qs;
                const filterobj = {
                    mealtype: mealtype,
                    location: location
                };
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterobj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants,mealtype,location,pageCount: response.data.pageCount})
                    })
                    .catch()
                    axios({
                        url: 'http://localhost:1588/locations',
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' }
                    })
                        .then(response => {
                            this.setState({ locations: response.data.locations })
                        })
                        .catch()
        
            }
            handleLocationChange = (event) => {
                const location= event.target.value;
        
                const { mealtype, cuisine, lcost, hcost, sort, page } = this.state;
        
                const filterObj = {
                    mealtype,
                    location,
                    cuisine: cuisine.length === 0 ? undefined : cuisine,
                    lcost,
                    hcost,
                    sort,
                    page
                   
                };
        
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterObj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants,location,pageCount: response.data.pageCount })
                    })
                    .catch()
        
                this.props.history.push(`/filter?mealtype=${mealtype}&location=${location}`);
            }
            handleSortChange = (sort) =>{
                const { location, mealtype, cuisine, lcost, hcost, page } = this.state;
                const filterObj ={
                    mealtype,
                    location,
                    cuisine: cuisine.length === 0 ? undefined : cuisine,
                    lcost,
                    hcost,
                    page,
                    sort
                };
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterObj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants,sort,pageCount: response.data.pageCount})
                    })
                    .catch()
            }
            handleCostChange = (lcost, hcost) => {

                const { location, mealtype, cuisine, sort, page} = this.state;
        
                const filterObj = {
                    mealtype,
                    location,
                    cuisine: cuisine.length === 0 ? undefined : cuisine,
                    lcost,
                    hcost,
                    sort,
                    page
                };
        
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterObj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants, lcost, hcost,pageCount: response.data.pageCount })
                    })
                    .catch()
            }
            handleNavigate = (resId) => {
                this.props.history.push(`/details?restaurant=${resId}`);
            }
            handlePageChange = (page) => {
                const { location, mealtype, cuisine, sort, lcost, hcost } = this.state;
        
                const filterObj = {
                    mealtype,
                    location,
                    cuisine: cuisine.length === 0 ? undefined : cuisine,
                    lcost,
                    hcost,
                    sort,
                    page
                };
        
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterObj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants, page, pageCount: response.data.pageCount })
                    })
                    .catch()
            }
            handleCuisineChange = (cuisineId) => {

                const { location, mealtype, cuisine, sort, lcost, hcost, page } = this.state;
        
                const index = cuisine.indexOf(cuisineId);
                if (index >= 0) {
                    cuisine.splice(index, 1);
                }
                else {
                    cuisine.push(cuisineId);
                }
        
                const filterObj = {
                    mealtype: mealtype,
                    location: location,
                    cuisine: cuisine.length === 0 ? undefined : cuisine,
                    lcost,
                    hcost,
                    sort,
                    page
                };
                axios({
                    url: 'http://localhost:1588/filter',
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    data: filterObj
                })
                    .then(response => {
                        this.setState({ restaurants: response.data.restaurants,cuisine,pageCount: response.data.pageCount})
                    })
                    .catch()
            }
            render(){
                const {restaurants,pageCount,locations}= this.state;
                return(
                    <div>
                        <br/>
                        <div className="heading container mt-1 col-lg-12 col-md-12 col-sm-12 col-xs-12">Breakfast Places in Mumbai</div>
                        <br/><br/>
                        <div className="container">
                            <div className="container visible">
                                <span>Filter/Sort</span>
                                <span className="fas fa-angle-down" style={{float: "right"}} data-bs-toggle="collapse" data-bs-target="#targetDiv"></span>
                            </div>
                        <div id="targetDiv" className="container col-sm-12 col-xs-12 filter filters container collapse" style={{float:"left"}}>
                            <div className="text-filter">Filters</div>
                            <div className="sel-loc">Select Location</div>
                            
                            <select onChange={this.handleLocationChange}>
                                                    <option value="0">Select Location</option>
                                                    {locations.map((item) => {
                                                            return <option key={item.location_id} value={item.location_id}>{`${item.name}, ${item.city}`}</option>
                                                    })}
                            </select>
                            <div id="cuisine">Cuisine</div>
                            <input type="checkbox" onChange={()=>this.handleCuisineChange(1)}/><span className="check">North Indian</span><br/>
                            <input type="checkbox" onChange={()=>this.handleCuisineChange(2)}/><span className="check">South Indian</span><br/>
                            <input type="checkbox" onChange={()=>this.handleCuisineChange(3)}/><span className="check">Chinese</span><br/>
                            <input type="checkbox" onChange={()=>this.handleCuisineChange(4)}/><span className="check">Fast Food</span><br/>
                            <input type="checkbox" onChange={()=>this.handleCuisineChange(5)}/><span className="check">Street Food</span><br/>
        
                            <div id="cost">Cost For Two</div>
                            <input type="radio" name="enable" onChange={() => this.handleCostChange(1, 500)}/><span className="order">Less than &#8377;500</span><br/>
                            <input type="radio" name="enable"  onChange={() => this.handleCostChange(500, 1000)}/><span className="order">&#8377;500 to &#8377;1000</span><br/>
                            <input type="radio" name="enable"  onChange={() => this.handleCostChange(1000, 1500)}/><span className="order">&#8377;1000 to &#8377;1500</span><br/>
                            <input type="radio" name="enable"  onChange={() => this.handleCostChange(1500, 2000)}/><span className="order">&#8377;1500 to &#8377;2000</span><br/>
                            <input type="radio" name="enable"  onChange={() => this.handleCostChange(2000, 5000)}/><span className="order">&#8377;2000+</span><br/>
                            <input type="radio" name="enable"  onChange={() => this.handleCostChange(1, 5000)}/><span className="order">All</span><br/>

                            <div className="sort" >Sort</div>
                            <input type="radio" name="price" onChange={() => this.handleSortChange(1)} /><span className="order">Price low to high</span><br/>
                            <input type="radio" name="price" onChange={() => this.handleSortChange(-1)} /><span className="order">Price high to low</span><br/>
                        </div>
                        <div className="menu container" style={{float:"left"}}>
                            {restaurants.length>0?restaurants.map((item,index)=> {
                                return <div className="col-lg-6 col-md-6 col-sm-12 box boxs" key={index} onClick={() => this.handleNavigate(item._id)}>
                                <div>
                                    <div style={{float:"left",width:"20%"}}><img className="inside" src={`./${item.image}`}/></div>
                                    <div style={{float:"left",width:"80%"}}>
                                            <div className="c1">{item.name}</div>
                                            <div className="fort">{item.locality}</div>
                                            <div className="address">{item.city}</div>
                                    </div>
                                </div>
                               
                                <div>
                                    <div>
                                        <span className="cuisines">CUISINES:</span>
                                        <span id="bakery" className="items">{item.cuisine.map((cuisine)=>`${cuisine.name},`)}</span>
                                    </div>
                                    <br/>
                                    <div>
                                        <span className="cuisines">COST FOR TWO:</span>
                                        <span id="amt" className="items"><span>&#8377;</span>{item.min_price}</span>
                                    </div>
                                </div>
                                
                            </div>
                            }):<div className="no-records">NO RECORDS FOUND!! </div>}
                            <div>
                                { restaurants.length > 0 ? <div className="pagination">
                                        <div className="page-link" href="#">&laquo;</div>
                                        { pageCount.map((page)=>{
                                            return <div onClick={() => this.handlePageChange(page)} className="page-item">{page}</div>
                                        })}
                                        <div className="page-link" href="#">&raquo;</div>
                                    </div>:null }
                                </div>
                            </div>
                            </div>
                            </div>
                            )
                        }
                    }
                export default Filter;