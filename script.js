document.addEventListener('DOMContentLoaded', () => {
  const productList = document.getElementById('product-list');
  const headerImage = document.getElementById('header-image');
  const headerTitle = document.getElementById('header-title');
  const headerDescription = document.getElementById('header-description');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentIndex = 0;
  let devices = [];

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      devices = data;
      populateProducts();
      updateHeader();
      checkUrlParams();
    });

  function populateProducts() {
    devices.forEach((device, index) => {
      const item = document.createElement('div');
      item.classList.add('product-item');
      item.textContent = device.name;
      item.addEventListener('click', () => selectDevice(index));
      productList.appendChild(item);
    });
  }

  function selectDevice(index) {
    currentIndex = index;
    updateHeader();
    updateUrl();
    highlightSelectedProduct();
  }

  function updateHeader() {
    headerImage.src = devices[currentIndex].image;
    headerTitle.textContent = devices[currentIndex].name;
    headerDescription.textContent = devices[currentIndex].description;
  }

  function updateUrl() {
    const url = new URL(window.location);
    url.searchParams.set('aud_device', devices[currentIndex].key);
    window.history.pushState({}, '', url);
  }

  function checkUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const deviceKey = params.get('aud_device');
    if (deviceKey) {
      const deviceIndex = devices.findIndex(device => device.key === deviceKey);
      if (deviceIndex !== -1) {
        currentIndex = deviceIndex;
        updateHeader();
        highlightSelectedProduct();
      }
    }
  }

  function highlightSelectedProduct() {
    document.querySelectorAll('.product-item').forEach((item, index) => {
      item.classList.toggle('selected', index === currentIndex);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : devices.length - 1;
    updateHeader();
    updateUrl();
    highlightSelectedProduct();
  });

  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < devices.length - 1) ? currentIndex + 1 : 0;
    updateHeader();
    updateUrl();
    highlightSelectedProduct();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevBtn.click();
    } else if (e.key === 'ArrowRight') {
      nextBtn.click();
    }
  });
});
