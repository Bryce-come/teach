<template>
  <div v-loading="loading" calss="cutting-tool-management">
    <div style="margin-bottom:10px">
      <el-button type="primary" @click="cutterForm()">增加刀具信息</el-button>
    </div>
    <div class="flex end" style="margin-bottom: 5px;margin-top: -46px">
      <el-input slot="search" class="search-bar" v-model="keywords" placeholder="按关键字搜索" clearable/>
    </div>
    <lkt-table
      :data="cutterNameList"
      style="width:100%">
      <el-table-column prop="name" label="刀具名称"/>
      <el-table-column prop="no" label="刀具型号"/>
      <el-table-column prop="fitDeviceType" label="适配设备类型"/>
      <el-table-column prop="quantity" label="库存"/>
      <el-table-column prop="extend.discardNum" label="报废数量"/>
      <el-table-column label="操作" width="220px" >
        <div class="flex center little-space" slot-scope="{row}">
          <el-button type="text" @click="storeRecordForm(row)">出入库登记</el-button>
          <el-button type="text" style="margin-left:5px" @click="storeHistoryForm(row)">历史记录</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      :modal="addModal"
      :confirm="cutterInfoUpdate"
      width="500px">
        <div slot="title">刀具信息登记</div>
        <el-form v-if="addModal.cutterInfo" ref="form1" :model="addModal.cutterInfo" label-width="140px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="刀具名称：" prop="name" :rules="{ required: true, message: '请输入刀具名称'}">
            <el-input v-model="addModal.cutterInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="刀具型号：" prop="no" :rules="{ required: true, message: '请选择刀具型号'}">
            <el-input v-model="addModal.cutterInfo.no" ></el-input>
          </el-form-item>
          <el-form-item label="适配设备型号：" prop="fitDeviceType" :rules="{ required: true, message: '请选择适配设备型号'}">
            <el-select v-model="addModal.cutterInfo.fitDeviceType" multiple placeholder="请选择">
              <el-option
                v-for="item of deviceTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="storeRecordModal"
      :confirm="storeRecordUpdate"
      width="700px">
        <div slot="title">出入库登记</div>
        <el-form v-if="storeRecordModal.storeInfo" ref="form2" :model="storeRecordModal.storeInfo" label-width="140px" label-position="left" style="width: 580px;margin: 0 auto">
          <el-form-item label="出入库类型：" prop="type" :rules="{ required: true, message: '请选择出入库类型'}">
            <lkt-select v-model="storeRecordModal.storeInfo.type"></lkt-select>
          </el-form-item>
          <el-form-item label="批次：" prop="extend.batchNo" :rules="{ required: true, message: '请输入批次'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.batchNo"></el-input>
          </el-form-item>
          <el-form-item label="数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input v-model="storeRecordModal.storeInfo.quantity"></el-input>
          </el-form-item>
          <el-form-item label="厂商：" prop="extend.company" :rules="{ required: true, message: '请输入厂商名称'}">
            <el-input v-model="storeRecordModal.storeInfo.company"></el-input>
          </el-form-item>
          <el-form-item label="供货商：" prop="extend.supplier">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplier"></el-input>
          </el-form-item>
          <el-form-item label="供货商联系方式：" prop="extend.supplierTel">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplierTel"></el-input>
          </el-form-item>
          <el-form-item label="购入时间：" prop="extend.buyDt" :rules="{ required: true, message: '请选择购入时间'}">
            <el-date-picker v-model="storeRecordModal.storeInfo.extend.buyDt"></el-date-picker>
          </el-form-item>
          <el-form-item label="保管人：" prop="extend.keeper">
            <el-input v-model="storeRecordModal.storeInfo.extend.keeper"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="storeHistoryModal"
      width="800px">
        <div slot="title">历史记录</div>
        <div style="display:flex;justify-content:flex-end">
          <el-input style="width:300px" placeholder="请输入关键字搜索" v-model="filterText"></el-input>
        </div>
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
import { useConfirm, useLoading, useSearch } from 'web-toolkit/src/service';
import {ElForm} from 'element-ui/types/form';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {ComponentStoreAdd, ComponentStoreUpdate, ComponentStoreDel, ComponentStoreList, ComponentStoreRecordAdd, ComponentStoreRecordUpdate, ComponentStoreRecordDel } from '@/dao/componentStoreDao';
import { DeviceTypeList} from '@/dao/deviceDao';
export default {
  setup() {
    const loading = ref(false);
    const cutterList = ref<any>([]);
    const deviceTypeList = ref<any>();
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecord = ref<any>();
    const filterText = ref<string|null>(null);
    const [keywords, cutterNameList] = useSearch(cutterList, {
      includeProps: ['no', 'name'],
    });
    const form1 = ref<ElForm|null>(null);
    const form2 = ref<ElForm|null>(null);
    const addModal = ref<any>({
      visible: false,
      cutterInfo: null,
      type: 'add',
    });
    const storeRecordModal = ref<any>({
      visible: false,
      storeInfo: null,
    });
    const cutterForm = async (data?: any) => {
      if (form1.value) { (form1.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
        addModal.value.type = 'update';
      } else {
        data = initCutterForm();
        addModal.value.type = 'add';
      }
      addModal.value.cutterInfo = data;
      addModal.value.visible = true;
    };
    async function cutterInfoUpdate() {
      const valid = await (form1.value as ElForm).validate();
      console.log(valid);
      console.log(addModal.value.cutterInfo);
      if (valid) {
        if (addModal.value.type === 'add') {
          await ComponentStoreAdd({
            name: addModal.value.cutterInfo.name,
            no: addModal.value.cutterInfo.no,
            dTypeJson: JSON.stringify(addModal.value.cutterInfo.fitDeviceType),
          });
        }
        addModal.value.visible = false;
        Message.success('添加成功');
        cutterList.value = await ComponentStoreList();
        console.log(cutterList);
      }
    }
    const remove = async (row: any) => {
      await ComponentStoreDel({
        id: row.id,
      });
      cutterList.value = await ComponentStoreList();
      Message.success('删除成功');
    };
    const storeRecordForm = async (data: any) => {
      if (form1.value) { (form1.value as ElForm).clearValidate(); }
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
      cutterList.value = await ComponentStoreList();
      deviceTypeList.value = await DeviceTypeList();
    }));
    return{
      loading, cutterNameList, keywords, cutterList, form1, form2,
      query, deviceComponentStore,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      addModal, cutterForm, deviceTypeList,
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
    name: '', no: '',
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
