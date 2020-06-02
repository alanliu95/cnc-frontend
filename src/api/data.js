import request from '@/utils/request'
import { getToken } from '@/utils/auth'


export function getDevDetail(devId) {
  return request({
    url: '/cnc/' + devId,
    method: 'get'
  })
}
export function getAllDevStatus() {
  return request({
    url: '/cnc/status',
    method: 'get'
  })
}
/*
获取车间名称列表
* */
export function getWorkshops() {
  return request({
    url: '/data/gws&' + getToken(),
    method: 'get'
  })
}
// ========================================== 以下方法在 设备状态页 使用
export function getSummaryTotal(filter) {
  return request({
    url: '/data/gst&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
获取设备摘要数据
* */
export function getSummary(filter) {
  return request({
    url: '/data/gs&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ========================================== 以下方法在 设备详情页 使用
/*
获取设备详细信息
* */
export function getDetails(id) {
  return request({
    url: '/data/gdi&' + getToken(),
    method: 'get',
    params: { id: id }
  })
}
/*
获取设备报警在指定时间范围的总页数
* */
export function getAlertPages(filter) {
  return request({
    url: '/data/gap&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
获取设备报警记录在指定时间范围的汇总信息
* */
export function getAlertSummary(filter) {
  return request({
    url: '/data/gas&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
获取设备报警记录在指定时间范围指定页数据
* */
export function getAlertData(filter) {
  return request({
    url: '/data/gad&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ========================================== 以下方法在 设备利用率页 使用
/*
获取分析数据 - 使用率摘要
* */
export function getAnalysis(filter) {
  return request({
    url: '/data/ga&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ========================================== 以下方法在 设备利用率详情页 使用
/*
获取设备分析数据 - 使用情况汇总1
* */
export function getUsageSummary1(filter) {
  return request({
    url: '/data/gus1&' + getToken(),
    method: 'get',
    params: filter
  })
}

/*
获取设备分析数据 - 使用情况汇总2 总页数
* */
export function getUsageTotal2(filter) {
  return request({
    url: '/data/gut2&' + getToken(),
    method: 'get',
    params: filter
  })
}

/*
获取设备分析数据 - 使用情况汇总2
* */
export function getUsageSummary2(filter) {
  return request({
    url: '/data/gus2&' + getToken(),
    method: 'get',
    params: filter
  })
}

/*
获取设备分析数据 - 使用情况详情 总页数
* */
export function getUsageTotald(filter) {
  return request({
    url: '/data/gutd&' + getToken(),
    method: 'get',
    params: filter
  })
}

/*
获取设备分析数据 - 使用情况详情
* */
export function getUsageDetail(filter) {
  return request({
    url: '/data/gud&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ==========================================
/*
获取预警数据
* */
export function getForecast(filter) {
  return request({
    url: '/data/gf&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ========================================== 以下方法在 工厂信息 页使用
/*
获取工厂信息
* */
export function getFactoryInfo() {
  return request({
    url: '/data/gfi&' + getToken(),
    method: 'get'
  })
}
/*
获取工厂车间 总页数
* */
export function getFactoryTotal(filter) {
  return request({
    url: '/data/gft&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
获取工厂的车间信息
* */
export function getFactoryData(filter) {
  return request({
    url: '/data/gfd&' + getToken(),
    method: 'get',
    params: filter
  })
}
// ========================================== 以下方法在 用户管理 页使用
/*
获取工厂的用户信息
* */
export function getUsers(filter) {
  return request({
    url: '/data/gfu&' + getToken(),
    method: 'get',
    params: filter
  })
}
/*
工厂添加用户
* */
export function addUser(data) {
  return request({
    url: '/data/afu&' + getToken(),
    method: 'get',
    params: data
  })
}
/*
工厂删除用户
* */
export function delUser(id) {
  return request({
    url: '/data/dfu&' + getToken(),
    method: 'get',
    params: { id: id }
  })
}
