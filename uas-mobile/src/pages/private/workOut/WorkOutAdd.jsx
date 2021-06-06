import React, { Component } from 'react'
import { connect } from 'react-redux'
import FormLine from '../../../components/common/formNew/FormLine'
import {
  InputItem,
  Icon,
  DatePicker,
  Button,
  SegmentedControl,
  Modal,
  List, Toast,
} from 'antd-mobile'
import moment from 'moment'
import { isObjEmpty } from '../../../utils/common/common.util'
import { fetchPostObj } from '../../../utils/common/fetchRequest'
import { API } from '../../../configs/api.config'
import { message } from 'antd'
import MapSearch from '../../../components/common/map/MapSearch'

/**
 * Created by RaoMeng on 2021/4/12
 * Desc: 新增外勤计划
 */

const prompt = Modal.prompt

class WorkOutAdd extends Component {

  constructor () {
    super()

    this.state = {
      companyName: '',
      companyAddr: '',
      purpose: '',
      type: 0,
      distance: '',
      createTime: moment().format('YYYY-MM-DD hh:mm:ss'),
      createLocation: '',
      visitTime: '',
      modalOpen: false,
      modalList: [],
      mapOpen: false,
    }
  }

  componentDidMount () {
    document.title = '新增外勤计划'

    const that = this
    const { BMap } = window
    const geolocation = new BMap.Geolocation()
    geolocation.enableSDKLocation()
    geolocation.getCurrentPosition(function (r) {
      if (r) {
        if (r.point) {
          window.localPoint = r.point
        }
        if (r.address) {
          const address = r.address
          that.setState({
            createLocation: address.province + address.city + address.district +
              address.street + address.street_number,
          })
        }
      }
    })
  }

  componentWillUnmount () {
    Toast.hide()
  }

  render () {
    const {
      companyName,
      companyAddr,
      purpose,
      type,
      distance,
      createTime,
      createLocation,
      visitTime,
      modalOpen,
      modalList,
      mapOpen,
    } = this.state
    return (
      <div className='com-column-flex-root'
           style={{ height: '100%' }}>
        <div className='com-column-flex-root'
             style={{ flex: 1 }}>
          <FormLine caption={'拜访单位'} required>
            <InputItem
              editable={false}
              placeholder={'请选择'}
              extra={<Icon type="search" size={'xs'}/>}
              value={companyName}
              onClick={this.onCompanyClick}
            />
          </FormLine>
          <FormLine caption={'拜访地址'} required>
            <InputItem
              editable={false}
              value={companyAddr}
            />
          </FormLine>
          <FormLine
            caption={'拜访目的'}
            required
            onArrowClick={this.onPurposeClick}
            arrow>
            <InputItem
              editable={false}
              placeholder={'请选择'}
              value={purpose}
              onClick={this.onPurposeClick}
            />
          </FormLine>
          <FormLine caption={'时段'}>
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div style={{ flex: 1 }}></div>
              <SegmentedControl
                values={['半天', '全天']}
                selectedIndex={type}
                onChange={this.onTypeChange}
                style={{ width: '100px' }}/>
            </div>
          </FormLine>
          <FormLine caption={'距离'}>
            <InputItem
              editable={false}
              extra={'米'}
              value={distance}
            />
          </FormLine>
          <FormLine caption={'创建时间'}>
            <InputItem
              editable={false}
              value={createTime}
            />
          </FormLine>
          <FormLine caption={'创建地点'}>
            <InputItem
              editable={false}
              value={createLocation}
            />
          </FormLine>
          <FormLine caption={'预计到达时间'} required arrow>
            <DatePicker
              locale={{
                okText: '确定',
                dismissText: '取消',
              }}
              mode={'datetime'}
              extra={'请选择时间'}
              value={!isObjEmpty(visitTime)
                ? new Date(visitTime.replace(/\-/g, '/'))
                : ''}
              onChange={this.onDateChange}
            >
              <DatePickerCustom>
                <div style={{ flex: 1 }}></div>
              </DatePickerCustom>
            </DatePicker>
          </FormLine>
        </div>
        <Button
          type={'primary'}
          style={{
            margin: '14px 24px',
            height: '36px',
            lineHeight: '36px',
            fontSize: '16px',
          }}
          onClick={this.onSubmitClick}>提交</Button>
        {/*拜访目的选择弹框*/}
        <Modal
          visible={modalOpen}
          animationType={'slide-up'}
          onClose={() => {
            this.setState({
              modalOpen: false,
            })
          }}
          title={'拜访目的'}
          popup
        >
          <List className='form-modal-root'>
            {modalList && (
              modalList.map((modalObj, index) => (
                <List.Item
                  key={index}
                  onClick={this.onModalSelect.bind(this,
                    index)}>
                  {modalObj.value + ''}
                </List.Item>
              ))
            )}
          </List>
        </Modal>
        {/*拜访单位选择弹框*/}
        <Modal
          visible={mapOpen}
          animationType={'slide-up'}
          onClose={() => {
            this.setState({
              mapOpen: false,
            })
          }}
          title={'拜访单位'}
          popup
        >
          <div className='map-modal-root'>
            <MapSearch
              onLocationSelect={this.onMapSelect}/>
          </div>
        </Modal>
      </div>
    )
  }

  onMapSelect = (location) => {
    this.setState({
      mapOpen: false,
    })
    this.company = location
    prompt('拜访单位', '请完善单位名称', [
      {
        text: '跳过此步', onPress: value => {
          this.setState({
            companyName: this.company.title,
            companyAddr: this.company.address,
          })
          this.getLocalDistance(location)
        },
      },
      {
        text: '确定', onPress: value => {
          this.setState({
            companyName: value,
            companyAddr: this.company.address,
          })
          this.getLocalDistance(location)
        },
      },
    ], 'default', this.company.title)
  }

  /**
   * 计算距离
   * @param location
   */
  getLocalDistance (location) {
    const { localPoint } = window
    if (isObjEmpty(localPoint)) {
      message.error('定位失败，请重新选择拜访单位')
    } else {
      const { BMap } = window
      if (isObjEmpty(this.map)) {
        this.map = new BMap.Map('map_canvas')
      }
      const distance = this.map.getDistance(localPoint, location.point)
      if (!isObjEmpty(distance)) {
        this.setState({
          distance: distance.toFixed(2),
        })
      }
    }
  }

  onCompanyClick = () => {
    this.setState({
      mapOpen: true,
    })
  }

  onModalSelect = (index) => {
    this.setState({
      modalOpen: false,
      purpose: this.state.modalList[index].value,
    })
  }

  onPurposeClick = () => {
    Toast.loading('数据请求中', 0)
    fetchPostObj(API.CRM_GETBUSINESSCHANCESTAGE, {
      condition: '1=1',
    }).then(response => {
      let { modalList } = this.state
      modalList = [
        { value: '客情维护' }, { value: '业务办理' }, { value: '其他拜访' },
      ]
      Toast.hide()
      if (response) {
        let stages = response.stages
        if (stages) {
          stages.forEach(item => {
            modalList.push({
              value: item.BS_NAME,
            })
          })
        }
      }
      this.setState({
        modalList,
        modalOpen: true,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      }
      this.setState({
        modalList: [
          { value: '客情维护' }, { value: '业务办理' }, { value: '其他拜访' },
        ],
        modalOpen: true,
      })
    })
  }

  onTypeChange = e => {
    this.setState({
      type: e.nativeEvent.selectedSegmentIndex,
    })
  }

  onDateChange = date => {
    let dateValue = moment(date).
      format('YYYY-MM-DD HH:mm:ss')
    this.setState({
      visitTime: dateValue,
    })
  }

  onSubmitClick = () => {
    //Todo 外勤计划提交
    const {
      companyName,
      companyAddr,
      purpose,
      type,
      distance,
      createTime,
      createLocation,
      visitTime,
      modalOpen,
      modalList,
      mapOpen,
    } = this.state
  }
}

const DatePickerCustom = ({ extra, onClick, children }) => (
  <div onClick={onClick}>
    {children}
    <span style={{
      float: 'right',
      color: '#888',
      height: '32px',
      lineHeight: '32px',
    }}>{extra}</span>
  </div>
)

let mapStateToProps = (state) => ({})

export default connect(mapStateToProps)(WorkOutAdd)
