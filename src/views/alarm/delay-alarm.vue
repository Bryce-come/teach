<template>
  <div v-loading="loading">
    <el-form class="flex little-space" label-width="120px" label-position="left">
      <el-form-item label="提前提醒时间：">
        <el-input-number v-model="limit.days"/>
        <span style="margin:0 30px 0 10px">天</span>
        <el-button type="primary" @click="queryManually">查询</el-button>
      </el-form-item>
    </el-form>
    <lkt-table :data="list" stripe>
      <el-table-column prop="device.name" label="设备名称"/>
      <el-table-column label="设备编号" prop="device.referencedColumnName" sortable="custom" min-width="150"/>
      <el-table-column label="设备类型" prop="deviceType.name" sortable="custom" min-width="110"/>
      <el-table-column label="生产产商" prop="extend.productorName" sortable="custom" min-width="150"/>
      <el-table-column label="购买时间" prop="extend.productDt" sortable="custom" min-width="100">
      </el-table-column>
      <el-table-column label="距到期时间" prop="extend.expireDays" align="center" sortable="custom" width="130">
        <div class="flex center" slot-scope="{row}">
          <span v-if="row.extend.expireDays>=0">{{row.extend.expireDays}} 天</span>
          <el-tag type="danger" v-else>过期 {{0-row.extend.expireDtays}} 天</el-tag>
        </div>
      </el-table-column>
      <el-table-column label="操作" align="center" width="200">
        <el-button size="mini" slot-scope="{ row }" type="success" @click="confirm(row)">确认 / 不再提醒</el-button>
      </el-table-column>
    </lkt-table>
  </div>
</template>
<script lang='ts'>
import { ref, computed, onMounted } from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {postService, storeUserInfo} from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { Filter } from '@/types/filter';
import {PRIVILEGE} from '@/types/privilege';
export default {
  setup() {
    const loading = ref(false);
    const limit = ref({
      days: 30,
    });
    const list = ref<any>();
    const queryManually = async () => {
      list.value =[
         {
                id: 1,
                device:{
                    name: '加工中心1',
                    referencedColumnName: 'YC124245532',
                },
                type: 2,
                position: 'XXX',
                statues: '故障',
                occurDt: '2019-2-19 08:23:09',
                operator: {
                    name: '玛丽',
                },
                description: '设备刀具磨损严重',
                extend:{
                    confirm: 1,
                    productorName:'五鑫工业设备厂',
                    productDt: '2019-2-19',
                    expireDays: 7,
                }
            }]
      };
    const confirm = async (row: any) => {
    };
    const exportExcel = async () => {};
    onMounted(useLoading(loading, async () => {
      await queryManually();
    }));
    return{
      // filter,
      loading,
      limit,
      list,
      queryManually: useLoading(loading, queryManually),
      exportExcel: useLoading(loading, exportExcel),
      confirm: useConfirm('确认不再提醒？', useLoading(loading, confirm)),
    };
  },
};
</script>
