
const ADJEngine = {
  stopWords: [
    "a", "o", "as", "os", "um", "uma", "de", "do", "da",
    "dos", "das", "em", "no", "na", "nos", "nas", "por",
    "para", "com", "que", "e", "ou", "ao", "se", "é",
    "ser", "são", "foi", "como", "mais", "menos", "sua",
    "seu", "suas", "seus", "isso", "essa", "esse", "este",
    "esta", "também", "entre", "sobre", "pelo", "pela",
    "quando", "porque", "muito", "cada", "tem", "têm",
    "até", "já", "após", "antes", "sem", "qual", "quais"
  ],

  cleanText(text) {
    return text
      .replace(/\s+/g, " ")
      .trim();
  },

  splitSentences(text) {
    return text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)
      ?.map(s => s.trim())
      .filter(Boolean) || [];
  },

  splitIntoSteps(text) {
    const sentences = this.splitSentences(text);
    const steps = [];

    for (let i = 0; i < sentences.length; i += 2) {
      steps.push(sentences.slice(i, i + 2).join(" "));
    }

    return steps;
  },

  extractKeywords(text) {
    const words = text
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\s]/gu, "")
      .split(/\s+/);

    const frequency = {};

    words.forEach(word => {
      if (
        word.length > 4 &&
        !this.stopWords.includes(word)
      ) {
        frequency[word] = (frequency[word] || 0) + 1;
      }
    });

    return Object.entries(frequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([word]) => word);
  },

  generateQuestions(steps) {
    return steps.slice(0, 3).map((step, index) => ({
      level: index + 1,
      question: `Explique com suas palavras o que você entendeu sobre: ${step}`
    }));
  },

  generate(text) {
    const content = this.cleanText(text);

    if (!content || content.length < 30) {
      return {
        error: "Insira um texto um pouco maior para que possamos organizar seu aprendizado."
      };
    }

    const steps = this.splitIntoSteps(content);
    const keywords = this.extractKeywords(content);

    return {
      title: "Seu conteúdo organizado",
      introduction:
        "Vamos aprender em pequenas etapas. Leia uma parte de cada vez e avance no seu ritmo.",
      steps,
      keywords,
      questions: this.generateQuestions(steps),
      review:
        "Agora tente explicar o conteúdo sem consultar o texto. Se precisar, volte e releia uma etapa.",
      disclaimer:
        "Esta organização é automática e pode não representar uma simplificação pedagógica completa."
    };
  }
};

window.ADJEngine = ADJEngine;
