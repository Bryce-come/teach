<template>
  <div v-loading="loading">
    <div class="monitor">
        <div v-if="lesson" class="card flex align-center column monitor-left"  ref="box">
           <h3>上课班级信息</h3>
            <el-form label-width="110px" label-position="left">
              <el-form-item label="课程名称：">{{ lesson.course.name }}</el-form-item>
              <el-form-item label="实验项目：">{{ lesson.course.programList }}</el-form-item>
              <el-form-item label="授课老师：">{{ lesson.course.teacher.name }}</el-form-item>
              <el-form-item label="授课班级：">{{ lesson.extend.clasz }}</el-form-item>
              <el-form-item label="上课人数：">{{ lesson.students.length }}</el-form-item>
              <el-form-item label="距离下课时间：">{{ timeDiff(time, lesson.end) }}</el-form-item>
            </el-form>
        </div>
        <div class="monitor-detail--right">

        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useSearch, useLoading, useConfirm } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const box = ref(null);
    const lesson = ref<any>();
    const time = new Date;
    const query = async () => {
        lesson.value = {  
            id:1,
            course: { 
              name: '自动化课程1',
              programList: '切刀挂刀操作',
              teacher: {
                 name: '玛丽',
                },
              },
            start: new Date(new Date().getTime() - 1 * 60 * 60 * 1000),
            end: new Date(new Date().getTime() + 1 * 60 * 60 * 1000),
            type: 0,
            students: ['马丽', '李海'],
            extend: {
              appointRecord: {result:1},
              lessons:[1,2,3],
              clasz: '自动化1801',
              claszGroup: '自动化一组',
              }
          }
    }
    const timeDiff = (time1: any, time2: any) => {
        var dateDiff = time2.getTime() - time1.getTime();
        var hours = Math.floor(dateDiff / (3600 * 1000));
        var leave1 = dateDiff % (3600 * 1000);
        var minutes = Math.floor(leave1 / (60 * 1000));
        var leave2 = leave1 % (60 * 1000);     //计算分钟数后剩余的毫秒数
        var seconds = Math.round(leave2 / 1000);
        return  hours + '小时' + minutes + '分' + seconds + '秒';
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
       loading,
       box,
       time,
       lesson,
       query,
       timeDiff,
    };
  },
};
</script>
<style scoped lang="scss">
.monitor{
    .monitor-left{
        margin-right: 1rem;
        width: 45%;
        padding: 15px 20px;
        .el-form * {
          font-size: 1rem;
        }
        .el-form-item {
           margin-bottom: 5px;
        }
    }
    .monitor-right{
        margin-right: 1rem;
        width: 45%;
    }

}
</style>
