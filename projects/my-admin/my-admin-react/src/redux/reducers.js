/*包含多个用于生成新的 state 的 reducer 函数的模块 */
import { combineReducers } from 'redux'
import { LOGIN, LOGOUT } from './action-types'

/**
 * login or logout
 */
function login(state = false, action) {
  switch (action.type) {
    case LOGIN:
      return true
    case LOGOUT:
      return false
    default:
      return state
  }
}

// function xxx(state = 0, action) {
//   return state
// }

// function yyy(state = 0, action) {
//   return state
// }

export default combineReducers({
  // xxx,
  // yyy
  login
})
