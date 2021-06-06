/*合并reducer*/

import { combineReducers } from 'redux'

import { user } from './user'
import redHomeState from './redHomeState'
import redSearchState from './redSearchState'

export const appReducer = combineReducers({
  user, redHomeState, redSearchState,
})
