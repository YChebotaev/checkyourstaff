export const generatePinCode = (size: number) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const arr = new Array(size)

  for (let i = 0; i < size; i++) {
    arr[i] = numbers[Math.floor(Math.random() * numbers.length)]
  }

  return arr.join('').padStart(size, '0')
}
