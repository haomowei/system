import React from 'react';
import {privateRouters} from "./routers/index";
import {Route, Switch, Redirect} from 'react-router-dom'
import FrameOut from './components/FrameOut'
import './App.less'

class App extends React.Component{
    constructor(props){
        super(props)
        console.log('app',props)
        this.props.history.listen(location=> {

            const pathname = location.pathname.split('/')
            console.log('pathname',pathname)
            const findOne = privateRouters.find(item=> {
                return pathname[0] ===item.pathname.split('/')[0]&&pathname[1] ===item.pathname.split('/')[1]&&pathname[2] ===item.pathname.split('/')[2]
            })
            if(findOne){
                window.document.title = findOne.title
                console.log('findOne',findOne)
            }
        })
    }
    updateParent=(data)=>{
        console.log('app数据',data)
        this.props.history.push({'pathname':data})
    }
    render() {
        return(
            <FrameOut appUpdate={(data)=>this.updateParent(data)}>
                <Switch>
                    {
                        privateRouters.map((item,index)=> {
                            return(
                                <Route key={item.pathname} exact path={item.pathname} component={item.component}/>
                            )
                        })
                    }
                    <Redirect from="/track" to={privateRouters[0].pathname} exact/>
                    <Redirect to="/404"/>
                </Switch>
            </FrameOut>
        )
    }
}


export default App;
