const CHARS = "1234567890qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM".split("")

export function createKey(length: number) {
  let final = ""

  for(let i = 0; i < length; i++){
    final += CHARS[Math.floor(Math.random() * CHARS.length)]
  }

  return final
}