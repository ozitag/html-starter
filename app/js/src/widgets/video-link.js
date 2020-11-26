let videoLinkModalInstance = null;

class VideoLinkModal {
  constructor() {
    this.$overlay = null;
    this.$buttonClose = null;
    this.$videoIframe = null;
    this.$videoWrapper = null;

    this.onClose = this.onClose.bind(this);
    this.onBodyKeyUp = this.onBodyKeyUp.bind(this);

    this.build();

    this.events();
  }

  build() {
    this.$overlay = document.createElement('div');
    this.$overlay.classList.add('video-overlay');
    document.body.append(this.$overlay);

    this.$buttonClose = document.createElement('button');
    this.$buttonClose.classList.add('video-overlay__close');
    this.$overlay.append(this.$buttonClose);


    this.$videoWrapper = document.createElement('div');
    this.$videoWrapper.classList.add('video-overlay__video');
    this.$overlay.append(this.$videoWrapper);

    this.$videoIframe = document.createElement('iframe');
    this.$videoWrapper.append(this.$videoIframe);
  }

  events() {
    this.$buttonClose.addEventListener('click', this.onClose);

    document.body.addEventListener('keyup', this.onBodyKeyUp);
  }

  onBodyKeyUp(e) {
    if (e.keyCode === 27) {
      this.close();
    }
  }

  onClose(e) {
    e.preventDefault();

    this.close();
  }

  open(iframeUrl) {
    hideScrollbar();
    this.$videoIframe.setAttribute('src', iframeUrl);

    this.$overlay.classList.add('visible');
  }

  close() {
    this.$overlay.classList.remove('visible');
    showScrollbar();

    this.$videoIframe.setAttribute('src', '');
  }

  static getInstance() {
    if (!videoLinkModalInstance) {
      videoLinkModalInstance = new VideoLinkModal();
    }
    return videoLinkModalInstance;
  }
}

class VideoLink extends Widget {
  constructor(node) {
    super(node, 'js-video-link');

    const youtubeId = this.$node.dataset.youtubeId;
    if (!youtubeId) {
      return;
    }

    this.videoUrl = '//www.youtube.com/embed/' + youtubeId + '?autoplay&rel=0';
    this.modal = VideoLinkModal.getInstance();

    this.open = this.open.bind(this);

    this.events();
  }

  events() {
    this.$node.addEventListener('click', this.open);
  }

  open(e) {
    e.preventDefault();

    this.modal.open(this.videoUrl);
  }

  static init(el) {
    el && new VideoLink(el);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.js-video-link').forEach(item => VideoLink.init(item));
});
