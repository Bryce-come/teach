<template>
  <div v-loading="loading">
    <lkt-table
      :data="usageAlarmList"
      style="width:100%">
      <el-table-column prop="createDt" label="报警时间"/>
      <el-table-column prop="type.name" label="报警类型">
          <el-tag slot-scope="{ row }">
            {{(row.type.name==="illegal_time"? '非法时间内开启':'')+(row.type==="illegal_user"? '未授权的使用者':'')+(row.type===0? '巡检':'')}}
          </el-tag>
      </el-table-column>
      <el-table-column prop="users.name" label="人员"/>
      <el-table-column prop="stations.name" label="操作台"/>
      <el-table-column prop="description" label="报警内容">
      </el-table-column>
      <el-table-column label="操作" >
        <el-tag slot-scope="{ row }" v-if="row.extend.confirm" type="warning">已被确认</el-tag>
      </el-table-column>
    </lkt-table>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {postService} from 'web-toolkit/src/case-main';
import {isString} from 'web-toolkit/src/utils';
import {timelineConfig} from 'web-toolkit/src/utils/echarts-helper';
import {LktDialog} from 'web-toolkit/src/utils/lkt-dialog';
import {IDeviceAlarmRecord, IParamConfig} from '@/types/beans';
import { EChartOption } from 'echarts';
import {urlMap} from '@/config';
import {statusMap} from '@/utils/device-utils';
import {router} from '@/main';
export default {
  setup() {
    const loading = ref(false);
    const usageAlarmList = ref<any>();
    const query = async () => {
        usageAlarmList.value = [
            {
                id: 1,
                users: {
                    name: '英超就',
                },
                type: {
                  name: 'illegal_time',
                },
                createDt: '2019-2-19 08:23:09',
                stations: {
                    name: '操作台1',
                },
                description: '操作台开启',
                extend: {
                    confirm: 1,
                },
            },
        ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return{
        loading,
        usageAlarmList,
        query,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
