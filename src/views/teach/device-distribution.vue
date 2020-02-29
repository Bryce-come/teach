<template >
  <div v-loading="loading"> 
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
        <el-form :inline="true" >
            <el-form-item label="上课时间:" label-width="100px" v-if='courseRecordInClass'>
                <span>{{courseRecordInClass.startDt+' — '+courseRecordInClass.endDt}}</span>
            </el-form-item>
            <el-form-item label="上课班级:" label-width="100px" v-if='courseRecordInClass.clasz' >
                <span>{{courseRecordInClass.clasz.name}}</span>
            </el-form-item> 
            <el-form-item label="教学分组:" label-width="100px" v-if='courseRecordInClass.claszGroup'>
               <span>{{courseRecordInClass.claszGroup.name}}</span>
            </el-form-item> 
            <el-form-item label="人数:" label-width="100px">
                <span v-if="courseRecordInClass.studentList">{{courseRecordInClass.studentList.length}}人</span>
            </el-form-item>
        </el-form> 
    </div>
    <div style="margin: 10px 0" class="card">
        <el-tabs type="card">
            <el-tab-pane label="按设备分">
               <div class="flex align-center wrap">
                    <div v-for="(item, i) in stationList" :key='i' style='width:23%; margin-left:10px;border:1px solid grey;border-radius:5px'>
                        <div class="flex align-center">
                          <div style="width: 60%; margin-left:10px;">{{item.name}}</div>
                         <div v-if="item.extend.student" class="flex end" style="width: 30%">
                           <el-button type="text" @click="distribution(item.id)">重新分配</el-button>
                         </div>
                        <div v-else class="flex end" style="width: 30%">
                           <el-button type="text"  @click="distribution(item.id)">分配学生</el-button>
                         </div>
                        </div>
                        <div class="flex center" style="width:80%;margin:10px auto" v-if="item.deviceList">
                            <img :src="img(item.deviceList[0].deviceType.img)" alt="">
                         </div>
                        <div class="flex align-center wrap" style="background-color:rgb(215, 235, 248);" v-if="courseRecordInClass.stationBind[item.id.toString()]">
                          <div  
                              v-for="(sName, k) in courseRecordInClass.stationBind[item.id.toString()]" :key='k'
                              style=" width:50%; text-align:center;height:2rem;line-height:2rem">
                              <div >
                                {{sName.name}}
                              </div>
                          </div>
                        </div>
                         <div v-else style="background-color:rgb(215, 235, 248); width:100%; text-align:center;height:2rem;line-height:2rem">--</div>
                    </div>
               </div>
            </el-tab-pane>
            <el-tab-pane label="按学生分">
               <div class="flex align-center wrap">
                    <div v-for="(item, i) in studentsList" :key='i' style='width:23%; margin-left:10px;border:1px solid grey;border-radius:5px'>
                        <div class="flex end">
                          <div v-if="item.station" class="flex end" style="width: 30%;margin-right:10px;">
                            <el-button type="text" @click="distributionDevice()">重新分配</el-button>
                          </div>
                          <div v-else class="flex end" style="width: 30%">
                            <el-button type="text"  @click="distributionDevice()">分配设备</el-button>
                          </div>
                        </div>
                        <div class="flex center" style="width:100%;font-weight: 700;font-size:2rem;line-height:3rem;height:3rem">
                            {{item.name}}
                         </div>
                        <div class="flex align-center wrap" style="background-color:rgb(215, 235, 248);">
                            <div  v-if="item.station" style="width:100%; text-align:center;height:2rem;line-height:2rem">
                                {{item.station.name}}
                            </div>
                            <div v-else style="width:100%; text-align:center;height:2rem;line-height:2rem">--</div>
                        </div>
                    </div>
               </div>
            </el-tab-pane>
        </el-tabs>
    </div>
    <kit-dialog-simple
      :modal="studentMode"
      :confirm="update"
      width="500px">
      <div slot='title'>学生列表</div>
      <div v-if="studentMode.data" class="flex align-center wrap">
         <div
              class="flex between align-center"
              v-for="(param,index) of studentMode.data"
              :key="index"
              style="margin-right:10px;"
             >
             <el-checkbox-group class="flex little-space" style="padding: 5px 20px" v-model="checkList">
              <el-checkbox
                style="min-width: 50%;font-weight: 700"
                :label="param.id">
                {{param.name}}
              </el-checkbox>
             </el-checkbox-group>
         </div>
      </div>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="deviceMode"
      :confirm="update"
      width="500px">
      <div slot='title' v-if="deviceMode.data">{{deviceMode.data.extend.clasz+deviceMode.data.extend.claszGroup}}详情</div>
      <div v-if="deviceMode.data.stationList" class="flex align-center wrap">
         <div
              class="flex between align-center"
              v-for="(param,index) of deviceMode.data.stationList"
              :key="index"
              style="margin-right:10px;"
             >
             <el-checkbox-group class="flex little-space" style="padding: 5px 20px" v-model="checkDeviceList">
              <el-checkbox
                style="min-width: 50%;font-weight: 700"
                :label="param.name">
              </el-checkbox>
             </el-checkbox-group>
         </div>
      </div>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, onUnmounted, watch, createComponent } from '@vue/composition-api';
import { router } from '@/main';
import { useLoading } from 'web-toolkit/src/service';
import monitor from '../laboratory/monitor.vue';
import { CourseRecordInClass, CourseRecordUpdate } from '@/dao/courseRecordDao';
import { StationList } from '@/dao/stationDao';
import {ImageLink} from '@/dao/commonDao.ts';
export default {
  setup() {
    const loading = ref(false);
    const lesson = ref<any>({});
    const stationList = ref<any>([]);
    const stationID = ref(-1);
    const studentID = ref(-1);
    const stationExtend =ref<any>();
    const studentsList = ref<any>([]);
    const studentMode = ref<any>({
        visible: false,
        data: '',
    });
    const deviceMode = ref<any>({
        visible: false,
        data: '',
    });
    const checkList = ref([]);
    const checkDeviceList = ref([]);
    const query = async () => {
        lesson.value = {
           date: '2020/02/23 周四 第1-3节',
           students: [
                {id: 1,
                name: '马克',
                station: {
                    id: 1,
                    name: '操作台1'}},
                {id: 2,
                name: '王力',
                station: {
                    id: 1}},
                {id: 3,
                name: '嘉华',
                station: {
                    id: 2,
                    name: '操作台2'}},
                {id: 4,
                name: '德利',
                station: {
                    id: 2,
                    name: '操作台2'}},
           ],
           stationList: [
                {id: 1,
                name: '操作台1',
                src: '../../assets/u1630.png',
                extend: {
                    student: ['马克', '王力'],
                }},
                {id: 2,
                name: '操作台2',
                src: '../../assets/u1630.png',
                extend: {
                    student: ['马克', '王力'],
                }},
                {id: 3,
                name: '操作台3',
                src: '../../assets/u1630.png',
                extend: {
                    student: ['马克', '王力'],
                }},
                {id: 4,
                name: '操作台4',
                src: '../../assets/u1630.png',
                extend: {
                    student: ['马克', '王力'],
                }},
                ],
           extend: {
                clasz: '自动化1602',
                claszGroup: [ '一组', '二组' ],
           },
       };
    };
    const courseRecordInClass = ref<any>();
    const queryStationList = async () => {
        stationList.value = await StationList({
            simple: false,
        });
        console.log(stationList.value);
    };
    const queryCourseInClass = async () => {
        courseRecordInClass.value = await CourseRecordInClass();
        studentsList.value = courseRecordInClass.value.studentList?courseRecordInClass.value.studentList:null;
        console.log(courseRecordInClass.value);
        console.log(studentsList.value);
    };
    function img(path: any) {
      if (path) {
        return ImageLink(path);
      }
    }
    const distribution = async (id:any) => {
        stationID.value = id;
        studentMode.value.data = studentsList.value;
        studentMode.value.visible = true;
        stationExtend.value = initExtend(); 
    };
    const distributionDevice = async () => {
        deviceMode.value.data = lesson.value;
        deviceMode.value.visible = true;
    };
    const update = async () => {
        let obj = {} as any; 
        let stationId = stationID.value; 
        obj[stationId.toString()] = checkList.value;
        stationExtend.value.extend.stationBind = obj;
        console.log(checkList.value);
        console.log(stationExtend.value);
        await courseRecordUpdate();
        await queryCourseInClass();
        deviceMode.value.visible = false;
        studentMode.value.visible = false;
    };
    const courseRecordUpdate = async () => {
      await CourseRecordUpdate({
        id: courseRecordInClass.value.id,
        type: courseRecordInClass.value.type,
        extendJson: JSON.stringify(stationExtend.value.extend),
      });
    };
    onMounted(useLoading(loading, async () => {
      await query();
      await queryCourseInClass();
      await queryStationList();
    }));
    return{
     lesson,
     loading,
     stationList,
     studentsList,
     distribution,
     query,
     update,
     studentMode,
     deviceMode,
     checkList,
     distributionDevice,
     checkDeviceList,
     courseRecordInClass,
     queryCourseInClass,
     img,
     stationID, stationExtend, courseRecordUpdate,
     studentID,
    };
  },
};
function initExtend() {
  return {
    extend:{
      stationBind:{},
    }
  }
}
</script>
<style scoped lang="scss">
//  .card{
//      background-color: rgb(215, 235, 248)
//  }
 img{
    height: 8rem;
  }
</style>