/**
 * Created by RaoMeng on 2021/4/12
 * Desc: 外勤计划详情
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import CurrencyDetail
  from '../../../components/common/currencyDetail/CurrencyDetail'
import './work-out.less'
import { Toast } from 'antd-mobile'
import moment from 'moment'
import FormInput from '../../../components/common/formNew/FormInput'

class WorkOutDetail extends Component {

  constructor () {
    super()

    this.state = {
      nowTime: moment().
        format('hh:mm'),
      realDistance: '米',
    }
  }

  componentDidMount () {
    document.title = '外勤计划'

    // 每20秒更新显示时间
    this.timeInterval = setInterval(() => {
      this.setState({
        nowTime: moment().
          format('hh:mm'),
      })
    }, 20000)
  }

  componentWillUnmount () {
    this.timeInterval && clearInterval(this.timeInterval)
  }

  render () {
    const { realDistance } = this.state
    return (
      <div className='com-column-flex-root'
           style={{ height: '100%', background: 'white' }}>
        <CurrencyDetail
          style={{ background: 'white', flex: 1 }}
          caller={this.props.match.params.caller}
          id={this.props.match.params.id}
          isDetail
        >
          <FormInput
            billModel={{
              caption: '实时距离',
              readOnly: true,
              value: realDistance,
              allowBlank: true,
            }}
          />
        </CurrencyDetail>

        <div className='work-out-sign-root'
             onClick={this.onWorkOutSign}>
          <div className='work-out-sign-time'>{this.state.nowTime}</div>
          <div className='work-out-sign-text'>打卡</div>
        </div>
      </div>
    )
  }

  /**
   * 签到
   */
  onWorkOutSign = () => {
    Toast.show('签到成功')
  }
}

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(WorkOutDetail)
