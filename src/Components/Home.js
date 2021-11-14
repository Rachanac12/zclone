import React from 'react';
import axios from 'axios';
import '../Styles/home.css';
import Wallpaper from './Wallpaper';
import QuickSearch from './QuickSearch';

class Home extends React.Component{
    constructor()
    {
        super();
        this.state={
            locations:[],
            QuickSearchItems:[]
        }

    }
    componentDidMount(){
        sessionStorage.clear();
        axios({
            url:'http://evening-temple-85571.herokuapp.com/locations',
            method:'GET',
            headers:{'Content-Type':'application/json'}
        })
            .then(res=>{
                this.setState({locations:res.data.locations})
            })
            
            .catch()
            axios({
                url:'http://evening-temple-85571.herokuapp.com/mealtypes',
                method:'GET',
                headers:{'Content-Type':'application/json'}
            })
                .then(res=>{
                    this.setState({QuickSearchItems:res.data.mealtypes})
                })
                
                .catch()
    }
    render(){
        const {locations,QuickSearchItems}= this.state;
        return(
        <div>
            <Wallpaper locationsData={locations}/>
            <QuickSearch QuickSearchData={QuickSearchItems}/>
        </div>
        )
    }
}
export default Home;



