import { useEffect, useState } from "react";
import logo from "./logo.svg";
import "./App.css";
import useLocalStorageState from "./useLocalStorageState"

function App() {
  // const [cards, setCards] = useState([]);
  // useEffect(() => {
  //   async function fetchCards() {
  //     try {
  //       const response = await fetch(
  //         "https://pokeapi.co/api/v2/pokemon?limit=7&offset=0"
  //       );
  //       const data = await response.json();
  //       setCards(
  //         data.results.map((card: any) => {
  //           return card.name;
  //         })
  //       );
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }
  //   fetchCards();
  //   console.log(cards);
  // }, []);
  interface Image {
    url: string;
    name: string;
  }
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    async function fetchGifs(name: string):Promise<Image | undefined> {
      try {
        const response = await fetch(
          "https://api.giphy.com/v1/gifs/translate?api_key=9UlZ2waaRImI4fmUG97zEKDfGoEx5oCZ&s=" +
            name 
        );
        const data = await response.json();
        return { url: data.data.images.original.url, name: name };
      } catch (error) {
        console.log(error);
      }
    }
    setImages([]);
    let pokemon = ["Pikachu", "Charizard", "Blastoise", "Alakazam", "Gengar", "Machamp", "Jolteon", "Dragonite", "Gyarados", "Snorlax"]
    Promise.all(pokemon.map((card) => fetchGifs(card))).then((img) => {
      const newImages = img.filter((image): image is Image =>  image !== undefined)
      setImages(newImages);
    });
  }, []);
  const [cacheCards, setCacheCards] = useState<string[]>([]);
  const [score, SetScore] = useState(0);
  const [Highest, setHighest] = useLocalStorageState("Highest", 0);

  function shuffleCards() {
    let shuffleCards = [...images];
    console.log("image", shuffleCards);
    for (let i = 0; i < shuffleCards.length; i++) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffleCards[i], shuffleCards[j]] = [shuffleCards[j], shuffleCards[i]];
    }
    console.log("shuffle", shuffleCards);
    setImages(shuffleCards);
  }
  function handleSetCacheCards(card: string) {
    if (cacheCards.includes(card)) {
      alert("You lose");
      setCacheCards([]);
      SetScore(0);
      return;
    }
    console.log("card", card);
    SetScore(score + 1);
    setCacheCards((PrevCard) => [...PrevCard, card]);
  }

  useEffect(() => {
    if (score > Highest) {
      setHighest(score);
    }
  }, [score, Highest]); 

  return (
    <div>
      <header>Memory Game</header>
      <div className="Score">
        <p>Highest Score: {Highest}</p>
        <p>Current Score: {score}</p>
      </div>
      <div className="Cards">
        {console.log("final", images)}
        {images.map((image, index) => {
          return (
            <div key={index} className="Card">
              <img
                src={image.url}
                onClick={() => {
                  handleSetCacheCards(image.name);
                  shuffleCards();
                }}
                alt={image.name}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
