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
import imask from 'imask';
import datepicker from 'js-datepicker';
import { format as dateFormat } from 'date-fns';
import select2 from 'select2';
import PerfectScrollbar from 'perfect-scrollbar';

window.$ = window.jQuery = jquery;
window.svg4everybody = svgPolyfill;
window.Swiper = swiper;
window.IMask = imask;
window.select2 = select2;
window.PerfectScrollbar = PerfectScrollbar;
window.datepicker = datepicker;
window.dateHelper = {
  format: dateFormat,
};

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};
