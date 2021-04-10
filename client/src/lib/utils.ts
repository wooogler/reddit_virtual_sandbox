export function nthHighest(numbers:number[], n: number) {
  var sorted = numbers.sort(function (a, b) {
      return a - b;
  });
  return sorted[sorted.length - n];
}