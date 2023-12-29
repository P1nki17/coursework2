document.addEventListener('click', function (event) {
    // игнорирование событий, которые произошли не на данной кнопке
    if (!event.target.hasAttribute('data-toggle-fullscreen')) return;
    // если элемент уже в полноэкранном режиме, выйти из него
    // В противном случае войти в полный экран
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen();

}, false);
