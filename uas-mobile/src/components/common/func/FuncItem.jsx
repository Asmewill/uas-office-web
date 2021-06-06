/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 应用item
 */

import React, { Component } from 'react'
import './common-func.less'
import { Icon } from 'antd-mobile'
import { isObjEmpty } from '../../../utils/common/common.util'
import { fetchGet } from '../../../utils/common/fetchRequest'
import {
  FUNC_TYPE_DOC,
  FUNC_TYPE_REPORT,
} from '../../../configs/constans.config'
import { GlobalEvent } from '../../../utils/common/eventbus/eventbus'
import { EVENT_DOC_FUNC_COUNT } from '../../../utils/common/eventbus/events.types'
import { withRouter } from 'react-router-dom'
import { _baseURL } from '../../../configs/api.config'

class FuncItem extends Component {

  constructor () {
    super()

    this.state = {
      supState: 0,
    }
  }

  componentDidMount () {
    let { funcObj, supAble, supValue } = this.props

    if (supAble && !isObjEmpty(funcObj.countUrl)) {
      fetchGet(funcObj.countUrl).then(response => {
        funcObj.sup = response.data
        this.props.onFuncDataChange && this.props.onFuncDataChange(funcObj)
        this.setState({
          supState: funcObj.sup,
        })
      }).catch(error => {
        funcObj.sup = 0
        this.props.onFuncDataChange && this.props.onFuncDataChange(funcObj)
        this.setState({
          supState: 0,
        })
      })
    } else {
      this.setState({
        supState: 0,
      })
    }
  }

  shouldComponentUpdate (nextProps, nextState, nextContext) {
    return true
  }

  componentWillUnmount () {

  }

  render () {
    let {
      funcObj,
      operation,//右上角操作图标
      supValue,//角标值
      lineCount,//标题行数
    } = this.props

    const { supState } = this.state

    let funcTextStyle = {
      height: 20 * lineCount + 'px',
      // webkitLineClamp: lineCount,
    }
    // funcTextStyle['-webkit-line-clamp'] = lineCount
    return (
      funcObj &&
      <div
        className={this.props.line ? 'func-func-root-line' : 'func-func-root'}
        onClick={this.onFuncClick.bind(this)}>
        <div className='func-func-layout'>
          {
            funcObj.iconColor ?
              <div
                className='func-func-icon'
                style={{
                  fontSize: 14,
                  borderRadius: 4,
                  background: funcObj.iconColor,
                  color: 'white',
                }}
              >{funcObj.name ? funcObj.name.substr(0, 1) : ''}</div> :
              funcObj.img ? <img className='func-func-icon'
                                 src={funcObj.img}/> : <Icon
                className='func-func-icon'
                type={funcObj.icon || 'uas-func-default'}/>
          }

          <span
            className={lineCount ? 'func-func-line-text' : 'func-func-text'}
            style={funcTextStyle}
          >{funcObj.name}</span>
          {
            (supValue || supState) ?
              <sup
                className='func-func-sup'
                style={{
                  // paddingTop: getOS() === 'Android' ? '3px' : '0px',
                }}
              >{supValue || supState}</sup> : ''
          }
        </div>
        {
          operation && <Icon
            type={operation}
            className='func-operation-icon'
            onClick={this.onOperationClick.bind(this)}
          />
        }
      </div>
    )
  }

  onFuncClick = () => {
    const { funcObj } = this.props
    if (this.props.onFuncClick) {
      this.props.onFuncClick(funcObj)
    } else {
      if (funcObj.url) {
        window.open(funcObj.url, '_self')
      } else if (funcObj.route) {
        this.props.history.push(funcObj.route)
      } else if (funcObj.funcType === FUNC_TYPE_DOC) {
        this.props.history.push(
          '/serviceList/' + funcObj.readOnly + '/' + funcObj.caller + '/' +
          funcObj.name)
      } else if (funcObj.funcType === FUNC_TYPE_REPORT) {
        this.props.history.push(
          '/reportList/' + funcObj.caller + '/' + funcObj.id + '/' +
          funcObj.name)
      }
    }
  }

  onOperationClick = () => {
    const { funcObj } = this.props
    this.props.onOperationClick &&
    this.props.onOperationClick(funcObj)
  }
}

export default withRouter(FuncItem)
