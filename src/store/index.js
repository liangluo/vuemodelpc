import Vue from 'vue'
import Vuex from 'vuex'
import storage from '@/utils/storage'
import staticRouter from '@/router/staticRouter'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    source: {
      token: null,
      cancel: null
    }
  },
  mutations: {
    updateSource (state, { source }) {
      state.source = source
    }
  },
  actions: {

  },
  modules: {
  }
})
