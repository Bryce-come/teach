<template>
  <div v-loading="loading" class="cutting-tool-management">
    <div style="margin-bottom:10px">
      <el-button type="primary" @click="componentStoreForm()">增加工具包信息</el-button>
    </div>
    <lkt-table :data="componentList" style="width:100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-button @click="addComponentStoreItemGroup(props.row)">增加刀具信息</el-button>
          <el-table :data="props.row.itemList" style="width:100%">
            <el-table-column>
              <div slot-scope="{row}">
                <span>刀具ID:{{row.id}}刀具数量:{{row.quantity}}</span>
                <el-button
                  type="text"
                  @click="updateComponentStoreItemGroup(row)"
                  style="margin-left:525px"
                >修改</el-button>
                <el-button
                  type="danger"
                  @click="removeComponentStoreGroupItem(row)"
                  size="mini"
                  style="float:right"
                >删除</el-button>
              </div>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="工具包名称" />
      <el-table-column prop="id" label="工具包ID" />
      <el-table-column label="操作" width="280px">
        <div class="flex center little-space" slot-scope="{row}">
          <el-button type="text" @click="updateComponentStoreGroup(row)">修改</el-button>
          <el-button
            type="danger"
            size="mini"
            style="margin-left:5px"
            @click="removeComponentStoreGroup(row)"
          >删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>

    <!-- 增加工具包 -->
    <kit-dialog-simple
      id="device-component"
      :modal="addModal"
      :confirm="componentStoreAlter"
      width="500px"
    >
      <div slot="title">工具包信息登记</div>
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

    <!-- 增加工具包item -->
    <kit-dialog-simple
      id="device-component"
      :modal="addComponentStoreGroupItemModal"
      :confirm="addComponentStoreGroupItemConfirm"
      width="500px"
    >
      <div slot="title">增加工具包</div>
      <el-form
        v-if="addComponentStoreGroupItemModal.componentStoreGroupItem"
        ref="form1"
        :model="addComponentStoreGroupItemModal.componentStoreGroupItem"
        label-width="140px"
        label-position="left"
        style="width: 357px;margin: 0 auto"
      >
        <el-form-item label="刀具名称：" prop="name" :rules="{ required: true, message: '请输入刀具名称'}">
          <el-input v-model="addComponentStoreGroupItemModal.componentStoreGroupItem.name"></el-input>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>

    <!-- 更新工具包信息  -->
    <kit-dialog-simple
      id="updateComponentStoreGroup"
      :modal="updateComponentStoreGroupModal"
      :confirm="updateComponentStoreGroupConfirm"
      width="550px"
    >
      <div slot="title">工具包信息</div>
      <el-form
        ref="form"
        :model="updateComponentStoreGroupModal.componentStoreGroup"
        label-width="120px"
        label-position="left"
        style="margin: 0 10px"
      >
        <el-form-item label="工具包名称：" prop="name">
          <el-input v-model="updateComponentStoreGroupModal.componentStoreGroup.name" />
        </el-form-item>
        <el-form-item label="工具包ID：" prop="id">
          <el-input v-model="updateComponentStoreGroupModal.componentStoreGroup.id" />
        </el-form-item>
      </el-form>
    </kit-dialog-simple>

    <!-- 更新工具包item信息  -->
    <kit-dialog-simple
      id="updateComponentStoreItemGroup"
      :modal="updateComponentStoreGroupItemModal"
      :confirm="updateComponentStoreGroupItemConfirm"
      width="550px"
    >
      <div slot="title">工具包信息</div>
      <el-form
        ref="form"
        :model="updateComponentStoreGroupItemModal.componentStoreGroupItem"
        label-width="120px"
        label-position="left"
        style="margin: 0 10px"
      >
        <el-form-item label="ID：" prop="id">
          <el-input v-model="updateComponentStoreGroupItemModal.componentStoreGroupItem.id" />
        </el-form-item>
        <el-form-item label="数量：" prop="quantity">
          <el-input v-model="updateComponentStoreGroupItemModal.componentStoreGroupItem.quantity" />
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from "@vue/composition-api";
import { Message } from "element-ui";
import { useConfirm, useLoading, useSearch } from "web-toolkit/src/service";
import { ElForm } from "element-ui/types/form";
import { isUndefined, deepClone } from "web-toolkit/src/utils";
import {
  ComponentStoreAdd,
  ComponentStoreUpdate,
  ComponentStoreDel,
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
  ComponentStoreGroupItemList
} from "@/dao/componentStoreDao";
import { DeviceTypeList } from "@/dao/deviceDao";
import { StationList } from "@/dao/stationDao";

export default {
  setup() {
    const loading = ref(false);
    const cutterList = ref<any>([]);
    const componentList = ref<any>([]);
    const componentItemList = ref<any>([]);
    //  const ComponentStoreGroupItemNameList = ref<any>([]);
    const deviceTypeList = ref<any>();
    const stationList = ref<any>([]);
    const deviceComponentStore = ref<any>();
    const deviceComponentStoreRecordList = ref<any>([]);
    const componentID = ref<any>();
    const [filterText, deviceComponentStoreRecord] = useSearch(
      deviceComponentStoreRecordList,
      {
        includeProps: ["dt", "remark", "person"]
      }
    );

    const form1 = ref<ElForm | null>(null);
    const form2 = ref<ElForm | null>(null);

    //新增工具包
    const addModal = ref<any>({
      visible: false,
      componentInfo: null,
      type: "add"
    });
    const componentStoreForm = async (data?: any) => {
      if (form1.value) {
        (form1.value as ElForm).clearValidate();
      }
      if (data) {
        data = deepClone(data);
        addModal.value.type = "update";
      } else {
        data = initcomponentStoreForm();
        addModal.value.type = "add";
      }
      addModal.value.componentInfo = data;
      addModal.value.visible = true;
    };
    //工具包新增确认
    async function componentStoreAlter() {
      const valid = await (form1.value as ElForm).validate();
      if (valid) {
        if (addModal.value.type === "add") {
          await ComponentStoreGroupAdd({
            name: addModal.value.componentInfo.name
          });
        }
        addModal.value.visible = false;
        Message.success("添加成功");
        componentList.value = await ComponentStoreGroupList({});
      }
    }

    //删除工具包
    const removeComponentStoreGroup = async (row: any) => {
      await ComponentStoreGroupDel({
        id: row.id
      });
      componentList.value = await ComponentStoreGroupList({});
      Message.success("删除成功");
    };

    //删除工具包item
    const removeComponentStoreGroupItem = async (row: any) => {
      await ComponentStoreGroupItemDel({
        id: row.id
      });
      componentItemList.value = await ComponentStoreGroupItemList({});
      Message.success("删除成功");
    };

    const query = async (data: any) => {
      deviceComponentStoreRecordList.value = await ComponentStoreRecordList({
        componentId: data.id
      });
    };
    const queryStationList = async () => {
      stationList.value = await StationList({
        simple: false
      });
    };

    //更新工具包信息
    const updateComponentStoreGroupModal = ref<any>({
      visible: false,
      componentStoreGroup: {
        id: "",
        name: "",
        type: "",
        storeNumber: "",
        discardNumber: ""
      }
    });
    const updateComponentStoreGroup = async (row: any) => {
      updateComponentStoreGroupModal.value.componentStoreGroup.id = row.id;
      updateComponentStoreGroupModal.value.componentStoreGroup.name = row.name;
      updateComponentStoreGroupModal.value.visible = true;
      console.log(row);
      console.log(row.id);
    };
    const updateComponentStoreGroupConfirm = async () => {
      await ComponentStoreGroupUpdate({
        id: updateComponentStoreGroupModal.value.componentStoreGroup.id,
        name: updateComponentStoreGroupModal.value.componentStoreGroup.name
      });
    };

    // //工具包item：修改
    const updateComponentStoreGroupItemModal = ref<any>({
      visible: false,
      componentStoreGroupItem: {
        id: "",
        type: "",
        quantity: ""
      }
    });
    
    const updateComponentStoreItemGroup = async (row: any) => {
      updateComponentStoreGroupItemModal.value.componentStoreGroupItem.grpId =
        row.id;
       updateComponentStoreGroupItemModal.value.componentStoreGroupItem.componentId= row.componentId;
      updateComponentStoreGroupItemModal.value.componentStoreGroupItem.quantity =
        row.quantity;
      updateComponentStoreGroupItemModal.value.visible = true;
    };
    const updateComponentStoreGroupItemConfirm = async () => {
      await ComponentStoreGroupItemUpdate({
        id: updateComponentStoreGroupItemModal.value.componentStoreGroupItem.id
      });
    };
     // //工具包item：新增
    const addComponentStoreGroupItemModal = ref<any>({
      visible: false,
      componentStoreGroupItem: {
        grpId: "",
        type: "add",
        componentId:"",
        quantity: ""
      }
    });
    const addComponentStoreItemGroup = async (row: any) => {
      updateComponentStoreGroupItemModal.value.componentStoreGroupItem.grpId =
        row.id;
       updateComponentStoreGroupItemModal.value.componentStoreGroupItem.componentId= row.componentId;
      updateComponentStoreGroupItemModal.value.componentStoreGroupItem.quantity =
        row.quantity;
         updateComponentStoreGroupItemModal.value.componentStoreGroupItem.componentId =
        row.componentId;
      updateComponentStoreGroupItemModal.value.visible = true;
    };
    const addComponentStoreGroupItemConfirm = async (row: any) => {
      await ComponentStoreGroupItemAdd({
        grpId: addComponentStoreGroupItemModal.value.componentStoreGroupItem.grpId,
        componentId: addComponentStoreGroupItemModal.value.componentStoreGroupItem.componentId,
        quantity: addComponentStoreGroupItemModal.value.componentStoreGroupItem.quantity
      });
        addComponentStoreGroupItemModal.value.visible = true;
    };
    onMounted(
      useLoading(loading, async () => {
        componentList.value = await ComponentStoreGroupList({});
        await queryStationList();
      })
    );
    return {
      loading,
      form1,
      form2,
      query,
      deviceComponentStore,
      removeComponentStoreGroup: useConfirm(
        "确认删除？",
        useLoading(loading, removeComponentStoreGroup)
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
      updateComponentStoreGroupModal,
      updateComponentStoreGroup,
      updateComponentStoreGroupConfirm,
      removeComponentStoreGroupItem,
      updateComponentStoreGroupItemModal,
      updateComponentStoreItemGroup,
      updateComponentStoreGroupItemConfirm,
      addComponentStoreGroupItemModal,
      addComponentStoreGroupItemConfirm,
      addComponentStoreItemGroup
    };
  }
};

function initcomponentStoreForm() {
  return {
    name: "",
    no: ""
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
