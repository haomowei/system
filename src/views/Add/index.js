import React from 'react'
import {Form, Button, Input, Radio, message, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
class Add extends React.Component{
    formRef = React.createRef();
    constructor(props){
        super(props)
    }
     onFinish=async (e)=>{
        console.log(e)
        if(e['longTerm'] == undefined){
            message.info('长短险没选择');
        }else{
            await getDatas('/product/addProduct',e)
                .then(res=>{
                    console.log(res)
                    console.log('提交',this.props)
                    if(res.code === 0){
                        this.props.history.push('/track/productconfiguration')
                    }else{
                        message.info(res.msg);
                    }

                })
                .catch(err=>{

                })
        }
    }
    componentDidMount(){
        console.log('组件加载',this.props)
        console.log('this.formRef',this.formRef)
        this.formRef.current.setFieldsValue({
            longTerm: 1
        });

    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品新增" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                        <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                name="productName"
                                label="产品名称"
                                rules={
                                    [
                                        {
                                            message: '产品名称不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="产品名称"/>
                            </Form.Item>
                            <Form.Item
                                required
                                label="长短险"
                                name="longTerm">
                                <Radio.Group >
                                    <Radio value={2}>长寿险</Radio>
                                    <Radio value={1}>短寿险</Radio>
                                </Radio.Group>
                            </Form.Item>
                            <Form.Item>
                                <Button block  style={{margin:'0 auto',display:'block'}} type="primary" htmlType="submit"  >保存</Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        )
    }
}
export default Add