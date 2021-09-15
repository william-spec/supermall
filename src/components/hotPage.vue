<template>
  <div class="chartContainer">
    <div class="chart" ref="chart"></div>
    <span class="iconfont title-icon left" @click="toLeft" :style="myStyle.arrStyle"> &#xe6ef; </span>
    <span class="iconfont title-icon right" @click="toRight" :style="myStyle.arrStyle"> &#xe6ed; </span>
    <span class="hotPageTitle" :style="myStyle.spanStyle">{{myStyle.title}}</span>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onUnmounted, reactive, computed, watch } from '@vue/runtime-core'

export default {
  setup(){
    const {proxy} = getCurrentInstance();
    let chart;
    let value = [], legend = [], Alldata = [], curIndex = 0, myStyle = reactive({
      title: '',
      //控制箭头和右下角文字大小
      arrStyle: {},
      spanStyle: {}
    });
    const echartsInit = () => {
      chart = proxy.$echarts.init(proxy.$refs.chart, theme.value);
      let initOption = {
        title: {
          text: '| 热销商品占比',
          textStyle: {
            fontSize: 66
          },
          left: 20,
          top: 15
        },
        grid: {
          left: '3%',
          top: '20%',
          right: '6%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          show: true,
          formatter: arg => {
            let total = arg.data.children.reduce((t, cur) => {
              return t + cur.value
            }, 0)
            let str = arg.data.children.reduce((s, cur) => {
              return s + cur.name + ': ' + Math.round((cur.value / total) * 100)  + '%<br>'
            }, '');
            return str;
          }
        },
        series: [
          {
            type: 'pie',
            label: {
              show: true,
              labelLine: true,
              textStyle: {
                color: 'white',
                fontSize: '15px'
              }
            }
          }
        ]
      }
      chart.setOption(initOption);
      window.addEventListener('resize', throttleScreenAdapter);
    }
    const getData = async () => {
      let {data} = await proxy.$axios.get('hotproduct.json');
      Alldata = data;
      myStyle.title = Alldata[curIndex].name;
      value = Alldata[curIndex].children.map(obj => {
        legend.push(obj.name);
        return {
          name: obj.name,
          value: obj.value,
          children: obj.children
        }
      });
    }
    const echartsUpdate = (v) => {
      let option = {
        legend: {
          data: legend,
          left: '10%',
          bottom: '5%',
          icon: 'circle',
          orient: 'vertical'
        },
        series: [
          {
            data: v,
          }
        ]
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
            fontSize: adapterWidth / 100 * 4
          }
        },
        legend: {
          itemWidth: adapterWidth / 400 * 8,
          itemHeight: adapterWidth / 400 * 8,
          itemGap: adapterWidth / 800 * 7.2,
          textStyle: {
            fontSize: adapterWidth / 700 * 17
          }
        },
        series: [
          {
            radius: adapterWidth / 15 * 3.6    //控制饼图的半径大小
          }
        ]
      }
      myStyle.arrStyle.fontSize = adapterWidth / 50 * 3.6 + 'px';
      myStyle.arrStyle.color = themeStyle.value.titleColor;
      myStyle.spanStyle.fontSize = adapterWidth / 100 * 5 + 'px';
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
      echartsUpdate(value);
      throttleScreenAdapter();
    })
    onMounted(async () => {
      echartsInit();
      await getData();
      echartsUpdate(value);
      throttleScreenAdapter();
    })
    onUnmounted(() => {
      window.removeEventListener('resize', throttleScreenAdapter);
    })
    const toLeft = () => {
      if(curIndex === 0)curIndex=2;
      else curIndex--;
      myStyle.title = Alldata[curIndex].name;
      value = Alldata[curIndex].children.map(obj => {
        legend.push(obj.name);
        return {
          name: obj.name,
          value: obj.value
        }
      });
      echartsUpdate(value);
    }
    const toRight = () => {
      if(curIndex === 2)curIndex=0;
      else curIndex++;
      myStyle.title = Alldata[curIndex].name;
      value = Alldata[curIndex].children.map(obj => {
        legend.push(obj.name);
        return {
          name: obj.name,
          value: obj.value
        }
      });
      echartsUpdate(value);
    }
    return {
      toLeft,
      toRight,
      myStyle,
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
.left{
  position: absolute;
  font-size: 80px;
  color: white;
  left: 5%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.right{
  position: absolute;
  font-size: 80px;
  color: white;
  right: 5%;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
.hotPageTitle{
  position: absolute;
  font-size: 30px;
  color: white;
  right: 10%;
  bottom: 8%;
}
</style>