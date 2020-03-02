<template>
  <div v-loading="loading" class="preview">
    <el-form :inline="true" class="flex start">
      <el-form-item label="选择课程：">
        <el-select v-model="coursePreview">
          <el-option
            v-for="item of coursePreviewList"
            :key="item.id"
            :label="item.name"
            :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="queryCourseInfo()">预习</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0" class="block_background" v-show="coursePreviewList.length > 0">
      <div class="block_title flex start">课程详细信息</div>
      <div style="margin-top:20px">
          <div style="font-weight:bold;margin: 10px 20px">自动化原理与操作</div>
          <el-form label-width="150px" class="flex space-between wrap" style="width:60%">
            <el-form-item label="上课时间：">{{'2020年2月10日  周一  14：30~15：30  2课时'}}</el-form-item>
            <el-form-item label="授课教师：">{{'马冬梅'}}</el-form-item>
            <el-form-item label="上课班级：">{{'自动化1602'}}</el-form-item>
            <el-form-item label="上课地点：">{{'实验室'}}</el-form-item>
            <el-form-item label="操作台：">{{'操作台02'}}</el-form-item>
          </el-form>
          <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px">实验名称</div>
        <div style="margin:20px">自动化操作</div>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px">实验目的</div>
        <div style="margin:20px">通过编程实现vigenere加密，更加深入的了解其原理，掌握vigenere算法。</div>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px">实验步骤</div>
        <el-form style="margin:20px">
          <el-form-item label="1、预习内容">
            <div>vigenere cipher加密规则：1）找到一个关键字作为密钥；2）将关键字重复的写在明文上；3）根据vigenere table 找出对应的密文</div>
          </el-form-item>
          <el-form-item label="2、解密">
            <div>1）根据vigenere table找到中对应的字母；2）再看密文字母对应的关键字字母；3）唯一的确定明文字母。</div>  
          </el-form-item>
          <el-form-item label="3、关键代码（如何让3个字母实现类似vigenere table的形式）">
            <div>PS：具体代码见附件</div>
          </el-form-item>
        </el-form>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px">课程附件</div>
        <el-button type="text" style="margin:20px" @click="download()">关键代码.nv</el-button>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px 20px">项目附件</div>
        <el-button type="text" style="margin:20px" @click="download()">关键代码.nv</el-button>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
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
export default {
  setup() {
    const loading = ref(false);
    const coursePreviewList = ref<any>([]);
    const coursePreview = ref<any>();
    const courseInfo = ref<any>();
    const queryCoursePreviewList = async () => {
      coursePreviewList.value = await CourseList4Student();
      console.log(coursePreviewList.value);
    };
    const queryCourseInfo = async () => {
      const courseID = coursePreview.value;
      courseInfo.value = await CourseRecordPreview({
        courseId: courseID,
      });
      console.log(courseInfo.value);
    };
    const download = async () => {
      Message.success('下载成功');
    };
    onMounted(useLoading(loading, async () => {
      await queryCoursePreviewList();
      // await queryCourseInfo();
    }));
    return {
      loading, coursePreviewList, queryCoursePreviewList, coursePreview,
      queryCourseInfo, courseInfo,
      download: useConfirm('确认下载？', useLoading(loading, download)),
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
</style>