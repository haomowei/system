import React from 'react'
import {Form, Button, message, Select, Checkbox, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
const { Option } = Select;
class NodeMappingEdit extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state={
            selfDatas:{},
            options:[]


        }
    }
    async onFinish(e){
        await getDatas('/productNode/modifyProNode',{
            nodeId: e.publicList.join(','),
            productId:this.state.selfDatas.productId,
            id:this.props.match.params['id']
        })
            .then(res=>{
                if(res.code === 0){
                    this.props.history.push('/track/nodemapping')
                }else{
                    message.info(res.msg)
                }

            })
        console.log(e)
    }
    async componentDidMount(){
        console.log('组件加载')
        console.log(this.props.match)
        console.log('this.formRef',this.formRef)
        // console.log(this.state.checkedList)
        await getDatas('/node/queryAllList')
            .then(res=>{
                console.log('返回所有',res)
                if(res.code === 0){
                    this.setState({
                        options: res.data.nodeList
                    })
                }else{
                    message.info(res.msg)
                }

            })
        await getDatas('/productNode/getProNode',{
            id:this.props.match.params['id']
        })
            .then(res=>{
                if(res.code === 0){
                    this.setState({
                        selfDatas : res.data
                    })
                    console.log('产品节点映射',res)
                    this.formRef.current.setFieldsValue({
                        publicList:res.data.nodeId.split(',')
                    })
                }else{
                    message.info(res.msg)
                }

            })


    }
    async onChange(e) {
        console.log(e)
    }
    render(){
        return(
            <Row>
                <Col span={10} offset={2}>
                    <Card title="产品节点映射修改" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                label="产品名称">
                                <div>{this.state.selfDatas.productName}</div>
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
                                            this.state.options.map(item=> {
                                                return(
                                                    <Col key={item.id} span={8}>
                                                        <Checkbox value={item.id}>{item.nodeName}</Checkbox>
                                                    </Col>
                                                )
                                            })
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
export default NodeMappingEdit