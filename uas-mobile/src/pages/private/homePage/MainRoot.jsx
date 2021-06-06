/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 首页
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import FuncTitle from '../../../components/common/func/FuncTitle'
import MainHeader from '../../../components/common/mainHeader/MainHeader'
import KanBan from '../../../components/private/kanban/KanBan'
import './main-root.less'
import { withRouter } from 'react-router-dom'
import FuncGroup from '../../../components/common/func/FuncGroup'
import { isObjEmpty, isObjNull } from '../../../utils/common/common.util'
import { requestServices } from '../../../utils/private/services.util'

class MainRoot extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {
    document.title = 'UAS系统'
    //获取应用列表
    requestServices()
  }

  componentWillUnmount () {

  }

  render () {
    const { docState } = this.props
    let oftenFunc = {
      groupTitle: '常用',
      funcList: [],
    }
    if (!isObjEmpty(docState, docState.docFuncGroupList)) {
      docState.docFuncGroupList.forEach((groupItem, index) => {
        const docFuncGroupList = groupItem.funcList
        if (!isObjEmpty(docFuncGroupList)) {
          docFuncGroupList.forEach((childItem, childIndex) => {
            if (!isObjNull(childItem) && childItem.often) {
              oftenFunc.funcList.push(childItem)
            }
          })
        }
      })
    }
    return (
      <div>
        {/* 首页固定头部 */}
        <div className="main-header">
          <MainHeader/>
        </div>
        {/* 首页常用功能模块 */}
        <FuncGroup
          funcGroup={oftenFunc}
          rightIcon={'uas-edit'}
          supAble
          onRightClick={this.onOftenManage}
        />
        {/* 首页看板展示 */}
        <div className="main-kanban">
          <FuncTitle
            funcTitle={{
              groupTitle: '数据看板',
            }}
            rightIcon='uas-edit'
            onRightClick={this.onKanbanManage}/>
          <KanBan KanbanManage={this.onKanbanManage}/>
        </div>
      </div>
    )
  }

  onOftenManage = () => {
    this.props.history.push('/oftenFuncManage')
  }

  onKanbanManage = () => {
    this.props.history.push('/subscribeManage')
  }

}

let mapStateToProps = (state) => ({
  mainState: state.mainState,
  docState: state.docState,
})

export default connect(mapStateToProps)(withRouter(MainRoot))
