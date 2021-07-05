import React from 'react'
import {Form, Button, Input, Radio, message, Row, Col, Card } from 'antd'
import {ArrowRightOutlined} from '@ant-design/icons'
import '../css/style.less'
import {getDatas} from '../../api'

class Edit extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            nodeName:'',
            nodeNo:0
        }
    }
    formRef = React.createRef();
    onFinish=async (e)=>{
        await getDatas('/node/modifyNode',{...e,id:this.props.match.params['id']})
        console.log(e)
        this.props.history.push('/track/nodesetting')
    }
    async componentDidMount(){
        // console.log(this.props.match.params)
        await getDatas('/node/getNode',{id:this.props.match.params['id']})
            .then(res=>{
                console.log(res)
                if(res.code === 0){
                    this.setState({
                        nodeName:res.data.nodeName,
                        nodeNo:res.data.nodeNo
                    })
                    this.formRef.current.setFieldsValue({
                        nodeName:res.data.nodeName,
                        nodeNo:res.data.nodeNo
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
                    <Card title="节点修改" style={{marginTop:'50px'}} extra={<Button icon={<ArrowRightOutlined />} onClick={this.props.history.goBack}/>}>
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
                                name="nodeNo"
                                label="节点编号"
                                rules={
                                    [
                                        {
                                            pattern: /^\d+$/,
                                            message: '节点标号输入不正确',
                                            required: true
                                        }
                                    ]
                                }>
                                <Input placeholder="节点标号"/>
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