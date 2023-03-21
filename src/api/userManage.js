import request from '@/utils/request'

export function getUserList() {
  return request({
    url: '/user/queryAll',
    method: 'get'
  })
}

export function queryByName(name) {
  return request({
    url: '/user/queryByName',
    method: 'get',
    params: {
      name: name
    }
  })
}

export function deleteUserById(userId) {
  return request({
    url: '/user/' + userId,
    method: 'delete'
  })
}

export function getAccount() {
  return request({
    url: '/user/getAccount',
    method: 'get'
  })
}

export function updateUser(user) {
  return request({
    url: '/user/updateUser',
    method: 'put',
    data: user
  })
}

export function addUser(user) {
  return request({
    url: '/user/addUser',
    method: 'post',
    data: user
  })
}

export function getUserById(userId) {
  return request({
    url: '/user/' + userId,
    method: 'get'
  })
}

