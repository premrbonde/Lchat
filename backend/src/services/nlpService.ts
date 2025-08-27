import fs from 'fs/promises';
import path from 'path';

interface DictionaryEntry {
  term: string;
  [key: string]: string;
}

class NLPService {
  private slangDict: Map<string, string> = new Map();
  private shortformDict: Map<string, string> = new Map();
  private isInitialized = false;

  constructor() {
    this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const slangPath = path.join(process.cwd(), 'data', 'slang.json');
      const shortformsPath = path.join(process.cwd(), 'data', 'shortforms.json');

      const [slangData, shortformsData] = await Promise.all([
        fs.readFile(slangPath, 'utf-8'),
        fs.readFile(shortformsPath, 'utf-8'),
      ]);

      const slang: DictionaryEntry[] = JSON.parse(slangData);
      const shortforms: DictionaryEntry[] = JSON.parse(shortformsData);

      slang.forEach(item => this.slangDict.set(item.term.toLowerCase(), item.definition));
      shortforms.forEach(item => this.shortformDict.set(item.term.toLowerCase(), item.expansion));

      this.isInitialized = true;
      console.log('NLP Service initialized successfully.');
    } catch (error) {
      console.error('Failed to initialize NLP Service:', error);
    }
  }

  private ensureInitialized() {
    if (!this.isInitialized) {
      throw new Error('NLP Service is not initialized.');
    }
  }

  public expandShortforms(text: string): string {
    this.ensureInitialized();
    const words = text.split(' ');
    const expandedWords = words.map(word => this.shortformDict.get(word.toLowerCase()) || word);
    return expandedWords.join(' ');
  }

  public replaceSlang(text: string): string {
    this.ensureInitialized();
    // This is a simple implementation. A more robust solution would handle punctuation.
    const words = text.split(' ');
    const replacedWords = words.map(word => this.slangDict.get(word.toLowerCase()) || word);
    return replacedWords.join(' ');
  }

  public detectSarcasm(text: string): { text: string; sarcasmDetected: boolean } {
    this.ensureInitialized();
    // Mock implementation: detects sarcasm if the text contains "sure" or "whatever"
    const sarcasmDetected = /sure|whatever/i.test(text);
    const resultText = sarcasmDetected ? `${text} [sarcasm]` : text;
    return { text: resultText, sarcasmDetected };
  }

  // Mock Translation Adapter
  public async translate(
    text: string,
    targetLanguage: string
  ): Promise<{ originalText: string; translatedText: string; targetLanguage: string }> {
    this.ensureInitialized();
    // In a real app, this would call an external API like Google Cloud Translation.
    return Promise.resolve({
      originalText: text,
      translatedText: `[Translated to ${targetLanguage}] ${text}`,
      targetLanguage,
    });
  }

  public async processMessage(text: string, translateTo?: string) {
    let processedText = this.expandShortforms(text);
    processedText = this.replaceSlang(processedText);
    const sarcasmResult = this.detectSarcasm(processedText);
    processedText = sarcasmResult.text;

    if (translateTo) {
      return this.translate(processedText, translateTo);
    }

    return { originalText: text, processedText, sarcasmDetected: sarcasmResult.sarcasmDetected };
  }
}

// Export a singleton instance
export const nlpService = new NLPService();
