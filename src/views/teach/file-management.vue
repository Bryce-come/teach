<template>
  <div v-loading="loading" class="report-template-management">
    <div v-if="!courseRecordInClass" style="color: grey;text-align: center">暂无上课信息</div>
    <div v-else>
        <div style="margin: 10px 0" class="block_background">
            <div class="block_title flex between">上课班级信息</div>
            <el-form :inline="true" >
                <el-form-item label="上课时间:" label-width="100px" v-if='courseRecordInClass'>
                    <span>{{courseRecordInClass.startDt+' — '+courseRecordInClass.endDt}}</span>
                </el-form-item>
                <el-form-item label="上课班级:" label-width="100px" v-if='courseRecordInClass.clasz' >
                    <span>{{courseRecordInClass.clasz.name}}</span>
                </el-form-item>
                <el-form-item label="教学分组:" label-width="100px" v-if='courseRecordInClass.claszGroup'>
                    <span>{{courseRecordInClass.claszGroup.name}}</span>
                </el-form-item>
                <el-form-item label="人数:" label-width="100px">
                    <span v-if="courseRecordInClass.studentList">{{courseRecordInClass.studentList.length}}人</span>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin: 10px 0" class="block_background">
            <div style="margin:10px 10px;display:flex;justify-content:space-between;flex-wrap:wrap">
            <el-upload
                action=""
                :http-request="(option)=>upload(option)"
                :show-file-list="false">
                <el-button type="primary" icon="el-icon-upload2">上传临时文件</el-button>
            </el-upload>
            <el-input v-model="keywords" placeholder="输入文件名称搜索" style="width:400px"/>
            </div>
            <lkt-table
            :data="filtered"
            style="width:100%">
            <el-table-column label="文件名" prop="name"/>
            <el-table-column label="大小" prop="size"/>
            <el-table-column label="上传时间" prop="time">
                <div slot-scope="{row}">
                   {{new Date(row.time) | datetime}}
                </div>
            </el-table-column>
            <el-table-column label="操作" width="120px" align="center">
                <div slot-scope="{row}">
                <el-button type="text" @click="downFile(row)">下载</el-button>
                <el-button type="danger" size="mini" style="margin-left:10px" @click="remove(row)">删除</el-button>
                </div>
            </el-table-column>
            </lkt-table>
        </div>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted } from '@vue/composition-api';
import {ElForm} from 'element-ui/types/form';
import { useLoading, useConfirm, useSearch } from 'web-toolkit/src/service';
import { Message } from 'element-ui';
import {isUndefined, deepClone} from 'web-toolkit/src/utils';
import {ReportTemplateList, ReportTemplateAdd, ReportTemplateDel} from '@/dao/reportDao';
import {DownLoadPrivate} from '@/dao/commonDao';
import { CourseRecordInClass } from '@/dao/courseRecordDao';
import { TempFileAdd, TempFileDel, TempFileList } from '@/dao/inClassDao';
export default {
  setup() {
    const loading = ref(false);
    const fileList = ref<any>();
    const [keywords, filtered] = useSearch(fileList, {
      includeProps: ['name'],
    });
    const courseRecordInClass = ref<any>();
    const queryCourseInClass = async () => {
        courseRecordInClass.value = await CourseRecordInClass();
    };
    const remove = async (row: any) => {
      await TempFileDel({
        path: row.path,
      });
      Message.success('删除成功');
      await query();
    };
    async function upload(option: any) {
      await TempFileAdd({
        file: option.file,
      });
      await query();
    }
    async function downFile(row: any) {
      await DownLoadPrivate(row.path, row.name);
    }
    const query = async () => {
      fileList.value = await TempFileList();
    };
    onMounted(useLoading(loading, async () => {
      await query();
      await queryCourseInClass();
    }));
    return{
      loading, query, fileList, keywords, filtered,
      remove: useConfirm('确认删除？', useLoading(loading, remove)),
      upload: useLoading(loading, upload), downFile,
      queryCourseInClass, courseRecordInClass,
    };
  },
};
</script>
<style scoped lang="scss">

</style>
