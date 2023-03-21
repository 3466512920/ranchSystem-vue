import request from '@/utils/request'

export function queryAll() {
  return request({
    url: '/role/queryAll',
    method: 'get'
  })
}

export function queryByName(name) {
  return request({
    url: '/role/queryByName',
    method: 'get',
    params: {
      roleName: name
    }
  })
}

export function getRoleById(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'get'
  })
}

export function addRole(role) {
  return request({
    url: '/role/addRole',
    method: 'post',
    data: role
  })
}

export function updateRole(role) {
  return request({
    url: '/role/updateRole',
    method: 'put',
    data: role
  })
}

export function deleteRole(roleId) {
  return request({
    url: '/role/' + roleId,
    method: 'delete'
  })
}
