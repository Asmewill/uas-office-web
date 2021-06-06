/**
 * Created by hujs on 2020/11/11
 * Desc: 打卡
 */

import React, { Component } from 'react'
import './punch-clock.less'
import ClockDesc from './ClockDesc'
import ClockRecord from './ClockRecord'
import { isEmptyObject, isObjEmpty } from '../../../utils/common/common.util'

export default class PunchClock extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { punchClockData } = this.props
    const rowItems = []
    if (!isObjEmpty(punchClockData) && !isObjEmpty(punchClockData.clockRecord)) {
      punchClockData.clockRecord.forEach((item, index) => {
        rowItems.push(<ClockRecord key={index} clockRecord={item}/>)
      })
    }

    return (
      isEmptyObject(this.props.punchClockData)
        ?
        ''
        :
        <div className='punch-clock'>
          <ClockDesc companyRule={punchClockData.companyRule}/>
          {rowItems}
        </div>
    )
  }

}
