/**
 * Created by Hujs on 2020/12/25
 * Desc: 关于我们
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Toast, List, Modal } from 'antd-mobile'
import Map from '../../../components/common/map/Map'
import './contact-info.less'

class ContactInfo extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = this.title || '关于我们'
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div className="contact—info">
        <div className="info-header-box">
          <div className="header-logo">
            <img src={require('@/res/img/usoftchina.png')}/>
          </div>
          <div className="header-content">
            优软科技致力于企业信息化管理系统和互联网平台的研发、咨询与应用，并在国内率先推出基于浏览器的ERP应用平台，是国内领先的企业管理软件及云服务商。
          </div>
        </div>
        <div className="info-content-box">
          <div className="content-item">
            <div className="title">电话</div>
            <div className="detail">400-830-1818</div>
          </div>
          <div className="content-item">
            <div className="title">Email</div>
            <div className="detail">info@usoftchina.com</div>
          </div>
          <div className="content-item">
            <div className="title">官网</div>
            <div className="detail"><a target="_blank" href="http://www.ubtob.net">http://www.ubtob.net</a></div>
          </div>
          <div className="content-item">
            <div className="title">地址</div>
            <div className="detail">深圳市宝安区新安街道海旺社区宝兴路6号海纳百川总部大厦B座6、7楼</div>
          </div>
        </div>
        <Map longitude={113.887564} latitude={22.554923}/>
      </div>
    )
  }

}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(ContactInfo)
