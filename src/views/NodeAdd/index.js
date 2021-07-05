import React from 'react'
import {Form, Button, Input, Radio, message, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'
class NodeAdd extends React.Component{
    formRef = React.createRef();
    async onFinish(e){
        await getDatas('/node/addNode',e)
            .then(res=> {
                if(res.code === 0){
                    this.props.history.push('/track/nodesetting')
                }else{
                    message.info(res.msg)
                }

            })
        console.log(e)
    }
    componentDidMount(){
        console.log('组件加载')
        console.log('this.formRef',this.formRef)

    }
    render(){
        return(
            <Row>
                <Col span={8} offset={2}>
                    <Card title="节点新增" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
                    <Form
                            ref={this.formRef}
                            name="add"
                            onFinish={(e)=>this.onFinish(e)}
                            labelCol={{span: 6}}>

                            <Form.Item
                                name="nodeName"
                                label="节点名称"
                                rules={
                                    [
                                        {
                                            message: '节点名称不能为空',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="节点名称"/>
                            </Form.Item>
                            <Form.Item
                                required
                                label="节点编号"
                                name="nodeNo"
                                rules={
                                    [
                                        {
                                            pattern: /^\d+$/,
                                            message: '节点编号输入不正确',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="节点编号"/>
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
export default NodeAdd