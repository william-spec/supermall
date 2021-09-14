<template>
  <div class="chartContainer">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import { computed, getCurrentInstance, onMounted, onUnmounted, watch } from '@vue/runtime-core'

export default {
  setup(){
    const {proxy} = getCurrentInstance();
    let chart, timer = '', chartPage = 0, pageNum = 5;
    let category = [], value = [];
    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      let initOption = {
        title: {
          text: '| 商家销售情况',
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 10
        },
        grid: {
          left: '3%',
          top: '20%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
        },
        yAxis: {
          type: 'category',
        },
        tooltip: {
          showContent: false,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
            lineStyle: {
              type: 'solid',
              width: 66,
              color: '#2D3443'
            }
          }
        },
        series: [
          {
            type: 'bar',
            barWidth: 66,
            label: {
              show: true,
              position: 'right',
              color: 'white'
            },
            itemStyle: {
              barBorderRadius: [0, 33, 33, 0],
              color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: '#5052EE'
                },
                {
                  offset: 1,
                  color: '#AB6EE5'
                }
              ])
            }
          }
        ]
      }
      chart.setOption(initOption);
      chart.on('mouseover', () => {
        clearInterval(timer);
      })
      chart.on('mouseout', () => {
        setTimer();
      })
      window.addEventListener('resize', throttleScreenAdapter);
    }
    const getData = async () => {
      let {data} = await proxy.$axios.get('seller.json');
      category = data.map(obj => obj.name);
      value = data.map(obj => obj.value);
    }
    const echartsUpdate = (c,v) => {
      let option = {
        yAxis: {
          data: c
        },
        series: [
          {
            data: v,
          }
        ]
      }
      chart.setOption(option);
    }
    const setTimer = () => {
      timer = setInterval(() => {
        if((chartPage+1) * pageNum >= category.length) chartPage = 0;
        else chartPage++;
        echartsUpdate(category.slice(chartPage*pageNum, chartPage*pageNum+pageNum), value.slice(chartPage*pageNum, chartPage*pageNum+pageNum))
      }, 3000)
    }
    const throttle = (func, sleep) => {
        let timer = '';
        return () => {
            if(!timer){
                timer = setTimeout(() => {
                    func();
                    timer = '';
                }, sleep);
            }
        }
    }
    const screenAdapter = () => {
      let adapterWidth = proxy.$refs.chart.offsetWidth;
      let adapterHeight = proxy.$refs.chart.offsetHeight;
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: adapterWidth / 100 * 4
          },
        },
        tooltip: {
          axisPointer: {
            lineStyle: {
              width: adapterHeight * 66 / 779,
            }
          }
        },
        series: [
          {
            barWidth: adapterHeight * 66 / 779,
            itemStyle: {
              barBorderRadius: [0, adapterHeight * 66 / 779 / 2, adapterHeight * 66 / 779 / 2, 0],
            }
          }
        ]
      }
      chart.setOption(adapterOption);
      chart.resize();
    }
    const throttleScreenAdapter = throttle(screenAdapter, 700);
    let theme = computed(() => {
      return proxy.$store.state.theme
    })
    watch(theme, async () => {
      chart.dispose();
      echartsInit();
      await getData();
      echartsUpdate(category.slice(chartPage, chartPage+pageNum), value.slice(chartPage, chartPage+pageNum));
      throttleScreenAdapter();
    })
    onMounted(async () => {
      echartsInit();
      await getData();
      echartsUpdate(category.slice(chartPage, chartPage+pageNum), value.slice(chartPage, chartPage+pageNum));
      throttleScreenAdapter();
      setTimer();
    })
    onUnmounted(() => {
      clearInterval(timer);
      window.removeEventListener('resize', throttleScreenAdapter);
    })
    return {
      screenAdapter
    }
  }
}
</script>

<style>
.chartContainer{
  width: 100%;
  height: 100%;
}
.chart{
  width: 100%;
  height: 100%;
}
</style>