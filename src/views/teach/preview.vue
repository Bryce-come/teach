<template>
  <div v-loading="loading" class="preview">
    <el-form :inline="true" class="flex start">
      <el-form-item label="选择课程：">
        <el-select v-model="coursePreview">
          <el-option
            v-for="item of coursePreviewList"
            :key="item.id"
            :label="item.name"
            :value="item.id"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryCourseInfo()">预习</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0" class="block_background" v-show="coursePreviewList.length > 0" v-if="courseInfo">
      <div class="block_title flex start">课程详细信息</div>
      <div style="margin-top:20px">
          <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-tickets" style="font-size:16px"></i>{{courseInfo.course.name}}</div>
          <el-form label-width="120px" class="flex between wrap" style="width:80%">
            <el-form-item label="上课时间：">{{courseInfo.startDt + '-' + courseInfo.endDt}}</el-form-item>
            <el-form-item label="授课教师：">{{courseInfo.teacher.name}}</el-form-item>
            <el-form-item label="上课班级：">{{courseInfo.clasz.name + '-' + courseInfo.claszGroup.name}}</el-form-item>
          </el-form>
          <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-document-checked" style="font-size:16px"></i>{{courseInfo.program.name}}</div>
        <el-form label-width="120px" class="flex">
          <el-form-item label="实验类型：">{{courseInfo.program.label}}</el-form-item>
          <el-form-item label="操作台：">
            <div v-for="item of courseInfo.stations" :key="item.id">{{item.name + ','}}</div>
          </el-form-item>
        </el-form>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-document" style="font-size:16px"></i>{{' 实验目的'}}</div>
        <div style="margin:20px 40px">{{courseInfo.program.purpose}}</div>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-notebook-1" style="font-size:16px"></i>{{' 实验原理'}}</div>
        <div style="margin:20px 40px">{{courseInfo.program.principle}}</div>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-notebook-2" style="font-size:16px"></i>{{' 实验步骤'}}</div>
        <div style="margin: 20px 40px">{{courseInfo.program.steps}}</div>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-paperclip" style="font-size:16px"></i>{{' 实验结果'}}</div>
        <div style="margin:20px 40px">{{courseInfo.program.results}}</div>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-files" style="font-size:16px"></i>{{' 课程附件'}}</div>
        <el-link
          type="primary" style="margin:20px 40px"
          v-for="(item,i) in courseInfo.attachment" :key="i" @click="downFile(item)">{{item.split('/')[item.split('/').length-1] + '，'}}
        </el-link>
        <div class="liner"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px"><i class="el-icon-files" style="font-size:16px"></i>{{' 项目附件'}}</div>
        <el-link
          type="primary" style="margin:20px 40px"
          v-for="(item,i) in courseInfo.program.attachment" :key="i" @click="downFile(item)">{{item.split('/')[item.split('/').length-1] + '，'}}
        </el-link>
        <div class="liner"></div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import { CourseList4Student} from '@/dao/courseProgramDao';
import { CourseRecordPreview} from '@/dao/courseRecordDao';
import {DownLoadPrivate} from '@/dao/commonDao';
import {StationList} from '@/dao/stationDao';
export default {
  setup() {
    const loading = ref(false);
    const coursePreviewList = ref<any>([]);
    const coursePreview = ref<any>();
    const courseInfo = ref<any>();
    const stationList = ref<any>();
    const queryCoursePreviewList = async () => {
      coursePreviewList.value = await CourseList4Student();
    };
    const queryCourseInfo = async () => {
      const courseID = coursePreview.value;
      courseInfo.value = await CourseRecordPreview({
        courseId: courseID,
      });
      console.log(courseInfo.value);
      for (let i = 0; i < courseInfo.value.stations; i++) {
        const station = stationList.value.filter((item: any) => {
          return item.id === courseInfo.value.stations[i];
        });
      }
    };
    async function downFile(item: any) {
      const files = {
        path: item,
        filename: item.split('/')[item.split('/').length - 1],
      };
      await DownLoadPrivate(files.path, files.filename);
    }
    onMounted(useLoading(loading, async () => {
      await queryCoursePreviewList();
      // await queryCourseInfo();
      stationList.value = await StationList({
        simple: true,
      });
      console.log(stationList.value);
    }));
    return {
      loading, coursePreviewList, queryCoursePreviewList, coursePreview,
      queryCourseInfo, courseInfo,
      downFile, stationList,
    };
  },
};
</script>
<style scoped lang="scss">
.wrapper{
  width: 100%;
  height: auto;
  display: flex;
  justify-content: space-between;
  // flex-direction: row;
  flex-wrap: wrap;
  margin: 10px;
}
.wrapper-content{
  width: 50%;
  margin-bottom: 20px;
}
.i{
  font-size: 1.4rem!important;
  color: blue;
}
.liner{
  width: 95%;
  height: 1px;
  margin-left: 30px;
  padding: 0px;
  background-color: #D5D5D5;
  overflow: hidden;
}
</style>
