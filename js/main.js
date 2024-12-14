let words = [];
let letters = [
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
];

async function fetchRandomWord() {
  try {
    const chosenIndex = Math.floor(Math.random() * letters.length);
    let chosenLetter = letters[chosenIndex];
    const response = await fetch(
      `https://api.datamuse.com/words?sp=${chosenLetter}*`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching word:", error);
    return "error";
  }
}

async function startInfiniteWordCloud() {
  const container = document.getElementById("wordcloud");

  setInterval(async () => {
    const allWords = await fetchRandomWord();
    const chosenIndex = Math.floor(Math.random() * allWords.length);
    console.log(chosenIndex);
    let newWord = allWords[chosenIndex].word;
    words.push(newWord);
    console.log(words);

    container.innerHTML = "";

    const wordCloud = WordCloud(words, {
      width: 800,
      height: 400,
      fill: "#000",
    });

    container.appendChild(wordCloud);
  }, 1000);
}

startInfiniteWordCloud();
