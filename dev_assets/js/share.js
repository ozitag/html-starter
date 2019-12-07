var Share = {
  vkontakte: function(purl, ptitle, pimg, text) {
    var url = 'http://vkontakte.ru/share.php?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&image=' + encodeURIComponent(pimg);
    url += '&noparse=true';
    Share.popup(url);
  },
  odnoklassniki: function(purl) {
    var url = 'http://www.odnoklassniki.ru/dk?st.cmd=addShare&st.s=1';
    url += '&st._surl=' + purl;
    Share.popup(url);
  },
  facebook: function(purl, ptitle, pimg, text) {
    var url = 'http://www.facebook.com/sharer.php?s=100';
    url += '&p[title]=' + encodeURIComponent(ptitle);
    url += '&p[summary]=' + encodeURIComponent(text);
    url += '&p[url]=' + encodeURIComponent(purl);
    url += '&p[images][0]=' + encodeURIComponent(pimg);
    Share.popup('https://www.facebook.com/sharer/sharer.php?u=' + purl);
  },

  twitter: function(purl, ptitle, pimg, text) {
    var url = 'http://twitter.com/share?';
    if (typeof ptitle !== 'undefined') url += 'text=' + encodeURIComponent(ptitle.length ? ptitle : text);
    url += '&url=' + encodeURIComponent(purl);
    url += '&counturl=' + encodeURIComponent(purl);
    Share.popup(url);
  },

  gplus: function(purl) {
    Share.popup('https://plus.google.com/share?url=' + encodeURIComponent(purl));
  },

  popup: function(url) {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  },
};

function getOgParam(param) {
  var $elem = $('meta[property="og:' + param + '"]');
  return $elem.length ? $elem.attr('content') : '';
}

$(function() {
  $('.js-social-share button').on('click', function() {
    var social = $(this).data('social');
    var func = social in Share ? Share[social] : null;

    if (func === null) {
      return false;
    }

    func(getOgParam('url'), getOgParam('title'), getOgParam('image'), getOgParam('description'));

    return false;
  });
});
