export type LoremType = "paragraphs" | "sentences" | "words";

const WORDS = [
  "lorem",
  "ipsum",
  "dolor",
  "sit",
  "amet",
  "consectetur",
  "adipiscing",
  "elit",
  "sed",
  "do",
  "eiusmod",
  "tempor",
  "incididunt",
  "ut",
  "labore",
  "et",
  "dolore",
  "magna",
  "aliqua",
  "enim",
  "ad",
  "minim",
  "veniam",
  "quis",
  "nostrud",
  "exercitation",
  "ullamco",
  "laboris",
  "nisi",
  "ut",
  "aliquip",
  "ex",
  "ea",
  "commodo",
  "consequat",
  "duis",
  "aute",
  "irure",
  "dolor",
  "in",
  "reprehenderit",
  "voluptate",
  "velit",
  "esse",
  "cillum",
  "dolore",
  "eu",
  "fugiat",
  "nulla",
  "pariatur",
  "excepteur",
  "sint",
  "occaecat",
  "cupidatat",
  "non",
  "proident",
  "sunt",
  "culpa",
  "qui",
  "officia",
  "deserunt",
  "mollit",
  "anim",
  "id",
  "est",
  "laborum",
  "vitae",
  "porta",
  "nullam",
  "sagittis",
  "tincidunt",
  "vehicula",
  "integer",
  "malesuada",
  "bibendum",
  "aliquet",
  "morbi",
  "facilisis",
  "augue",
  "praesent",
  "interdum",
  "efficitur",
  "metus",
  "iaculis",
  "hendrerit",
  "rutrum",
  "elementum",
  "curabitur",
  "eros",
  "turpis",
  "posuere",
  "felis",
  "gravida",
  "lectus",
  "faucibus",
  "mi",
  "rhoncus",
  "dictum",
  "dignissim",
  "tellus",
  "fringilla",
  "placerat",
  "cursus",
  "ultricies",
  "pulvinar",
  "sollicitudin",
  "varius",
  "libero",
  "blandit",
  "accumsan",
  "suscipit",
  "imperdiet",
  "condimentum",
  "lacinia",
  "fermentum",
  "auctor",
  "sem",
  "sodales",
  "nisl",
  "eleifend",
  "tortor",
  "mauris",
  "maximus",
  "risus",
  "vestibulum",
  "ornare",
  "purus",
  "mattis",
  "finibus",
  "pretium",
  "pharetra",
  "erat",
  "viverra",
  "pellentesque",
  "vulputate",
  "convallis",
  "scelerisque",
  "congue",
  "vivamus",
  "ullamcorper",
  "egestas",
  "tristique",
  "molestie",
  "dapibus",
  "sapien",
  "venenatis",
  "magna",
  "tempus",
  "lacus",
  "arcu",
  "commodo",
  "vel",
  "laoreet",
  "class",
  "aptent",
  "taciti",
  "sociosqu",
  "ad",
  "litora",
  "torquent",
  "per",
  "conubia",
  "inceptos",
  "himenaeos",
  "donec",
  "penatibus",
  "senectus",
  "lobortis",
];

function pickWord(): string {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function sentence(): string {
  const len = 5 + Math.floor(Math.random() * 10);
  const words: string[] = [];
  for (let i = 0; i < len; i++) words.push(pickWord());
  return capitalize(words.join(" ")) + ".";
}

function paragraph(): string {
  const len = 3 + Math.floor(Math.random() * 4);
  const sentences: string[] = [];
  for (let i = 0; i < len; i++) sentences.push(sentence());
  return sentences.join(" ");
}

function generateWords(count: number): string {
  const words: string[] = [];
  for (let i = 0; i < count; i++) words.push(pickWord());
  return words.join(" ");
}

function generateSentences(count: number): string {
  const items: string[] = [];
  for (let i = 0; i < count; i++) items.push(sentence());
  return items.join(" ");
}

function generateParagraphs(count: number): string {
  const items: string[] = [];
  for (let i = 0; i < count; i++) items.push(paragraph());
  return items.join("\n\n");
}

export function generateLorem(type: LoremType, count: number): string {
  switch (type) {
    case "words":
      return generateWords(Math.max(1, Math.min(count, 200)));
    case "sentences":
      return generateSentences(Math.max(1, Math.min(count, 50)));
    case "paragraphs":
      return generateParagraphs(Math.max(1, Math.min(count, 50)));
  }
}
