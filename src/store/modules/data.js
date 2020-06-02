import { getSummary } from '@/api/data'

const actions = {
  getSummary({ commit }, filter) {
    return new Promise((resolve, reject) => {
      getSummary(filter).then(response => {
        const { data } = response
        commit('SET_TOKEN', data.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  }
}

export default {
  namespaced: true,
  actions
}
