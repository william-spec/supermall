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
    let chart;
    let value = [], Alldata = [], curIndex = 0, pageNum = 5, timer, 
    adapterFontSize = 25, innerRadius = 100, outterRadius = 110;
    const centerArr = [
        ['18%', '40%'],
        ['50%', '40%'],
        ['82%', '40%'],
        ['34%', '75%'],
        ['66%', '75%']
      ]
    const colorArr = [
      ['#4FF778', '#0BA82C'],
      ['#E5DD45', '#E8B11C'],
      ['#E8821C', '#E55445'],
      ['#5052EE', '#AB6EE5'],
      ['#23E5E5', '#2E72BF']
    ]
    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      let initOption = {
        title: {
          text: '| 库存和销量分析',
          textStyle: {
            fontSize: 66,
          },
          left: 20,
          top: 15
        },
        tooltip: {
          show: true,
          formatter: (arg) => {
            if(arg.name)  return '库存: ' + arg.value ;
            else return '销量: ' + arg.value
          }
        },
      }
      chart.on('mouseover', () => {
        clearInterval(timer);
      })
      chart.on('mouseout', () => {
        setTimer();
      })
      chart.setOption(initOption);
      window.addEventListener('resize', throttleScreenAdapter);
    }
    const getData = async () => {
      let {data} = await proxy.$axios.get('stock.json');
      Alldata = data;
    }
    const echartsUpdate = (v) => {
      value = v.map((obj, index) => {
        return {
          type: 'pie',
          radius: [outterRadius, innerRadius],
          center: centerArr[index],
          labelLine: false,
          label: {  //饼图的提示文字
            normal: {
              position: 'center',
              textStyle: {
                fontSize: adapterFontSize / 1.8,  //务必保持和screenAdapter中的设置一致，否则切换时字体大小会出现变化
                fontWeight: 'bold',
                color: colorArr[index][0]
              }
            }
          },
          data: [
            {
              value: obj.sales,
              itemStyle: {
                color: '#333843'
              },
            },
            {
              name: obj.name + '\n' + obj.stock,    //写在此处才会自动显示（原因尚不清楚）
              value: obj.stock,
              itemStyle: {
                color: new proxy.$echarts.graphic.LinearGradient(0, 0, 1, 0, [
                {
                  offset: 0,
                  color: colorArr[index][0]
                },
                {
                  offset: 1,
                  color: colorArr[index][1]
                }
              ])
              }
            }
          ]
        }
      });
      let option = {
        series: value
      }
      chart.setOption(option);
    }
    const setTimer = () => {
      timer = setInterval(() => {
      if(curIndex * pageNum + pageNum >= Alldata.length)curIndex=0;
      else curIndex++;
      echartsUpdate(Alldata.slice(curIndex * pageNum, curIndex * pageNum + pageNum));
      }, 5000)
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
      adapterFontSize = adapterWidth / 100 * 5;
      innerRadius = adapterFontSize * 2;
      outterRadius = innerRadius * 1.125;
      let adapterArr = [];
      for(let i = 0; i<pageNum; i++)
        adapterArr.push(
          {
            type: 'pie',
            radius: [outterRadius, innerRadius],
            label: {
              textStyle: {
                fontSize: adapterFontSize / 1.8
              }
            }
          }
        )
      let adapterOption = {
        title: {
          textStyle: {
            fontSize: adapterFontSize
          }
        },
        series: adapterArr
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
      echartsUpdate(Alldata.slice(curIndex * pageNum, curIndex * pageNum + pageNum));
      throttleScreenAdapter();
    })
    onMounted(async () => {
      echartsInit();
      await getData();
      echartsUpdate(Alldata.slice(curIndex * pageNum, curIndex * pageNum + pageNum));
      setTimer();
      throttleScreenAdapter();
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