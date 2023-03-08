<script setup>
import { onMounted } from 'vue';
import * as echarts from "echarts"
import { http } from "@/utils"

http({
    method: 'get',
    url: 'console/index/echarts',
    params: {}
}).then((res) => {
    console.log(res)
})

onMounted(() => {
    var dayChart = echarts.init(document.getElementById('day'))
    dayChart.setOption({
        title: {
            text: '今日接口概览'
        },
        tooltip: {},
        xAxis: {
            data: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        },
        yAxis: {},
        series: [
            {
                name: '接口量',
                type: 'line',
                data: [11,11,22,33,22,11,22,11,21,22,11,22,11,22,22,22,33,33,33,33,33,33,22,22]
            }
        ]
    });

    var monthChart = echarts.init(document.getElementById('month'))
    monthChart.setOption({
        title: {
            text: '接口概览'
        },
        tooltip: {},
        xAxis: {
            data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
        },
        yAxis: {},
        series: [
            {
                name: '接口量',
                type: 'line',
                data: [11,22,33,11,22,33,11,22,33,11,22,33]
            }
        ]
    });
})
</script>

<template>
    <div class="console-list">
        <el-card class="box-card">
            <div id="day" style="height: 250px;"></div>
        </el-card>
        <el-card class="box-card box-card-list">
            <div id="month" style="height: 250px;"></div>
        </el-card>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.box-card-list{
    margin-top: 20px;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.box-card {
  width: 100%;
}
</style>