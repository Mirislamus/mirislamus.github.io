document.addEventListener('DOMContentLoaded', () => {
  const myElement = document.querySelectorAll('.payment__select-content');

  myElement.forEach(el => {
    new SimpleBar(el, { autoHide: false });

  })
  console.log(1)
});