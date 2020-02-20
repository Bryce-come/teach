<template>
  <div v-loading="loading">
    <el-form class="flex align-center">
      <el-form-item label="设备型号:" label-width="80px">
        <lkt-select :list="deviceTypeList" value-key="name" option-value-key="id" v-model="deviceTypes" multiple :clearable="true" placeholder="请选择设备型号"/>
      </el-form-item>
      <el-form-item label="购入时间:" label-width="80px">
        <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-left:10px">
        <el-button type="primary" @click="query()">查询</el-button>
        <el-button type="success" style="margin-left: 1rem" @click="showForm()">增加</el-button>
      </el-form-item>
    </el-form>
    <lkt-table
      :data="deviceList"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form class="flex" label-width="100px" label-position="left" inline>
            <el-form-item label="厂商联系人:" style="margin-left:80px">
              <span>{{props.row.extend.producerContact}}</span>
            </el-form-item>
            <el-form-item label="厂商联系方式:" style="margin-left:80px">
              <span>{{props.row.extend.producerTel}}</span>
            </el-form-item>
            <el-form-item label="价格:" style="margin-left:80px">
              <span>{{props.row.extend.price}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="设备编号" width="150px"/>
      <el-table-column prop="name" label="设备名称" />
      <el-table-column prop="deviceType.name" label="设备型号" />
      <el-table-column prop="extend.address" label="存放地址"/>
      <el-table-column prop="extend.buyDt" :formatter="(row, column, cellValue, index)=> row.extend.buyDt? formatDate(new Date(row.extend.buyDt)):''"  label="购入日期"/>
      <el-table-column prop="extend.keeper" label="管理员"/>
      <el-table-column prop="extend.producer" label="生产厂商"/>
      <el-table-column label="操作" width="180">
        <div slot-scope="{row}">
          <el-button type="success" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="600px">
      <div slot="title">{{modal.deviceInfo && modal.deviceInfo.id ? '修改' : '添加'}}设备信息</div>
      <el-form v-if="modal.deviceInfo" ref="form" :model="modal.deviceInfo" label-width="120px" label-position="left" style="margin: 0 10px">
        <el-form-item label="设备编号：" prop="id" :rules="{ required: true, message: '请填写设备编号'}">
          <el-input v-model="modal.deviceInfo.id" />
        </el-form-item>
        <el-form-item label="设备名称：" prop="name" :rules="{ required: true, message: '请填写设备名称'}">
          <el-input v-model="modal.deviceInfo.name" />
        </el-form-item>
        <el-form-item label="设备型号：" prop="deviceType.id" :rules="{ required: true, message: '请选择设备型号'}">
          <lkt-select :list="deviceTypeList" value-key="name" option-value-key="id" v-model="modal.deviceInfo.deviceType.id" placeholder="请选择设备型号"/>
        </el-form-item>
        <el-form-item label="购入日期：" prop="extend.buyDt" :rules="{ required: true, message: '请选择购入日期'}">
          <el-date-picker v-model="modal.deviceInfo.extend.buyDt" type="date"/>
        </el-form-item>
        <el-form-item label="价格：" prop="extend.price" >
          <el-input v-model="modal.deviceInfo.extend.price"/>
        </el-form-item>
        <el-form-item label="保管人：" prop="extend.keeper" >
          <el-input v-model="modal.deviceInfo.extend.keeper"/>
        </el-form-item>
        <el-form-item label="存放地址：" prop="extend.address" >
          <el-input v-model="modal.deviceInfo.extend.address"/>
        </el-form-item>
        <el-form-item label="生产厂商：" prop="extend.producer">
          <el-input v-model="modal.deviceInfo.extend.producer"/>
        </el-form-item>
        <el-form-item label="厂商联系人：" prop="extend.producerContact">
          <el-input v-model="modal.deviceInfo.extend.producerContact"/>
        </el-form-item>
        <el-form-item label="厂商联系方式：" prop="extend.producerTel">
          <el-input v-model="modal.deviceInfo.extend.producerTel"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import {ref, Ref, onMounted} from '@vue/composition-api';
import {useConfirm, useLoading} from 'web-toolkit/src/service';
import {Message} from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {deepClone, formatDate} from 'web-toolkit/src/utils';
import {DeviceAdd, DeviceDel, DeviceList, DeviceTypeList, DeviceUpdate} from '@/dao/deviceDao';

export default {
  setup() {
    const loading = ref(false);
    const deviceList = ref<any>();
    const deviceTypeList = ref<any>();
    const deviceTypes = ref<any>();
    const dateRange = ref<any>(null);
    const modal = ref<any>({
      visible: false,
      deviceInfo: null,
      type: 'add',
    });
    const remove = async (row: any) => {
      await DeviceDel({
        deviceId: row.id,
      });
      Message.success('删除成功');
      await query();
    };
    const form = ref<ElForm | null>(null);
    const showForm = async (data?: any) => {
      if (form.value) {
        (form.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        modal.value.type = 'update';
        // 时间格式转化
        if (data.extend.buyDt) {
          data.extend.buyDt = new Date(data.extend.buyDt);
        }
      } else {
        data = initForm();
        modal.value.type = 'add';
      }
      modal.value.deviceInfo = data;
      modal.value.visible = true;
    };

    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        // 时间格式转化
        if (modal.value.deviceInfo.extend.buyDt && modal.value.deviceInfo.extend.buyDt instanceof Date) {
          modal.value.deviceInfo.extend.buyDt = modal.value.deviceInfo.extend.buyDt.getTime();
        }
        // *id, *name, *type, extendJson
        if (modal.value.type === 'add') {
          await DeviceAdd({
            id: modal.value.deviceInfo.id,
            name: modal.value.deviceInfo.name,
            type: modal.value.deviceInfo.deviceType.id,
            extendJson: JSON.stringify(modal.value.deviceInfo.extend),
          });
        } else {
          await DeviceUpdate({
            deviceId: modal.value.deviceInfo.id,
            name: modal.value.deviceInfo.name,
            type: modal.value.deviceInfo.deviceType.id,
            extendJson: JSON.stringify(modal.value.deviceInfo.extend),
          });
        }
        modal.value.visible = false;
        Message.success(`${modal.value.type === 'add' ? '添加' : '修改'}成功`);
        await query();
      }
    }

    const query = async () => {
      deviceList.value = await DeviceList({
        types: deviceTypes.value && deviceTypes.value.length > 0 ? JSON.stringify(deviceTypes.value) : null,
        start: dateRange.value && dateRange.value[0] ? (dateRange.value[0] as Date).getTime() : null,
        end: dateRange.value && dateRange.value[1] ? (dateRange.value[1] as Date).getTime() : null,
      });
    };
    onMounted(useLoading(loading, async () => {
      deviceTypeList.value = await DeviceTypeList();
      await query();
    }));
    return {
      deviceList, dateRange, form, modal, showForm, loading,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
      deviceTypeList, deviceTypes,
      query: useLoading(loading, query),
      formatDate,
    };
  },
};

function initForm() {
  return {
    deviceType: {},
    extend: {buyDt: '', address: '', producer: '', producerContact: '', producerTel: ''},
  };
}
</script>
<style scoped lang="scss">
</style>
