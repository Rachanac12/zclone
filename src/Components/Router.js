import { BrowserRouter,Route } from "react-router-dom";
import Home from './Home';
import Filter from './Filter';
import Details from './Details';
import Account from './Account';
import Header from "./Header";

function Router()
{
    return(
        < BrowserRouter>
            <Header/>
            <Route exact path="/" component={Home}/>
            <Route path="/filter" component={Filter}/>
            <Route path="/details" component={Details}/>
            <Route path="/accounts" component={Account}/>
        </BrowserRouter>
    )
}
export default Router;






















