import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Login from './views/Login'
import './index.less'
//配置中文环境
import zhCN from 'antd/es/locale/zh_CN';
import {ConfigProvider } from 'antd'

// import {BrowserRouter as Router, Link, NavLink, Route, Switch, Redirect} from 'react-router-dom';
import {HashRouter as Router, Link, NavLink, Route, Switch, Redirect} from 'react-router-dom';
import {commentRouters, privateRouters} from './routers'






//开启路由,路由守卫
ReactDOM.render(

    <ConfigProvider locale={zhCN}>
        <Router basename="/hermessys">
            <Switch>
                {/*<App />*/}
                {/*私有页面*/}
                {
                    <Route path="/track" render={(rootProps)=> {
                        return <App {...rootProps}/>
                    //    授权检测TODO
                    //     console.log(rootProps)
                    //     return <App {...rootProps}/>

                    }}/>
                }
                {/*{*/}
                    {/*<Route path="/login" render={(rootProps)=> {*/}

                        {/*if(sessionStorage.getItem("isLogin") == "true"){*/}
                            {/*console.log('login.....')*/}
                            {/*return <Redirect  to="/admin" exact/>*/}
                        {/*}else{*/}
                            {/*return <Login {...rootProps}/>*/}
                        {/*}*/}

                        {/*//    授权检测TODO*/}
                        {/*//     console.log(rootProps)*/}
                        {/*//     return <App {...rootProps}/>*/}

                    {/*}}/>*/}
                {/*}*/}
                {/*共有页面*/}
                {
                    commentRouters.map((item,index)=> {
                        return(
                            <Route key={item.pathname} path={item.pathname} component={item.component}/>
                        )
                    })
                }
                {/*配置默认页*/}

                <Redirect from="/" to="/track" exact/>
                <Redirect to="/404"/>

            </Switch>

        </Router>

    </ConfigProvider>,
    document.getElementById('root')
);
