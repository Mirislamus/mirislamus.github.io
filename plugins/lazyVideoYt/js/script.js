class LazyVideoYt {
  constructor(options = {}) {
    const {
      videoElement = '.LazyVideoYt',
    } = options;
    this.videoElement = videoElement;
    this.init();
  }
  init() {
    const videoElement = document.querySelectorAll(this.videoElement);

    videoElement.forEach((element, index, array) => {
      const videoUrl = `https://www.youtube.com/embed/${element.dataset.id}/?autoplay=1&enablejsapi=1&rel=0&showinfo=0&playsinline=1&${element.dataset.parameters}`;
      const imgUrl = `https://img.youtube.com/vi/${element.dataset.id}/maxresdefault.jpg`;
      const imgAlt = element.dataset.alt;

      const createIframe = function() {
        for (let items of array) {
          if (items.lastElementChild.tagName === 'IFRAME') {
            items.lastElementChild.remove();
          }
        }
        this.innerHTML +=
        `<iframe
          class="video__iframe"
          frameborder="0"
          src="${videoUrl}"
          width="100%"
          height="100%"
          allow="autoplay"
          allowfullscreen>
        </iframe>`;
      };

      if(element.firstElementChild.tagName === 'IMG') {
        element.addEventListener('click', createIframe);
      } else {
        element.innerHTML += `<img class="video__img" src="${imgUrl}" alt="${imgAlt}">`;
        element.addEventListener('click', createIframe);
      }
    });

  }

}

new LazyVideoYt();
