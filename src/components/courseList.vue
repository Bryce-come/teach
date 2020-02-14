<template>
  <div class="flex algin-center">
    <div class="class-table">
      <table>
        <thead>
          <tr>
            <th>时间</th>
            <th v-for="(weekNum, weekIndex) in weeks.length"
                 :key="weekIndex"
            >
            {{'周' + digital2Chinese(weekIndex, 'week')}}
            </th>
          </tr>
        </thead>
        <tbody>
           <tr v-for="(weekNum, weekIndex) in weeks.length" :key="weekIndex">
             <th>
               <div>第<span>{{weekIndex+1}}</span>节课</div>
             </th>
             <td v-for="i in 7" :key="i" >
               {{i}}
             </td>
           </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { ref, Ref, onMounted, createComponent} from '@vue/composition-api';
export default createComponent({
  name: 'courseList',
  props:{ },
  // props 父组件传过来的东西  ctx 相当于子组件的this（cts.$emit()）
  setup(props: any, ctx: any) {
    const weeks = ref(['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
    function digital2Chinese(num: any, identifier: any) {
      const character = ['零', '一', '二', '三', '四', '五', '六', '七'];
      return identifier === 'week' && (num === 0 || num === 7) ? '日' : character[num];
    } 
    return{
      weeks,
      digital2Chinese,
    };
  },
});
</script>
<style scoped lang="scss">
  .class-table {
    margin: 7px;
    table {
      background-color: rgb(32, 38, 97);
      margin: auto;
      table-layout:fixed;
      width: 80%;
      thead {
        background-color:#67a1ff  ;
        th {
          color: #fff;
          line-height: 2rem;
          font-weight: normal;
        }
      }
    }
    tbody{
      tr {
        th {
          color: #fff;
          background-color:#67a1ff ;
          line-height: 2rem;
          font-weight:lighter;
          text-align: center;
          vertical-align:middle;
        }
        td {
          background-color:white ;
          line-height: 2rem;
          font-weight:lighter;
          text-align: center;
          vertical-align:middle;
        }
      }
    }
  }
</style>