<template>
  <el-table :data="tableData" style="width: 100%">
    <el-table-column label="在线状态">
      <template #default="scope">
        <div v-if="scope.row.Online === true">
          <el-icon color="#67C23A" class="no-inherit" style="margin-left: 20px"><SuccessFilled /></el-icon>
        </div>
        <div v-if="scope.row.Online === false">
          <el-icon :size="17" color="#F56C6C" class="no-inherit" style="margin-left: 20px"><CircleCloseFilled /></el-icon>
        </div>
      </template>
    </el-table-column>
    <el-table-column label="服务器名称">
      <template #default="scope">
          <div @click="detailData = []; nowSelect = scope.$index; loadingDetail = true; getDetail(); drawer = true">
            <p >{{ scope.row.DisplayName }}</p>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="所在地">
      <template #default="scope">
        <el-image style="width: 30px" fit="contain" :src="'https://api.widayn.club/countriesFlags/' + scope.row.CountryCode + '.png'"></el-image>
      </template>
    </el-table-column>
    <el-table-column prop="MenFree" label="空闲内存" />
    <el-table-column prop="MemAll" label="总内存" />
    <el-table-column label="总上行 | 下行流量" >
      <template #default="scope">
        <p>{{ scope.row.TotalUpStreamDataSize }} | {{ scope.row.TotalDownStreamDataSize }}</p>
      </template>
    </el-table-column>
    <el-table-column prop="NowDownStreamDataSize" label="当前上行 | 下行流量" >
      <template #default="scope">
        <p>{{ scope.row.NowUpStreamDataSize }} | {{ scope.row.NowDownStreamDataSize }}</p>
      </template>
    </el-table-column>
    <el-table-column label="CPU占用">
      <template #default="scope">
        <el-progress :percentage="scope.row.CPUAvg"/>
      </template>
    </el-table-column>
    <el-table-column label="内存使用比">
      <template #default="scope">
        <el-progress :percentage="scope.row.MemUsedPercent"/>
      </template>
    </el-table-column>
    <el-table-column label="磁盘使用百分比">
      <template #default="scope">
        <el-progress :percentage="scope.row.DiskPercent" />
      </template>
    </el-table-column>
  </el-table>

  <el-drawer v-model="drawer" title="服务器详情">
    <el-skeleton style="width: 240px" :loading="loadingDetail" :rows="5" animated>
      <template #template>
        <div style="padding: 14px">
          <el-skeleton-item variant="h3" style="width: 50%" />
          <el-divider />
          <div
          >
            <el-skeleton-item variant="text" style="margin-right: 16px" />
            <el-skeleton-item variant="text" style="width: 30%" />
          </div>
        </div>
      </template>
      <template #default>
        <h3>{{ detailData.DisplayName }}</h3>
        <el-divider />
        <p>Hostname: {{ detailData.Hostname }}</p>
        <p>Location: {{ detailData.Country + " " + detailData.RegionName + " " + detailData.City}}</p>
        <p>OS: {{ detailData.OS }}</p>
        <p>ISP: {{ detailData.Isp}}</p>
        <p>OnlineTime: {{ getDays(detailData.UpdatedAt) }}</p>
      </template>
    </el-skeleton>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from "@/store/store";
import queryDetail from "@/apis/queryDetail";


export default defineComponent({
  data(){
    return{
      tableData: [],
      detailData: [],
      drawer: false,
      nowSelect: 0,
      loadingDetail: true,
      loadingTable: true,
    }
  },
  "mounted"() {
    this.onLoad();
  },
  methods: {
    onLoad() {
      setInterval(() => {
        if(store.getTableData() != undefined){
          this.tableData = JSON.parse(store.getTableData())
        }
      }, 1000);
      return;
    },
    getDetail(){
      queryDetail.queryDetail(this.tableData[this.nowSelect]["ClientId"]).then((res) => {
        this.detailData = res
        this.loadingDetail = false
      })
    },
    getDays(startDate:string){
      const start = new Date(startDate).getTime();
      const end = new Date(Date.now()).getTime();
      const milliseconds = Math.abs(end - start).toString()
      if(parseInt(milliseconds) / 1000 / 60 / 60 / 24 > 1) {
        return (parseInt(milliseconds) / 1000 / 60 / 60 / 24).toFixed(2) + "天"
      }
      if(parseInt(milliseconds) / 1000 / 60 / 60 > 1) {
        return (parseInt(milliseconds) / 1000 / 60 / 60).toFixed(2) + "小时"
      }
      return (parseInt(milliseconds) / 1000 / 60).toFixed(2) + "分钟"
    }
  }
})
</script>
