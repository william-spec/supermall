<template>
  <div class="chartContainer" >
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, reactive, computed, watch } from '@vue/runtime-core'
import mapData from '../assets/map/china.json'
import pinyin from 'pinyin'
export default {
  setup(){
    const {proxy} = getCurrentInstance();
    let chart;
    let Alldata = reactive({
      data: [],
      legend: [],
      series: [],
      mapStorage: {}
    });
    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      proxy.$echarts.registerMap('china', mapData);
      let initOption = {
        title: {
          text: '｜ 商家分布',
          top: '3%',
          left: '3%'
        },
        geo: {
          type: 'map',
          map: 'china',
          top: '5%',
          bottom: '5%',
          itemStyle: {
            areaColor: '#2E728F',
            borderColor: '#333'
          }
        },
        legend: {
          orient: 'vertical',
          left: '5%',
          bottom: '5%'
        }
      }
      chart.setOption(initOption);
      chart.on('click', async (arg) => {
        let name = pinyin(arg.name, {style: pinyin.STYLE_NORMAL, type: 'array'}).join('');
        if(!Alldata.mapStorage[name]){
          let {data} = await proxy.$axios.get('/province/' + name + '.json');
          Alldata.mapStorage[name] = data;
          proxy.$echarts.registerMap(name, Alldata.mapStorage[name]);
        }
        let option = {
          geo: {
            map: name
          }
        }
        chart.setOption(option);
      });
      window.addEventListener('dblclick', backToChina)
      window.addEventListener('resize', throttleScreenAdapter);
    }
    const getData = async () => {
      let {data} = await proxy.$axios.get('map.json');
      Alldata.data = data;
      Alldata.legend = data.map(item => item.name);
      Alldata.series = data.map(item => {
        return {
          type: 'effectScatter',
          name: item.name,
          rippleEffect: {
            scale: 5,
            brushType: 'stroke'
          },
          data: item.children,
          coordinateSystem: 'geo'
        }
      });
    }
    const echartsUpdate = (l,s) => {
      let option = {
        legend: {
          data: l
        },
        series: s
      }
      chart.setOption(option);
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
            fontSize: adapterWidth / 100 * 3.6
          }
        },
        legend: {
          itemWidth: adapterWidth / 200 * 6,
          itemHeight: adapterWidth / 200 * 6,
          itemGap: adapterWidth / 200 * 3.6,
          textStyle: {
            fontSize: adapterWidth / 300 * 7.2
          }
        }
      }
      chart.setOption(adapterOption);
      chart.resize();
    }
    const throttleScreenAdapter = throttle(screenAdapter, 700);
    const backToChina = () => {
      let option = {
        geo: {
          map: 'china'
        }
      }
      chart.setOption(option);
    }
    let theme = computed(() => {
      return proxy.$store.state.theme
    })
    watch(theme, async () => {
      chart.dispose();
      echartsInit();   
      await getData();
      echartsUpdate(Alldata.legend, Alldata.series);
      throttleScreenAdapter();
    })
    onMounted(async () => {
      echartsInit();   
      await getData();
      echartsUpdate(Alldata.legend, Alldata.series);
      throttleScreenAdapter();
    })
    onUnmounted(() => {
      window.removeEventListener('resize', throttleScreenAdapter);
      window.removeEventListener('dblclick', backToChina);
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