function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options,
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    if (options[optionKey] !== true) {
      updatedCookie += '=' + options[optionKey];
    }
  }

  document.cookie = updatedCookie;
}

function deleteCookie(name) {
  setCookie(name, '', {
    'max-age': -1,
  });
}

function getCookie(name) {
  const matches = document.cookie.match(new RegExp(
    '(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)',
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

window.setCookie = setCookie;
window.deleteCookie = deleteCookie;
window.getCookie = getCookie;
