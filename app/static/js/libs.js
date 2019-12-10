import 'html5shiv';
import svgPolyfill from 'svg4everybody';
import 'core-js/modules/web.dom-collections.for-each';
import lazySizes from 'lazysizes';
import 'lazysizes/plugins/respimg/ls.respimg';
import 'lazysizes/plugins/native-loading/ls.native-loading';
import 'lazysizes/plugins/object-fit/ls.object-fit';
import 'lazysizes/plugins/blur-up/ls.blur-up';
import './poly';
import $ from 'jquery';

window.$ = $;
window.svg4everybody = svgPolyfill;

lazySizes.cfg.lazyClass = 'lazy';
lazySizes.cfg.srcAttr = 'data-original';
lazySizes.cfg.loadMode = 1;
lazySizes.cfg.nativeLoading = {
  setLoadingAttribute: true,
  disableListeners: {
    scroll: true,
  },
};