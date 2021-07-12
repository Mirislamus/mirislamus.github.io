class ChangeMap  {
  constructor(options = {}) {
    const {
      mapContainer = '.map-container',
      mapBlock = '.map-lazy',
      mapLoaded = false,
      mapOptions = {
        once: true,
        passive: true,
        capture: true
      },

    } = options;
    this.mapContainer = mapContainer;
    this.mapBlock = mapBlock;
    this.mapLoaded = mapLoaded;
    this.mapOptions = mapOptions;
    this.init();

  }

  init() {
    const mapContainer = document.querySelector(this.mapContainer);
    const mapBlock = document.querySelector(this.mapBlock);

    const lazyMap = () => {

      mapBlock.setAttribute('src', mapBlock.getAttribute('data-src'));
      mapBlock.removeAttribute('data-src');

      mapContainer.removeEventListener('click', lazyMap, this.mapOptions);
      mapContainer.removeEventListener('mouseover', lazyMap, this.mapOptions);
      mapContainer.removeEventListener('touchstart', lazyMap, this.mapOptions);
      mapContainer.removeEventListener('touchmove', lazyMap, this.mapOptions);
    }

    mapContainer.addEventListener('click', lazyMap, this.mapOptions);
    mapContainer.addEventListener('mouseover', lazyMap, this.mapOptions);
    mapContainer.addEventListener('touchstart', lazyMap, this.mapOptions);
    mapContainer.addEventListener('touchmove', lazyMap, this.mapOptions);
  }

} new ChangeMap();