import request from '../utils/request'

export function getItemList(data = {}) {
  return request({
    url: '/item/list',
    method: 'post',
    data
  })
}

export function saveItem(data = {}) {
  return request({
    url: '/item/save',
    method: 'post',
    data
  })
}

export function deleteItem(data = {}) {
  return request({
    url: '/item/delete',
    method: 'post',
    data
  })
}