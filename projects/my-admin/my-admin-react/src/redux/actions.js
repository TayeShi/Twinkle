import { LOGIN, LOGOUT } from './action-types'
/**
 * login or logout
 */
export function login() {
  return { type: LOGIN }
}
export function logout() {
  return { type: LOGOUT }
}
