import React from 'react'
import {Form, Button, Input, Radio, message, Select, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
const { Option } = Select;
class ApplicationEdit extends React.Component{

    constructor(props){
        super(props)
        this.state={
            formRef : React.createRef(),
            productInfo:{}
        }
    }
    async onFinish(e){
        console.log(e)
        await getDatas('/productContext/modifyProdAppConfig',{
            bsProductId: e.bsProductId,
            context: e.context,
            productApplicationId:this.props.match.params.id
        })
            .then(res=>{
                if(res.code === 0){
                    this.props.history.push('/track/applicationmapping')
                }else{
                    message.info(res.msg)
                }

            })
    }
    async componentDidMount(){
        console.log(this.props)
        console.log('this.formRef',this.state.formRef)
        await getDatas('/productContext/getProductApplicationConfig',{
            id:this.props.match.params.id
        })
            .then(res=>{
                if(res.code === 0){
                    this.setState({
                        productInfo: res.data
                    })
                    console.log('修改应用映射',this.state.productInfo.context)
                    this.state.formRef.current.setFieldsValue({
                        context:this.state.productInfo.context,
                        bsProductId:this.state.productInfo.bsProductId,
                        productName:this.state.productInfo.productName
                    })
                }else{
                    message.info(res.msg)
                }

            })
    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品应用映射修改" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.state.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>
                            <Form.Item
                                name="productName"
                                label="产品名称">
                                <div style={{textIndent: '10px'}}>{this.state.productInfo.productName}</div>
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
                                <Input placeholder="应用名称" />
                            </Form.Item>
                            <Form.Item
                                required
                                label="应用产品Id"
                                name="bsProductId"
                                rules={
                                    [
                                        {
                                            pattern: /^\d+$/,
                                            message: 'ID输入不正确',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="应用产品Id"/>
                            </Form.Item>
                            <Form.Item>
                                <Button block  style={{margin:'0 auto',display:'block'}} type="primary" htmlType="submit">更新</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        )
    }
}
export default ApplicationEdit