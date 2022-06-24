/** _debounce(fn: (...params: any[]) => void), delay: number, immediate?: boolean, context?: object)

 * Author: Amagyzener <dmitry-phs535@ya.ru>

 * Декоратор '_debounce(fn, delay[, immediate[, context]])', принимающий множество вызовов функции 'fn' во время указанной задержки 'delay', но
  передающий только самый последний вызов, когда задержка закончится, причём задержка начинает заново отсчитываться с каждой новой попыткой вызова 'fn'.

 * Функция 'fn' выполняется в указанном контексте 'context'; режим работы определяется значением 'immediate':
	'false' — реальный вызов происходит только после 'delay' с момента последней попытки;
	'true' — реальный вызов происходит сразу; последующие попытки вызова игнорируются в течение 'delay', отсчитанной с момента последней попытки.
*/

export default function _debounce(fn, delay, immediate = false, context = this) {
	let timer;
	return function(...args) {
		immediate && !timer && fn.apply(context, args);
		clearTimeout(timer);
		timer = setTimeout(() => {
			!immediate && fn.apply(context, args);
			timer = null;
		}, delay);
	};
}