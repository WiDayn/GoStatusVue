<template>
  <div>
    <el-container>
      <el-header>
        <meta name="referrer" content="never">
        <HeadView/>
      </el-header>
      <el-main>
        <MainView/>
      </el-main>
    </el-container>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import HeadView from './components/headView.vue';
import MainView from './components/mainView.vue';

@Options({
  components: {
    HeadView,
    MainView,
  },
})
export default class App extends Vue {}
</script>

<style>
</style>
