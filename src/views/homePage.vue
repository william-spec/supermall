<template>
  <div class="screen-container" :style="reactiveStyle.containerStyle">
    <header class="screen-header">
      <div>
        <img :src="themeStyle.headerBorderSrc" alt="" />
      </div>
      <span class="logo"> <a :style="reactiveStyle.titleColor" href="https://www.bookbook.cc" title="去bookbook.cc主站" target="_blank">bookbook.cc</a> </span>
      <span class="title" :style="reactiveStyle.titleColor">电商平台实时监控系统</span>
      <div class="title-right">
        <img :src="themeStyle.themeSrc" class="qiehuan"  alt="切换主题" title="切换主题" @click="handleChangeTheme" />
        <div class="datetime"></div>
      </div>
    </header>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top" :class="{ fullscreen: fullScreenStatus.trend }">
          <!-- 销量趋势图表 -->
          <trend ref="trend"></trend>
          <div class="resize">
            <!-- icon-compress-alt 向内 -->
            <span  @click="changeSize('trend')" :class="['iconfont', fullScreenStatus.trend ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="left-bottom" :class="{ fullscreen: fullScreenStatus.seller }">
          <!-- 商家销售金额图表 -->
          <seller ref="seller"></seller>
          <div class="resize">
            <span @click="changeSize('seller')" :class="['iconfont', fullScreenStatus.seller ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-middle">
        <div id="middle-top" :class="{ fullscreen: fullScreenStatus.singleMap }">
          <!-- 商家分布图表 -->
          <single-map ref="singleMap"></single-map>
          <div class="resize">
            <span @click="changeSize('singleMap')" :class="['iconfont', fullScreenStatus.singleMap ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="middle-bottom"  :class="{ fullscreen: fullScreenStatus.rank }">
          <!-- 地区销量排行图表 -->
          <rank ref="rank"></rank>
          <div class="resize">
            <span @click="changeSize('rank')" :class="['iconfont', fullScreenStatus.rank ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
      <section class="screen-right">
        <div id="right-top" :class="{ fullscreen: fullScreenStatus.hot }">
          <!-- 热销商品占比图表 -->
          <hot ref="hot"></hot>
          <div class="resize">
            <span @click="changeSize('hot')" :class="['iconfont', fullScreenStatus.hot ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
        <div id="right-bottom" :class="{ fullscreen: fullScreenStatus.stock }">
          <!-- 库存销量分析图表 -->
          <stock ref="stock"></stock>
          <div class="resize">
            <span @click="changeSize('stock')" :class="['iconfont', fullScreenStatus.stock ? 'icon-compress-alt' : 'icon-expand-alt']"></span>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import Hot from '../components/hotPage.vue'
import Map from '../components/map.vue'
import Rank from '../components/rank.vue'
import Seller from '../components/seller.vue'
import Stock from '../components/stock.vue'
import Trend from '../components/trend.vue'
import { getCurrentInstance, computed, reactive } from '@vue/runtime-core'

// import { mapState } from 'vuex'
// 导入自己定义的主题工具函数 用于返回不同主题下的配置对象
// import { getThemeValue } from 'utils/theme_utils'

export default {
  name: 'ScreenPage',
  components: {
    Hot,
    'single-map': Map,
    Rank,
    Seller,
    Stock,
    Trend,
  },
  setup(){
    let {proxy} = getCurrentInstance();
    let fullScreenStatus = reactive({
      trend: false,
      seller: false,
      hot: false,
      singleMap: false,
      stock: false,
      rank: false,
    });
    let reactiveStyle = reactive({
      containerStyle: {},
      titleColor: {
        color: '#FFFFFF'
      },
    })
    const changeSize = (chartName) => {
      fullScreenStatus[chartName] = !fullScreenStatus[chartName];   //此时虽然已经具备全局样式，但是由于屏幕分辨率没有变化，不会去出发组件的重新适配，所以不能全屏
      //由于数据有延迟，所以直接同步调用screenAdapter无法生效
      proxy.$nextTick(() => {
        proxy.$refs[chartName].screenAdapter();
      })
    }
    const handleChangeTheme = () => {
      proxy.$store.commit('changeTheme');
      reactiveStyle.containerStyle.backgroundColor = themeStyle.value.backgroundColor;
      reactiveStyle.titleColor.color = themeStyle.value.titleColor;
    }
    let theme = computed(() => {
      return proxy.$store.state.theme
    })
    let themeStyle = computed(() => {
      return proxy.$store.state[theme.value]
    })
    return {
      fullScreenStatus,
      changeSize,
      handleChangeTheme,
      themeStyle,
      reactiveStyle
    }
  }
}
</script>
<style lang="less" scoped>
// 全屏样式的定义
.fullscreen {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  z-index: 9999;
}

.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  background-color: #161522;
  color: #fff;
  box-sizing: border-box;
}
.screen-header {
  width: 100%;
  // height: 64px;
  font-size: 20px;
  position: relative;
  > div {
    img {
      width: 100%;
    }
  }
  .title {
    position: absolute;
    left: 50%;
    top: 50%;
    font-size: 20px;
    transform: translate(-50%, -50%);
  }
  .title-right {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
  .qiehuan {
    width: 28px;
    height: 21px;
    cursor: pointer;
  }
  .datetime {
    font-size: 15px;
    margin-left: 10px;
  }
  .logo {
    position: absolute;
    left: 0px;
    top: 50%;
    transform: translateY(-80%);
    a {
      text-decoration: none;
    }
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 27.6%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 41.5%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 28%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 27.6%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>