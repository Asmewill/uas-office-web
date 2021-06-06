/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 应用
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isObjEmpty } from '../../../utils/common/common.util'
import FuncGroup from '../../../components/common/func/FuncGroup'
import { requestServices } from '../../../utils/private/services.util'
import { PullToRefresh } from 'antd-mobile'
import { refreshDocList } from '../../../redux/actions/docState'
import { Empty } from 'antd'
import PageLoading from '../../../components/common/loading/PageLoading'

class DocRoot extends Component {

  constructor () {
    super()

    this.state = {
      refreshing: false,
    }
  }

  componentDidMount () {
    //获取应用列表
    requestServices()
  }

  componentWillUnmount () {

  }

  render () {
    const { docState: { docFuncGroupList, docEmpty } } = this.props
    const funcGroupItems = []
    if (!isObjEmpty(docFuncGroupList)) {
      docFuncGroupList.forEach((item, index) => {
        funcGroupItems.push(
          <FuncGroup
            funcGroup={item}
            // line
            card
            key={'docFuncGroup' + index}
            supAble
            onFuncDataChange={this.onFuncDataChange.bind(this)}
          />,
        )
      })
    }

    return (
      <PullToRefresh
        direction={'down'}
        refreshing={this.state.refreshing}
        onRefresh={this.refreshFunc}
        className='doc-root'>
        {funcGroupItems.length > 0 ?
          funcGroupItems :
          docEmpty ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/> :
            this.state.refreshing ? '' : <PageLoading/>}
      </PullToRefresh>
    )
  }

  refreshFunc = () => {
    this.setState({
      refreshing: true,
    })
    requestServices().then(response => {
      this.setState({
        refreshing: false,
      })
    }).catch(error => {
      this.setState({
        refreshing: false,
      })
    })
  }

  onFuncDataChange = (funcObj) => {
    const { docState: { docFuncGroupList } } = this.props
    if (!isObjEmpty(docFuncGroupList, funcObj)) {
      docFuncGroupList[funcObj.groupIndex].funcList[funcObj.childIndex].sup = funcObj.sup

      refreshDocList({ docFuncGroupList })
    }
  }
}

let mapStateToProps = (state) => ({
  docState: state.docState,
})

export default connect(mapStateToProps)(DocRoot)

