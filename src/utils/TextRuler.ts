import LRUCache from "./LRUCache";

export default class TextRuler {
  private ruler: CanvasRenderingContext2D;

  private cache = new LRUCache<string, number>(256);

  constructor(font?: string) {
    const canvas = document.createElement("canvas");
    const textRuler = canvas.getContext("2d");
    if (!textRuler) throw new Error("Canvas context is not available.");
    if (font) textRuler.font = font;
    this.ruler = textRuler;
  }

  measureText(text: string) {
    let width = this.cache.get(text);
    if (width == null) {
      width = this.ruler.measureText(text).width;
      this.cache.set(text, width);
    }
    return width;
  }
}
