import request from '@/utils/request'
import { getToken } from '@/utils/auth'
/**
 * 公司后台管理所使用的方法
 * */

// ============================================== 工厂管理页面
/*
获取工厂列表
* */
export function getFactories(filters) {
  return request({
    url: '/admin/gfs&' + getToken(),
    method: 'get',
    params: filters
  })
}
/*
删除工厂
* */
export function delFactory(filter) {
  return request({
    url: '/admin/df&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
添加工厂
* */
export function addFactory(data) {
  return request({
    url: '/admin/af&' + getToken(),
    method: 'get',
    params: data
  })
}

// ============================================== 车间管理页面
/*
获取车间列表
* */
export function getWorkshop(id) {
  return request({
    url: '/admin/gw&' + getToken(),
    method: 'get',
    params: { id: id }
  })
}
/*
添加车间
* */
export function addWorkshop(name) {
  return request({
    url: '/admin/aw&' + getToken(),
    method: 'get',
    params: { name: name }
  })
}
/*
删除车间
* */
export function delWorkshop(id) {
  return request({
    url: '/admin/dw&' + getToken(),
    method: 'get',
    params: { id: id }
  })
}
// ========================================== 用户管理
/*
获取工厂的用户信息
* */
export function getUsers(filter) {
  return request({
    url: '/admin/gu&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
工厂添加用户
* */
export function addUser(data) {
  return request({
    url: '/admin/au&' + getToken(),
    method: 'get',
    params: data
  })
}
/*
工厂删除用户
* */
export function delUser(id) {
  return request({
    url: '/admin/du&' + getToken(),
    method: 'get',
    params: { id: id }
  })
}
