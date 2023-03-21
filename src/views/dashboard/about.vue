<template>
  <div>
    关于我们
    <el-button @click="fallBack">返回</el-button>
  </div>

</template>

<script>

export default {
  name: 'About',
  data() {
    return {

    }
  },
  methods: {
    fallBack() {
      this.$router.push('/dashboard')
    }
  }
}

</script>

<style>

</style>
