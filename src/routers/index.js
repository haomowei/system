// 公共路由与私有路由
import {Setting, NotFound, Login, Play, ReManagement, ProductConfiguration, Playing, Add, Edit, NodeSetting, NodeAdd, NodeEdit, ApplicationMapping, ApplicationAdd, ApplicationEdit, NodeMapping, NodeMappingAdd, NodeMappingEdit, NodeMappingCheck, User, UserAdd, UserEdit, QPlay, QPlaying} from '../views'

import Heade from '../components/heade'
const commentRouters = [
    {
        pathname:'/login',
        pathname2:'/login',
        component:Login,
        title:'登录页面'
    },
    {
        pathname:'/404',
        pathname2:'/404',
        component:NotFound,
        title:'404'
    },
    {
        pathname:'/header',
        pathname2:'/header',
        component:Heade
    }
]
// 私有路由
const privateRouters = [
    {
        pathname:'/track/play',
        pathname2:'/track/play',
        component:Play,
        title:'视频回溯'
    },
    {
        pathname:'/track/qplay',
        pathname2:'/track/qplay',
        component:QPlay,
        title:'齐鲁保二期'
    },
    {
        pathname:'/track/setting',
        pathname2:'/track/setting',
        component:Setting,
        title:'设置'
    },

    {
        pathname:'/track/remanagement',
        pathname2:'/track/remanagement',
        component:ReManagement,
        title:'回溯分析'
    },
    {
        pathname:'/track/productconfiguration',
        pathname2:'/track/productconfiguration',
        component:ProductConfiguration,
        title:'产品配置'
    },
    {
        pathname:'/track/playing/:id',
        pathname2:'/track/playing',
        component:Playing,
        title:'视频播放'
    },
    {
        pathname:'/track/qplaying/:id',
        pathname2:'/track/qplaying',
        component:QPlaying,
        title:'齐鲁保视频播放'
    },
    {
        pathname:'/track/add',
        pathname2:'/track/add',
        component:Add,
        title:'产品新增'
    },
    {
        pathname:'/track/edit/:id',
        pathname2:'/track/edit',
        component:Edit,
        title:'产品修改'
    },
    {
        pathname:'/track/nodesetting',
        pathname2:'/track/nodesetting',
        component:NodeSetting,
        title:'节点配置'
    },
    {
        pathname:'/track/nodeadd',
        pathname2:'/track/nodeadd',
        component:NodeAdd,
        title:'节点新增'
    },
    {
        pathname:'/track/nodeedit/:id',
        pathname2:'/track/nodeedit',
        component:NodeEdit,
        title:'节点修改'
    },
    {
        pathname:'/track/applicationmapping',
        pathname2:'/track/applicationmapping',
        component:ApplicationMapping,
        title:'产品应用映射'
    },
    {
        pathname:'/track/applicationadd',
        pathname2:'/track/applicationadd',
        component:ApplicationAdd,
        title:'产品应用映射新增'
    },
    {
        pathname:'/track/applicationedit/:id',
        pathname2:'/track/applicationedit',
        component:ApplicationEdit,
        title:'产品应用映射修改'
    },
    {
        pathname:'/track/nodemapping',
        pathname2:'/track/nodemapping',
        component:NodeMapping,
        title:'产品节点映射'
    },
    {
        pathname:'/track/nodemappingadd',
        pathname2:'/track/nodemappingadd',
        component:NodeMappingAdd,
        title:'产品节点映射新增'
    },
    {
        pathname:'/track/nodemappingedit/:id',
        pathname2:'/track/nodemappingedit',
        component:NodeMappingEdit,
        title:'产品节点映射修改'
    },
    {
        pathname:'/track/nodemappingcheck/:productName',
        pathname2:'/track/nodemappingcheck',
        component:NodeMappingCheck,
        title:'产品节点映射信息'
    },
    {
        pathname:'/track/user',
        pathname2:'/track/user',
        component:User,
        title:'用户管理'
    },
    {
        pathname:'/track/useradd',
        pathname2:'/track/useradd',
        component:UserAdd,
        title:'增加用户'
    },
    {
        pathname:'/track/useredit/:id',
        pathname2:'/track/useredit',
        component:UserEdit,
        title:'修改用户'
    }
]

export {
    commentRouters,
    privateRouters
}