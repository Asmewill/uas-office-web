/**
 * Created by RaoMeng on 2020/11/12
 * Desc: 常用应用 管理页面
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd-mobile'
import './often-func.less'
import {
  FUNC_OPERATION_CANCEL,
} from '../../../configs/constans.config'
import FuncGroup from '../../../components/common/func/FuncGroup'
import { isObjEmpty, isObjNull } from '../../../utils/common/common.util'
import { refreshDocList } from '../../../redux/actions/docState'
import { message } from 'antd'
import { Toast } from 'antd-mobile'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { analysisDocList } from '../../../utils/private/services.util'

class OftenFuncManage extends Component {

  constructor () {
    super()
    this.oftenSize = 0
    this.state = {
      docFuncGroupStateList: [],
    }
  }

  componentDidMount () {
    document.title = '常用管理'

    const { docState } = this.props
    if (!isObjEmpty(docState, docState.docFuncGroupList)) {
      this.setState({
        docFuncGroupStateList: JSON.parse(
          JSON.stringify(docState.docFuncGroupList)),//深拷贝，不然会出现state变化，props随之变化的情况。
      })
    }
  }

  componentWillUnmount () {
    Toast.hide()
  }

  render () {
    const { docFuncGroupStateList } = this.state
    const funcGroupItems = []
    let oftenFunc = {
      groupTitle: '常用（' + this.oftenSize + '/12）',
      funcList: [],
    }
    if (!isObjEmpty(docFuncGroupStateList)) {
      docFuncGroupStateList.forEach((groupItem, groupIndex) => {
        funcGroupItems.push(
          <FuncGroup
            funcGroup={groupItem}
            operable
            key={'funcGroup' + groupIndex}
            onFuncClick={this.onOperationClick.bind(this)}
          />,
        )
        const docFuncChildList = groupItem.funcList
        if (!isObjEmpty(docFuncChildList)) {
          docFuncChildList.forEach((childItem, childIndex) => {
            if (!isObjNull(childItem) && childItem.often) {
              oftenFunc.funcList.push(childItem)
            }
          })
          this.oftenSize = oftenFunc.funcList.length
          oftenFunc.groupTitle = '常用（' + this.oftenSize + '/12）'
        }
      })
    }
    this.oftenFuncList = oftenFunc.funcList

    return (
      <div className='often-func-root'>
        <div className='often-func-header'>
          <FuncGroup
            funcGroup={oftenFunc}
            operation={FUNC_OPERATION_CANCEL}
            onFuncClick={this.onOperationClick.bind(this)}
          />
        </div>
        <div className='often-func-all-list'>
          {funcGroupItems}
        </div>
        <div className='often-func-save-btn'>
          <Button
            type={'primary'}
            onClick={this.onSaveOften}>保存</Button>
        </div>
      </div>
    )
  }

  onOperationClick = (funcObj) => {
    let { docFuncGroupStateList } = this.state

    if (!isObjNull(funcObj)) {
      if (!funcObj.often && this.oftenSize >= 12) {
        Toast.fail('最多添加 12 个常用应用')
      } else {
        funcObj.often = !funcObj.often
        this.setState({ docFuncGroupStateList })
      }
    }
  }

  onSaveOften = () => {
    Toast.loading('正在保存', 0)
    fetchPostObj(API.APPCOMMON_SAVESERVICES, {
      data: this.oftenFuncList,
    }).then(response => {
      Toast.hide()
      analysisDocList(response)
      message.success('保存成功')
      this.props.history.goBack()
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('常用应用保存失败')
      }
    })
  }
}

let mapStateToProps = (state) => ({
  docState: state.docState,
})

export default connect(mapStateToProps)(OftenFuncManage)
