<template>
  <div v-loading="loading" class="preview">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex start"><i class="iconfont icon-message4"></i>未来两天共有实验课程<span>{{4}}</span>门</div>
      <div class="wrapper">
        <div class="wrapper-content" v-for="(item, id) in courseList" :key="id">
          <div style="margin-left:50px">
            <i class="iconfont icon-manage2 i"></i>
            <span style="font-weight:bold;font-size:1.2rem">{{item.name + '：'}}</span>
            <span>{{item.time}}</span>
          </div>
        </div>
      </div>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex start">课程详细信息</div>
      <div style="margin-top:20px">
          <div style="font-weight:bold;margin: 10px">自动化原理与操作</div>
          <el-form label-width="100px" style="display:flex;justify-content:start;flex-wrap:wrap">
            <el-form-item label="上课时间：">{{'2020年2月10日  周一  14：30~15：30  2课时'}}</el-form-item>
            <el-form-item label="授课教师：">{{'马冬梅'}}</el-form-item>
            <el-form-item label="上课班级：">{{'自动化1602'}}</el-form-item>
            <el-form-item label="上课地点：">{{'实验室'}}</el-form-item>
            <el-form-item label="操作台：">{{'操作台02'}}</el-form-item>
          </el-form>
          <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px">实验名称</div>
        <div style="margin:20px">自动化操作</div>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px">实验目的</div>
        <div style="margin:20px">通过编程实现vigenere加密，更加深入的了解其原理，掌握vigenere算法。</div>
        <div style="width:95%;height:1px;margin-left:30px;padding:0px;background-color:#D5D5D5;overflow:hidden;"></div>
      </div>
      <div style="margin-top:20px">
        <div style="font-weight:bold;margin: 10px">实验步骤</div>
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
        <div style="font-weight:bold;margin: 10px">附件</div>
        <el-button type="text" style="margin:20px" @click="download()">关键代码.nv</el-button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import { useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
export default {
  setup() {
    const loading = ref(false);
    const courseList = ref<any>();
    const query = async () => {
      courseList.value = [
        {id: 0, name: '自动化原理与操作', time: '2月10日 周一 13：30~14：30'},
        {id: 1, name: '自动化原理与操作', time: '2月11日 周二 13：30~14：30'},
        {id: 2, name: '自动化原理与操作', time: '2月12日 周三 13：30~14：30'},
        {id: 3, name: '自动化原理与操作', time: '2月13日 周四 13：30~14：30'},
      ];
    };
    const download = async () => {
      Message.success('下载成功');
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, courseList, query,
      download: useConfirm('确认下载？',useLoading(loading, download)),
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
  font-size: 1.2rem!important
}
</style>