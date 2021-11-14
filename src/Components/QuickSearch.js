import React from 'react';
import '../Styles/home.css'
import QuickSearchItems from './QuickSearchItems';
class QuickSearch extends React.Component{
    render(){
        const {QuickSearchData}=this.props;
        return(
            <div>
                <div className="container ml-1">
                    <div className="row">
                        <div className="quick1 col-sm-12 col-md-12 col-lg-12 mt-5 pl-2 ml-sm-4 pl-sm-4">Quick Searches</div>
                    </div>
            
                    <div className="row">
                        <div className="discover1 col-sm-12 col-md-12 col-lg-12 pl-2 ">Discover restaurants by type of meal</div>
                    </div>
                </div>
        
                <div className="container mt-5 text-center">
                    <div className="row">
                        {
                            QuickSearchData.map((item,index)=>{
                                return <QuickSearchItems key={index} QSItemData={item}/>
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default QuickSearch;