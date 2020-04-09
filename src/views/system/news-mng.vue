<template>
  <div v-loading="loading">
    <div class="flex between" style="margin: 10px 0;">
      <div class="flex">
        <lkt-date-picker v-model="queryParam.timeRoom"/>
        <el-button style="margin-left: 10px" type="primary" @click="query()">查询</el-button>
        <el-button style="margin-left: 10px" type="success" @click="showForm()">添加</el-button>
      </div>
      <el-input class="search-bar" v-model="keywords" placeholder="搜索标题/内容/发布人" clearable/>
    </div>
    <lkt-table :data="filtered">
      <el-table-column label="标题" prop="title"/>
      <el-table-column label="内容" prop="content"/>
      <el-table-column label="发布时间" prop="createDt"/>
      <el-table-column label="发布人" prop="author.name"/>
      <el-table-column label="操作" align="center">
        <div class="flex center little-space" slot-scope="{ row }">
          <el-button type="primary" size="mini" @click="showForm(row)">修改</el-button>
          <el-button type="danger" size="mini" @click="remove(row)">删除</el-button>
        </div>
      </el-table-column>
    </lkt-table>
    <kit-dialog-simple
      id="news"
      :modal="modal"
      :confirm="update"
      width="600px">
      <div slot="title">{{modal.Info ? '修改' : '添加'}}信息</div>
      <el-form v-if="modal.visible" ref="form" :model="modal.Info" label-width="120px" label-position="left" class="flex column between" style="width: 480px;margin: 0 auto">
        <el-form-item label="标题：" prop="title" :rules="{ required: true, message: '请输入标题', trigger: 'blur' }">
          <el-input style="width:340px" v-model="modal.Info.title"/>
        </el-form-item>
        <el-form-item label="内容：" prop="content" :rules="{ required: true, message: '请输入内容', trigger: 'blur' }">
          <el-input style="width:340px" resize="none" type="textarea" :rows="2" v-model="modal.Info.content"/>
        </el-form-item>
      </el-form>
    </kit-dialog-simple>
  </div>
</template>
<script lang="ts">
import { ref, onMounted, computed, watch } from '@vue/composition-api';
import { useSearch, useLoading, useConfirm} from 'web-toolkit/src/service';
import { deepClone} from 'web-toolkit/src/utils';
import { Message } from 'element-ui';
import { ElForm } from 'element-ui/types/form';
import { NewsAdd, NewsUpdate, NewsDel, NewsList } from '@/dao/newsDao';
export default {
  setup() {
    const loading = ref(false);
    const list = ref<any>([]);
    const modal = ref<any>({
      visible: false,
      Info: null,
      type: 'add',
    });
    const form = ref<ElForm|null>(null);
    const queryParam = ref<any>({
      timeRoom: undefined,
      count: undefined,
    });
    const [keywords, filtered] = useSearch(list, {
      includeProps: ['title', 'content', 'author.name'],
    });
    const showForm = async (data?: any) => {
      if (form.value) { (form.value as ElForm).clearValidate(); }
      if (data) {
        data = deepClone(data);
        modal.value.type = 're';
      } else {
        data = initForm();
        modal.value.type = 'add';
      }
      modal.value.Info = data;
      modal.value.visible = true;
    };
    async function update() {
      const valid = await (form.value as ElForm).validate();
      if (valid) {
        if ( modal.value.type === 'add' ) {
          const param = {
            title: modal.value.Info.title,
            content: modal.value.Info.content,
          };
          await NewsAdd(param);
        } else if ( modal.value.type === 're' ) {
          const param = {
            id: modal.value.Info.id,
            title: modal.value.Info.title,
            content: modal.value.Info.content,
          };
          await NewsUpdate(param);
        }
        modal.value.visible = false;
        Message.success(`${modal.value.type === 're' ? '修改' : '添加'}成功`);
        await query();
      }
    }
    const query = async () => {
      list.value = await NewsList({});
      if ( queryParam.value.timeRoom ) {
        const param = {
          start: queryParam.value.timeRoom[0].getTime(),
          end: queryParam.value.timeRoom[1].getTime(),
        };
        list.value = await NewsList(param);
      }
    };
    const remove = async (row: any) => {
      await NewsDel({id: row.id});
      await query();
      Message.success('删除成功');
    };
    onMounted(useLoading(loading, async () => {
      await query();
    }));
    return {
      loading, list, form, queryParam, query,
      showForm, keywords, filtered,
      modal,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      update: useLoading(loading, update),
    };
  },
};
function initForm() {
  return {
    title: undefined,
    content: undefined,
    extend: {},
  };
}
</script>

