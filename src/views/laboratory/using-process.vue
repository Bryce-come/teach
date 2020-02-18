<template>
  <div v-loading="loading">
    <el-tabs type="card">
      <el-tab-pane label="按课时查询">
          <course-list></course-list>
          <div class="total">
            <div style="margin:10px"><h3>本周总体情况</h3></div>
            <div class="flex align-center" style="width:100%">
                <div class="flex align-center watch3">
                    <div style="font-weight: 700;padding: 5px 40px">总课时：</div>
                    <div style="font-weight: 700;padding: 5px 40px">设备开机时长：</div>
                </div>
                <div class="watch2 flex align-center">
                   <v-chart
                    autoresize
                    style="width:300px;height:200px;"
                    :options="chart"/>
                    <el-form v-if="summary" label-width="80px" label-position="left">
                        <el-form-item label="开机：">{{ summary.on }}</el-form-item>
                        <el-form-item label="故障：">{{ summary.emergency }}</el-form-item>
                        <el-form-item label="离线：">{{ summary.offline }}</el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="margin:10px"><h3>操作台总览</h3></div>
                <div class="flex center wrap">
                <div class="device-card"
                    @click="$router.push({name:'monitorDetail'})"
                    v-for="(item,i) in stations" :key="i">
                    <div class="flex align-center">
                    <div class="device-img">
                        <!-- 我图片链接不出来 -->
                        <!-- <img class="image" :src="item.imgUrl"> -->
                        <img class="image" src='../../assets/u1630.png'>
                    </div>
                    <div class="device-message">
                        <div>{{item.name}}</div>
                    </div>
                    </div>
                    <div class="device-time">

                    </div>
                </div>
                </div>
          </div>
      </el-tab-pane>
      <el-tab-pane label="按日期查询">
        <div class="total">
            <div class="flex align-center" style="margin-right: 10px">
                <span>请输入要查询的日期：</span>
                <lkt-date-picker v-model="oneDay" type="datetime" format="yyyy-MM-dd HH:mm" :clearable="false"/>
                <el-button style="margin-left: 10px" type="primary" @click="list()">查询</el-button>        
            </div>
            <div style="margin:10px"><h3>本周总体情况</h3></div>
            <div class="flex align-center" style="width:100%">
                <div class="flex align-center watch3">
                    <div style="font-weight: 700;padding: 5px 40px">总课时：</div>
                    <div style="font-weight: 700;padding: 5px 40px">设备开机时长：</div>
                </div>
                <div class="watch2 flex align-center">
                   <v-chart
                    autoresize
                    style="width:300px;height:200px;"
                    :options="chart"/>
                    <el-form v-if="summary" label-width="80px" label-position="left">
                        <el-form-item label="开机：">{{ summary.on }}</el-form-item>
                        <el-form-item label="故障：">{{ summary.emergency }}</el-form-item>
                        <el-form-item label="离线：">{{ summary.offline }}</el-form-item>
                    </el-form>
                </div>
            </div>
            <div style="margin:10px"><h3>操作台总览</h3></div>
                <div class="flex center wrap">
                <div class="device-card"
                    @click="$router.push({name:'monitorDetail'})"
                    v-for="(item,i) in stations" :key="i">
                    <div class="flex align-center">
                    <div class="device-img">
                        <!-- 我图片链接不出来 -->
                        <!-- <img class="image" :src="item.imgUrl"> -->
                        <img class="image" src='../../assets/u1630.png'>
                    </div>
                    <div class="device-message">
                        <div>{{item.name}}</div>
                    </div>
                    </div>
                    <!-- 时间轴位置 -->
                    <div class="device-time">
                 
                    </div>
                </div>
                </div>
          </div>

      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent } from '@vue/composition-api';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { Loading } from 'element-ui';
import courseList from '../../components/courseList.vue';
import { Message } from 'element-ui';
import { lineConfig, getColors} from 'web-toolkit/src/utils/echarts-helper';
import { EChartsEvent } from 'web-toolkit/src/types/echarts';
import { EChartOption } from 'echarts';
export default createComponent({
  components: { courseList },
  setup() {
    const loading = ref(false);
    const summary = ref<any>();
    const stations = ref<any>();
    const oneDay = ref();
    const chart: Ref<EChartOption> = ref({});
    const setChart = async () =>{
      summary.value = {
        emergency: 0,
        offline: 1,
        on: 9,
      };
      const xyData = Object.entries(summary.value);
      chart.value = {
        series: [{
          name: '设备数量',
          type: 'pie',
          data: [
            {value:1, name:'故障'},
            {value:1, name:'离线'},
            {value:9, name:'开机'},
          ],
            // radius: document.querySelector('#index-pie')!.clientWidth * 0.25,
          radius: 50,
          label: {
          formatter: '{b}：{c}',
          fontSize: 14,
          },
        }],
        grid: {
            height: 300,
        },
        color: getColors(),
      }
    }
    const setStation = async () => {
      stations.value = [
        {
          id: 1,
          name: '操作台1',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        },
        {
          id: 2,
          name: '操作台2',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        },
        {
          id: 3,
          name: '操作台3',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        },
        {
          id: 4,
          name: '操作台4',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        },
        {
          id: 5,
          name: '操作台5',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        },
        {
          id: 6,
          name: '操作台6',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801'
            },
          }
        }
      ];
    };
    // 查询函数
    async function list() {};
   onMounted(useLoading(loading, async () => {
      await setChart();
      await setStation();
    }));
    return{
       loading,
       summary,
       chart,
       setChart ,
       stations,
       setStation,
       oneDay,
       list,
    };
  },
});
</script>
<style scoped lang="scss">
.total{
    width: 80%;
    margin: auto;
    .watch2 {
        width: 48%;
    }
    .watch3 {
        width: 48%;
        margin-right: 20px; 
    }
    .device-card{
        width: 30%;
        margin-right: 10px;
        .device-img{
            width: 50%;
            img{
                width: 100%;
            }
        }
        .device-message{
            font-size: 1rem;
            width: 50%;
        }
    }
}
</style>
