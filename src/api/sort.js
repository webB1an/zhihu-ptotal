import request from '../utils/request'

export function getSortList(data = {}) {
  return request({
    url: '/sort/list',
    method: 'post',
    data
  })
}

export function getSortTable(data = {}) {
  return request({
    url: '/sort/listtable',
    method: 'post',
    data
  })
}

export function saveSort(data = {}) {
  return request({
    url: '/sort/save',
    method: 'post',
    data
  })
}