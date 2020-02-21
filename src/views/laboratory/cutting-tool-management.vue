<template>
  <div v-loading="loading" calss="cutting-tool-management">
    <el-form :inline="true" style="display:flex;justify-content:flex-start;flex-wrap:wrap">
      <el-form-item label="刀具名称:" label-width="80px">
        <lkt-select :list="cutterNameList" value-key="name" v-model="cutterName" multiple :clearable="false" placeholder="请选择刀具名称"/>
      </el-form-item>
      <el-form-item label="刀具型号:" label-width="80px">
        <lkt-select :list="cutterNoList" value-key="no" v-model="cutterNo" multiple :clearable="false" placeholder="请选择刀具型号"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
        <el-button style="margin-left:10px">重置</el-button>
      </el-form-item>
    </el-form>
    <el-form>
      <el-form-item>
        <el-button type="primary" @click="cutterForm()">增加刀具信息</el-button>
      </el-form-item>
    </el-form>
    <lkt-table
      :data="cutterNameList"
      style="width:100%">
      <el-table-column prop="name" label="刀具名称"/>
      <el-table-column prop="no" label="刀具型号"/>
      <el-table-column prop="fitDeviceType" label="适配设备类型"/>
      <el-table-column prop="quantity" label="库存"/>
      <el-table-column prop="extend.discardNum" label="报废数量"/>
      <el-table-column label="操作" width="220px">
        <el-button type="text" @click="storeRecordForm()">出入库登记</el-button>
        <el-button type="text" style="margin-left:5px" @click="storeHistoryForm()">历史记录</el-button>
        <el-button type="danger" size="mini" style="margin-left:5px" @click="remove()">删除</el-button>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="addModal"
      :confirm="cutterInfoUpdate"
      width="700px">
        <div slot="title">刀具信息登记</div>
        <el-form v-if="addModal.cutterInfo" ref="form" :model="addModal.cutterInfo" label-width="160px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="刀具名称" prop="name" :rules="{ required: true, message: '请输入刀具名称'}">
            <el-input v-model="addModal.cutterInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="刀具型号" prop="no" :rules="{ required: true, message: '请选择刀具型号'}">
              <lkt-select v-model="addModal.cutterInfo.no"></lkt-select>
          </el-form-item>
          <el-form-item label="适配设备型号(多选)" prop="fitDeviceType" :rules="{ required: true, message: '请选择适配设备型号'}">
              <lkt-select v-model="addModal.cutterInfo.fitDeviceType" multiple></lkt-select>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="storeRecordModal"
      :confirm="storeRecordUpdate"
      width="700px">
        <div slot="title">出入库登记</div>
        <el-form v-if="storeRecordModal.storeInfo" ref="form" :model="storeRecordModal.storeInfo" label-width="140px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="出入库类型" prop="type" :rules="{ required: true, message: '请选择出入库类型'}">
            <lkt-select v-model="storeRecordModal.storeInfo.type"></lkt-select>
          </el-form-item>
          <el-form-item label="批次" prop="extend.batchNo" :rules="{ required: true, message: '请输入批次'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.batchNo"></el-input>
          </el-form-item>
          <el-form-item label="数量" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input v-model="storeRecordModal.storeInfo.quantity"></el-input>
          </el-form-item>
          <el-form-item label="厂商" prop="extend.company" :rules="{ required: true, message: '请输入厂商名称'}">
            <el-input v-model="storeRecordModal.storeInfo.company"></el-input>
          </el-form-item>
          <el-form-item label="供货商" prop="extend.supplier" :rules="{ required: true, message: '请输入供货商名称'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplier"></el-input>
          </el-form-item>
          <el-form-item label="供货商联系方式" prop="extend.supplierTel" :rules="{ required: true, message: '请输入供货商联系方式'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplierTel"></el-input>
          </el-form-item>
          <el-form-item label="购入时间" prop="extend.buyDt" :rules="{ required: true, message: '请选择购入时间'}">
            <el-date-picker v-model="storeRecordModal.storeInfo.extend.buyDt"></el-date-picker>
          </el-form-item>
          <el-form-item label="保管人" prop="extend.keeper" :rules="{ required: true, message: '请输入保管人姓名'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.keeper"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="storeHistoryModal"
      width="1300px">
        <div slot="title">历史记录</div>
        <el-input style="width:100%" placeholder="请输入关键字搜索" v-model="filterText"></el-input>
        <lkt-table
          :data="deviceComponentStoreRecord"
          style="width:100%">
          <el-table-column prop="dt" label="时间"/>
          <el-table-column prop="type" label="类型"/>
          <el-table-column prop="quantity" label="数量"/>
          <el-table-column prop="person" label="操作人"/>
        </lkt-table>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useConfirm, useLoading } from 'web-toolkit/src/service';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
export default {
  setup() {
    const loading = ref(false);
    const cutterNameList = ref<any>();
    const cutterName = ref<any>();
    const cutterNoList = ref<any>();
    const cutterNo = ref<any>();
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecord = ref<any>();
    const filterText = ref<string|null>(null);
    const remove = async (row: any) => {
        Message.success('删除成功');
    };
    const form = ref<ElForm|null>(null);
    const addModal = ref<any>({
      visible: false,
      cutterInfo: null,
    });
    const cutterForm = async (data: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initCutterForm();
      }
      addModal.value.cutterInfo = data;
      addModal.value.visible = true;
    };
    const storeRecordModal = ref<any>({
      visible: false,
      storeInfo: null,
    });
    const storeRecordForm = async (data: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);

      } else {
        data = initStoreRecordForm();
      }
      storeRecordModal.value.storeInfo = data;
      storeRecordModal.value.visible = true;
    };
    const storeHistoryModal = ref<any>({
      visible: false,
      storeHistoryInfo: null,
    });
    const storeHistoryForm = async () => {
      storeHistoryModal.value.visible = true;
    };
    async function cutterInfoUpdate() {
      const valid = true;
      if (valid) {
        const { name, no, fitDeviceType } = addModal.value.cutterInfo;
        addModal.value.visible = false;
        Message.success('添加成功');
        await query();
      }
    }
    async function storeRecordUpdate() {
      const valid = true;
      if (valid) {
        const { type, quantity, extend: {batchNo, company, supplier, supplierTel, buyDt, keeper} } = storeRecordModal.value.storeInfo;
        storeRecordModal.value.visible = false;
        Message.success('添加成功');
        await query();
      }
    }
    const query = async () => {
      deviceComponentStore.value = [
        {id: '0', type: '', name: '刀具1', no: 'YC2838363738931', fitDeviceType: ['samrt200', 'smart300'], quantity: '100', createDt: '', extend: {discardNum: '20'}},
        {id: '1', type: '', name: '刀具2', no: 'YC2838363738932', fitDeviceType: ['samrt200'], quantity: '120', createDt: '', extend: {discardNum: '11'}},
        {id: '2', type: '', name: '刀具3', no: 'YC2838363738933', fitDeviceType: ['samrt200'], quantity: '60', createDt: '', extend: {discardNum: '15'}},
        {id: '3', type: '', name: '刀具4', no: 'YC2838363738934', fitDeviceType: ['samrt200', 'smart300'], quantity: '55', createDt: '', extend: {discardNum: '20'}},
        {id: '4', type: '', name: '刀具5', no: 'YC2838363738935', fitDeviceType: ['samrt200'], quantity: '32', createDt: '', extend: {discardNum: '2'}},
      ];
      deviceComponentStoreRecord.value = [
        {id: '0', type: '借出', component: '', quantity: '10', dt: '', remark: '', createDt: '',
        extend: {person: '', stationRecord: {id: '', quantity: ''}, batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''}},
        {id: '1', type: '归还', component: '', quantity: '8', dt: '', remark: '', createDt: '',
        extend: {person: '', stationRecord: {id: '', quantity: ''}, batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''}},
        {id: '2', type: '新购', component: '', quantity: '30', dt: '', remark: '', createDt: '',
        extend: {person: '', stationRecord: {id: '', quantity: ''}, batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''}},
      ];
    };
    onMounted(useLoading(loading, async () => {
      await query();
      cutterNameList.value = [
        {id: '0', type: '', name: '刀具1', no: 'YC2838363738931', fitDeviceType: ['samrt200', 'smart300'], quantity: '100', createDt: '', extend: {discardNum: '20'}},
        {id: '1', type: '', name: '刀具2', no: 'YC2838363738932', fitDeviceType: ['samrt200'], quantity: '120', createDt: '', extend: {discardNum: '11'}},
        {id: '2', type: '', name: '刀具3', no: 'YC2838363738933', fitDeviceType: ['samrt200'], quantity: '60', createDt: '', extend: {discardNum: '15'}},
        {id: '3', type: '', name: '刀具4', no: 'YC2838363738934', fitDeviceType: ['samrt200', 'smart300'], quantity: '55', createDt: '', extend: {discardNum: '20'}},
        {id: '4', type: '', name: '刀具5', no: 'YC2838363738935', fitDeviceType: ['samrt200'], quantity: '32', createDt: '', extend: {discardNum: '2'}},
      ];
      cutterNoList.value = [
        {id: '0', type: '', name: '刀具1', no: 'YC2838363738931', fitDeviceType: ['samrt200', 'smart300'], quantity: '100', createDt: '', extend: {discardNum: '20'}},
        {id: '1', type: '', name: '刀具2', no: 'YC2838363738932', fitDeviceType: ['samrt200'], quantity: '120', createDt: '', extend: {discardNum: '11'}},
        {id: '2', type: '', name: '刀具3', no: 'YC2838363738933', fitDeviceType: ['samrt200'], quantity: '60', createDt: '', extend: {discardNum: '15'}},
        {id: '3', type: '', name: '刀具4', no: 'YC2838363738934', fitDeviceType: ['samrt200', 'smart300'], quantity: '55', createDt: '', extend: {discardNum: '20'}},
        {id: '4', type: '', name: '刀具5', no: 'YC2838363738935', fitDeviceType: ['samrt200'], quantity: '32', createDt: '', extend: {discardNum: '2'}},
      ];
    }));
    return{
      loading, cutterNameList, cutterName, cutterNoList, cutterNo,
      query, deviceComponentStore,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      addModal, cutterForm,
      cutterInfoUpdate: useLoading(loading, cutterInfoUpdate),
      storeRecordModal, storeRecordForm,
      storeRecordUpdate: useLoading(loading, storeRecordUpdate),
      storeHistoryModal, storeHistoryForm,
      filterText, deviceComponentStoreRecord,
    };
  },
};
function initCutterForm() {
  return {
    name: '', no: '', fitDeviceType: '',
  };
}
function initStoreRecordForm() {
  return {
    type: '', quantity: '',
    extend: {batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
