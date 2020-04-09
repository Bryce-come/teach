<template>
  <div class="flex" v-loading="loading">
      <div>
				<el-progress type="dashboard" :percentage="percentage" color="#26b229"></el-progress>
				<div>
				</div>
			</div>
			<div>
				<el-progress type="dashboard" :percentage="percentage" color="#ff4949"></el-progress>
				<div>
				</div>
			</div>
			<div>
				<el-progress type="dashboard" :percentage="percentage" color="#3d3d3d"></el-progress>
				<div>
				</div>
			</div>
			<div>
				<el-progress type="dashboard" :percentage="percentage" color="#d7d400"></el-progress>
				<div>
				</div>
			</div>
  </div>
</template>

<script lang="ts">
import { onMounted } from '@vue/composition-api';
import { ref, createComponent, Ref} from '@vue/composition-api';
import { postService, mesPostUntilSuccess } from 'web-toolkit/src/case-main';
import { urlMap } from '@/config';
import { useLoading } from 'web-toolkit/src/service';
import { statusMap } from '@/utils/device-utils';

export default {
  name: 'stateCount',
  setup() {
		const loading = ref(false);
		const state = ref<any>({
			workingNum: undefined,
			emergencyNum: undefined,
			offlineNum:undefined,
			closeNum:undefined,
		})
		onMounted(useLoading(loading, async () => {
      await Promise.all([
        stationList.value = await MonitorStationList(),
      ]);
			console.log(stationList)
		}))
    return{
			state, loading,
    };
  },
};
</script>


<style scoped lang="scss">
</style>
