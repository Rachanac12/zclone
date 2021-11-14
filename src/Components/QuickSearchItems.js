import React from 'react';
import '../Styles/home.css'
import {withRouter} from 'react-router-dom';
class QuickSearchItems extends React.Component{
    handleNavigate=(mealTypeId)=>{
        const locationId=sessionStorage.getItem('locationId');
        
        if(locationId){
            this.props.history.push(`/filter?mealtype=${mealTypeId}&location=${locationId}`)
        }
        else{
        this.props.history.push(`/filter?mealtype=${mealTypeId}`);
        }

    }
    render(){
        const {QSItemData} = this.props;
        return(
            
                <div key={QSItemData._id} className="col-lg-4 col-md-6 col-sm-12 box1 m-lg-4 m-md-3 m-sm-3 m-xs-3 m-3" style={{float:"left",width:"328px"}} onClick={()=>this.handleNavigate(QSItemData.meal_type)}>
                        <div style={{float:"left",width:"40%"}}><img src={`./${QSItemData.image}`}/></div>
                        <div style={{float:"left",width:"60%"}}>
                            <div className="b1">{QSItemData.name}</div>
                            <div className="b2">{QSItemData.content}</div>
                        </div>
                </div>
            
            
        )
    }
}
export default  withRouter(QuickSearchItems);