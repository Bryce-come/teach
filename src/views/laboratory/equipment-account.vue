<template>
  <div class="equipment-account">
    <el-form>
        <el-form-item label="设备型号:" label-width="80px">
            <lkt-select :list="deviceTypeList" value-key="name" v-model="deviceType" multiple :clearable="false" placeholder="请选择设备型号"/>
        </el-form-item>
        <el-form-item label="购入时间:" label-width="80px">
            <el-date-picker v-model="buyDate" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
             </el-date-picker>
             <el-button type="primary" style="margin-left: 20px">查询</el-button>
            <el-button style="margin-left: 20px">重置</el-button>
        </el-form-item>
        <el-form-item>
            <el-button type="success" @click="showForm()">增加</el-button>
            <el-button type="info" style="margin-left: 20px">导出</el-button>
        </el-form-item>
    </el-form>    
     <lkt-table
      :data="deviceaccountList"
      style="width: 100%">
      <el-table-column type="expand">
      <template slot-scope="props">
        <el-form class="flex" label-width="100px" label-position="left" inline>
          <el-form-item label="设备IP" style="margin-left:80px">
            <span>{{props.row.extend.ip}}</span>
          </el-form-item>
          <el-form-item label="厂商联系人" style="margin-left:80px">
            <span>{{props.row.extend.producerContact}}</span>
          </el-form-item>
          <el-form-item label="厂商联系方式" style="margin-left:80px">
            <span>{{props.row.extend.producerTel}}</span>
          </el-form-item>
        </el-form>
      </template>
    </el-table-column>
      <el-table-column prop="type.name" label="设备型号" width="100px"/>
      <el-table-column prop="extend.address" label="存放地址"/>     
      <el-table-column prop="extend.buyDt" label="购入日期"/>
      <el-table-column prop="extend.producerTel" label="联系方式"/>
      <el-table-column prop="extend.producer" label="生产厂商"/>
      <el-table-column label="操作">
          <el-button type="warning" size="mini" @click="showForm()">修改</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove()">删除</el-button>                     
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="modal"
      :confirm="update"
      width="700px">
        <div slot="title">{{modal.deviceInfo && modal.deviceInfo.id ? '修改' : '添加'}}设备信息</div>
        <el-form v-if="modal.deviceInfo" ref="form" :model="modal.deviceInfo" label-width="120px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="设备型号" prop="type.name" :rules="{ required: true, message: '请选择设备型号', trigger: none}">
              <el-select v-model="modal.deviceInfo.type.name"></el-select>
          </el-form-item>
          <el-form-item label="存放地址" prop="extend.address" :rules="{ required: true, message: '请输入存放地址', trigger: none}">
              <el-input v-model="modal.deviceInfo.extend.address"></el-input>
          </el-form-item>
          <el-form-item label="购入日期" prop="extend.buyDt" :rules="{ required: true, message: '请选择购入日期', trigger: none}">
              <el-date-picker v-model="modal.deviceInfo.extend.buyDt" type="date"></el-date-picker>
          </el-form-item>
          <el-form-item label="生产厂商" prop="extend.producer">
              <el-input v-model="modal.deviceInfo.extend.producer"></el-input>
          </el-form-item>
          <el-form-item label="厂商联系人" prop="extend.producerContact">
              <el-input v-model="modal.deviceInfo.extend.producerContact"></el-input>
          </el-form-item>
          <el-form-item label="厂商联系方式" prop="extend.producerTel">
              <el-input v-model="modal.deviceInfo.extend.producerTel"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const deviceaccountList = ref<any>();
    const deviceTypeList = ref<any>();
    const deviceType = ref<any>();
    const buyDate = '';
    const remove = () => {
        Message.success('删除成功');
    };
    const modal = ref<any>({
        visible: false,
        deviceInfo: null,
    });
    const form = ref<ElForm|null>(null);
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initForm();
      }
      modal.value.deviceInfo = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = true;
      if (valid) {
        const { id, type: {name}, extend: {buyDt, address, producer, producerContact, producerTel}} = modal.value.deviceInfo;
        modal.value.visible = false;
        Message.success(`${isUndefined(id) ? '添加' : '修改'}成功`);
        await query();
      }
    }
    const query = async () => {
          deviceaccountList.value = [
          {id: '001', collector: '', name: 'xx机', type: {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.101', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室01', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '002', collector: '', name: 'xx机', type: {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.102', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室02', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '003', collector: '', name: 'xx机', type: {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.103', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室03', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '004', collector: '', name: 'xx机', type: {id: '3', name: 'NLJT4', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.104', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室04', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          {id: '005', collector: '', name: 'xx机', type: {id: '4', name: 'NLJT5', img: '', extend: {ctrName: ''}},
          createDt: '', extend: {ip: '192.168.0.105', buyDt: '2019-12-23', keeper: '王小明', maintenTime: '', address: '浙江自动化学院实验室05', price: '', producer: '浙江金华机床厂',
          producerContact: '', producerTel: '18977538970'}},
          ];
      };
    onMounted(useLoading(loading, async () => {
      await query();
      deviceTypeList.value = [
          {id: '0', name: 'NLJT1', img: '', extend: {ctrName: ''}},
          {id: '1', name: 'NLJT2', img: '', extend: {ctrName: ''}},
          {id: '2', name: 'NLJT3', img: '', extend: {ctrName: ''}},
          {id: '3', name: 'NLJT4', img: '', extend: {ctrName: ''}},
          {id: '4', name: 'NLJT5', img: '', extend: {ctrName: ''}}
      ];
    }));
    return{
        deviceaccountList, buyDate, form, modal, showForm,
        remove: useConfirm('确认删除？', useLoading(loading, remove)),
        update: useLoading(loading, update),
        deviceTypeList, deviceType,
        };
    },
};
function initForm() {
  return {
    type: {name: ''},
    extend: {buyDt: '', address: '', producer: '', producerContact: '', producerTel: ''},
  };
}
</script>
<style scoped lang="scss">
.el-form-item {
    margin-bottom: 10px;
  }
</style>
