document.addEventListener('click', function (event) {
    // игнорирование событий, которые произошли не на данной кнопке
    if (!event.target.hasAttribute('data-toggle-fullscreen')) return;
    // если элемент уже в полноэкранном режиме, выйти из него
    // В противном случае войти в полный экран
    if (document.fullscreenElement) {
        document.webkitExitFullscreen()
        document.querySelector(".btn__fullscreen").classList.remove("is-active");
    } 
    else {
        document.documentElement.webkitRequestFullscreen();
        document.querySelector(".btn__fullscreen").classList.add("is-active");
    }

}, false);
