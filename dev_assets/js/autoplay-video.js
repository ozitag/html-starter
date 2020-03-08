class AutoplayVideo {
  constructor () {
    this.observer = null;
    this.config = {
      root: null,
      threshold: 0,
    };
  }

  static onObserve (entries) {
    entries.forEach(({ intersectionRatio, target }) => {
      if (intersectionRatio > 0) target.play();
      else target.pause();
    });
  }

  static playAutoplay (container, action) {
    const videos = container.querySelectorAll('video[autoplay]');
    switch (action) {
      case 'play':
        videos.forEach(item => item.play());
        break;
      case 'pause':
        videos.forEach(item => item.pause());
        break;
    }
  }

  init () {
    const videos = document.querySelectorAll('video[autoplay]');
    if (!videos.length) return false;

    this.observer = new IntersectionObserver(AutoplayVideo.onObserve, this.config);
    videos.forEach(video => {
      this.observer.observe(video);
    });
  }

  static createInstance () {
    new AutoplayVideo();
  }
}

const autoplayVideo = AutoplayVideo.createInstance();
window.initAutoplayVideo = autoplayVideo.init.bind(autoplayVideo);
window.playAutoplay = AutoplayVideo.playAutoplay;
