$('.js-load-more').each(function() {
  var $btn = $(this);

  var itemSelector = $(this).data('item');

  var $target = $($(this).data('container'));
  if ($target.length === 0) {
    $btn.hide();
    return;
  }

  var url = $(this).data('url');

  $btn.on('click', function() {
    $btn.addClass('loading');

    var requestUrl = url + (url.indexOf('?') === -1 ? '?' : '&') + 'offset=' + $(itemSelector).length;
    $.get(requestUrl, function(response) {
      var content = '',
        count = 0;

      try {
        response = JSON.parse(response);
        content = response.content;
        count = response.remaining;
      } catch (e) {
        content = response;
        count = 9999;
      }

      var offset = $target.offset().top + $target.outerHeight();

      $target.append(content);

      if (count === 0) {
        $btn.hide();
      }

      $btn.removeClass('loading');

      $('html, body').animate(
        {
          scrollTop: offset,
        },
        1000,
      );
    });

    return false;
  });
});
