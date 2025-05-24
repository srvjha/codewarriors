type Timer = ReturnType<typeof setTimeout> | undefined;

export const debounce = <T extends (...args: any[]) => any>(
  cb: T,
  delay: number
) => {
  let timerId: Timer;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      cb.apply(this, args);
    }, delay);
  };
};
