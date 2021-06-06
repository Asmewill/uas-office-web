/**
 * Created by hujs on 2020/11/11
 * Desc: 日历组件
 */

import React, { Component } from 'react'
import { Calendar, Select, Row } from 'antd'
import './common-calendar.less'
import moment from 'moment'
import {
  DoubleLeftOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
} from '@ant-design/icons'

export default class CommonCalendar extends Component {

  constructor () {
    super()

    this.state = {}
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  render () {
    let { currentDate } = this.props
    return (
      <div className='calendar-box'>
        <div className="site-calendar-demo-card">
          <Calendar
            onPanelChange={this.onPanelChange}
            dateCellRender={this.dateCellRender}
            onSelect={this.onSelectTime}
            fullscreen={false}
            value={moment(currentDate)}
            headerRender={({ value, type, onChange, onTypeChange }) => {
              const start = 0
              const end = 12
              const monthOptions = []

              const current = value.clone()
              const localeData = value.localeData()
              const months = []
              for (let i = 0; i < 12; i++) {
                current.month(i)
                months.push(localeData.monthsShort(current))
              }

              for (let index = start; index < end; index++) {
                monthOptions.push(
                  <Select.Option className="month-item" key={`${index}`}>
                    {months[index]}
                  </Select.Option>,
                )
              }
              const month = value.month()  //面板月份0开始
              const year = value.year()     //面板年份
              const options = []
              for (let i = year - 10; i < year + 10; i += 1) {
                options.push(
                  <Select.Option key={i} value={i} className="year-item">
                    {i}
                  </Select.Option>,
                )
              }
              return (
                <div className="ant-picker-header" style={{ padding: 8 }}>
                  <Row gutter={8}>
                    <div className="left-box arrow-box">
                      <DoubleLeftOutlined
                        className="lastyear arrow"
                        onClick={() => {
                          const now = value.clone().year(year - 1)
                          onChange(now)
                        }}
                      />
                      <LeftOutlined
                        className="lastmonth arrow"
                        onClick={() => {
                          const now = value.clone().month(month - 1)
                          onChange(now)
                        }}
                      />
                    </div>

                    <div className="middle-box">
                      <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        className="my-year-select"
                        dropdownClassName="calendar-select-menu"
                        onChange={newYear => {
                          const now = value.clone().year(newYear)
                          onChange(now)
                        }}
                        value={String(year)}
                      >
                        {options}
                      </Select>
                      <Select
                        size="small"
                        dropdownMatchSelectWidth={false}
                        className="my-month-select"
                        dropdownClassName="calendar-select-menu"
                        value={String(month)}
                        onChange={selectedMonth => {
                          const newValue = value.clone()
                          newValue.month(parseInt(selectedMonth, 10))
                          onChange(newValue)
                        }}
                      >
                        {monthOptions}
                      </Select>

                      <button
                        className="todaybtn"
                        onClick={() => {
                          const now = moment()
                          onChange(now)
                        }}
                      >
                        今
                      </button>

                    </div>

                    <div className="right-box arrow-box">
                      <RightOutlined
                        className="nextmonth arrow"
                        onClick={() => {
                          const now = value.clone().month(month + 1)
                          onChange(now)
                        }}
                      />
                      <DoubleRightOutlined
                        className="nextyear arrow"
                        onClick={() => {
                          const now = value.clone().year(year + 1)
                          onChange(now)
                        }}
                      />
                    </div>

                  </Row>
                </div>
              )
            }}
          />
        </div>
      </div>
    )
  }

  dateformat = (date) => {
    let clickDate = new Date(date._d).format('yyyy-MM-dd')
    return clickDate
  }

  getListData = (value) => {
    let clickDate = this.dateformat(value),
      { calendarData } = this.props,
      listData
    if (calendarData && calendarData.length >= 0) {
      for (let i = 0; i < calendarData.length; i++) {
        let date = calendarData[i].date
        if (clickDate === date) {
          switch (calendarData[i].status) {
            case 0:
              listData = [
                { color: 'no' },
              ]
              break
            case 1:
              listData = [
                { color: 'red' },
              ]
              break
            case 2:
              listData = [
                { color: 'gray' },
              ]
              break
            default:
              break
          }

        }
      }
    }
    return listData || []
  }

  dateCellRender = (date) => {
    const listData = this.getListData(date)
    return (
      <div className="point-box">
        {listData.map(item => (
          <div key={item.color} className={'calendar-point calendar-point-' + item.color}></div>
        ))}
      </div>
    )
  }

  //日历点击事件
  onSelectTime = (date) => {
    let clickDate = this.dateformat(date)
    this.props.clickDate(clickDate)
  }

  //点击上月或者下月时触发
  onPanelChange = (date, mode) => {
    let nowDate = new Date(date._d).format('yyyy-MM')
    this.props.clickBlankPanel(nowDate)
  }

}
