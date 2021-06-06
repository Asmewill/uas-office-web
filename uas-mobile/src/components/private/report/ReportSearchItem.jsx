/**
 * Created by RaoMeng on 2020/12/4
 * Desc: 报表搜索item
 */

import React, { Component } from 'react'
import './comp-report.less'
import { Icon } from 'antd-mobile'

export default class ReportSearchItem extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    const { reportObj } = this.props
    return (
      <div
        className='report-search-item-root'
        onClick={this.onSubItemClick}>
        {
          reportObj.iconColor ?
            <div
              className='report-search-item-img'
              style={{
                fontSize: 15,
                borderRadius: 4,
                background: reportObj.iconColor,
                color: 'white',
              }}
            >{reportObj.name ? reportObj.name.substr(0, 1) : ''}</div> :
            reportObj.img ?
              <img src={reportObj.img}
                   className='report-search-item-img'/> :
              <Icon
                className='report-search-item-img'
                type={reportObj.icon || 'uas-func-default'}/>
        }

        <span className='report-search-item-name'>{reportObj.name}</span>
      </div>
    )
  }

  onSubItemClick = () => {
    const { onSubItemClick, reportObj } = this.props
    onSubItemClick && onSubItemClick(reportObj)
  }
}
