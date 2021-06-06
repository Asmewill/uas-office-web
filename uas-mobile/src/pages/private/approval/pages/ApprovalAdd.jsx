/**
 * Created by RaoMeng on 2020/2/19
 * Desc: 审批新增页面
 */

import React, { Component } from 'react'
import {
  isObjEmpty,
  isObjNull,
  strContain,
} from '../../../../utils/common/common.util'
import { message } from 'antd'
import { Prompt } from 'react-router-dom'
import {
  Toast,
  List,
  Button,
  Modal,
  Checkbox,
  ListView,
  SearchBar,
} from 'antd-mobile'
import BillModel, {
  TYPE_ADD,
  TYPE_TAB,
  TYPE_TITLE,
} from '../model/BillModel'
import LocalData from '../model/LocalData'
import BillGroupModel from '../model/BillGroupModel'
import FormInput from '../components/approvalAdd/FormInput'
import FormTitle from '../components/approvalAdd/FormTitle'
import FormAdd from '../components/approvalAdd/FormAdd'
import EmployeeItem from '../components/employeeItem/EmployeeItem'
import { fetchGet, fetchPostForm } from '../../../../utils/common/fetchRequest'
import { _baseURL } from '../../../../configs/api.config'

const alert = Modal.alert
const CheckboxItem = Checkbox.CheckboxItem

const SELECT_APPROVAL = 'select_approval'

let mCaller//当前单据的Caller
let mId//当前单据拥有的id，新增默认为0  如果mid为-1，说明保存时候使用更新的接口
let mMaster
let mDetailKeyField//从表id字段
let mKeyField//主表id字段
let mStatusCodeField//状态码字段
let mStatusField//状态字段
let mDetailMainKeyField//从表
let mDefaultMap

let mModalList = []

let mShowBillModels, mFormBillModels, mUpdateBillModels, mAllBillModels

export default class ApprovalAdd extends Component {

  constructor () {
    super()

    this.state = {
      billGroupModelList: [],
      modalOpen: false,
      modalDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectModel: {},
      promptAble: false,
    }
  }

  componentDidMount () {
    document.title = '新增单据'
    mCaller = this.props.match.params.caller
    mMaster = this.props.match.params.master
    mId = this.props.match.params.id
    if (isObjEmpty(mId)) {
      mId = 0
    }
    this.setState({
      promptAble: mId > 0,
    })
    if (isObjEmpty(mCaller)) {
      message.error('单据caller为空，单据获取失败')
    } else {
      Toast.loading('正在获取单据', 0)
      this.loadFormandGridDetail()
    }
  }

  componentWillUnmount () {
    Toast.hide()
    this.deleteAlert && this.deleteAlert.close()
    this.promptAlert && this.promptAlert.close()
  }

  render () {
    const { billGroupModelList } = this.state
    let formItems = []
    if (!isObjEmpty(billGroupModelList)) {
      //从表的起始Groupindex
      let gridStartIndex = -1
      for (let g = 0; g < billGroupModelList.length; g++) {
        let billGroup = billGroupModelList[g]
        if (!isObjNull(billGroup)) {
          let showBillFields = billGroup.showBillFields
          if (!isObjNull(showBillFields) &&
            showBillFields.length > 0) {
            //添加组标题
            gridStartIndex = this.addGroupTitle(g, billGroup, gridStartIndex,
              formItems)
            //添加显示字段
            for (let i = 0; i < showBillFields.length; i++) {
              let billModel = showBillFields[i]
              if (!isObjNull(billModel)) {
                let itemViewType = this.getItemViewType(billModel.type)
                if (billModel.renderer == 'detailAttach') {
                  itemViewType = 2
                }
                switch (itemViewType) {
                  case 1:
                    formItems.push(
                      <FormInput billModel={billModel} groupIndex={g}
                                 childIndex={i}
                                 baseUrl={_baseURL}
                                 onTextChange={this.onTextChange.bind(this)}
                                 onInputClick={this.onInputClick.bind(this)}/>,
                    )
                    break
                  case 2:
                    //附件
                    /*formItems.push(
                      <FormEnclosure billModel={billModel} groupIndex={g}
                                     baseUrl={_baseURL}
                                     childIndex={i}/>,
                    )*/
                    break
                  default:
                    break
                }
              }
            }
            if (billGroup.isForm == false && billGroup.lastInType == true) {
              //如果是最后一个从表，则添加【新增】按钮
              formItems.push(
                <FormAdd billModel={this.getAddModel(g)} groupIndex={g}
                         onAddClick={this.onAddClick.bind(this)}/>,
              )
            }
          }
        }
      }
    }
    return (
      <div className='approval-add-root'>
        <Prompt message={this.handlePrompt}
                when={this.state.promptAble}/>
        <div className='approval-add-root' style={{ flex: 1 }}>
          <List>
            {formItems}
          </List>
        </div>
        {formItems.length > 0 &&
        <Button type={'primary'}
                style={{
                  margin: '18px 26px',
                  height: '36px',
                  lineHeight: '36px',
                  fontSize: '16px',
                }}
                onClick={this.onSubmitClick}>提交</Button>}

        {this.getDbfindModal()}
      </div>
    )
  }

  /**
   * 处理返回事件
   * @param location
   */
  handlePrompt = location => {
    if (mId > 0) {
      this.promptAlert && this.promptAlert.close()
      this.promptAlert = Modal.alert('提示', '退出后，当前单据将被删除，确定退出并删除？', [
        {
          text: '取消', onPress: () => {
            this.setState({
              promptAble: true,
            })
          },
        },
        {
          text: '确定', onPress: () => {
            fetchPostForm(_baseURL + '/uapproval/common/cancelOrder.action', {
              caller: mCaller,
              id: mId,
            })
            this.setState({
              promptAble: false,
            })
            this.props.history.goBack()
          },
        }])
      return false
    } else {
      return true
    }
  }

  /**
   * 放大镜弹框
   * @returns {*}
   */
  getDbfindModal () {
    const { modalOpen, modalDataSource, selectModel } = this.state
    let selectType = selectModel.type
    return <Modal visible={modalOpen}
                  animationType={'slide-up'}
                  onClose={() => {
                    this.setState({
                      modalOpen: false,
                    })
                    if (selectModel.nodeId) {
                      this.toApprovalDetail(selectModel.nodeId)
                    }
                  }}
                  title={selectModel.caption}
                  popup
    >
      <SearchBar
        placeholder={'搜索'}
        maxLength={16}
        onChange={value => {
          if (isObjEmpty(value)) {
            this.setState({
              modalDataSource: modalDataSource.cloneWithRows(
                mModalList),
            })
          } else {
            let searchList = []
            if (!isObjEmpty(mModalList)) {
              mModalList.forEach(item => {
                if (!isObjNull(item)
                  && (
                    strContain(item.value, value)
                    || strContain(item.display, value)
                    || strContain(item.name, value)
                    || strContain(item.EM_CODE, value)
                    || strContain(item.EM_NAME, value)
                    || strContain(item.EM_POSITION, value)
                    || strContain(item.EM_DEFAULTORNAME, value)
                  )) {
                  searchList.push(item)
                }
              })
            }
            this.setState({
              modalDataSource: modalDataSource.cloneWithRows(
                searchList),
            })
          }
        }}
        onClear={value => {
          this.setState({
            modalDataSource: modalDataSource.cloneWithRows(
              mModalList),
          })
        }}
        /*onCancel={() => {
          this.setState({
            modalDataSource: modalDataSource.cloneWithRows(
              mModalList),
          })
        }}*/
      />
      <ListView
        dataSource={modalDataSource}
        initialListSize={30}
        renderRow={(rowData, sectionID, rowID) => {
          switch (selectType) {
            case SELECT_APPROVAL:
              return <List.Item
                key={rowID}
                wrap
                onClick={this.onEmployeeSelect.bind(this,
                  rowData)}>
                <EmployeeItem employee={rowData}/>
              </List.Item>
            /*case 'MF':
              return <CheckboxItem
                key={rowID}
                checked={rowData.isSelected == true}
                onChange={e => {
                  let checked = e.target.checked
                  rowData.isSelected = checked
                  this.setState({
                    modalDataSource,
                  })
                }}>{rowData.value}</CheckboxItem>*/
            default:
              return <List.Item
                key={rowID}
                wrap
                onClick={this.onDbfindSelect.bind(this,
                  selectModel,
                  rowData)}>{rowData.value}</List.Item>
          }
        }}
        style={{
          height: '72vh',
          overflow: 'auto',
        }}
        pageSize={20}
        // onScroll={() => {}}
        // scrollRenderAheadDistance={800}
      />
    </Modal>
  }

  onEmployeeSelect = rowData => {
    this.setState({
      modalOpen: false,
      modalDataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      }),
      selectModel: {},
    })
    let emcode = rowData.EM_CODE
    let nodeId = rowData.nodeId
    this.approvalTakeover(emcode, nodeId)
  }

  /**
   * 放大镜选项选中
   */
  onDbfindSelect = (selectModel, rowData) => {
    const { billGroupModelList } = this.state
    let groupIndex = selectModel.groupIndex
    let childIndex = selectModel.childIndex
    let selectData = rowData
    if (selectModel.type === 'C') {
      if (!isObjEmpty(billGroupModelList) &&
        !isObjNull(billGroupModelList[groupIndex])) {
        let billGroup = billGroupModelList[groupIndex]
        billGroup[childIndex].value = selectData.value
        billGroup[childIndex].display = selectData.display
      }
      this.setState({
        billGroupModelList,
        modalOpen: false,
        selectModel: {},
      })
    } else {
      let dataObj = selectData.obj
      let isForm = selectModel.isForm
      if (!isObjEmpty(billGroupModelList) &&
        !isObjNull(billGroupModelList[groupIndex])) {
        if (isForm == true) {
          billGroupModelList.forEach((billGroup, index) => {
            if (!isObjNull(billGroup) && billGroup.isForm) {
              let showBillFields = billGroup.showBillFields
              let hideBillFields = billGroup.hideBillFields
              if (!isObjEmpty(showBillFields)) {
                showBillFields.forEach((showModel, index) => {
                  if (showModel.field in dataObj) {
                    showModel.value = dataObj[showModel.field]
                  }
                })
              }
              if (!isObjEmpty(hideBillFields)) {
                hideBillFields.forEach((showModel, index) => {
                  if (showModel.field in dataObj) {
                    showModel.value = dataObj[showModel.field]
                  }
                })
              }
            }
          })
        } else {
          let billGroup = billGroupModelList[groupIndex]
          if (!isObjNull(billGroup)) {
            let showBillFields = billGroup.showBillFields
            let hideBillFields = billGroup.hideBillFields
            if (!isObjEmpty(showBillFields)) {
              showBillFields.forEach((showModel, index) => {
                if (showModel.field in dataObj) {
                  showModel.value = dataObj[showModel.field]
                }
              })
            }
            if (!isObjEmpty(hideBillFields)) {
              hideBillFields.forEach((showModel, index) => {
                if (showModel.field in dataObj) {
                  showModel.value = dataObj[showModel.field]
                }
              })
            }
          }
        }
      }
      this.setState({
        billGroupModelList,
        modalOpen: false,
        selectModel: {},
      })
    }
  }

  //接管单据
  approvalTakeover = (emcode, nodeId) => {
    Toast.loading('正在指定审批人', 0)
    fetchPostForm(_baseURL + '/common/takeOverTask.action', {
      em_code: emcode,
      nodeId: nodeId,
      master: mMaster,
      _noc: 1,
    }, {
      // 'Cookie': 'JSESSIONID=' + mSessionId
    }).then(response => {
      Toast.hide()
      message.success('指定审批人成功')
      this.toApprovalDetail(nodeId)
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('指定审批人失败')
      }
    })
  }

  /**
   * 添加明细组
   * @param groupIndex
   */
  onAddClick = groupIndex => {
    const { billGroupModelList } = this.state
    billGroupModelList[groupIndex].lastInType = false

    let newBillGroup = this.newGridBillGroup(groupIndex,
      billGroupModelList[groupIndex])
    billGroupModelList.push(newBillGroup)
    console.log('newgroup', billGroupModelList)
    this.setState({
      billGroupModelList,
    })
  }

  newGridBillGroup = (groupIndex, oldBillGroup) => {
    let oldGridIndex = oldBillGroup.gridIndex
    let isForm = oldBillGroup.isForm

    let newBillGroup = new BillGroupModel()
    newBillGroup.isForm = isForm
    if (isForm == true) {
      newBillGroup.group = oldBillGroup.group
    } else {
      newBillGroup.group = `明细${oldGridIndex + 1}`
    }
    newBillGroup.billCaller = oldBillGroup.billCaller
    newBillGroup.gridIndex = oldGridIndex + 1
    newBillGroup.isDeleteAble = true
    newBillGroup.lastInType = true
    newBillGroup.groupIndex = groupIndex + 1

    let showBillFields = oldBillGroup.showBillFields
    let hideBillFields = oldBillGroup.hideBillFields

    if (!isObjEmpty(showBillFields)) {
      for (let i = 0; i < showBillFields.length; i++) {
        let billModel = showBillFields[i]
        newBillGroup.addShow(new BillModel(billModel))
      }
    }
    if (!isObjEmpty(hideBillFields)) {
      for (let i = 0; i < hideBillFields.length; i++) {
        let billModel = hideBillFields[i]
        newBillGroup.addHide(new BillModel(billModel))
      }
    }
    return newBillGroup
  }

  /**
   * 添加分组头部
   * @param g
   * @param billGroup
   * @param gridStartIndex
   * @param formItems
   */
  addGroupTitle (g, billGroup, gridStartIndex, formItems) {
    let titleBillModel = new BillModel()
    titleBillModel.groupIndex = g
    titleBillModel.type = TYPE_TITLE
    if (billGroup.isForm == true) {
      titleBillModel.caption = billGroup.group
      titleBillModel.allowBlank = 'F'

    } else {
      if (gridStartIndex === -1) {
        gridStartIndex = g
      }
      titleBillModel.caption = `明细${g - gridStartIndex + 1}`
      titleBillModel.allowBlank = billGroup.isDeleteAble == true
        ? 'T'
        : 'F'
    }
    if (!isObjEmpty(titleBillModel.caption)) {
      formItems.push(
        <FormTitle billModel={titleBillModel} groupIndex={g}
                   onDeleteClick={this.onDeleteClick.bind(this)}/>,
      )
    }
    return gridStartIndex
  }

  onDeleteClick = groupIndex => {
    this.deleteAlert = alert('提示', '确认删除该明细?', [
      {
        text: '取消',
        onPress: () => {},
        style: 'default',
      },
      {
        text: '确定', onPress: () => {
          this.deleteGroup(groupIndex)
        },
      },
    ])
  }

  /**
   * 删除分组
   * @param groupIndex
   */
  deleteGroup (groupIndex) {
    const { billGroupModelList } = this.state
    let deleteGroup = billGroupModelList[groupIndex]
    let isLastGroup = deleteGroup.lastInType
    if (isLastGroup == true && groupIndex - 1 >= 0) {
      let billGroup = billGroupModelList[groupIndex - 1]
      if (deleteGroup.isForm == false && (billGroup.isForm == true)) {
        //明细删除光了，要默认添加一个空明细表
        deleteGroup.groupIndex = groupIndex - 1
        deleteGroup.gridIndex = 0
        let newGridGroup = this.newGridBillGroup(groupIndex - 1, deleteGroup)
        newGridGroup.isDeleteAble = false
        billGroupModelList.splice(groupIndex, 1)
        billGroupModelList.push(newGridGroup)
      } else {
        billGroup.lastInType = true
        billGroupModelList.splice(groupIndex, 1)
      }
    } else {
      billGroupModelList.splice(groupIndex, 1)
    }

    this.setState({
      billGroupModelList,
    }, () => {
      this.forceUpdate()
    })
  }

  onInputClick = (groupIndex, childIndex) => {
    const { billGroupModelList } = this.state
    if (!isObjNull(billGroupModelList) &&
      !isObjNull(billGroupModelList[groupIndex])) {
      let billGroup = billGroupModelList[groupIndex]
      if (!isObjNull(billGroup.showBillFields) &&
        !isObjNull(billGroup.showBillFields[childIndex])) {
        let billModel = billGroup.showBillFields[childIndex]
        if (isObjNull(billModel)) {
          return
        }
        billModel.childIndex = childIndex
        this.setState({
          selectModel: billModel,
        })
        Toast.loading('数据请求中', 0)
        let type = billModel.type
        if (type === 'C') {
          //单项选择
          this.getComboValue(billModel)
        } else if (type === 'SF' || type === 'DF') {
          //DBFind选择
          this.getDbfindList(billModel, billGroup)
        } else if (type === 'MF') {
          //多项选择

        }
      }
    }
  }

  /**
   * 放大镜类型
   * @param billModel
   * @param billGroup
   */
  getDbfindList (billModel, billGroup) {
    let fieldKey = billModel.field
    let isForm = billGroup.isForm
    let gridCaller = ''
    if (isForm == false && !isObjEmpty(billModel.findFunctionName)) {
      let findFunctionNames = billModel.findFunctionName.split('\|')
      if (!isObjEmpty(findFunctionNames)) {
        gridCaller = findFunctionNames[0]
        // fieldKey=findFunctionNames[1]
      }
    }
    let condition = '1=1'

    let params = {
      which: isForm == true ? 'form' : 'grid',
      caller: isForm == true
        ? (billGroup.billCaller || mCaller)
        : gridCaller,
      field: fieldKey,
      condition: condition,
      page: 1,
      pageSize: 1000,
    }
    if (isForm == false) {
      params.gridField = fieldKey
      params.gridCaller = (billGroup.billCaller || mCaller)
    }
    fetchGet(_baseURL + '/uapproval/common/dbfind.action',
      params).then(response => {
      Toast.hide()
      let dbfinds = response.dbfinds || response.gridDbfinds
      if (isObjEmpty(dbfinds)) {
        message.warn('选项数据为空')
        return
      }
      let dataStr = response.data
      let dataList = JSON.parse(dataStr)
      if (isObjEmpty(dataList)) {
        message.warn('选项数据为空')
        return
      }
      let fieldKeyLike = ''
      let configMap = {}
      dbfinds.forEach((config, index) => {
        //显示值对应字段名
        let dbGridField = config.dbGridField || config.ds_dbfindfield
        //实际字段名
        let field = config.field || config.ds_gridfield
        if (!isObjEmpty(dbGridField) && !isObjEmpty(field)) {
          if (field == fieldKey) {
            fieldKeyLike = dbGridField
          }
          configMap[dbGridField] = field
        }
      })
      let dbList = []
      dataList.forEach((item, index) => {
        let localData = new LocalData()
        localData.name = item[fieldKeyLike]
        let jsonMap = {}
        for (let key in configMap) {
          jsonMap[configMap[key]] = item[key]
        }
        localData.value = this.getShowValue(jsonMap)
        localData.obj = jsonMap
        dbList.push(localData)
      })
      mModalList = dbList
      if (dbList.length === 0) {
        message.error('选项数据为空')
      } else {
        this.setState({
          modalDataSource: this.state.modalDataSource.cloneWithRows(
            mModalList),
          modalOpen: true,
        })
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('选项获取失败')
      }
    })
  }

  getShowValue = (jsonMap) => {
    let showValue = ''
    for (let key in jsonMap) {
      if (!isObjEmpty(jsonMap[key])) {
        showValue += jsonMap[key] + ','
      }
    }
    showValue = showValue.substr(0, showValue.length - 1)
    return showValue
  }

  getComboValue (billModel) {
    fetchPostForm(_baseURL + '/mobile/common/getComboValue.action', {
      caller: mCaller,
      field: billModel.field,
    }).then(response => {
      Toast.hide()
      if ('combdatas' in response) {
        let combdatas = response.combdatas
        if (isObjEmpty(combdatas)) {
          message.warn('选项数据为空')
          return
        }
        let combList = []
        for (let i = 0; i < combdatas.length; i++) {
          let combObj = combdatas[i]
          if (isObjNull(combObj)) {
            continue
          }
          let comb = new LocalData()
          if (typeof combObj === 'string') {
            comb.value = combObj
            comb.display = combObj
          } else if (typeof combObj === 'object') {
            comb.value = combObj.DISPLAY
            comb.display = combObj.DISPLAY
          }
          combList.push(comb)
        }
        mModalList = combList
        if (combList.length === 0) {
          message.error('选项数据为空')
        } else {
          this.setState({
            modalDataSource: this.state.modalDataSource.cloneWithRows(
              mModalList),
            modalOpen: true,
          })
        }
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('选项获取失败')
      }
    })
  }

  onTextChange = (groupIndex, childIndex, value, display) => {
    const { billGroupModelList } = this.state
    if (!isObjNull(billGroupModelList) &&
      !isObjNull(billGroupModelList[groupIndex])) {
      let billGroup = billGroupModelList[groupIndex]
      if (!isObjNull(billGroup.showBillFields) &&
        !isObjNull(billGroup.showBillFields[childIndex])) {
        billGroup.showBillFields[childIndex].value = value
        if (!isObjNull(display)) {
          billGroup.showBillFields[childIndex].display = display
        }
      }
    }
    this.setState({
      billGroupModelList,
    })
  }

  onSubmitClick = () => {
    const { billGroupModelList } = this.state
    if (!isObjEmpty(billGroupModelList)) {
      let formFields = [], gridGroupFields = []
      for (let i = 0; i < billGroupModelList.length; i++) {
        let billGroup = billGroupModelList[i]
        if (isObjNull(billGroup)) {
          continue
        }
        if (billGroup.isForm) {
          if (!isObjEmpty(billGroup.showBillFields)) {
            formFields = formFields.concat(billGroup.showBillFields)
          }
          if (!isObjEmpty(billGroup.hideBillFields)) {
            formFields = formFields.concat(billGroup.hideBillFields)
          }
        } else {
          let gridFields = []
          if (!isObjEmpty(billGroup.showBillFields)) {
            gridFields = gridFields.concat(billGroup.showBillFields)
          }
          if (!isObjEmpty(billGroup.hideBillFields)) {
            gridFields = gridFields.concat(billGroup.hideBillFields)
          }
          gridGroupFields.push(gridFields)
        }
      }
      let formStore = this.analysisForm(formFields)
      if (isObjNull(formStore)) {
        return
      }
      let gridStoreList = this.analysisGrid(gridGroupFields)
      if (isObjNull(gridStoreList)) {
        return
      }

      console.log('form', JSON.stringify(formStore))
      console.log('grid', JSON.stringify(gridStoreList))
      Toast.loading('单据提交中', 0)
      fetchPostForm(_baseURL + (mId <= 0
        ? '/uapproval/common/commonSaveAndSubmit.action'
        : '/uapproval/common/commonUpdate.action'), {
        caller: mCaller,
        keyid: mId,
        id: mId,
        formStore: JSON.stringify(formStore),
        gridStore: JSON.stringify(gridStoreList),
      }).then(response => {
        Toast.hide()
        if (response && response.success == true) {
          this.setState({
            promptAble: false,
          })
          let nodeid = response.nodeId
          if (nodeid == -1) {
            message.success('单据提交成功')
            this.props.history.goBack()
          } else {
            if (mId <= 0) {
              mId = response[mKeyField] || response.keyvalue
              let formcode = response.formcode
              let isSave = response.isSave
              if (isSave == true || isSave == 'true') {
                this.toApprovalDetail(nodeid)
              } else {
                this.judgeApproval(nodeid, mId, formcode)
              }
              message.success('单据提交成功')
            } else {
              this.judgeApproval(nodeid, mId, '')
              message.success('单据提交成功')
            }
          }

        } else {
          message.error('单据提交失败')
        }
        let exceptionInfo = response.exceptionInfo
        if (!isObjEmpty(exceptionInfo)) {
          message.error(exceptionInfo)
        }
      }).catch(error => {
        Toast.hide()
        if (typeof error === 'string') {
          message.error(error)
        } else {
          message.error('单据提交失败')
        }
      })
    }
  }

  toApprovalDetail (nodeid) {
    if (!isObjEmpty(nodeid)) {
      this.props.history.replace('/approval/%7B%22' +
        'master%22%3A%22' + mMaster
        + '%22%2C%22nodeId%22%3A' + nodeid
        + '%2C%22type%22%3A' + 2
        + '%2C%22baseUrl%22%3A%22' + encodeURIComponent(_baseURL)
        + '%22%7D')
    }
  }

  judgeApproval = (oldNodeId, keyvalue, formcode) => {
    Toast.loading('正在触发审批流', 0)
    fetchGet(_baseURL + '/uapproval/common/getMultiNodeAssigns.action', {
      condition: '1=1',
      caller: mCaller,
      id: keyvalue,
    }).then(response => {
      Toast.hide()
      if (!isObjEmpty(response.assigns)) {
        let assignArray = response.assigns
        let assignObj = assignArray[0]
        let nodeid = assignObj ? (assignObj.JP_NODEID || '') : ''
        let candidates = assignObj ? (assignObj.JP_CANDIDATES || []) : []
        if (!isObjEmpty(nodeid) && !isObjEmpty(candidates)) {
          let candidateList = []
          candidates.forEach(item => {
            let candidate = item
            candidate.id = keyvalue
            candidate.formcode = formcode
            candidate.nodeId = nodeid

            candidateList.push(candidate)
          })
          mModalList = candidateList
          this.setState({
            modalDataSource: this.state.modalDataSource.cloneWithRows(
              candidateList),
            selectModel: {
              caption: '选择审批人',
              type: SELECT_APPROVAL,
              nodeId: nodeid,
            },
            modalOpen: true,
          })
        } else {
          message.success('审批流触发成功')
          this.toApprovalDetail(nodeid)
        }
      } else {
        this.toApprovalDetail(oldNodeId)
      }
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('审批流触发失败')
      }
    })
  }

  /**
   * 判断主表字段必填情况，拼接主表字段
   * @param formFields
   * @returns {null}
   */
  analysisForm = (formFields) => {
    if (!isObjNull(formFields)) {
      let formStore = {}
      for (let i = 0; i < formFields.length; i++) {
        let billModel = formFields[i]
        if (isObjNull(billModel)) {
          continue
        }
        if (isObjEmpty(billModel.getValue()) && billModel.isdefault === -1 &&
          (billModel.allowBlank === 'necessaryField'
            || billModel.allowBlank === 'F')) {
          message.error(`${billModel.caption}为必填项`)
          return null
        }
        //Todo 附件上传

        formStore[billModel.field] = billModel.getDisplay()
      }
      return formStore
    } else {
      return null
    }
  }

  analysisGrid = (gridBillMap) => {
    let gridStoreList = []
    if (!isObjNull(gridBillMap)) {
      for (let i = 0; i < gridBillMap.length; i++) {
        let gridFields = gridBillMap[i]
        if (!isObjEmpty(gridFields)) {
          let gridStore = {}
          for (let j = 0; j < gridFields.length; j++) {
            let billModel = gridFields[j]
            if (isObjEmpty(billModel.getValue())
              && billModel.isdefault === -1
              && (billModel.allowBlank === 'necessaryField'
                || billModel.allowBlank === 'F')) {
              message.error(`${billModel.caption}为必填项`)
              return null
            }
            //Todo 附件上传

            gridStore[billModel.field] = billModel.getDisplay()
          }
          gridStoreList.push(gridStore)
        }
      }
    }
    return gridStoreList
  }

  /**
   * 获取主从表数据
   */
  loadFormandGridDetail () {
    fetchPostForm(_baseURL + (mId <= 0
      ? '/mobile/uapproval/getformandgriddetail.action'
      : '/mobile/getformandgriddetail_uapproval.action'), {
      condition: '1=1',
      caller: mCaller,
      id: mId,
    }).then(response => {
      Toast.hide()
      let billGroupModels = this.handlerBill(response)
      // this.changeBillModel(billGroupModels)
      // console.log('raomeng', billGroupModels)
      this.setState({
        billGroupModelList: billGroupModels,
      })
    }).catch(error => {
      Toast.hide()
      if (typeof error === 'string') {
        message.error(error)
      } else {
        message.error('单据获取失败')
      }
    })
  }

  /**
   * 解析主从表数据
   * @param response
   */
  handlerBill = (response) => {
    let showBillGroupModels = []
    let config = response.config
    if (isObjEmpty(config)) {
      message.error('单据配置异常，请联系系统管理员')
      return []
    } else {
      mDetailKeyField = config.fo_detailkeyfield
      mKeyField = config.fo_keyfield
      mStatusCodeField = config.fo_statuscodefield
      mStatusField = config.fo_statusfield
      mDetailMainKeyField = config.fo_detailmainkeyfield
    }
    let data = response.data
    if (isObjEmpty(data)) {
      message.error('无法获取单据界面，请联系系统管理员')
      return []
    } else {
      let formdetail = data.formdetail
      if (isObjEmpty(formdetail)) {
        message.error('无法获取单据界面，请联系系统管理员')
        return []
      }

      let formdeMap = this.handlerFormdetail(formdetail)
      let formBillGroupModels = []//主表显示字段

      if (!isObjEmpty(formdeMap)) {
        for (let key in formdeMap) {
          let entryValue = formdeMap[key]
          if (!isObjNull(entryValue)) {
            //主表caller为单据caller
            entryValue.billCaller = mCaller

            formBillGroupModels.push(entryValue)
          }
        }
        if (!isObjEmpty(formBillGroupModels)) {
          formBillGroupModels.sort((pre, next) => {
            return pre.minDetno - next.minDetno
          })
        }
      }
      showBillGroupModels = showBillGroupModels.concat(formBillGroupModels)

      let gridetail = data.gridetail
      let gridGroupModelMap = this.handlerGridetail(
        showBillGroupModels.length,
        gridetail)
      if (!isObjEmpty(gridGroupModelMap)) {
        for (let key in gridGroupModelMap) {
          let entryValue = gridGroupModelMap[key]
          if (!isObjNull(entryValue)) {
            //单从表的情况下，从表caller和主表一样
            entryValue.billCaller = mCaller
            showBillGroupModels.push(entryValue)
          }
        }
      }
    }
    return showBillGroupModels
  }

  /**
   * 获取主表数据包含分组
   * @param formdetail
   */
  handlerFormdetail = formdetail => {
    if (!isObjEmpty(formdetail)) {
      let object
      let modelMap = {}
      for (let i = 0; i < formdetail.length; i++) {
        object = formdetail[i]
        let billModel = this.getBillModelByObject(object)
        let group = object.fd_group
        //判断组别
        if (group in modelMap) {
          let mapBillGroupModel = modelMap[group]
          if (isObjNull(mapBillGroupModel)) {
            let mapBillGroupModel = new BillGroupModel()
            mapBillGroupModel.isForm = true
            mapBillGroupModel.group = group
            mapBillGroupModel.groupIndex = Object.keys(modelMap).length
            modelMap[group] = mapBillGroupModel
          }
          billModel.groupIndex = mapBillGroupModel.groupIndex
          let minDetno = mapBillGroupModel.minDetno
          if (minDetno > billModel.detno) {
            minDetno = billModel.detno
          }
          mapBillGroupModel.minDetno = minDetno
          if (this.isShow(billModel)) {
            mapBillGroupModel.addShow(billModel)
          } else {
            mapBillGroupModel.addHide(billModel)
          }
        } else {
          let mapBillGroupModel = new BillGroupModel()
          mapBillGroupModel.group = group
          mapBillGroupModel.isForm = true
          mapBillGroupModel.groupIndex = Object.keys(modelMap).length
          modelMap[group] = mapBillGroupModel

          billModel.groupIndex = mapBillGroupModel.groupIndex
          if (this.isShow(billModel)) {
            mapBillGroupModel.addShow(billModel)
          } else {
            mapBillGroupModel.addHide(billModel)
          }
        }
      }
      return modelMap
    } else {
      return null
    }
  }

  handlerGridetail = (index, formdetail) => {
    if (!isObjEmpty(formdetail)) {
      let modelMap = {}
      if (mId <= 0) {
        //id等于0，是新增单据，则默认添加一组从表
        let billGroupModel = new BillGroupModel()
        billGroupModel.groupIndex = index
        billGroupModel.gridIndex = 1
        billGroupModel.group = '明细1'
        billGroupModel.lastInType = true
        billGroupModel.isForm = false

        let hideBillFields = []
        let showBillFields = []
        for (let i = 0; i < formdetail.length; i++) {
          if (isObjNull(formdetail[i])) {
            continue
          }
          let billModel = this.getBillModelByObject(formdetail[i])
          if (!isObjNull(billModel)) {
            billModel.groupIndex = index
            if (this.isShow(billModel)) {
              showBillFields.push(billModel)
            } else {
              hideBillFields.push(billModel)
            }
          }
        }
        billGroupModel.hideBillFields = hideBillFields
        billGroupModel.showBillFields = showBillFields

        modelMap['明细1'] = billGroupModel
      } else {
        //id大于0 ，说明是在录入单据，则将在录入数据先添加进从表
        let object, oldGroup
        for (let i = 0; i < formdetail.length; i++) {
          object = formdetail[i]
          if (isObjNull(object)) {
            continue
          }
          let billModel = this.getBillModelByObject(object)
          let dg_group = object.dg_group
          let group = isObjEmpty(dg_group) ? '0' : dg_group//dg_group为0代表是新增的单据明细

          if (`明细${group}` in modelMap) {
            let billGroupModel = modelMap[`明细${group}`]
            if (isObjNull(billGroupModel)) {
              billGroupModel = new BillGroupModel()
              billGroupModel.groupIndex = index +
                Object.keys(modelMap).length -
                1
              billGroupModel.gridIndex = Object.keys(modelMap).length + 1
              billGroupModel.group = `明细${Object.keys(modelMap).length + 1}`
              billGroupModel.lastInType = true
              billGroupModel.form = false

              if (!isObjEmpty(oldGroup)) {
                modelMap[oldGroup].lastInType = false
              }
              oldGroup = `明细${group}`
              modelMap[`明细${group}`] = billGroupModel
            }

            billModel.groupIndex = billGroupModel.groupIndex
            if (this.isShow(billModel)) {
              billGroupModel.addShow(billModel)
            } else {
              billGroupModel.addHide(billModel)
            }
          } else {
            let billGroupModel = new BillGroupModel()
            billGroupModel.groupIndex = index + Object.keys(modelMap).length
            billGroupModel.gridIndex = Object.keys(modelMap).length + 1
            billGroupModel.group = `明细${Object.keys(modelMap).length + 1}`
            billGroupModel.lastInType = true
            billGroupModel.form = false

            modelMap[`明细${group}`] = billGroupModel

            billModel.groupIndex = billGroupModel.groupIndex
            if (this.isShow(billModel)) {
              billGroupModel.addShow(billModel)
            } else {
              billGroupModel.addHide(billModel)
            }

            if (!isObjEmpty(oldGroup)) {
              modelMap[oldGroup].lastInType = false
            }
            oldGroup = `明细${group}`
          }
        }
      }
      return modelMap
    } else {
      return null
    }
  }

  getBillModelByObject = object => {
    let billModel = new BillModel()

    let caption = object.fd_caption || object.dg_caption//字段名称
    let value = object.fd_value || object.dg_value//字段值
    let fd_detno = object.fd_detno//序号
    let id = object.fd_id || object.gd_id//id
    let length = object.fd_maxlength || object.dg_maxlength//字符长度
    let appwidth = object.fd_appwidth || object.dg_appwidth//宽度
    let isdefault = object.mfd_isdefault || object.mdg_isdefault//是否显示
    let dbfind = object.fd_dbfind //是否是dbfind字段判定
    let type = object.fd_type || object.dg_type//类型(标题类型为Constants.TYPE_TITLE,不触发点击事件等 )
    let logicType = object.fd_logictype || object.dg_logictype//logic类型
    let readOnly = object.fd_readonly || object.dg_editable//是否只读
    let field = object.fd_field || object.dg_field//字段
    let defValue = object.fd_defaultvalue //默认值
    let allowBlank = object.fd_allowblank//是否允许为空(注:当作为标题的时候T:表示可以删除 F:表示不可删除)
    let findFunctionName = object.dg_findfunctionname
    let updatable = object.fd_modify || object.dg_modify
    let renderer = object.dg_renderer

    if (isObjEmpty(defValue) && !isObjEmpty(mDefaultMap) &&
      !isObjNull(mDefaultMap[field])) {
      defValue = mDefaultMap[field]
    }

    if (logicType === 'necessaryField') {
      allowBlank = 'F'
    }

    let display = ''
    let combostore = object.COMBOSTORE
    if (!isObjEmpty(combostore)) {
      let localDatas = []
      for (let i = 0; i < combostore.length; i++) {
        let combosModel = combostore[i]
        let dlc_display = combosModel.DLC_DISPLAY
        let dlc_value = combosModel.DLC_VALUE

        let localData = new LocalData()
        localData.display = dlc_display
        localData.value = dlc_value

        if (type === 'C'
          && !isObjEmpty(value)
          && (value == dlc_display || value == dlc_value)) {
          value = dlc_value
          display = dlc_display
        }
        localDatas.push(localData)
      }
      billModel.localDatas = localDatas
    }

    billModel.findFunctionName = findFunctionName
    billModel.detno = fd_detno
    billModel.caption = caption
    billModel.id = id
    billModel.value = value
    billModel.display = display
    billModel.length = length
    billModel.appwidth = appwidth
    billModel.isdefault = isdefault
    billModel.dbfind = dbfind
    billModel.type = type
    billModel.logicType = logicType
    billModel.readOnly = readOnly
    billModel.field = field
    billModel.defValue = defValue
    billModel.allowBlank = allowBlank
    billModel.updatable = (updatable === 'T')
    billModel.renderer = renderer

    return billModel
  }

  changeBillModel = billGroupModels => {
    if (isObjNull(mShowBillModels)) {
      mShowBillModels = []
    } else {
      mShowBillModels.length = 0
    }
    if (isObjNull(mFormBillModels)) {
      mFormBillModels = []
    } else {
      mFormBillModels.length = 0
    }
    if (isObjNull(mUpdateBillModels)) {
      mUpdateBillModels = []
    } else {
      mUpdateBillModels.length = 0
    }
    if (isObjNull(mAllBillModels)) {
      mAllBillModels = []
    } else {
      mAllBillModels.length = 0
    }
    //从表的起始Groupindex
    let gridStartIndex = -1
    for (let i = 0; i < billGroupModels.length; i++) {
      let groupModel = billGroupModels[i]
      if (!isObjNull(groupModel)) {
        if (!isObjEmpty(groupModel.showBillFields)) {
          if (!isObjEmpty(groupModel.group)) {
            let titleBillModel = new BillModel()
            titleBillModel.groupIndex = i
            titleBillModel.type = TYPE_TITLE
            if (groupModel.isForm == true) {
              titleBillModel.caption = groupModel.group
            } else {
              if (gridStartIndex === -1) {
                gridStartIndex = i
              }
              titleBillModel.caption = `明细${i - gridStartIndex + 1}`
              titleBillModel.allowBlank = groupModel.isDeleteAble == true
                ? 'T'
                : 'F'
              mShowBillModels.push(titleBillModel)
            }
          }
          mShowBillModels = mShowBillModels.concat(groupModel.showBillFields)

          if (groupModel.isForm == false && groupModel.lastInType == true) {
            mShowBillModels.push(this.getAddModel(i))
          }
        }

        ////////////////////////////////////////////////
        if (!isObjEmpty(groupModel.updateBillFields)) {
          mUpdateBillModels = mUpdateBillModels.concat(
            groupModel.updateBillFields)
        }

        if (groupModel.isForm == true) {
          if (!isObjEmpty(groupModel.showBillFields)) {
            mFormBillModels = mFormBillModels.concat(
              groupModel.showBillFields)
          }
          if (!isObjEmpty(groupModel.hideBillFields)) {
            mFormBillModels = mFormBillModels.concat(
              groupModel.hideBillFields)
          }
        }

        if (!isObjEmpty(groupModel.showBillFields)) {
          mAllBillModels = mAllBillModels.concat(groupModel.showBillFields)
        }
        if (!isObjEmpty(groupModel.hideBillFields)) {
          mAllBillModels = mAllBillModels.concat(groupModel.hideBillFields)
        }
      }
    }
  }

  isShow = (billModel) => (billModel.isdefault === -1 && billModel.type !==
    'H')

  getAddModel = index => {
    let addBillModel = new BillModel()
    addBillModel.groupIndex = index
    addBillModel.type = TYPE_ADD
    addBillModel.caption = '添加单据'
    return addBillModel
  }

  getItemViewType = dfType => {
    if (isObjEmpty(dfType)) {
      return -1
    }
    switch (dfType.toUpperCase()) {
      case TYPE_TITLE:
        return 0
      case TYPE_ADD:
        return 110
      case TYPE_TAB:
        return 111
      case 'C':
      case 'SF':
      case 'DF':
      case 'S':
      case 'SS':
        return 1
      case 'FF':
        return 2
      default:
        return 1
    }
  }
}
