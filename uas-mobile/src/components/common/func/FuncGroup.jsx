/**
 * Created by RaoMeng on 2020/11/9
 * Desc: 应用分组
 */

import React, { Component } from 'react'
import './common-func.less'
import FuncTitle from './FuncTitle'
import { isObjEmpty } from '../../../utils/common/common.util'
import FuncItem from './FuncItem'
import {
  FUNC_OPERATION_ADD,
  FUNC_OPERATION_ADD_DISABLE,
} from '../../../configs/constans.config'

export default class FuncGroup extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let {
      funcGroup,
      line,//是否显示分割线
      onRightClick,//分组栏右侧按钮点击
      onFuncClick,//菜单item点击
      operation,//菜单item操作按钮
      rightIcon,//分组栏右侧按钮
      operable,//是否可操作
      onOperationClick,//操作按钮点击
      onFuncDataChange,
      lineCount,//菜单item标题行数
      card,//是否以卡片形式显示
      supAble,//是否展示角标
    } = this.props

    let funcItems = []
    if (!isObjEmpty(funcGroup.funcList)) {
      funcGroup.funcList.forEach((funcItem, funcIndex) => {
        funcItems.push(
          <FuncItem
            funcObj={funcItem}
            line={line}
            operation={
              operation
              || (operable &&
                (funcItem.often
                  ? FUNC_OPERATION_ADD
                  : FUNC_OPERATION_ADD_DISABLE))
            }
            onFuncClick={onFuncClick}
            onOperationClick={onOperationClick}
            onFuncDataChange={onFuncDataChange}
            lineCount={lineCount}
            supAble={supAble}
            key={'funcChild' + funcIndex}/>,
        )
      })
    }
    if (line) {
      if (funcItems.length >= 4) {
        this.topLineWidth = 100
      } else {
        this.topLineWidth = 25 * funcItems.length
      }
    }

    return (
      <div
        className={card ? 'func-group-card' : 'func-group-normal'}>
        <FuncTitle funcTitle={funcGroup}
                   card={card}
                   rightIcon={rightIcon || funcGroup.rightIcon}
                   onRightClick={onRightClick}/>
        <div
          style={{
            marginRight: line ? '-1px' : '0px',
            background: 'white',
          }}>
          {/*上边框*/}
          {
            line && <div
              className={'func-group-top-line'}
              style={{
                width: this.topLineWidth + '%',
              }}
            ></div>
          }
          {funcItems}
        </div>
      </div>
    )
  }
}
