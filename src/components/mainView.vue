<template>
  <div v-for="(item, index) in tableData" :key="index">
    <el-row v-if="index % 3 === 0">
      <el-card class="box-card" style="padding: 14px; width:25%; margin: 2%">
        <template #header>
          <div class="card-header">
            <el-image style="width: 30px" fit="contain" :src="'https://api.widayn.club/countriesFlags/default/' + tableData[index].CountryCode + '.png'"></el-image>
            {{ tableData[index].DisplayName }}
          </div>
        </template>
      </el-card>
      <el-card class="box-card" style="padding: 14px; width:25%; margin: 2%" v-if="index <= tableData.length - 2">
        <template #header>
          <div class="card-header">
            <el-image style="width: 30px" fit="contain" :src="'https://api.widayn.club/countriesFlags/default/' + tableData[index + 1].CountryCode + '.png'"></el-image>
            {{ tableData[index + 1].DisplayName }}
          </div>
        </template>
      </el-card>
      <el-card class="box-card" style="padding: 14px; width:25%; margin: 2%" v-if="index <= tableData.length - 3">
        <template #header>
          <div class="card-header">
            <el-image style="width: 30px" fit="contain" :src="'https://api.widayn.club/countriesFlags/default/' + tableData[index + 2].CountryCode + '.png'"></el-image>
            {{ tableData[index + 2].DisplayName }}
          </div>
        </template>
      </el-card>
    </el-row>
  </div>


  <div class='chart' id='map' style="width: 100%; height: 700px"></div>
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
          <div @click="nowSelect = scope.$index; loadingDetail = true; getDetail(); drawer = true">
            <p >{{ scope.row.DisplayName }}</p>
          </div>
      </template>
    </el-table-column>
    <el-table-column label="所在地">
      <template #default="scope">
        <el-image style="width: 30px" fit="contain" :src="'https://api.widayn.club/countriesFlags/default/' + scope.row.CountryCode + '.png'"></el-image>
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
    <el-table-column label="CT | CU | CM">
      <template #default="scope">
        <p>{{ scope.row.CT.AvgRTT }}ms | {{ scope.row.CU.AvgRTT }}ms | {{ scope.row.CM.AvgRTT }}ms</p>
      </template>
    </el-table-column>
  </el-table>

  <el-drawer v-model="drawer" title="服务器详情" size="50%">
    <el-skeleton style="width: 300px" :loading="loadingDetail" :rows="5" animated>
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
        <div>
          <h3>{{ detailData.client.DisplayName }}</h3>
          <el-divider />
          <p>主机名: {{ detailData.client.Hostname }}</p>
          <p>位置: {{ detailData.client.Country + " " + detailData.client.RegionName + " " + detailData.client.City}}</p>
          <p>系统: {{ detailData.client.OS }}</p>
          <p>运营商: {{ detailData.client.Isp}}</p>
          <p>在线时长: {{ getDays(detailData.client.UpdatedAt) }}</p>
        </div>
        <div>
          <div id="ChartCPU" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartMem" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartDisk" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartUpStream" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartDownStream" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartCT" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartCU" :style="{width: '100%', height: '300px'}"></div>
        </div>
        <div>
          <div id="ChartCM" :style="{width: '100%', height: '300px'}"></div>
        </div>
      </template>
    </el-skeleton>
  </el-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import store from "@/store/store";
import queryDetail from "@/apis/queryDetail";
import * as echarts from 'echarts';
import {WorldJSON} from '@/map/world';
import getCountryList from "@/apis/getCountryList";

export default defineComponent({
  data(){
    return{
      tableData: [],
      detailData: { pingRecords : {CT: {Time: [], AvgRTT: []}, CU:{Time: [], AvgRTT: []}, CM:{Time: [], AvgRTT: []}}, basicRecords: {CPUAvg: [], MemUsedPercent: [], DiskPercent: [], NowUpStreamDataSize: [], NowDownStreamDataSize: [], Time: []} },
      drawer: false,
      nowSelect: 0,
      loadingDetail: true,
      loadingTable: true,
      loadingCharts: false,
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

      getCountryList.getCountryList().then((res) => {
        echarts.registerMap('world', WorldJSON);
        const chart = echarts.init(document.getElementById('map')!);
        chart.setOption({
          tooltip: {
            trigger: 'item',
            formatter: '{b}<br/>{c} 台'
          },
          toolbox: {
            show: true,
            orient: 'vertical',
            left: 'right',
            top: 'center',
            feature: {
              dataView: { readOnly: false },
              restore: {},
              saveAsImage: {}
            }
          },
          visualMap: {
            min: res.Min,
            max: res.Max,
            text: ['High', 'Low'],
            realtime: false,
            calculable: true,
            inRange: {
              color: [
                '#777788',
                '#2222DD',
              ]
            }
          },
          series: [{
            type: 'map',
            map: 'world',
            data: res.Countries
          }]
        });
      })
    },
    getDetail(){
      queryDetail.queryDetail(this.tableData[this.nowSelect]["ClientId"]).then((res) => {
        this.detailData = res
        this.loadingDetail = false
      }).then(() => {
        this.drawLine()
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
    },
    drawLine(){
      let ChartCPU = echarts.init(document.getElementById('ChartCPU')!)
      document.getElementById('ChartCPU')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartCPU.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: 'CPU占用',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        xAxis: {
          type: 'category',
          data: this.detailData.basicRecords.Time,
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: this.detailData.basicRecords.CPUAvg,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });

      let ChartMem = echarts.init(document.getElementById('ChartMem')!)
      document.getElementById('ChartMem')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartMem.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '内存占用',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.basicRecords.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        series: [
          {
            data: this.detailData.basicRecords.MemUsedPercent,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });

      let ChartDisk = echarts.init(document.getElementById('ChartDisk')!)
      document.getElementById('ChartDisk')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartDisk.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '硬盘占用',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.basicRecords.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        series: [
          {
            data: this.detailData.basicRecords.DiskPercent,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });

      // 基于准备好的dom，初始化echarts实例
      let ChartUpStream = echarts.init(document.getElementById('ChartUpStream')!)
      document.getElementById('ChartUpStream')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartUpStream.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '上传流量',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.basicRecords.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}Kbp/s',
        },
        series: [
          {
            data: this.detailData.basicRecords.NowUpStreamDataSize,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });

      // 基于准备好的dom，初始化echarts实例
      let ChartDownStream = echarts.init(document.getElementById('ChartDownStream')!)
      document.getElementById('ChartDownStream')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartDownStream.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '下载流量',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.basicRecords.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}Kbp/s',
        },
        series: [
          {
            data: this.detailData.basicRecords.NowDownStreamDataSize,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });


      // 基于准备好的dom，初始化echarts实例
      let ChartCT = echarts.init(document.getElementById('ChartCT')!)
      document.getElementById('ChartCT')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartCT.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '中国电信',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.pingRecords.CT.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        series: [
          {
            data: this.detailData.pingRecords.CT.AvgRTT,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });
      let ChartCU = echarts.init(document.getElementById('ChartCU')!)
      document.getElementById('ChartCU')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartCU.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '中国联通',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.pingRecords.CU.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        series: [
          {
            data: this.detailData.pingRecords.CU.AvgRTT,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });
      let ChartCM = echarts.init(document.getElementById('ChartCM')!)
      document.getElementById('ChartCM')!.setAttribute('_echarts_instance_', '')
      // 绘制图表
      ChartCM.setOption({
        zlevel: 1,
        z: 1,
        title: {
          text: '中国移动',
          left: 'center'
        },
        xAxis: {
          type: 'category',
          data: this.detailData.pingRecords.CM.Time,
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            animation: true,
            label: {
              backgroundColor: '#ccc',
              borderColor: '#aaa',
              borderWidth: 1,
              shadowBlur: 0,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              color: '#222'
            }
          },
          formatter: '{b} <br> {c}',
        },
        series: [
          {
            data: this.detailData.pingRecords.CM.AvgRTT,
            type: 'line',
            itemStyle: {
              color: '#333'
            },
            showSymbol: false
          }
        ]
      });
    }
  }
})
</script>
