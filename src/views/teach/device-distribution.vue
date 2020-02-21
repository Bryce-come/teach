<template >
  <div v-loading="loading"> 
    <div class="card">
        <h3 style='margin:10px'>上课班级信息</h3>
        <el-form :inline="true" >
            <el-form-item label="上课时间:" label-width="80px">
                <lkt-date-picker v-model="lesson.date"></lkt-date-picker>
            </el-form-item>
            <el-form-item label="上课班级:" label-width="80px" v-if='lesson.extend' >
                <lkt-select :list="classList" value-key="name" v-model="lesson.extend.clasz" multiple :clearable="false" placeholder="请选择上课班级"/>
            </el-form-item>
            <el-form-item label="教学分组:" label-width="80px" v-if='lesson.extend'>
                <lkt-select :list="classGroupList" value-key="type" v-model="lesson.extend.claszGroup" multiple :clearable="false" placeholder="请选择分组"/>
            </el-form-item>
            <el-form-item label="人数:" label-width="100px">
                <span v-if="lesson.students">{{lesson.students.length}}人</span>
            </el-form-item>
        </el-form> 
        <el-tabs type="card">
            <el-tab-pane label="按设备分">
               <div class="flex align-center wrap">
                    <div v-for="(item, i) in lesson.stationList" :key='i' style='width:23%; margin-left:10px;border:1px solid grey;border-radius:5px'>
                        <div class="flex align-center">
                          <div style="width: 60%; margin-left:10px;">{{item.name}}</div>
                         <div v-if="item.extend.student" class="flex end" style="width: 30%">
                           <el-button type="text" @click="distribution()">重新分配</el-button>
                         </div>
                        <div v-else class="flex end" style="width: 30%">
                           <el-button type="text"  @click="distribution()">分配学生</el-button>
                         </div>
                        </div>
                        <div class="flex center" style="width:100%;margin:10px auto">
                            <img :src='item.src'>
                         </div>
                        <div class="flex align-center wrap" v-if="item.extend.student">
                            <div style="background-color:rgb(215, 235, 248); width:50%; text-align:center;height:2rem;line-height:2rem"
                                 v-for="(sName, k) in item.extend.student" :key='k'>
                                {{sName}}
                            </div>
                        </div>
                    </div>
               </div>
            </el-tab-pane>
            <el-tab-pane label="按学生分">
               <div class="flex align-center wrap">
                    <div v-for="(item, i) in lesson.students" :key='i' style='width:23%; margin-left:10px;border:1px solid grey;border-radius:5px'>
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
                        <div class="flex align-center wrap" v-if="item.station">
                            <div style="background-color:rgb(215, 235, 248); width:100%; text-align:center;height:2rem;line-height:2rem">
                                {{item.station.name}}
                            </div>
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
      <div slot='title' v-if="studentMode.data">{{studentMode.data.extend.clasz+studentMode.data.extend.claszGroup}}详情</div>
      <div v-if="studentMode.data.students" class="flex align-center wrap">
         <div
              class="flex between align-center"
              v-for="(param,index) of studentMode.data.students"
              :key="index"
              style="margin-right:10px;"
             >
             <el-checkbox-group class="flex little-space" style="padding: 5px 20px" v-model="checkList">
              <el-checkbox
                style="min-width: 50%;font-weight: 700"
                :label="param.name">
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
import monitor  from '../laboratory/monitor.vue'
export default {
  setup() {
    const loading = ref(false);
    const lesson = ref<any>({});
    const classList = ref<any>([]);
    const classGroupList = ref<any>([]);
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
    const query= async () =>{
        lesson.value = {
           date: new Date,
           students: [
                {id: 1,
                name: '马克',
                station: {
                    id: 1,
                    name: '操作台1'}},
                {id: 2,
                name: '王力',
                station: {
                    id: 1,
                    name: '操作台1'}},
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
                claszGroup:[ '一组', '二组' ],
           }
       }
    };
    const distribution = async () => {
        studentMode.value.data = lesson.value; 
        studentMode.value.visible = true;
    };
    const distributionDevice = async () => {
        deviceMode.value.data = lesson.value;
        deviceMode.value.visible = true;
    };
    const update = async () =>{
        deviceMode.value.visible = false;
        studentMode.value.visible = false;
    }
    onMounted(useLoading(loading, async () => {
      await query();

    }));
    return{
     lesson,
     loading,
     classList,
     classGroupList,
     distribution,
     query,
     update,
     studentMode,
     deviceMode,
     checkList,
     distributionDevice,
     checkDeviceList,
    };
  },
};
</script>
<style scoped lang="scss">
//  .card{
//      background-color: rgb(215, 235, 248)
//  }
 
</style>