import React from 'react'
import {Layout, Steps, Row, Col, Button, message, Timeline } from 'antd'
import {PlaySquareOutlined, SnippetsOutlined, DownloadOutlined, PlayCircleOutlined} from '@ant-design/icons'
import '../css/style.less'
import 'rrweb/dist/rrweb.min.css'
import 'rrweb-player/dist/style.css'
import Oss from 'ali-oss'
// import {get} from '../../api/index-网络拦截'
import {getDatas} from '../../api'
import rrwebPlayer from 'rrweb-player'
import {BASE_URL} from '../../configs'
import axios from 'axios'

const {Header} = Layout
const {Step, progressDot} = Steps
// .ant-steps-item-custom.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon
// .ant-steps-item-wait .ant-steps-item-icon > .ant-steps-icon
let doms
let vDatas = []
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
            ossData:'111',//oss视频数据
            isShow: false,
            tag: true,
            events: '',
            ossName:'',//oss文件名称路径
            eventSingle:'',//节点历史视频
            current: 0,
            vId:'',//播放中的视频
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

    componentDidMount = async () => {
        let doms = this.myRef.current
        doms.innerHTML = `
                        <div style="color:white;font-size: 30px;text-align: center;margin:150px 0 0;">loading...</div>
                    `
        this.getOssToken()
        await this.getVideoData(1)

    }
    //获取osstoken
    getOssToken = async ()=>{
        await getDatas('/oss/getToken')
            .then(res=>{
                this.setState({
                    accessKeyId: res.data.accessKeyId,
                    accessKeySecret: res.data.accessKeySecret,
                    region: res.data.region,
                    bucket: res.data.bucket
                })
            })
    }
    getOss = async () =>{
        console.log(this.state.accessKeyId)
        let client = Oss({
            accessKeyId: this.state.accessKeyId,
            accessKeySecret: this.state.accessKeySecret,
            region: this.state.region,
            bucket:this.state.bucket
        });
        console.log('this.state.ossName',this.state.ossName)
        let url = client.signatureUrl(this.state.ossName);
        await axios({
            url,
            method:'get',
            async: false,
        })
            .then(val=>{
                this.setState({
                    ossData:val.data
                })
                // console.log(this.state.ossData)
                console.log((JSON.parse(this.state.ossData)).events)
            })
    }

    getVideoData= async(parms)=> {
        var _this = this
        return getDatas('/record/playInsuTrace', {
            vedioSeriesNo: this.props.match.params['id'],
            typeId: parms
        })
            .then(async res => {
                if (res.code === 0) {
                    console.log('videoDatas', res.data)
                    //增加判断record不为null 20201104

                    if (Array.isArray(res.data)) {
                        this.setState({
                            ossName:res.data[0].record
                        })
                        console.log(this.state.ossName)
                        if(this.state.ossName.toString().indexOf('events') != -1){
                            this.setState({
                                events: JSON.parse(JSON.parse(res.data[0].record)).events
                            })
                        }else{
                            await this.getOss()
                            this.setState({
                                events: JSON.parse(this.state.ossData).events
                            })

                        }
                        this.setState({
                            // events: JSON.parse(JSON.parse(res.data[0].record)).events,
                            vedioSeriesNo: this.props.match.params['id'],
                            videoDatas: res.data[0],
                        })
                        vDatas = res.data
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
        vDatas = []
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
    //新增所有节点视频
    plays = async (e) =>{
        this.setState({
            vId : e
        })
        let doms = this.myRef.current
        doms.innerHTML = ''
        // if (JSON.parse(JSON.parse((vDatas.find(value => {return value.id == e})).record)).events.length > 2) {

            if(this.state.ossName.toString().indexOf('events') != -1){
                this.setState({
                    eventSingle:JSON.parse(JSON.parse((vDatas.find(value => {
                        return value.id == e
                    })).record)).events
                },()=>{
                    if (this.state.eventSingle.length > 2) {
                        new rrwebPlayer({
                            target: this.myRef.current,
                            props: {
                                events: this.state.eventSingle,
                                autoPlay: false
                            },
                        })
                    }else {
                        this.myRef.current.innerHTML = `
                        <h1 style="color:white;font-size: 30px;text-align: center;marign-top:20px;">该节点视频数据为null</h1>
                    `
                    }
                })
            }else{

                this.setState({
                    ossName:vDatas.find(value => {
                        return value.id == e
                    }).record
                },async ()=>{
                    await this.getOss()
                    this.setState({
                        eventSingle: JSON.parse(this.state.ossData).events
                    },()=>{
                        if (this.state.eventSingle.length > 2) {
                            new rrwebPlayer({
                                target: this.myRef.current,
                                props: {
                                    events: this.state.eventSingle,
                                    autoPlay: false
                                },
                            })
                        }else {
                            this.myRef.current.innerHTML = `
                        <h1 style="color:white;font-size: 30px;text-align: center;marign-top:20px;">该节点视频数据为null</h1>
                    `
                        }
                    })
                })
            }

    }
    onChange = async (current) => {
        vDatas = []
        this.setState({
            vId : ''
        })
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
        window.location.href = BASE_URL + '/record/downloadSecond?vedioSeriesNo='+event
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
                        <Col span={17} style={{overflow: 'hidden'}}>
                            <div style={{height: '100%', background: 'black'}} className="video_out">
                                <div className="video_item">
                                    {/*<Button type="primary">{this.state.vedioSeriesNo}</Button>*/}
                                    {/*<Button type="primary">{this.state.typeId}</Button>*/}
                                    <div style={{display: 'flex', justifyContent: 'center'}} ref={this.myRef}>

                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col span={4} style={{paddingLeft:'10px'}}>
                            <Timeline>


                                        {
                                            vDatas.map(item => {
                                                return(
                                                    <Timeline.Item>
                                                        <Row>
                                                            <Col span={16} style={{color: this.state.vId === item.id ? '#06DF23' :'gray'}}>
                                                                {item.createTime}
                                                            </Col>
                                                            <Col span={4}>
                                                                    <Button size="small" type="primary"
                                                                            onClick={()=>this.plays(item.id)}>播放</Button>
                                                            </Col>
                                                        </Row>
                                                    </Timeline.Item>
                                                )
                                            })
                                        }

                            </Timeline>,
                        </Col>
                    </Row>
                    {button}
                </div>

            </React.Fragment>
        )
    }
}

export default Playing