export const capitalizeFirstLetter = (word) => {
  return word[0].toUpperCase() + word.substring(1)
}

export const joinStrings = (words) => {
  const wordsArray = words.split(" ")
  for (let i = 0; i < wordsArray.length; i++) {
    wordsArray[i] = capitalizeFirstLetter(wordsArray[i])
  }
  return wordsArray.join(" ")
}
