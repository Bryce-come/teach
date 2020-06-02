<template>
  <div v-loading="loading" class="cutting-tool-management">
    <div style="margin-bottom:10px">
      <el-button type="primary" @click="componentStoreForm()">增加工具包</el-button>
    </div>
    <lkt-table :data="componentList" style="width:100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-button @click="addComponentStoreItemGroup(props.row.id,null)">增加工具</el-button>
          <el-table :data="props.row.itemList" style="width:100%">
            <el-table-column prop="component.no" label="工具编号"></el-table-column>
            <el-table-column prop="component.name" label="工具名称"></el-table-column>
             <el-table-column prop="component.extend.model" label="型号"></el-table-column>
            <el-table-column prop="quantity" label="数量"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="{row}">
                <el-button type="text" @click="addComponentStoreItemGroup(props.row.id,row)">修改</el-button>
                <el-button type="danger" @click="removeComponentStoreGroupItem(row)" size="mini"  style="margin-left:10px">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="工具包名称" />
      <el-table-column label="操作" width="280px">
        <div class="flex little-space" slot-scope="{row}">
          <el-button type="text" @click="componentStoreForm(row)">修改</el-button>
          <el-button
            type="danger"
            size="mini"
            style="margin-left:5px"
            @click="removeComponentStoreGroup(row)"
          >删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>

    <!-- 增加/修改工具包 -->
    <kit-dialog-simple
      id="device-component"
      :modal="addModal"
      :confirm="componentStoreAlter"
      width="500px"
    >
      <div slot="title" v-if="addModal.type=='add'">工具包信息登记</div>
      <div slot="title" v-else>工具包信息修改</div>
      <el-form
        v-if="addModal.componentInfo"
        ref="form1"
        :model="addModal.componentInfo"
        label-width="140px"
        label-position="left"
        style="width: 357px;margin: 0 auto"
      >
        <el-form-item label="工具包名称：" prop="name" :rules="{ required: true, message: '请输入工具包名称'}">
          <el-input v-model="addModal.componentInfo.name"></el-input>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>

    <!-- 增加/修改工具包item -->
    <kit-dialog-simple
      id="addComponentStoreGroupItemModal"
      :modal="addComponentStoreGroupItemModal"
      :confirm="addComponentStoreGroupItemConfirm"
      width="500px"
    >
      <div slot="title" v-if="addComponentStoreGroupItemModal.type=='add'">增加工具包</div>
      <div slot="title" v-else>修改工具包</div>
      <el-form
        v-if="addComponentStoreGroupItemModal.componentStoreGroupItem"
        ref="form1"
        :model="addComponentStoreGroupItemModal.componentStoreGroupItem"
        label-width="140px"
        label-position="left"
        style="width: 357px;margin: 0 auto"
      >
        <el-form-item label="刀具名称：" :rules="{ required: true}">
          <el-select
            v-model="addComponentStoreGroupItemModal.componentStoreGroupItem.component"
            value-key="id"
            placeholder="请选择"
          >
            <el-option
              v-for="item of toolSelect "
              :key="item.id"
              :label="item.name +' '+ item.extend.model "
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="刀具数量：" prop="quantity" :rules="{ required: true, message: '请输入刀具数量'}">
          <el-input-number v-model="addComponentStoreGroupItemModal.componentStoreGroupItem.quantity"></el-input-number>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, set } from '@vue/composition-api';
import { Message } from 'element-ui';
import { useConfirm, useLoading, useSearch } from 'web-toolkit/src/service';
import { ElForm } from 'element-ui/types/form';
import { isUndefined, deepClone } from 'web-toolkit/src/utils';
import {
  ComponentStoreList,
  ComponentStoreRecordAdd,
  ComponentStoreRecordUpdate,
  ComponentStoreRecordDel,
  ComponentStoreRecordList,
  ComponentStoreGroupAdd,
  ComponentStoreGroupUpdate,
  ComponentStoreGroupDel,
  ComponentStoreGroupList,
  ComponentStoreGroupItemAdd,
  ComponentStoreGroupItemUpdate,
  ComponentStoreGroupItemDel,
  ComponentStoreGroupItemList,
} from '@/dao/componentStoreDao';
import { DeviceTypeList } from '@/dao/deviceDao';
import { StationList } from '@/dao/stationDao';

export default {
  setup() {
    const loading = ref(false);
    const cutterList = ref<any>([]);
    const componentList = ref<any>([]);
    const componentItemList = ref<any>([]);
    const toolSelect = ref<any>([]);
    const deviceTypeList = ref<any>();
    const stationList = ref<any>([]);
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecordList = ref<any>([]);
    const componentID = ref<any>();
    const [filterText, deviceComponentStoreRecord] = useSearch(
      deviceComponentStoreRecordList,
      {
        includeProps: ['dt', 'remark', 'person'],
      },
    );
    const form1 = ref<ElForm | null>(null);
    const form2 = ref<ElForm | null>(null);

    // 新增工具包
    const addModal = ref<any>({
      visible: false,
      componentInfo: null,
      type: '',
    });
    const componentStoreForm = async (data?: any) => {
      if (form1.value) {
        (form1.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        addModal.value.type = 'update';
      } else {
        data = initcomponentStoreForm();
        addModal.value.type = 'add';
      }
      addModal.value.componentInfo = data;
      addModal.value.visible = true;
    };
    // 工具包新增确认
    async function componentStoreAlter() {
      const valid = await (form1.value as ElForm).validate();
      if (valid) {
        if (addModal.value.type === 'add') {
          await ComponentStoreGroupAdd({
            name: addModal.value.componentInfo.name,
          });
        } else if (addModal.value.type === 'update') {
          await ComponentStoreGroupUpdate({
            id: addModal.value.componentInfo.id,
            name: addModal.value.componentInfo.name,
          });
        }
        addModal.value.visible = false;
        Message.success('添加成功');
        componentList.value = await ComponentStoreGroupList({});
      }
    }

    // 删除工具包
    const removeComponentStoreGroup = async (row: any) => {
      await ComponentStoreGroupDel({
        id: row.id,
      });
      componentList.value = await ComponentStoreGroupList({});
      Message.success('删除成功');
    };

    // 删除工具包item
    const removeComponentStoreGroupItem = async (row: any) => {
      await ComponentStoreGroupItemDel({
        id: row.id,
      });
      Message.success('删除成功');
      // componentList.value = await ComponentStoreGroupList({});
      const list =  await ComponentStoreGroupList({});
      for (let i = 0; i < componentList.value.length; i++) {
          // componentList.value[i] =  list[i].itemList;
          set(componentList.value[i], 'itemList', list[i].itemList);
        }
    };

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

    // 工具包item：修改
    const addComponentStoreGroupItemModal = ref<any>({
      visible: false,
      type: '',
      componentStoreGroupItem: null,
      grpId: null,
    });
    const addComponentStoreItemGroup = async (id: number, data?: any) => {
      if (form1.value) {
        (form1.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        addComponentStoreGroupItemModal.value.type = 'update';
      } else {
        data = {};
        addComponentStoreGroupItemModal.value.type = 'add';
      }
      addComponentStoreGroupItemModal.value.componentStoreGroupItem = data;
      addComponentStoreGroupItemModal.value.grpId = id;
      addComponentStoreGroupItemModal.value.visible = true;
    };
    async function addComponentStoreGroupItemConfirm() {
      const valid = await (form1.value as ElForm).validate();
      if (valid) {
        if (addComponentStoreGroupItemModal.value.type === 'add') {
          await ComponentStoreGroupItemAdd({
            grpId: addComponentStoreGroupItemModal.value.grpId,
            componentId:
              addComponentStoreGroupItemModal.value.componentStoreGroupItem
                .component.id,
            quantity:
              addComponentStoreGroupItemModal.value.componentStoreGroupItem
                .quantity,
          });
        } else if (addComponentStoreGroupItemModal.value.type === 'update') {
          await ComponentStoreGroupItemUpdate({
            id: addComponentStoreGroupItemModal.value.componentStoreGroupItem.id,
            componentId:
              addComponentStoreGroupItemModal.value.componentStoreGroupItem
                .component.id,
            quantity:
              addComponentStoreGroupItemModal.value.componentStoreGroupItem
                .quantity,
          });
        }
        addComponentStoreGroupItemModal.value.visible = false;
        Message.success('添加成功');
        // 刷新
        const list =  await ComponentStoreGroupList({});
        for (let i = 0; i < componentList.value.length; i++) {
          // componentList.value[i] =  list[i].itemList;
          set(componentList.value[i], 'itemList', list[i].itemList);
        }
      }
    }

    onMounted(
      useLoading(loading, async () => {
        componentList.value = await ComponentStoreGroupList({});
        toolSelect.value = await ComponentStoreList({ forSelect: true });
        await queryStationList();
      }),
    );
    return {
      loading,
      form1,
      form2,
      query,
      deviceComponentStore,
      removeComponentStoreGroup: useConfirm(
        '确认删除？',
        useLoading(loading, removeComponentStoreGroup),
      ),
      addModal,
      deviceTypeList,
      componentStoreAlter: useLoading(loading, componentStoreAlter),
      filterText,
      deviceComponentStoreRecord,
      deviceComponentStoreRecordList,
      componentID,
      queryStationList,
      stationList,
      componentList,
      componentStoreForm,
      removeComponentStoreGroupItem,
      addComponentStoreGroupItemConfirm,
      initComponentStoreGroupItemForm,
      addComponentStoreGroupItemModal,
      addComponentStoreItemGroup,
      toolSelect,
    };
  },
};
function initcomponentStoreForm() {
  return {
    name: '',
    no: '',
  };
}
function initComponentStoreGroupItemForm() {
  return {
    name: '',
    no: '',
  };
}
</script>
<style scoped lang="scss">
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>
