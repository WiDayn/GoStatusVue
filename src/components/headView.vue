<template>
  <el-menu
      class="el-menu-demo"
      mode="horizontal"
      :ellipsis="false"
      style="width: 100%"
  >
    <el-menu-item index="0">GoStatus</el-menu-item>
    <div class="flex-grow" />
    <div v-if="NotifyList.Telegram === true" style="margin-top: 8px">
      <el-popover>
        <template #reference>
          <font-awesome-icon :icon="['fab', 'telegram']" size="2x" :style="{ color: 'Dodgerblue'}"/>
        </template>
        <template #default>
          <p>Telegram监控已启动</p>
        </template>
      </el-popover>
    </div>

    <div v-if="NotifyList.Telegram === false" style="margin-top: 8px">
      <el-popover>
        <template #reference>
          <font-awesome-icon :icon="['fab', 'telegram']" size="2x"/>
        </template>
        <template #default>
          <p>Telegram监控未启动</p>
        </template>
      </el-popover>
    </div>

  </el-menu>
</template>
<style>
.flex-grow {
  flex-grow: 1;
}
</style>

<script lang="ts">

import {defineComponent} from "vue";
import getNotifyList from "@/apis/getNotifyList";

export default defineComponent({
  data(){
    return{
      NotifyList: {"Telegram": false}
    }
  },
  mounted() {
    this.onLoad()
  },
  methods: {
    onLoad(){
      getNotifyList.getNotifyList().then((res) => {
        this.NotifyList = res
      })
    }
  }
})

</script>
