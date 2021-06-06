/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 入口页面（清除缓存数据，做必要的全局处理）
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { clearAllRedux } from '../../redux/utils/redux.utils'
import { isMobile } from '../../utils/common/common.util'
import { _baseURL } from '../../configs/api.config'

class UasEntry extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = 'UAS系统'

    if (isMobile()) {
      clearAllRedux()
      this.props.history.replace('/homePage')
    } else {
      window.location.href = _baseURL
    }
  }

  componentWillUnmount () {

  }

  render () {
    return (
      <div></div>
    )
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(UasEntry)
