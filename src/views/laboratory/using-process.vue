<template>
  <div v-loading="loading">
    <el-tabs type="card">
      <el-tab-pane label="按课时查询">
        <div class="flex center" style="margin: 5px 10px">
            <div class="flex align-center" style="margin-right: 10px">
              <lkt-date-picker v-model="oneDay"/>
              <el-button style="margin-left: 10px" type="primary" @click="list()">跳转日期</el-button>        
            </div>
          </div>
          <div class="class-table">
            <div class="flex center">
              <div style="margin: 10px">
                <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(142, 208, 214)"></span>
                <span>计划内课程</span>
                <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(233, 233, 224)"></span>
                <span>已预约课程</span>
                <span style="display: inline-block;margin: 0 5px;border-radius: 10px;width: 10px;height: 10px;background-color: rgb(248, 244, 8)"></span>
                <span>新预约课程</span>
              </div>
            </div>
            <div class="flex end" style="margin-right: 10%;margin-bottom:10px">
                <el-button-group>
                  <el-button type="primary" size="small" icon="el-icon-arrow-left">上一周</el-button>
                  <el-button type="primary" size="small">下一周<i class="el-icon-arrow-right el-icon--right"></i></el-button>
                </el-button-group>
              </div>
            <table id="tabs">
              <thead>
                <tr>
                  <th>时间</th>
                  <th v-for="(weekNum, weekIndex) in weeks.length" :key="weekIndex">
                  {{'周' + digital2Chinese(weekIndex, 'week')}}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item,i) in lessons" :key="i">
                  <th>
                    <div>第<span>{{i+1}}</span>节课</div>
                  </th>
                  <td v-for="(lessonItem, j) in item.lesson" :key="j" 
                      :rowspan="lessonItem != ''? lessonItem.extend.lessonInt:''"
                      :style="{'background-color': lessonItem != ''? setColors(lessonItem,'rgb(142, 208, 214)'):'white'}"
                      >
                        <!-- <div v-if="lessonItem" slot="reference">{{lessonItem.name}}</div> -->
                        <div style="width:100%;height:100%">
                          <div>
                            {{lessonItem?lessonItem.course.name:''}}
                          </div>
                      </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="total" v-if="showModal">
            <div style="margin:10px"><h3>本课程总体情况</h3></div>
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
                    @click="$router.push({name:'processMonitorDetail'})"
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
            <lkt-date-picker v-model="oneDay"/>
            <el-button style="margin-left: 10px" type="primary" @click="list()">跳转日期</el-button>        
          </div>
            <div style="margin:10px"><h3>总体情况</h3></div>
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
                    @click="$router.push({name:'processMonitorDetail'})"
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
    const showModal = ref(false);
    const oneDay = ref();
    const isshow = ref(false);
    const color = ref();
    const tableX = ref(-1);
    const tableY = ref(-1);
    const lessons = ref<any>();
    const chart: Ref<EChartOption> = ref({});
    const setChart = async () => {
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
            {value: 1, name: '故障'},
            {value: 1, name: '离线'},
            {value: 9, name: '开机'},
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
      };
    };
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
              name: '自动化1801',
            },
          },
        },
        {
          id: 2,
          name: '操作台2',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 3,
          name: '操作台3',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 4,
          name: '操作台4',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 5,
          name: '操作台5',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
        {
          id: 6,
          name: '操作台6',
          imgUrl: '../../assets/u1630.png',
          student: {
            id: 1,
            name: '马利',
            clasz: {
              name: '自动化1801',
            },
          },
        },
      ];
    };
    function setColors(lessonOne: any, defaultColor: any) {
      const type = lessonOne.type;
      if (type === 0 || lessonOne === '') {
        return defaultColor;
        // rgb(142, 208, 214) 计划内课程
      } else if (type === 1 || type === 2) {
        const result = lessonOne.extend.appointRecord.result;
        if (result === 2) {
          // 已预约课程
          defaultColor = 'rgb(233, 233, 224)';
        } else if (result === 1) {
         // 新预约课程
          defaultColor = 'rgb(248, 244, 8)';
        }
        return defaultColor;
     }
    }
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七'];
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num];
    }
    // 重新排列数据
    const newList = async () => {
      lessons.value = [
        {lesson: ['', '', '',
          {
            id: 1,
            course: {
              name: '自动化课程1',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 1,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 3,
              appointRecord: {result: 1},
              lessons: [1, 2, 3],
              class: '自动化1801'},
          }, '', '', '']},
        {lesson: ['', '', '', '', '', '']},
        {lesson: ['', '', '', '', '', '']},
        {lesson: ['', '', '', '', '',
          {
            id: 2,
            course: {
              name: '自动化课程2',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 0,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              lessons: [4],
              class: '自动化1801'},
          }, '']},
        {lesson: ['', '', '', '', '',
          {
            id: 3,
            course: {
              name: '自动化课程3',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 1,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              appointRecord: {result: 2},
              lessons: [5],
              class: '自动化1801'},
          }, '']},
        {lesson: ['', '', '', '', '', '', '']},
        {lesson: ['',
          {
            id: 4,
            course: {
              name: '自动化课程4',
              programList: ['切刀挂刀操作'] },
            teacher: {
              name: '玛丽'},
            type: 2,
            stations: ['操作台1'],
            students: '马丽',
            extend: {
              lessonInt: 1,
              appointRecord: {result: 1},
              lessons: [7],
              class: '自动化1801'},
          }, '', '', '', '', '']},
      ];
    };
    const tabCell = async () => {
       const tab = document.getElementById('tabs');
       // @ts-ignore
       const rows = tab.rows;
       const rlen = rows.length;
       for (let i = 1; i < rlen; i++) {
         const cells = rows[i].cells;
         for (let j = 1; j < cells.length; j++) {
             cells[j].onclick = function() {
                if (!isshow.value) {
                    color.value = this.style.backgroundColor;
                    tableX.value = i;
                    tableY.value = j;
                }
                isshow.value = !isshow.value;
                if (tableX.value === i &&  tableY.value ===j){
                  if (isshow.value && color.value !== 'white') {
                      this.style.backgroundColor = 'darkorchid';
                      showModal.value = true;
                  } else {
                    this.style.backgroundColor = color.value;
                    showModal.value = false;
                    }
                }
                else {
                  alert('请在上一处再次点击');
                  isshow.value = true;
                };
             };
         }
       }
    };
    // 查询函数
    async function list() {}
    onMounted(useLoading(loading, async () => {
      await setChart();
      await setStation();
      await newList();
      await tabCell();
    }));
    return{
       loading,
       summary,
       chart,
       setChart ,
       stations,
       setStation,
       oneDay: new Date(),
       list,
       showModal,
       weeks,
       digital2Chinese,
       lessons,
       setColors,
       isshow,
       tabCell,
       color,
       tableX,
       tableY,
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
  .class-table {
    margin: 7px;
    table {
      background-color: rgb(32, 38, 97);
      table-layout:fixed;
      margin: auto;
      width: 80%;
      thead {
        background-color:#67a1ff  ;
        th {
          color: #fff;
          line-height: 2.5rem;
          font-weight: normal;
        }
      }
    }
    tbody{
      tr {
        th {
          color: #fff;
          background-color:#67a1ff ;
          line-height: 3.5rem;
          font-weight: lighter;
          text-align: center;
          vertical-align: middle;
        }
        td {
          // background-color:rgb(142, 208, 214) ;
          line-height: 3.5rem;
          font-weight: lighter;
          text-align: center;
          vertical-align: middle;
          .order {
            height: 2.5rem;
            width: 5rem;
            text-align: center;
            vertical-align: middle;
          }
          .order .el-button{
            display: none;
          }
          .order:hover .el-button{
            display: inline-block;
          }
        }
      }
    }
  }
</style>
