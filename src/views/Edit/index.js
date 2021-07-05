import React from 'react'
import {Form, Button, Input, Radio, message, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            longTerm:1,
            productName:''
        }
    }
    formRef = React.createRef();
    async onFinish(e){
        console.log('表单提交',e)
       await getDatas('/product/modifyProduct',{
           ...e,
           inProductId:this.props.match.params['id']
       })
           .then(res=>{
               if(res.code === 0){
                   this.props.history.push('/track/productconfiguration')
               }else{
                   message.info(res.msg)
               }
               console.log('修改完成')

           })
    }
    async componentDidMount(){
        await getDatas('/product/getProduct',{
            id:this.props.match.params['id']
        })
            .then(res=>{
                console.log(res)
                if(res.code === 0){
                    this.formRef.current.setFieldsValue({
                        longTerm: res.data.longTerm ,
                        productName: res.data.productName
                    });
                }else{
                    message.info(res.msg)
                }

            })
        console.log('编辑页面',this.props.match.params['id'])
        console.log('组件加载',typeof(this.state.longTerm))
        console.log('this.formRef',this.formRef)


    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="产品修改" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
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
                                <Radio.Group>
                                    <Radio value={2}>长寿险</Radio>
                                    <Radio value={1}>短寿险</Radio>
                                </Radio.Group>
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
export default Edit