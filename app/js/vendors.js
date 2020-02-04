import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';
import './polyfills';
import 'html5shiv';
import svgPolyfill from 'svg4everybody';
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'lazysizes/plugins/native-loading/ls.native-loading';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import jquery from 'jquery';
import Swiper from 'swiper';

window.$ = window.jQuery = jquery;
window.svg4everybody = svgPolyfill;
window.Swiper = Swiper;

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};