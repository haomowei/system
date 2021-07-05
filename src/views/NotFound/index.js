import React from 'react'
import logo from '../images/logo.png'
import '../css/style.less'
class Notfound extends React.Component {
    render() {
        return(
            <div className="notfound">
                <img src={logo} alt=""/>
                <div>NotFound</div>
            </div>
        )
    }
}

export default Notfound