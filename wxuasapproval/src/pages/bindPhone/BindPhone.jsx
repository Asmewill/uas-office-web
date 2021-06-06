import React, {Component} from 'react'
import {Image} from 'semantic-ui-react'
import './bindPhone.css'
// import {BrowserRouter as Router, Link} from 'react-router-dom'
// import {bindActionCreators} from 'redux'
// import {connect} from 'react-redux'
// import * as userActions from '@/redux/actions/user'
// import Approval from '../approval/Approval'
import {message} from 'antd'
// import 'whatwg-fetch'

export default class BindPhone extends Component {

    constructor(props) {
        super(props);

        this.state = {
            bindPhone: "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbc1f8607137d3b8a&redirect_uri=https%3a%2f%2fwww.akuiguoshu.com%2fwxService%2fwxlogin&response_type=code&scope=snsapi_userinfo&state=#wechat_redirect",
            phone: ''
        }
    }

    componentDidMount() {
        this.bodyHeight = document.documentElement.clientHeight
        document.title = '绑定手机号'
        // this.props.userActions.login()
        console.log(this.props.match.params.openId)
    }

    render() {
        return <div className='bindParent'  style={{height: this.bodyHeight + 'px'}}>
            <Image className='uasIcon' src={require('@/images/ic_uas_icon.png')}/>

            <div className='phoneLayout'>
                <div className='phoneCaption'>手机号</div>
                <input type='number' onKeyPress={this.phoneKeyPress} className='phoneInput' placeholder='请输入手机号'
                       value={this.state.phone} onChange={this.phoneChange}/>
            </div>
            {/*  <a href={this.state.bindPhone} className='bindButton' >登录</a>*/}
            <div onClick={this.bindPhoneEvent} className='bindButton'>
                {/*<Link className='bindButton' to='/approval'>*/}
                绑定
                {/*</Link>*/}
            </div>
        </div>
    }

    phoneKeyPress = (event) => {
        const invalidChars = ['-', '+', 'e', '.', 'E']
        if (invalidChars.indexOf(event.key) !== -1) {
            event.preventDefault()
        }
    }

    phoneChange = (e) => {
        var href_wx_login = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxbc1f8607137d3b8a&redirect_uri=https%3a%2f%2fwww.akuiguoshu.com%2fwxService%2fwxlogin&response_type=code&scope=snsapi_userinfo&state=" + e.target.value + "#wechat_redirect";
        this.setState({
            phone: e.target.value,
            bindPhone: href_wx_login
        })
    }

    bindPhoneEvent = () => {
        let phoneRegex = /^\d{11}$/;
        const {phone} = this.state
        if (phoneRegex.test(phone)) {
            window.location.href = this.state.bindPhone;
        } else {
            message.error('请输入正确的手机号码')
        }
    }

    /*componentWillUnmount () {
        console.log('ddd')
        return false
    }*/
}