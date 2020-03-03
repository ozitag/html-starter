const Share = {
  vk: (purl, ptitle, pimg, text) => {
    let url = 'http://vkontakte.ru/share.php?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&image=' + encodeURIComponent(pimg);
    url += '&noparse=true';
    Share.popup(url);
  },
  ok: (purl, ptitle, pimg, text) => {
    let url = 'https://connect.ok.ru/offer?';
    url += 'url=' + encodeURIComponent(purl);
    url += '&title=' + encodeURIComponent(ptitle);
    url += '&description=' + encodeURIComponent(text);
    url += '&imageUrl=' + encodeURIComponent(pimg);
    Share.popup(url);
  },
  fb: (purl, ptitle, pimg, text) => {
    let url = 'http://www.facebook.com/sharer.php?s=100';
    url += '&p[title]=' + encodeURIComponent(ptitle);
    url += '&p[summary]=' + encodeURIComponent(text);
    url += '&p[url]=' + encodeURIComponent(purl);
    url += '&p[images][0]=' + encodeURIComponent(pimg);
    Share.popup('https://www.facebook.com/sharer/sharer.php?u=' + purl);
  },
  tw: (purl, ptitle, pimg, text) => {
    let url = 'http://twitter.com/share?';
    if (typeof ptitle !== 'undefined') {
      url += 'text=' + encodeURIComponent(ptitle.length ? ptitle : text);
    }
    url += '&url=' + encodeURIComponent(purl);
    url += '&counturl=' + encodeURIComponent(purl);
    Share.popup(url);
  },
  popup: url => {
    window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
  },
};

function getOgParam (param) {
  const elem = document.querySelector('meta[property="og:' + param + '"]');
  return elem.content || '';
}

function initShare () {
  const buttons = document.querySelectorAll('.js-social-share [data-social]');
  buttons.forEach(button => {
    button.addEventListener('click', e => {
      e.preventDefault();
      const { currentTarget } = e;
      const social = currentTarget.dataset.social;
      const handler =  Share[social] || null;

      if (handler === null) return false;

      handler(
        getOgParam('url'),
        getOgParam('title'),
        getOgParam('description'),
        getOgParam('image'),
      );
    });
  });
}

window.initShare = initShare;
