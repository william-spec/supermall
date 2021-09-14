<template>
  <div class="chartContainer">
    <div class="titleContainer">
      <div class="selectedTitle"><span :style="Alldata.selectedTypeStyle">{{'｜ ' + Alldata.selectedType.text}}</span><span class="iconfont title-icon" @click="select() " :style="Alldata.selectedTypeStyle">&#xe6eb;</span></div>
      <div class="title" :style="Alldata.otherTypeStyle" v-show="Alldata.isSelect" v-for="item in Alldata.otherType" :key="item.key" @click="selectTitle(item)">{{item.text}}</div>
    </div>
    <div class="chart" ref="chart"></div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, reactive, computed, watch} from '@vue/runtime-core'

export default {
  setup(){
    const {proxy} = getCurrentInstance();
    let chart;
    let Alldata = reactive({ 
      isSelect: false,   //是否点击了下拉按钮
      allType: [],   //所有标题
      data: [],   //保存所有数据
      category: [],  //类目轴
      legend: [],  //图例
      selectedType: {},   //当前标题
      selectedTypeStyle: {},    //当前标题风格
      selectedTypeValue: [],    //选中标题对应的数据
      otherType: [],   //所有标题中除了当前标题剩下的标题
      otherTypeStyle: {},   //剩余标题风格
      colorArr1: ['rgba(11, 168, 44, 0.5)', 'rgba(44, 110, 255, 0.5)', 'rgba(22, 242, 217, 0.5)', 'rgba(254, 33, 30, 0.5)', 'rgba(250, 105, 0, 0.5)'],   //折线和x轴围成区域的颜色渐变
      colorArr2: ['rgba(11, 168, 44, 0)', 'rgba(44, 110, 255, 0)', 'rgba(22, 242, 217, 0)', 'rgba(254, 33, 30, 0)', 'rgba(250, 105, 0, 0)']    //折线和x轴围成区域的颜色渐变
    });

    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      let initOption = {
        grid: {
          left: '3%',
          top: '35%',
          right: '4%',
          bottom: '1%',
          containLabel: true
        },
        legend: {
          left: 20,
          top: '15%',
          icon: 'circle'
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
        },
        tooltip: {
          showContent: true,
          trigger: 'axis',
          axisPointer: {
            type: 'line',
            z: 0,
          }
        }
      }
      chart.setOption(initOption);
      window.addEventListener('resize', throttleScreenAdapter);
    }
    const getData = async () => {
      let {data} = await proxy.$axios.get('trend.json');
      Alldata.data = data;
      Alldata.category = data.common.month;
      Alldata.allType = data.type;
      Alldata.selectedType = data.type[0];
      Alldata.selectedTypeValue = data[Alldata.selectedType.key].data.map((item, index) => {
        return {
          name: item.name,
          type: 'line',
          data: item.data,
          stack: 'map',
          areaStyle: {
            color: new proxy.$echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: Alldata.colorArr1[index]
                },
                {
                  offset: 1,
                  color: Alldata.colorArr2[index]
                }
              ])
          }
        }
      });
      Alldata.legend = data[Alldata.selectedType.key].data.map(item => item.name);
      Alldata.otherType = data.type.filter(item => item.text !== Alldata.selectedType.text);
    }
    const echartsUpdate = (c,v) => {
      let option = {
        yAxis: {
          data: c
        },
        series: v,
        legend: {
          data: Alldata.legend
        }
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
      Alldata.selectedTypeStyle = computed(() => {
        return {
          fontSize: adapterWidth / 100 * 5 + 'px',
          color: themeStyle.value.titleColor  //皮肤切换时更换字体颜色
        }
      })
      Alldata.otherTypeStyle = computed(() => {
        return {
          fontSize: adapterWidth / 300 * 11 + 'px',
          position: 'relative',
          left: adapterWidth / 100 * 4.7 + 'px',
          color: themeStyle.value.titleColor,
          backgroundColor: themeStyle.value.backgroundColor,
          opacity: '0.8',
          cursor: 'pointer',
          width: '60%'
        }
      })
      let adapterOption = {
        legend: {
          itemWidth: adapterWidth / 300 * 15,
          itemHeight: adapterWidth / 300 * 15,
          itemGap: adapterWidth / 300 * 15,
          textStyle:{
            fontSize: adapterWidth / 600 * 20
          }
        }
      }
      chart.setOption(adapterOption);
      chart.resize();
    }
    const throttleScreenAdapter = throttle(screenAdapter, 700);
    let theme = computed(() => {
      return proxy.$store.state.theme
    })
    let themeStyle = computed(() => {
      return proxy.$store.state[theme.value]
    })
    watch(theme, async () => {
      chart.dispose();
      echartsInit();
      await getData();
      echartsUpdate(Alldata.category, Alldata.selectedTypeValue);
      throttleScreenAdapter();
    })
    onMounted(async () => {
      echartsInit();
      await getData();
      echartsUpdate(Alldata.category, Alldata.selectedTypeValue);
      throttleScreenAdapter();
    })
    onUnmounted(() => {
      window.removeEventListener('resize', throttleScreenAdapter);
    })
    const select = () => {    //是否点击下拉框
      Alldata.isSelect = !Alldata.isSelect;
    }
    const selectTitle = (item) => {    //点击了其他标题
      Alldata.selectedType = item;
      Alldata.isSelect = !Alldata.isSelect;
      Alldata.data[item.key].data.forEach((i, index) => {
        Alldata.selectedTypeValue[index].data = i.data;
        Alldata.selectedTypeValue[index].name = i.name;
      });
      Alldata.otherType = Alldata.allType.filter(i => i.text !== item.text);
      Alldata.legend = Alldata.data[item.key].data.map(i => i.name);
      echartsUpdate(Alldata.category, Alldata.selectedTypeValue);
    }
    return {
      select,
      selectTitle,
      Alldata,
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
.titleContainer{
  position: absolute;
  left: 25px;
  top: 18px;
  color: white;
  z-index: 999;
}
.iconfont.title-icon{
  cursor: pointer;
}
</style>