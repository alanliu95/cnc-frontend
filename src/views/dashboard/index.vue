<template>
  <div class="dashboard">
    <!-- <div class="dashboard-text">name: {{ name }}</div> -->
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import mainPage from '../monitor'

export default {
  name: 'Dashboard',
  components: { mainPage },
  data() {
    return {
      currentRole: 'mainPage'
    }
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
</style>
