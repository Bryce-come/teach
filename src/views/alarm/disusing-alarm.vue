<template>
  <div v-loading="loading">
    <el-form :inline="true">
      <el-form-item label="操作台:" label-width="80px">
        <el-select v-model="stationName" multiple :clearable="false" placeholder="请选择操作台名称">
          <el-option
            v-for="item of stationList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型:" label-width="80px">
        <el-select v-model="type" multiple :clearable="false" placeholder="请选择类型">
          <el-option
            v-for="item of typeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-form :inline="true">
      <el-form-item label="发生时间:" label-width="80px">
        <lkt-date-picker v-model="date">
        </lkt-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="margin-left: 60px" @click="query()">查询</el-button>
      </el-form-item>
    </el-form>
    <lkt-table
      :data="usageAlarmList"
      style="width:100%">
      <el-table-column prop="createDt" label="报警时间" sortable="custom"/>
      <el-table-column prop="type" label="报警类型" sortable="custom">
        <el-tag slot-scope="{ row }">
          {{(row.type==="illegal_time"? '非法时间内开启':'')+(row.type==="illegal_user"? '未授权的使用者':'')}}
        </el-tag>
      </el-table-column>
      <el-table-column prop="users.name" label="人员"/>
      <el-table-column prop="duration" label="持续时间" sortable="custom">
        <template slot-scope="{row}">
          <el-tag type="danger" v-if="row.duration === undefined">报警中</el-tag>
          <div v-else>{{ row.duration | HMS }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="stations.name" label="操作台">
      </el-table-column>
      <!-- <el-table-column label="操作" >
        <div slot-scope="{ row }" class="flex column" >
         <el-tag v-if="row.extend.confirm" type="warning">已被确认</el-tag>
        </div>
      </el-table-column> -->
    </lkt-table>
  </div>
</template>
<script lang="ts">
import {ref, onMounted} from '@vue/composition-api';
import {useLoading} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {
  AlarmUsageList,
} from '@/dao/alarmDao';
import {StationList} from '@/dao/stationDao';

export default {
  setup() {
    const loading = ref(false);
    const stationName = ref<any>();
    const stationList = ref<any>([]);
    const type = ref<any>();
    const date = ref([new Date(Date.now() - 3 * 24 * 3600000), new Date()]);
    const usageAlarmList = ref<any>();
    const typeList = ref([
      {
        id: 'illegal_time',
        name: '非法时间内开启',
      }, {
        id: 'illegal_user',
        name: '未授权的使用者',
      },
    ]);
    const query = async () => {
      if (date.value === null) {
        Message.warning('请选择时间范围！');
      } else {
        usageAlarmList.value = await AlarmUsageList({
          typeJson: type.value ? JSON.stringify(type.value) : null,
          stationJson: stationName.value ? JSON.stringify(stationName.value) : null,
          start: date.value && date.value[0] ? (date.value[0] as Date).getTime() : null,
          end: date.value && date.value[1] ? (date.value[1] as Date).getTime() : null,
        });
      }
    };
    onMounted(useLoading(loading, async () => {
      await query();
      stationList.value = await StationList({
        simple: true,
      });
    }));
    return {
      loading,
      usageAlarmList,
      query,
      stationList,
      stationName,
      typeList,
      type,
      date,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
