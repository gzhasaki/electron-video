import Vue from 'vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'

import App from './App'
import router from './router'

Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

Vue.use(ElementUI);


let JsLoader={
  load:function(sUrl,fCallback){
    var _script = document.createElement("script");
    _script.setAttribute("type","text/javascript");
    _script.setAttribute("src",sUrl);
    document.getElementsByTagName("head")[0].appendChild(_script);

    if(/msie/.test(window.navigator.userAgent.toLowerCase())){
      _script.onreadystatechange=function(){
        if(this.readyState==="loaded"||this.readyState==="complete"){
          fCallback();
        }
      };
    }else if(/gecko/.test(window.navigator.userAgent.toLowerCase())){
      _script.onload=function(){
        fCallback();
      };
    }else{
      fCallback();
    }
  }
};
JsLoader.load("https://g.alicdn.com/de/prismplayer/2.9.3/aliplayer-min.js", function () {
  new Vue({
    el: '#app',
    router,
    render: h => h(App)
  });
})


