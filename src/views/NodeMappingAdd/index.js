import React from 'react'
import {Form, Button, message, Select, Checkbox, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
const { Option } = Select;
class NodeMappingAdd extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state={
            options:[],
            queryAllList:[]
        }
    }
    async onFinish(e){
        console.log(e)
        await getDatas('/productNode/addProNode',{
            productId: e.productId,
            nodeId:e.publicList.join(',')
        })
        this.props.history.push('/track/nodemapping')
    }
    async componentDidMount(){
        console.log('组件加载')
        console.log('this.formRef',this.formRef)
        await getDatas('/product/queryEffectiveProducts')
            .then(res=>{
                if(res.code === 0){
                    if(res.data.productList){
                        res.data.productList.map(item=>{
                            item.key = item.inProductId
                        })
                    }
                    console.log('新增节点映射',res)
                    this.setState({
                        options: res.data.productList
                    })
                }else{
                    message.info(res.msg)
                }

            })
        await getDatas('/node/queryAllList')
            .then(res=>{
                if(res.code === 0 ){
                    this.setState({
                        queryAllList : res.data.nodeList
                    })
                    console.log('产品节点',this.state.queryAllList )
                }else{
                    message.info(res.msg)
                }

            })
    }
    onChange(e) {
        console.log(e)
    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品节点映射新增" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                name="productId"
                                label="产品名称"
                                rules={
                                    [
                                        {
                                            message: '产品名称输入不正确',
                                            required: true
                                        }
                                    ]
                                }>
                                <Select placeholder="产品名称" >
                                    {
                                        this.state.options ?
                                        this.state.options.map((item,index)=> {
                                            return(
                                                <Option key={index} value={item.inProductId}>{item.productName}</Option>
                                            )
                                        }) : ''
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="publicList"
                                label="节点列表"
                                rules={
                                    [
                                        {
                                            message: '节点列表不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Checkbox.Group style={{ width: '100%' }} onChange={this.onChange}>
                                    <Row>
                                        {
                                            this.state.queryAllList ?
                                            this.state.queryAllList.map((item,index)=>{
                                                return(
                                                    <Col span={8} key={index}>
                                                        <Checkbox  value={item.id}>{item.nodeName}</Checkbox>
                                                    </Col>
                                                )
                                            }) : ''
                                        }

                                    </Row>
                                </Checkbox.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button block  style={{margin:'0 auto',display:'block'}} type="primary" htmlType="submit">保存</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        )
    }
}
export default NodeMappingAdd