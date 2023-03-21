import request from '@/utils/request'

export function queryAllMenu() {
  return request({
    url: '/menu/queryAllMenu',
    method: 'get'
  })
}
