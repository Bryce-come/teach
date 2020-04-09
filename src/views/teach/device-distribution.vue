<template>
  <div v-loading="loading">
    <div v-if="!courseRecordInClass" style="color: grey;text-align: center">暂无上课信息</div>
    <div v-else>
      <div style="margin: 10px 0" class="block_background">
        <div class="block_title flex between">上课班级信息</div>
        <el-form :inline="true">
          <el-form-item label="上课时间:" label-width="100px" v-if='courseRecordInClass'>
            <span>{{courseRecordInClass.startDt+' — '+courseRecordInClass.endDt}}</span>
          </el-form-item>
          <el-form-item label="上课班级:" label-width="100px" v-if='courseRecordInClass.clasz'>
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
      <div style="margin: 10px 0" class="block_background">
        <div class="block_title flex between">操作台分配</div>
        <div class="flex">
          <div style="padding-left: 10px;width:20%;margin-top:10px">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>未分配学生列表</span>
              </div>
              <div v-for="(item,i) in studentsList" :key="i">
                <div style="padding: 5px; text-align: left;" v-if="!overStudentList.includes(item.id)">{{item.name }}
                </div>
              </div>
            </el-card>
          </div>
          <div class="flex align-center wrap" style="padding-left: 10px;width:75%;">
            <div v-for="(item, i) in stationList" :key='i'
                 style='width:30%; margin-left:10px;margin-top:10px;border:1px solid grey;border-radius:5px'>
              <div class="flex align-center">
                <div style="width: 60%; margin-left:10px;">{{item.name}}</div>
                <div
                  v-if="courseRecordInClass.stationBind&&courseRecordInClass.stationBind[item.id.toString()] && courseRecordInClass.stationBind[item.id.toString()].length !== 0 "
                  class="flex end" style="width: 30%">
                  <el-button type="text" @click="distribution(item.id)">重新分配</el-button>
                </div>
                <div v-else class="flex end" style="width: 30%">
                  <el-button type="text" @click="distribution(item.id)">分配学生</el-button>
                </div>
              </div>
              <div class="flex align-center center">
                <div style="width:150px;margin-rignt:5px" v-if="item.deviceList[0].deviceType">
                  <img :src="img(item.deviceList[0].deviceType.img)" alt="">
                </div>
                <div class="device-message" style="padding-left: 10px;width: 100px;">
                  <div class="flex wrap" v-if="courseRecordInClass.stationBind">
                    <el-tag
                      v-for="(sName, k) in courseRecordInClass.stationBind[item.id.toString()]" :key='k'
                      style="margin-right: 5px "
                      type="primary" size="small" effect="plain">
                      {{sName.name}}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <kit-dialog-simple
      v-if="courseRecordInClass"
      id="device-distribute"
      :modal="studentMode"
      :confirm="update"
      width="600px">
      <div class="flex center"><span>学生列表</span></div>
      <div class="flex">
        <el-button type='primary' icon="el-icon-delete" @click="delectClick()">取消选择</el-button>
      </div>
      <div v-if="studentMode.data" class="flex align-center wrap">
        <div
          class="flex between align-center"
          v-for="(param,index) of studentMode.data"
          :key="index"
          style="margin-right:10px;">
          <el-checkbox-group class="flex little-space" v-model="checkList">
            <el-checkbox
              style="min-width: 50%;font-weight: 700;padding: 5px 20px"
              v-if="courseRecordInClass.extend.stationBind && courseRecordInClass.extend.stationBind[stationID.toString()].includes(param.id) || !overStudentList.includes(param.id)"
              :label="param.id">
              {{param.name}}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </div>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
  import {ref, onMounted, watch} from '@vue/composition-api';
  import {useLoading} from 'web-toolkit/src/service';
  import {CourseRecordInClass, CourseRecordUpdate} from '@/dao/courseRecordDao';
  import {StationList} from '@/dao/stationDao';
  import {ImageLink} from '@/dao/commonDao.ts';

  export default {
    setup() {
      const loading = ref(false);
      const stationList = ref<any>([]);
      const stationID = ref(-1);
      const studentID = ref(-1);
      const stationExtend = ref<any>();
      const studentsList = ref<any>([]);
      const overStudentList = ref<any>([]);
      const studentMode = ref<any>({
        visible: false,
        data: '',
      });
      const checkList = ref([]);
      const checkDeviceList = ref([]);
      const courseRecordInClass = ref<any>();
      const queryStationList = async () => {
        stationList.value = await StationList({
          simple: false,
        });
      };
      const queryCourseInClass = async () => {
        courseRecordInClass.value = await CourseRecordInClass();
        if(!courseRecordInClass.value) return
        studentsList.value = courseRecordInClass.value.studentList ? courseRecordInClass.value.studentList : null;
        if (courseRecordInClass.value.extend.stationBind) {
          const obj = Object.values(courseRecordInClass.value.extend.stationBind);
          // @ts-ignore
          overStudentList.value = obj.reduce((a, b) => a.concat(b), []);
        }
      };

      function img(path: any) {
        if (path) {
          return ImageLink(path);
        }
      }

      // 分配
      const distribution = async (id: any) => {
        stationID.value = id;
        studentMode.value.data = studentsList.value;
        if(!courseRecordInClass.value.extend.stationBind){
          courseRecordInClass.value.extend.stationBind = {}
        }
        stationExtend.value = courseRecordInClass.value.extend;
        if (courseRecordInClass.value.extend.stationBind[id.toString()] && courseRecordInClass.value.extend.stationBind[id.toString()].length !== 0) {
          checkList.value = courseRecordInClass.value.extend.stationBind[id.toString()];
        } else {
          checkList.value = [];
        }
        studentMode.value.visible = true;
      };
      const delectClick = async () => {
        checkList.value = [];
      };
      const update = async () => {
        const stationId = stationID.value;
        let flag = false;
        if (checkList.value && checkList.value.length !== 0) {
          for (const item of checkList.value) {
            if (stationExtend.value.stationBind) {
              for (const key in stationExtend.value.stationBind) {
                if (stationExtend.value.stationBind[key] && stationExtend.value.stationBind[key].includes(item)) {
                  stationExtend.value.stationBind[key].splice(stationExtend.value.stationBind[key].indexOf(item), 1);
                }
              }
            }
          }
          flag = true;
        } else {
          flag = true;
        }
        const obj1 = stationExtend.value.stationBind;
        const obj = {} as any;
        if (flag) {
          obj[stationId.toString()] = checkList.value;
          stationExtend.value.stationBind = {
            ...obj1,
            ...obj,
          };
          // console.log(checkList.value);
          // console.log(stationExtend.value);
          await courseRecordUpdate();
          await queryCourseInClass();
          studentMode.value.visible = false;
        }
      };
      const StuUpdate = async () => {
        const obj3 = [[1], [3], [2, 5]];
        const obj4 = obj3.reduce((a, b) => a.concat(b), []);
      };
      const courseRecordUpdate = async () => {
        await CourseRecordUpdate({
          id: courseRecordInClass.value.id,
          type: courseRecordInClass.value.type,
          extendJson: JSON.stringify(stationExtend.value),
        });
      };
      const ceshi = async () => {

      };
      onMounted(useLoading(loading, async () => {
        await queryCourseInClass();
        await queryStationList();
        // await StuUpdate();
      }));
      return {
        loading,
        stationList,
        studentsList,
        distribution,
        update,
        studentMode,
        checkList,
        checkDeviceList,
        courseRecordInClass,
        queryCourseInClass,
        img,
        stationID, stationExtend, courseRecordUpdate,
        studentID,
        overStudentList,
        delectClick,
        //  StuUpdate,
      };
    },
  };
</script>
<style scoped lang="scss">
  //  .card{
  //      background-color: rgb(215, 235, 248)
  //  }
  img {
    height: 8rem;
  }
</style>
