// 把views中所有页面导出
import Loadable from 'react-loadable';
import Loading from '../components/loading';

// import Article from './Article'
// import Dashboard from './Dashboard'
// import Login from './Login'
// import NotFound from './NotFound'
// import Setting from './Setting'
// import Play from './Play'
// import ReManagement from './ReManagement'
// import ProductConfiguration from './ProductConfiguration'


//实现路由的懒加载
const Login = Loadable({
    loader: () => import('./Login'),
    loading: Loading,
});
const NotFound = Loadable({
    loader: () => import('./NotFound'),
    loading: Loading,
});
const Setting = Loadable({
    loader: () => import('./Setting'),
    loading: Loading,
});
const Play = Loadable({
    loader: () => import('./Play'),
    loading: Loading,
});
const ReManagement = Loadable({
    loader: () => import('./ReManagement'),
    loading: Loading,
});
const ProductConfiguration = Loadable({
    loader: () => import('./ProductConfiguration'),
    loading: Loading,
});
const Playing = Loadable({
    loader:()=> import('./Playing'),
    loading:Loading
})
const Add = Loadable({
    loader:()=> import('./Add'),
    loading:Loading
})
const Edit = Loadable({
    loader:()=> import('./Edit'),
    loading:Loading
})
const NodeSetting = Loadable({
    loader:()=> import('./NodeSetting'),
    loading:Loading
})
const NodeAdd = Loadable({
    loader:()=> import('./NodeAdd'),
    loading:Loading
})
const NodeEdit = Loadable({
    loader:()=> import('./NodeEdit'),
    loading:Loading
})
const ApplicationMapping = Loadable({
    loader:()=> import('./ApplicationMapping'),
    loading:Loading
})
const ApplicationAdd = Loadable({
    loader:()=> import('./ApplicationAdd'),
    loading:Loading
})
const ApplicationEdit = Loadable({
    loader:()=> import('./ApplicationEdit'),
    loading:Loading
})
const NodeMapping = Loadable({
    loader:()=> import('./NodeMapping'),
    loading:Loading
})
const NodeMappingAdd = Loadable({
    loader:()=> import('./NodeMappingAdd'),
    loading:Loading
})
const NodeMappingEdit = Loadable({
    loader:()=> import('./NodeMappingEdit'),
    loading:Loading
})
const NodeMappingCheck = Loadable({
    loader:()=> import('./NodeMappingCheck'),
    loading:Loading
})
const User = Loadable({
    loader:()=> import('./User'),
    loading:Loading
})
const UserAdd = Loadable({
    loader:()=> import('./UserAdd'),
    loading:Loading
})
const UserEdit = Loadable({
    loader:()=> import('./UserEdit'),
    loading:Loading
})
const QPlay = Loadable({
    loader:()=> import('./QPlay'),
    loading:Loading
})
const QPlaying = Loadable({
    loader:()=> import('./QPlaying'),
    loading:Loading
})
export {
    Login,
    NotFound,
    Setting,
    Play,
    ReManagement,
    ProductConfiguration,
    Playing,
    Add,
    Edit,
    NodeSetting,
    NodeAdd,
    NodeEdit,
    ApplicationMapping,
    ApplicationAdd,
    ApplicationEdit,
    NodeMapping,
    NodeMappingAdd,
    NodeMappingEdit,
    NodeMappingCheck,
    User,
    UserAdd,
    UserEdit,
    QPlay,
    QPlaying
}