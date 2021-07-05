import React from 'react'
import Pako from 'pako'
import {Layout, Steps, Row, Col, Button, message} from 'antd'
import {PlaySquareOutlined, SnippetsOutlined, DownloadOutlined, PlayCircleOutlined} from '@ant-design/icons'
import '../css/style.less'
import 'rrweb/dist/rrweb.min.css'
import 'rrweb-player/dist/style.css'
// import {get} from '../../api/index-网络拦截'
import {getDatas} from '../../api'
import rrwebPlayer from 'rrweb-player'
import {BASE_URL} from '../../configs'

const {Header} = Layout
const {Step, progressDot} = Steps
// .ant-steps-item-custom.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon
// .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon
let doms

class Playing extends React.Component {
    constructor(props) {
        super(props)
        this.myRef = React.createRef()
        this.state = {
            //获取视频传参
            data: {
                vedioSeriesNo: 748241956756258816,
                typeId: 1
            },
            btnType1: 'primary',
            btnType2: 'default',
            isShow: false,
            tag: true,
            events: '',
            current: 0,
            stepList: [
                {
                    title: '节点1',
                    description: '产品详情（试算）'
                },
                {
                    title: '节点2',
                    description: '健康告知'
                },
                {
                    title: '节点3',
                    description: '信息录入'
                },
                {
                    title: '节点4',
                    description: '待支付订单'
                },
                {
                    title: '节点5',
                    description: '支付收银台'
                },
                {
                    title: '节点6',
                    description: '扣费回调结果'
                },
                {
                    title: '节点7',
                    description: '已完成订单'
                }
            ],
            videoDatas: {},//视频信息
            //获取视频回溯号
            vedioSeriesNo: 0,
            typeId: 1
        }
    }
    zip(str){
        let binaryString = Pako.gzip(encodeURIComponent(str), { to: 'string' })
        return btoa(binaryString);
    }
    unzip(b64Data) {
        var strData   = atob(b64Data);
        var charData  = strData.split('').map(function(x){return x.charCodeAt(0);});
        var binData   = new Uint8Array(charData);
        var data    = Pako.inflate(binData);
        // strData   = String.fromCharCode.apply(null, new Uint16Array(data));
        let array = new Uint16Array(data)
        var res = '';
        var chunk = 8 * 1024;
        var i;
        for (i = 0; i < array.length / chunk; i++) {
            res += String.fromCharCode.apply(null, array.slice(i * chunk, (i + 1) * chunk));
        }
        res += String.fromCharCode.apply(null, array.slice(i * chunk));

        strData = res
        return decodeURIComponent(strData);
    }
    componentDidMount = async () => {
        let doms = this.myRef.current
        doms.innerHTML = `
                        <div style="color:white;font-size: 30px;text-align: center;margin:150px 0 0;">loading...</div>
                    `
        await this.getVideoData(1)

    }

    getVideoData(parms) {
        var _this = this
        return getDatas('/record/insuTrace', {
            vedioSeriesNo: this.props.match.params['id'],
            typeId: parms
        })
            .then(res => {
                if (res.code === 0) {
                    console.log('videoDatas', res.data)
                    //增加判断record不为null 20201104
                    if (res.data.record) {
                        let a = this.zip('dsdsdsdsdsds')
                        console.log(a)
                        console.log(this.unzip(a))
                        // let a = btoa(Pako.deflate('12121212', {
                        //     to: 'string'
                        // }));
                        // console.log(a)
                        // try {
                        //     let b = Pako.inflate(atob(a),{
                        //         to:'string'
                        //     })
                        // } catch (err){
                        //     console.log(err);
                        // }

                        this.setState({
                            events: JSON.parse(JSON.parse(res.data.record)).events,
                            vedioSeriesNo: this.props.match.params['id'],
                            videoDatas: res.data
                        })
                        // let doms = _this.myRef.current
                        this.myRef.current.innerHTML = ''
                        if (this.state.events.length > 2) {
                            new rrwebPlayer({
                                target: this.myRef.current,
                                props: {
                                    events: this.state.events,
                                    autoPlay: false
                                },
                            })
                        } else {
                            this.myRef.current.innerHTML = `
                        <h1 style="color:white;font-size: 30px;text-align: center;marign-top:20px;">该节点没有录制视频</h1>
                    `
                        }
                    } else {
                        this.myRef.current.innerHTML = `
                        <h1 style="color:white;font-size: 30px;text-align: center;marign-top:20px;">该节点视频数据为null</h1>
                    `
                    }
                } else {
                    message.info(res.msg)
                }
                this.setState({
                    tag: false
                })
            })
    }

    step() {
        return (
            this.state.stepList.map(item => {
                return <Step disabled={this.state.tag} icon={<PlaySquareOutlined/>} key={item.title}
                             title={item.description}/>
            })
        )
    }
    changePay=async (e)=> {
        if(e == 1){
            this.setState({
                btnType1: 'primary',
                btnType2: 'default',
            })
            await this.getVideoData(4)
        }else{
            this.setState({
                btnType1: 'default',
                btnType2: 'primary',
            })
            await this.getVideoData(11)
        }
    }
    onChange = async (current) => {
        const _this = this
        _this.setState({
            events: '',
            tag: true
        })
        if (current == 3) {
            this.setState({
                isShow: true
            })
        } else {
            this.setState({
                isShow: false
            })
        }
        console.log('step', current)
        this.setState({current})
        let doms = _this.myRef.current
        doms.innerHTML = `
                        <div style="color:white;font-size: 30px;text-align: center;margin:150px 0 0;">loading...</div>
                    `
        await this.getVideoData(current + 1)
    }

    download(event) {
        window.location.href = BASE_URL + '/record/download?vedioSeriesNo='+event
    }

    render() {
        const isShow = this.state.isShow
        let button
        if (isShow) {
            button = (<div style={{textAlign: 'center', padding: '20px 0 0'}}>
                <Button type={this.state.btnType1} icon={<PlayCircleOutlined/>} style={{marginRight: '10px'}} onClick={()=>this.changePay(1)}>即时支付</Button>
                <Button type={this.state.btnType2} icon={<PlayCircleOutlined/>} onClick={()=>this.changePay(2)}>重新支付</Button>
            </div>)
        } else {
            button = ''
        }
        //获取浏览器上传过来的参数
        // console.log(this.props.match.params['id'])
        return (
            <React.Fragment>
                <div className="p_title">视频回溯</div>
                <Steps
                    type="navigation"
                    current={this.state.current}
                    // progressDot
                    onChange={this.onChange}
                >
                    {this.step()}
                </Steps>
                <div className='p_video'>
                    <Row>
                        <Col sm={{span: 4}} xl={{span: 3}}>
                            <div className="snip_top">
                                <SnippetsOutlined className="snip_icon"/>销售回溯信息
                            </div>
                            <div className="snip_bottom">
                                <div>
                                    <div>保险产品计划</div>
                                    {this.state.videoDatas.productName}
                                </div>
                                <div  title={this.state.videoDatas.policyNo}>
                                    <div>保单号</div>
                                    {this.state.videoDatas.policyNo}
                                </div>
                                <div>
                                    <div>订单号</div>
                                    {this.state.videoDatas.orderSn}
                                </div>
                                <div>
                                    <div>投保人</div>
                                    {this.state.videoDatas.appName}
                                </div>
                                <div>
                                    <div>视频生成时间</div>
                                    {this.state.videoDatas.createTime}
                                </div>
                                <div>
                                    <div>业务回溯码</div>
                                    {this.state.videoDatas.vedioSeriesNo}
                                </div>
                                <Button style={{marginTop: '14px'}} type="primary" shape="round"
                                        icon={<DownloadOutlined/>} onClick={() => this.download(this.state.videoDatas.vedioSeriesNo)} >
                                    Download
                                </Button>

                            </div>
                        </Col>
                        <Col span={19} style={{overflow: 'hidden'}}>
                            <div style={{height: '100%', background: 'black'}} className="video_out">
                                <div className="video_item">
                                    {/*<Button type="primary">{this.state.vedioSeriesNo}</Button>*/}
                                    {/*<Button type="primary">{this.state.typeId}</Button>*/}
                                    <div style={{display: 'flex', justifyContent: 'center'}} ref={this.myRef}>

                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    {button}
                </div>

            </React.Fragment>
        )
    }
}

export default Playing