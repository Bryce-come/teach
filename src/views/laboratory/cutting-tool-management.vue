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
      <!-- <el-table-column prop="fitDeviceTypeList.name" label="适配设备类型"/> -->
      <el-table-column label="适配设备类型">
         <div class="flex center little-space" slot-scope="{row}" >
           <div v-for="(item,i) in row.fitDeviceTypeList" :key="i" style="padding: 0">
             {{item.name}}
           </div>
         </div>
      </el-table-column>
      <el-table-column prop="quantity" label="库存"/>
      <el-table-column label="报废数量">
        <div slot-scope="{row}">
           <div v-if='row.extend.discardNum'>{{row.extend.discardNum}}</div>
           <div v-else>0</div>
        </div>
      </el-table-column>
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
        <el-form v-if="addModal.cutterInfo" ref="form1" :model="addModal.cutterInfo" label-width="140px" label-position="left" style="width: 357px;margin: 0 auto">
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
      width="600px">
        <div slot="title">出入库登记</div>
        <el-form v-if="storeRecordModal.storeInfo" ref="form2" :model="storeRecordModal.storeInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="出入库类型：" prop="type" :rules="{ required: true, message: '请选择出入库类型'}">
            <lkt-select :list="storeTypeList" value-key="name" option-value-key="id" v-model="storeRecordModal.storeInfo.type"></lkt-select>
          </el-form-item>
        </el-form>
        <el-form v-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 0" ref="form2" :model="storeRecordModal.storeInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="批次：" prop="extend.batchNo" :rules="{ required: true, message: '请输入批次'}">
            <el-input v-model="storeRecordModal.storeInfo.extend.batchNo"></el-input>
          </el-form-item>
          <el-form-item label="数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量"></el-input-number>
          </el-form-item>
          <el-form-item label="厂商：" prop="extend.company">
            <el-input v-model="storeRecordModal.storeInfo.company"></el-input>
          </el-form-item>
          <el-form-item label="供货商：" prop="extend.supplier">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplier"></el-input>
          </el-form-item>
          <el-form-item label="供货商联系方式：" prop="extend.supplierTel">
            <el-input v-model="storeRecordModal.storeInfo.extend.supplierTel"></el-input>
          </el-form-item>
          <el-form-item label="时间：" prop="extend.buyDt" :rules="{ required: true, message: '请选择时间'}">
            <el-date-picker v-model="storeRecordModal.storeInfo.extend.buyDt"></el-date-picker>
          </el-form-item>
          <el-form-item label="保管人：" prop="extend.keeper">
            <el-input v-model="storeRecordModal.storeInfo.extend.keeper"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="storeRecordModal.storeInfo.remark"  type="textarea" :autosize="{ minRows: 3}"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 1" ref="form2" :model="storeRecordModal.storeInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="借出数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量"></el-input-number>
          </el-form-item>
          <el-form-item label="借用人：" prop="" :rules="{ required: true, message: '请输入借用人名称'}">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="使用操作台（多选）：" prop="">
            <el-select multiple></el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="storeRecordModal.storeInfo.remark"  type="textarea" :autosize="{ minRows: 3}"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 2" ref="form2" :model="storeRecordModal.storeInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="归还数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量"></el-input-number>
          </el-form-item>
          <el-form-item label="归还人：" prop="" :rules="{ required: true, message: '请输入归还人名称'}">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="storeRecordModal.storeInfo.remark"  type="textarea" :autosize="{ minRows: 3}"></el-input>
          </el-form-item>
        </el-form>
        <el-form v-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 3" ref="form2" :model="storeRecordModal.storeInfo" label-width="160px" label-position="left" style="width: 377px;margin: 0 auto">
          <el-form-item label="报废数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
            <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量"></el-input-number>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input v-model="storeRecordModal.storeInfo.remark"  type="textarea" :autosize="{ minRows: 3}"></el-input>
          </el-form-item>
        </el-form>
    </kit-dialog-simple>
    <kit-dialog-simple
      :modal="storeHistoryModal"
      width="800px">
        <div slot="title">历史记录</div>
        <div class="flex end" style="margin-bottom: 5px;margin-top: -10px">
         <el-input slot="search1" class="search-bar" v-model="filterText" style="width:200px" placeholder="按关键字搜索" clearable/>
        </div>
        <lkt-table
          :data="deviceComponentStoreRecord"
          style="width:100%">
            <el-table-column type="expand">
              <div slot-scope="{ row }" class="flex around">
                <el-form label-width="100px">
                  <el-form-item label="批次:">{{row.extend.batchNo}}</el-form-item>
                  <el-form-item label="厂商:">{{row.extend.company}}</el-form-item>
                  <el-form-item label="供货商:">{{row.extend.supplier}}</el-form-item>                  
                  <el-form-item label="厂商联系方式:">{{row.extend.supplierTel}}</el-form-item>
                </el-form>
              </div>
          </el-table-column>
          <el-table-column prop="dt" label="时间"/>
          <el-table-column label="类型">
            <div slot-scope="{ row }">
              {{row.type === 0 ?'新购': '' || row.type === 1 ?'借出': '' || row.type === 2 ?'还回': '' || row.type === 3 ?'报废': ''}}
              <!-- {{row.type}} -->
            </div>
          </el-table-column>
          <el-table-column prop="quantity" label="数量"/>
          <el-table-column prop="person" label="操作人"/>
          <el-table-column prop="remark" label="备注" />
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
import {ComponentStoreAdd, ComponentStoreUpdate, ComponentStoreDel, ComponentStoreList, ComponentStoreRecordAdd, ComponentStoreRecordUpdate, ComponentStoreRecordDel, ComponentStoreRecordList } from '@/dao/componentStoreDao';
import { DeviceTypeList} from '@/dao/deviceDao';
export default {
  setup() {
    const loading = ref(false);
    const cutterList = ref<any>([]);
    const deviceTypeList = ref<any>();
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecordList = ref<any>([]);
    const componentID = ref<any>();
    const [filterText, deviceComponentStoreRecord] = useSearch(deviceComponentStoreRecordList, {
      includeProps: ['dt', 'remark', 'person'],
    });
    const [keywords, cutterNameList] = useSearch(cutterList, {
      includeProps: ['dt', 'no', 'name'],
    });
    const storeTypeList = ref<any>([
      { name: '新购',
        id: 0 },
      { name: '借出',
        id: 1 },
      { name: '归还',
        id: 2 },
      { name: '报废',
        id: 3 },
    ]);
    const form1 = ref<ElForm|null>(null);
    const form2 = ref<ElForm|null>(null);
    const addModal = ref<any>({
      visible: false,
      cutterInfo: null,
      type: 'add',
    });
    const storeRecordModal = ref<any>({
      visible: false,
      storeInfo: {
        type: '新购', quantity: '', remark: '',
        extend: {batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''},
      },
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
      if (form2.value) { (form2.value as ElForm).clearValidate(); }
      if (data) {
        componentID.value = data.id;
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
    const storeHistoryForm = async (row: any) => {
      storeHistoryModal.value.storeHistoryInfo = row;
      // console.log(storeHistoryModal.value.storeHistoryInfo);
      await query(storeHistoryModal.value.storeHistoryInfo);
      storeHistoryModal.value.visible = true;
    };
    // 出入库登记确认函数
    async function storeRecordUpdate() {
      const valid = await (form2.value as ElForm).validate();
      if (valid) {
         // 时间格式转化
        if (storeRecordModal.value.storeInfo.extend.buyDt && storeRecordModal.value.storeInfo.extend.buyDt instanceof Date) {
          storeRecordModal.value.storeInfo.extend.buyDt = storeRecordModal.value.storeInfo.extend.buyDt.getTime();
        }
        await ComponentStoreRecordAdd({
          componentId: componentID.value,
          type: storeRecordModal.value.storeInfo.type,
          quantity: storeRecordModal.value.storeInfo.quantity,
          dt: storeRecordModal.value.storeInfo.extend.buyDt,
          remark: storeRecordModal.value.storeInfo.remark ? storeRecordModal.value.storeInfo.remark : null,
          extendJson: JSON.stringify(storeRecordModal.value.storeInfo.extend),
        });
        cutterList.value = await ComponentStoreList();
        storeRecordModal.value.visible = false;
        Message.success('添加成功');
        // console.log(storeRecordModal.value.storeInfo);
      }
    }
    const query = async (data: any) => {
      deviceComponentStoreRecordList.value = await ComponentStoreRecordList({
      componentId: data.id});
      console.log(deviceComponentStoreRecord.value);
    };
    onMounted(useLoading(loading, async () => {
       cutterList.value = await ComponentStoreList();
       console.log(cutterList.value);
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
      filterText, deviceComponentStoreRecord, deviceComponentStoreRecordList, componentID, storeTypeList,
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
    type: '', quantity: '', remark: '',
    extend: {batchNo: '', company: '', supplier: '', supplierTel: '', buyDt: '', keeper: ''},
  };
}
</script>
<style scoped lang="scss">

</style>
