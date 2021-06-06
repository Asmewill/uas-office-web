/**
 * Created by hujs on 2020/11/11
 * Desc: 日程界面
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import CommonCalendar from '../../../components/common/calendar/CommonCalendar'
import PunchClock from '../../../components/private/punchclock/PunchClock'
import NoticeMatter from '../../../components/private/noticematter/NoticeMatter'
import { isObjEmpty } from '../../../utils/common/common.util'
import { fetchPostObj, fetchGet } from '../../../utils/common/fetchRequest'
import { message } from 'antd'
import { Toast } from 'antd-mobile'
import { API } from '../../../configs/api.config'
import { saveScheduleState } from '../../../redux/actions/scheduleState'
import moment from 'moment'
import './schedule-page.less'

class SchedulePage extends Component {

  constructor () {
    super()

    this.state = {
      punchClockData: {},
      noticeMatterData: [],
      calendarData: [],
      currentDate: new Date().format('yyyy-MM-dd'),
    }
  }

  componentWillMount () {

  }

  componentDidMount () {
    document.title = '我的日程'
    this.getdailyData()
  }

  componentWillUnmount () {

  }

  render () {
    let { scheduleState: { punchClockData, noticeMatterData, calendarData, currentDate } } = this.props
    return (
      <div className='schedule-root'>
        <CommonCalendar
          clickBlankPanel={this.clickBlankPanel}
          clickDate={this.clickDate}
          calendarData={calendarData}
          currentDate={currentDate}
        />
        <PunchClock punchClockData={punchClockData}/>
        <NoticeMatter noticeMatterData={noticeMatterData}/>
      </div>
    )
  }

  clickDate = (date) => {
    Toast.loading('加载中', 0)
    fetchPostObj(API.APPCOMMON_DAILYTASK, {
      data: date,
    }).then(response => {
      Toast.hide()
      saveScheduleState({
        noticeMatterData: response.data.noticeMatterData,
        punchClockData: response.data.punchClockData,
        currentDate: date,
      })
      if (!isObjEmpty(response.data.calendarData)) {
        saveScheduleState({
          calendarData: response.data.calendarData,
        })
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('数据加载失败')
      }
    })
  }

  clickBlankPanel = (date) => {
    //发送请求重新渲染日历上的点数
    Toast.loading('加载中', 0)
    fetchPostObj(API.APPCOMMON_MONTHLYTASKSTATUS, {
      data: date,
    }).then(response => {
      Toast.hide()
      saveScheduleState({
        calendarData: response.data.calendarData,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('数据加载失败')
      }
    })
  }

  getdailyData = () => {
    // 判断缓存中是否有数据，若有数据则部发起请求
    let { scheduleState: { punchClockData, noticeMatterData, calendarData } } = this.props
    if (isObjEmpty(punchClockData) || isObjEmpty(calendarData)) {
      Toast.loading('正在获取数据', 0)
      fetchGet(API.APPCOMMON_DAILYTASKTOTAL)
        .then(response => {
          Toast.hide()
          saveScheduleState({
            calendarData: response.data.calendarData,
            noticeMatterData: response.data.noticeMatterData,
            punchClockData: response.data.punchClockData,
          })
        }).catch(error => {
        Toast.hide()
        if (typeof error === 'string') {
          message.error(error)
        } else {
          message.error('待办事项获取失败')
        }
      })
    }
  }

}

let mapStateToProps = (state) => ({
  scheduleState: state.scheduleState,
})

export default connect(mapStateToProps)(SchedulePage)
