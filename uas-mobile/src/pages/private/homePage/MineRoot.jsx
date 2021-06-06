/**
 * Created by hujs on 2020/11/9
 * Desc: 我的
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import ProfileCard from '../../../components/private/profile/ProfileCard'
import ProfileList from '../../../components/private/profile/ProfileList'

class MineRoot extends Component {

  constructor () {
    super()

    this.state = {
      show: false,
    }
  }

  componentDidMount () {
    console.log('MineRoot')
  }

  componentWillUnmount () {

  }

  render () {
    let { accountName } = this.props.userState
    return (
      <div style={{ padding: '0px 5px', width: '100%' }}>
        <ProfileCard/>
        <ProfileList accountName={accountName}/>
      </div>
    )
  }
}

let mapStateToProps = (state) => ({
  mineState: state.mineState,
  userState: state.userState,
})

export default connect(mapStateToProps)(MineRoot)
