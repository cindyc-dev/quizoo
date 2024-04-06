export const generateGamePin = (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split("");
  let pin = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    const newCharacter = characters[randomIndex];
    characters.filter((c) => c !== newCharacter);
    pin += newCharacter;
  }

  return pin;
};
