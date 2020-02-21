<template>
  <div v-loading="loading" class="experiment-result-score">
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">上课班级信息</div>
      <el-form label-width="100px" style="margin-top:10px" :inline="true">
        <el-form-item label="课程名称:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="实验名称:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="上课时间:">
          <lkt-date-picker style="width:350px"></lkt-date-picker>
        </el-form-item>
        <el-form-item label="上课班级:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="上课分组:">
          <lkt-select/>
        </el-form-item>
        <el-form-item label="学生人数:">
          <el-input style="width:50px"></el-input>
          <span>人</span>
        </el-form-item>
      </el-form>
    </div>
    <div style="margin: 10px 0" class="block_background">
      <div class="block_title flex between">成绩评定</div>
      <div style="display:flex;justify-content:space-between;flex-wrap:wrap">
        <div style="margin:10px">
          <el-button type="primary">全部</el-button>
          <el-button type="primary" style="margin-left:5px">已评分</el-button>
          <el-button type="primary" style="margin-left:5px">未评分</el-button>
        </div>
        <el-input placeholder="输入操作台/学生搜索" style="width:400px;margin:10px"></el-input>
      </div>
      <lkt-table>
        <el-table-column label="学生" prop=""/>
        <el-table-column label="提交时间" prop=""/>
        <el-table-column label="操作台" prop=""/>
        <el-table-column label="状态" prop=""/>
        <el-table-column label="实验过程">
          <el-button type="text">查看</el-button>
        </el-table-column>
        <el-table-column label="操作评分" prop=""/>
        <el-table-column label="实验报告" prop="">
          <el-button type="text">{{}}</el-button>
        </el-table-column>
        <el-table-column label="报告评分" prop=""/>
        <el-table-column label="总分" prop=""/>
        <el-table-column label="操作">
          <el-button type="text">评分</el-button>
        </el-table-column>
      </lkt-table>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    return {
      loading,
    };
  }
}
</script>
<style scoped lang="scss">

</style>