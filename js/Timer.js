/**
 * Timer - Este é um exemplo de timer com javascript que será usado neste projeto
 * para mostrar o tempo de jogo.
 * @param {*} callback - recebe a função que será executada dentro do timer
 * @param {*} delay - Intervalo em milissegundos entre uma chamada e outra
 */
function Timer(callback, delay) {
  var timerId;
  var start;
  var remaining = delay;

  this.pause = function () {
    window.clearTimeout(timerId);
    remaining -= new Date() - start;
  };

  var resume = function () {
    start = new Date();
	timerId = window.setTimeout(function () {
      remaining = delay;
      resume();
      callback();
    }, remaining);
  }
  this.resume = resume;

  this.reset = function () {
    remaining = delay;
  };
}
