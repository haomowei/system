import React from 'react'
import {Form, Button, Input, Radio, message, Select, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
const { Option } = Select;
class ApplicationAdd extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
        this.state={
            options:[]
        }
    }
    async onFinish(e){
        console.log(e)
        await getDatas('/productContext/addProdAppConfig',e)
            .then(res=>{
                if(res.code === 0){
                    this.props.history.push('/track/applicationmapping')
                }else{
                    message.info(res.msg)
                }

            })
    }
    async componentDidMount(){
        console.log('组件加载')
        console.log('this.formRef',this.formRef)
        await getDatas('/product/queryEffectiveProducts')
            .then(res=>{
                if(res.code === 0){
                    this.setState({
                        options: res.data.productList
                    })
                }else{
                    message.info(res.msg)
                }
                console.log('产品应用映射',res)

            })
        // this.formRef.current.setFieldsValue({
        //     producName: '微医'
        // });
    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品应用映射新增" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                name="inProductId"
                                label="产品名称"
                                rules={
                                    [
                                        {
                                            message: '产品名称不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Select placeholder="产品名称" >
                                    {
                                        this.state.options ?
                                        this.state.options.map(item=> {
                                            return(
                                                <Option key={item.inProductId} value={item.inProductId}>{item.productName}</Option>
                                            )
                                        }) : ''
                                    }
                                </Select>
                            </Form.Item>
                            <Form.Item
                                required
                                label="应用名称"
                                name="context"
                                rules={
                                    [
                                        {
                                            message: '应用名称不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="应用名称"/>
                            </Form.Item>
                            <Form.Item
                                required
                                label="应用产品Id"
                                name="bsProductId"
                                rules={
                                    [
                                        {
                                            message: 'ID输入不正确',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="应用产品Id"/>
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
export default ApplicationAdd