<template>
  <div v-loading="loading" class="cutting-tool-management">
    <div style="margin-bottom:10px" class="flex">
      <el-button type="success" style="margin-right: 1rem" @click="cutterForm()">增加刀具信息</el-button>
      <el-upload
        style="margin-right: 1rem"
        action=""
        :http-request="(option)=>upload(option)"
        :show-file-list="false">
        <el-button type="success">导入添加修改</el-button>
      </el-upload>
      <el-button type="primary" style="margin-right: 1rem" @click="downFile()">导入模板下载</el-button>
      <el-button type="primary" @click="exportExcel()" style="margin-right: 1rem">导出</el-button>
    </div>
    <div class="flex end" style="margin-bottom: 5px;margin-top: -46px">
      <el-input slot="search" class="search-bar" v-model="keywords" placeholder="按关键字搜索" clearable />
    </div>
    
    <lkt-table :data="cutterNameList" style="width:100%">
      <el-table-column prop="name" label="刀具名称" />
      <el-table-column prop="no" label="刀具编号" />
      <el-table-column
        prop="type"
        label="刀具类型"
        :formatter="(row)=>{
        return row.type===1?'耗材':'量具'
      }"/>
      <el-table-column prop="extend.model" label="规格型号" />
      <el-table-column prop="extend.unit" label="单位" />
      <el-table-column prop="extend.place" label="货架位置" />
      <el-table-column prop="quantity" label="库存" />
      <el-table-column label="报废数量">
        <div slot-scope="{row}">
          <div v-if="row.extend.discardNum">{{row.extend.discardNum}}</div>
          <div v-else>0</div>
        </div>
      </el-table-column>
      <el-table-column label="操作" width="280px">
        <div class="flex center little-space" slot-scope="{row}">
          <el-button type="text" @click="cutterForm(row)">更新</el-button>
          <el-button type="text" @click="storeRecordForm(row)">出入库登记</el-button>
          <el-button type="text" style="margin-left:5px" @click="storeHistoryForm(row)">历史记录</el-button>
          <el-button type="danger" size="mini" style="margin-left:5px" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>

    <kit-dialog-simple
      id="device-component"
      :modal="addModal"
      :confirm="cutterInfoUpdate"
      width="500px">
      <div slot="title" v-if="addModal.type==='add'">刀具信息登记</div>
      <div slot="title" v-else>刀具信息修改</div>
      <el-form
        v-if="addModal.cutterInfo"
        ref="form1"
        :model="addModal.cutterInfo"
        label-width="140px"
        label-position="left"
        style="width: 357px;margin: 0 auto">
        <el-form-item label="刀具名称：" prop="name" :rules="{ required: true, message: '请输入刀具名称'}">
          <el-input v-model="addModal.cutterInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="刀具编号：" prop="no" :rules="{ required: true, message: '请选择刀具编号'}">
          <el-input v-model="addModal.cutterInfo.no"></el-input>
        </el-form-item>
        <el-form-item label="刀具类型：" prop="type" :rules="{ required: true, message: '请选择刀具类型'}">
          <el-select v-model="addModal.cutterInfo.type" placeholder="请选择">
            <el-option
              v-for="item of [{'id':1, 'name':'耗材'},{'id':2,'name':'量具'}]"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格型号：" prop="model">
          <el-input v-model="addModal.cutterInfo.model"></el-input>
        </el-form-item>
        <el-form-item label="单位：" prop="unit">
          <el-input v-model="addModal.cutterInfo.unit"></el-input>
        </el-form-item>
        <el-form-item label="当前库存：" prop="quantity" :rules="{ required: true}">
          <el-input v-model="addModal.cutterInfo.quantity"></el-input>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>

    <kit-dialog-simple
      id="device-component-record"
      :modal="storeRecordModal"
      :confirm="storeRecordUpdate"
      width="600px" >
      <div slot="title">出入库登记</div>
      <el-form
        v-if="storeRecordModal.storeInfo"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="出入库类型：" prop="type" :rules="{ required: true, message: '请选择出入库类型'}">
          <lkt-select
            :list="storeTypeList"
            value-key="name"
            option-value-key="id"
            v-model="storeRecordModal.storeInfo.type"
          ></lkt-select>
        </el-form-item>
      </el-form>
      <el-form
        v-if="storeRecordModal.storeInfo && (storeRecordModal.storeInfo.type === 1 || storeRecordModal.storeInfo.type === 2)"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto" >
        <el-form-item
          label="批次："
          prop="extend.batchNo"
          :rules="{ required: true, message: '请输入批次'}">
          <el-input v-model="storeRecordModal.storeInfo.extend.batchNo" />
        </el-form-item>
        <el-form-item label="数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item label="厂商：" prop="extend.company">
          <el-input v-model="storeRecordModal.storeInfo.company" />
        </el-form-item>
        <el-form-item label="供货商：" prop="extend.supplier">
          <el-input v-model="storeRecordModal.storeInfo.extend.supplier" />
        </el-form-item>
        <el-form-item label="供货商联系方式：" prop="extend.supplierTel">
          <el-input v-model="storeRecordModal.storeInfo.extend.supplierTel" />
        </el-form-item>
        <el-form-item label="时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item label="保管人：" prop="extend.keeper">
          <el-input v-model="storeRecordModal.storeInfo.extend.keeper" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"/>
        </el-form-item>
      </el-form>
      <el-form
        v-else-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 3"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="归还数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item
          label="归还人："
          prop="extend.person"
          :rules="{ required: true, message: '请输入归还人名称'}">
          <el-input v-model="storeRecordModal.storeInfo.extend.person" />
        </el-form-item>
        <el-form-item label="时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"
          />
        </el-form-item>
      </el-form>
      <el-form
        v-else-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 3"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="还回数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item label="时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"/>
        </el-form-item>
      </el-form>
      <el-form
        v-else-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 10"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="借出数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item label="时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item
          label="借用人："
          prop="extend.person"
          :rules="{ required: true, message: '请输入借用人名称'}">
          <el-input v-model="storeRecordModal.storeInfo.extend.person" />
        </el-form-item>
        <el-form-item label="使用操作台（多选）：" placeholder="请选择操作台">
          <el-select multiple v-model="storeRecordModal.storeInfo.extend.stationRecord.id">
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"/>
        </el-form-item>
      </el-form>
      <el-form
        v-else-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 11"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="领用数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item label="领用时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item
          label="领用人："
          prop="extend.person"
          :rules="{ required: true, message: '请输入借用人名称'}">
          <el-input v-model="storeRecordModal.storeInfo.extend.person" />
        </el-form-item>
        <el-form-item label="使用操作台（多选）：" placeholder="请选择操作台">
          <el-select multiple v-model="storeRecordModal.storeInfo.extend.stationRecord.id">
            <el-option
              v-for="item of stationList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"/>
        </el-form-item>
      </el-form>
      <el-form
        v-else-if="storeRecordModal.storeInfo && storeRecordModal.storeInfo.type === 12"
        ref="form2"
        :model="storeRecordModal.storeInfo"
        label-width="160px"
        label-position="left"
        style="width: 377px;margin: 0 auto">
        <el-form-item label="报废数量：" prop="quantity" :rules="{ required: true, message: '请输入数量'}">
          <el-input-number v-model="storeRecordModal.storeInfo.quantity" :min="1" label="请输入数量" />
        </el-form-item>
        <el-form-item label="报废时间：" prop="dt" :rules="{ required: true, message: '请选择时间'}">
          <el-date-picker v-model="storeRecordModal.storeInfo.dt" />
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input
            v-model="storeRecordModal.storeInfo.remark"
            type="textarea"
            :autosize="{ minRows: 3}"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>

    <kit-dialog-simple id="device-component-history" :modal="storeHistoryModal" width="800px">
      <div slot="title">历史记录</div>
      <div class="flex end" style="margin-bottom: 5px;margin-top: -10px">
        <el-input
          slot="search1"
          class="search-bar"
          v-model="filterText"
          style="width:200px"
          placeholder="按关键字搜索"
          clearable/>
      </div>
      <lkt-table :data="deviceComponentStoreRecord" style="width:100%">
        <el-table-column type="expand">
          <div slot-scope="{ row }">
            <el-form label-width="120px" label-position="left" class="demo-table-expand">
              <el-form-item label="批次:">{{row.extend.batchNo}}</el-form-item>
              <el-form-item label="厂商:">{{row.extend.company}}</el-form-item>
              <el-form-item label="供货商:">{{row.extend.supplier}}</el-form-item>
              <el-form-item label="厂商联系方式:">{{row.extend.supplierTel}}</el-form-item>
              <el-form-item label="保管人:">{{row.extend.keeper}}</el-form-item>
            </el-form>
          </div>
        </el-table-column>
        <el-table-column label="类型">
          <div slot-scope="{ row }">{{storeTypeList.filter(e=>e.id===row.type)[0].name}}</div>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" />
        <el-table-column prop="dt" label="时间">
          <div slot-scope="{ row }">
            <span v-if="row.dt">{{new Date(row.dt) | date }}</span>
          </div>
        </el-table-column>
        <el-table-column prop="extend.person" label="操作人" />
        <el-table-column prop="remark" label="备注" />
      </lkt-table>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useConfirm, useLoading, useSearch } from 'web-toolkit/src/service';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
import {
  ComponentStoreAdd,
  ComponentStoreUpdate,
  ComponentStoreDel,
  ComponentStoreList,
  ComponentStoreRecordAdd,
  ComponentStoreRecordUpdate,
  ComponentStoreRecordDel,
  ComponentStoreRecordList, ComponentStoreImportSample, ComponentStoreAddImport, ComponentStoreExport,
} from '@/dao/componentStoreDao';
import {DeviceTypeList} from '@/dao/deviceDao';
import {StationList} from '@/dao/stationDao';

export default {
  setup() {
    const loading = ref(false);
    const cutterList = ref<any>([]);
    const deviceTypeList = ref<any>();
    const stationList = ref<any>([]);
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecordList = ref<any>([]);
    const componentID = ref<any>();
    const [filterText, deviceComponentStoreRecord] = useSearch(
      deviceComponentStoreRecordList,
      {
        includeProps: [ 'remark', 'person'],
      },
    );
    const [keywords, cutterNameList] = useSearch(cutterList, {
      includeProps: ['no', 'name', 'extend.model', 'extend.place'],
    });
    // 1-新购, 2-利旧, 3-还回, 10-借出, 11-领用, 12-报废
    const storeTypeList = ref<any>([
      {
        name: '新购',
        id: 1,
      },
      {
        name: '利旧',
        id: 2,
      },
      {
        name: '还回',
        id: 3,
      },
      {
        name: '借出',
        id: 10,
      },
      {
        name: '领用',
        id: 11,
      },
      {
        name: '报废',
        id: 12,
      },
    ]);
    const form1 = ref<ElForm | null>(null);
    const form2 = ref<ElForm | null>(null);

    const addModal = ref<any>({
      visible: false,
      cutterInfo: null,
      type: '',
    });
    const cutterForm = async (data?: any) => {
      if (form1.value) {
        (form1.value as ElForm).clearValidate();
      }
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
            type: addModal.value.cutterInfo.type,
            // dTypeJson: JSON.stringify(addModal.value.cutterInfo.fitDeviceType),
          });
        } else if (addModal.value.type === 'update') {
          await ComponentStoreUpdate({
            id: addModal.value.cutterInfo.id,
            name: addModal.value.cutterInfo.name,
            no: addModal.value.cutterInfo.no,
            type: addModal.value.cutterInfo.type,
          });
        }
        addModal.value.visible = false;
        Message.success('添加成功');
        cutterList.value = await ComponentStoreList({});
      }
    }

    const remove = async (row: any) => {
      await ComponentStoreDel({
        id: row.id,
      });
      cutterList.value = await ComponentStoreList({});
      Message.success('删除成功');
    };
    const storeRecordModal = ref<any>({
      visible: false,
      storeInfo: {
        type: '新购',
        quantity: '',
        dt: '',
        remark: '',
        extend: {
          person: '',
          stationRecord: {
            id: [],
            quantity: '',
          },
          batchNo: '',
          company: '',
          supplier: '',
          supplierTel: '',
          buyDt: '',
          keeper: '',
        },
      },
    });
    const storeRecordForm = async (data: any) => {
      if (form2.value) {
        (form2.value as ElForm).clearValidate();
      }
      if (data) {
        componentID.value = data.id;
        //   data = deepClone(data);
        // } else {
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
      await query(storeHistoryModal.value.storeHistoryInfo);
      storeHistoryModal.value.visible = true;
    };

    // 出入库登记确认函数
    async function storeRecordUpdate() {
      const valid = await (form2.value as ElForm).validate();
      if (valid) {
        // 时间格式转化
        if (
          storeRecordModal.value.storeInfo.dt &&
          storeRecordModal.value.storeInfo.dt instanceof Date
        ) {
          storeRecordModal.value.storeInfo.dt = storeRecordModal.value.storeInfo.dt.getTime();
        }
        await ComponentStoreRecordAdd({
          componentId: componentID.value,
          type: storeRecordModal.value.storeInfo.type,
          quantity: storeRecordModal.value.storeInfo.quantity,
          dt: storeRecordModal.value.storeInfo.dt,
          remark: storeRecordModal.value.storeInfo.remark
            ? storeRecordModal.value.storeInfo.remark
            : null,
          extendJson: JSON.stringify(storeRecordModal.value.storeInfo.extend),
        });
        cutterList.value = await ComponentStoreList({});
        storeRecordModal.value.visible = false;
        Message.success('添加成功');
      }
    }

    const query = async (data: any) => {
      deviceComponentStoreRecordList.value = await ComponentStoreRecordList({
        componentId: data.id,
      });
    };
    const queryStationList = async () => {
      stationList.value = await StationList({
        simple: false,
      });
    };
    async function downFile() {
      await ComponentStoreImportSample();
    }
    async function upload(option: any) {
      await ComponentStoreAddImport({
        file: option.file,
      });
      cutterList.value = await ComponentStoreList({});
    }
    async function exportExcel() {
      await ComponentStoreExport({});
    }
    onMounted(
      useLoading(loading, async () => {
        cutterList.value = await ComponentStoreList({});
        deviceTypeList.value = await DeviceTypeList();
        await queryStationList();
      }),
    );
    return {
      loading,
      cutterNameList,
      keywords,
      cutterList,
      form1,
      form2,
      query,
      deviceComponentStore,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      addModal,
      cutterForm,
      deviceTypeList,
      cutterInfoUpdate: useLoading(loading, cutterInfoUpdate),
      storeRecordModal,
      storeRecordForm,
      storeRecordUpdate: useLoading(loading, storeRecordUpdate),
      storeHistoryModal,
      storeHistoryForm,
      filterText,
      deviceComponentStoreRecord,
      deviceComponentStoreRecordList,
      componentID,
      storeTypeList,
      queryStationList,
      stationList,
      downFile, upload: useLoading(loading, upload), exportExcel,
    };
  },
};

function initCutterForm() {
  return {
    name: '',
    no: '',
  };
}

function initStoreRecordForm() {
  return {
    type: 1,
    quantity: '',
    remark: '',
    dt: '',
    extend: {
      person: '',
      stationRecord: {
        id: [],
        quantity: '',
      },
      batchNo: '',
      company: '',
      supplier: '',
      supplierTel: '',
      buyDt: '',
      keeper: '',
    },
  };
}
</script>
<style scoped lang="scss">
</style>
