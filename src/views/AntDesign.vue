<template>
<div class=''>

    <ul>
        <!-- <li v-for="(item,index) in data" :key="index">age:{{item.age}}=====name:{{item.name}}</li> -->
    </ul>
<a-button type="primary" @click="selectAllUser()">btn</a-button>
 <a-button type="primary" @click="info">Display normal message</a-button>
  <div>
    <a-date-picker @change="onChange" />
    <br />
    <a-month-picker @change="onChange" placeholder="Select month" />
    <br />
    <a-range-picker @change="onChange" />
    <br />
    <a-week-picker @change="onChange" placeholder="Select week" />
  </div>
   <a-input placeholder="Basic usage"/>
</div>
</template>
<script>
import { Button,DatePicker,Input,message } from 'ant-design-vue';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
export default {
components: {
    [Button.name]: Button,
    [DatePicker.name]: DatePicker,
    [MonthPicker.name]: MonthPicker,
    [RangePicker.name]: RangePicker,
    [WeekPicker.name]: WeekPicker,
    [Input.name]: Input,
    [message.name]: message,
},
data() {
return {
    data:[
        {
            name:'aa',
            age:20
        },
          {
            name:'bb',
            age:29
        },


    ]
};
},
computed: {},
watch: {},
methods: {
   async selectAllUser(){
        try {
          const res = await this.post({
            url: this.Api.AllUser,
            data: {
              upageSize: 10,
              pageNumber: 1
            }
          })
           message.success(res.msg)
        } catch (error) {
          message(error.msg)
        }
    },
     onChange(date, dateString) {
      console.log(date, dateString);
    },
    push(name,age){
        this.data.push({
            name:name,
            age:age
        })
    },
    info () {
        message.error('This is a normal message');
      },
},
created() {

},
mounted() {

},
beforeCreate() {},
beforeMount() {},
beforeUpdate() {},
updated() {},
beforeDestroy() {},
destroyed() {},
activated() {},
}
</script>
<style lang='scss' scoped>

</style>

