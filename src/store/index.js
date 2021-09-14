import qiehuan_dark from '../assets/icon/qiehuan_dark.png'
import qiehuan_light from '../assets/icon/qiehuan_light.png'
import header_border_dark from '../assets/icon/header_border_dark.png'
import header_border_light from '../assets/icon/header_border_light.png'
import { createStore } from 'vuex'

export default createStore({
    state: {
      theme: 'chalk',
      chalk: {
        // 背景颜色
        backgroundColor: '#161522',
        // 标题文字颜色
        titleColor: '#FFFFFF',
        // 切换主题按钮的图片路径
        themeSrc: qiehuan_dark,
        // 头部的线条
        headerBorderSrc: header_border_dark,
        sellerAxisPointerColor: '#2D3443',
      },
      vintage: {
        backgroundColor: '#dddddd',
        titleColor: "#000000",
        themeSrc: qiehuan_light,
        headerBorderSrc: header_border_light,
        sellerAxisPointerColor: '#f1f2f6',
      },
    },
    mutations: {
      changeTheme(state) {
        if(state.theme === 'chalk')state.theme = 'vintage'
        else state.theme = 'chalk'
      }
    }, 
})