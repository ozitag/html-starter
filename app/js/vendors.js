import 'react-app-polyfill/stable';
import 'react-app-polyfill/ie11';
import 'intersection-observer';
import './polyfills';
import 'html5shiv';
import 'picturefill';
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/native-loading/ls.native-loading';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import svgPolyfill from 'svg4everybody';
import jquery from 'jquery';
import swiper from 'swiper';

window.$ = window.jQuery = jquery;
window.svg4everybody = svgPolyfill;
window.Swiper = swiper;

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};