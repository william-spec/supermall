<template>
  <div class="chartContainer">
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, computed, watch } from '@vue/runtime-core'

export default {
  setup(){
    const {proxy} = getCurrentInstance();
    let chart, timer = '', chartPage = 0, pageNum = 10;
    let category = [], value = [];
    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      let initOption = {
        title: {
          text: '| 商家销量排行',
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 5
        },
        grid: {
          left: '3%',
          top: '20%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          show: true,
        },
        series: [
          {
            type: 'bar',
            barWidth: 66,
            itemStyle: {
              barBorderRadius: [66 / 2, 66 / 2, 0, 0],
            },
            label: {
              show: true,
              position: 'top',
              color: 'white'
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
      let {data} = await proxy.$axios.get('rank.json');
      data.sort((a,b) => b.value - a.value);
      category = data.map(obj => obj.name);
      value = data.map(obj => obj.value);
    }
    const echartsUpdate = (c,v) => {
      let option = {
        xAxis: {
          data: c
        },
        series: [
          {
            data: v,
            itemStyle: {
              color: arg => {
                let colorArr;
                if(arg.value > 200)
                  colorArr = ['blue', 'red'];
                else if(arg.value > 130)
                  colorArr = ['green', 'blue'];
                else colorArr = ['yellow','green']
                return new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: colorArr[0]
                  },
                  {
                    offset: 1,
                    color: colorArr[1]
                  }
                ])
              }
            }
          }
        ]
      }
      chart.setOption(option);
    }
    const setTimer = () => {
      timer = setInterval(() => {
        if(chartPage + pageNum >= category.length) chartPage = 0;
        else chartPage++;
        echartsUpdate(category.slice(chartPage, chartPage+pageNum), value.slice(chartPage, chartPage+pageNum))
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
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: adapterWidth / 100 * 3
          }
        },
        series: [
          {
            barWidth: adapterWidth * 66 / 1314,
            itemStyle: {
              barBorderRadius: [adapterWidth * 66 / 1314 / 2, adapterWidth * 66 / 1314 / 2, 0, 0],
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