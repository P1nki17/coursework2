//Чувствительность — количество пикселей, после которого жест будет считаться свайпом
const sensitivity = 20;

var touchStart = null; //Точка начала касания
var touchPosition = null; //Текущая позиция

function TouchStart(e) {
    //Получаем текущую позицию касания
    touchStart = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    touchPosition = { x: touchStart.x, y: touchStart.y };
}

function TouchMove(e) {
    //Получаем новую позицию
    touchPosition = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
}

function TouchEnd(e) {
    CheckAction(); //Определяем, какой жест совершил пользователь

    //Очищаем позиции
    touchStart = null;
    touchPosition = null;
}

function CheckAction() {
    var d = //Получаем расстояния от начальной до конечной точек по обеим осям
    {
        x: touchStart.x - touchPosition.x,
        y: touchStart.y - touchPosition.y
    };

    var msg = ""; //Сообщение

    if (Math.abs(d.x) > Math.abs(d.y)) //Проверяем, движение по какой оси было длиннее
    {
        if (Math.abs(d.x) > sensitivity) //Проверяем, было ли движение достаточно длинным
        {
            if (d.x > 0) //Если значение больше нуля, значит пользователь двигал пальцем справа налево
            {
              moveLeft();
            }
            else //Иначе он двигал им слева направо
            {
              moveRight();
            }
        }
    }
    else //Аналогичные проверки для вертикальной оси
    {
        if (Math.abs(d.y) > sensitivity) {
            if (d.y > 0) //Свайп вверх
            {
              moveUp();
            }
            else //Свайп вниз
            {
              moveDown();
            }
        }
    }
}