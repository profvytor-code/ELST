import { Section, Exercise } from './types';

export const DEFAULT_SECTIONS: Section[] = [
  {
    id: 'sec-1',
    name: 'Assessment 1: Simple Present',
    grammarCategory: 'Presente Simples',
    order: 1,
    gradientFrom: '#4f46e5',
    gradientTo: '#06b6d4'
  },
  {
    id: 'sec-2',
    name: 'Assessment 2: Simple Past',
    grammarCategory: 'Passado Simples',
    order: 2,
    gradientFrom: '#3b82f6',
    gradientTo: '#2563eb'
  },
  {
    id: 'sec-3',
    name: 'Assessment 3: Simple Future',
    grammarCategory: 'Futuro Simples',
    order: 3,
    gradientFrom: '#0ea5e9',
    gradientTo: '#0284c7'
  },
  {
    id: 'sec-4',
    name: 'Assessment 4: To Be Tenses',
    grammarCategory: 'Verbo To Be (Presente/Passado/Futuro)',
    order: 4,
    gradientFrom: '#f59e0b',
    gradientTo: '#d97706'
  },
  {
    id: 'sec-5',
    name: 'Assessment 5: To Be Continuous',
    grammarCategory: 'Tempos Contínuos (Continuous)',
    order: 5,
    gradientFrom: '#10b981',
    gradientTo: '#059669'
  },
  {
    id: 'sec-6',
    name: 'Assessment 6: WH Questions',
    grammarCategory: 'Perguntas com WH (What, When, Where, etc.)',
    order: 6,
    gradientFrom: '#ec4899',
    gradientTo: '#db2777'
  },
  {
    id: 'sec-7',
    name: 'Assessment 7: Present Perfect',
    grammarCategory: 'Presente Perfeito',
    order: 7,
    gradientFrom: '#8b5cf6',
    gradientTo: '#7c3aed'
  },
  {
    id: 'sec-8',
    name: 'Assessment 8: There To Be',
    grammarCategory: 'Haver / Existir (There is / There are)',
    order: 8,
    gradientFrom: '#6366f1',
    gradientTo: '#4f46e5'
  },
  {
    id: 'sec-9',
    name: 'Assessment 9: Comparatives & Superlatives',
    grammarCategory: 'Comparativos e Superlativos',
    order: 9,
    gradientFrom: '#14b8a6',
    gradientTo: '#0d9488'
  },
  {
    id: 'sec-10',
    name: 'Assessment 10: Modal Verbs',
    grammarCategory: 'Verbos Modais (Can, Could, Should, Must, etc.)',
    order: 10,
    gradientFrom: '#f43f5e',
    gradientTo: '#e11d48'
  },
  {
    id: 'sec-11',
    name: 'Assessment 11: Pronouns',
    grammarCategory: 'Pronomes (Sujeito, Objeto, Possessivos)',
    order: 11,
    gradientFrom: '#06b6d4',
    gradientTo: '#0891b2'
  },
  {
    id: 'sec-12',
    name: 'Assessment 12: Quantifiers',
    grammarCategory: 'Quantificadores (Something, Anything, Some, Any)',
    order: 12,
    gradientFrom: '#84cc16',
    gradientTo: '#65a30d'
  },
  {
    id: 'sec-13',
    name: 'Assessment 13: Conjunctions',
    grammarCategory: 'Conjunções (And, But, Or, With)',
    order: 13,
    gradientFrom: '#a855f7',
    gradientTo: '#9333ea'
  },
  {
    id: 'sec-14',
    name: 'Assessment 14: Possessive Adjectives',
    grammarCategory: 'Adjetivos Possessivos (My, Your, Her, His)',
    order: 14,
    gradientFrom: '#eab308',
    gradientTo: '#ca8a04'
  },
  {
    id: 'sec-15',
    name: 'Assessment 15: Adverbs of Manner',
    grammarCategory: 'Advérbios de Modo',
    order: 15,
    gradientFrom: '#f97316',
    gradientTo: '#ea580c'
  },
  {
    id: 'sec-16',
    name: 'Assessment 16: Relative Clauses',
    grammarCategory: 'Orações Relativas (Who, Which, Where, When)',
    order: 16,
    gradientFrom: '#64748b',
    gradientTo: '#475569'
  },
  {
    id: 'sec-17',
    name: 'Assessment 17: Tag Questions',
    grammarCategory: 'Tag Questions (Don\'t you, Aren\'t you)',
    order: 17,
    gradientFrom: '#10b981',
    gradientTo: '#047857'
  },
  {
    id: 'sec-18',
    name: 'Assessment 18: Prepositions of Place',
    grammarCategory: 'Preposições de Lugar (In, On, Under, Between)',
    order: 18,
    gradientFrom: '#06b6d4',
    gradientTo: '#0369a1'
  },
  {
    id: 'sec-19',
    name: 'Assessment 19: Phonetics',
    grammarCategory: 'Fonética do Alfabeto',
    order: 19,
    gradientFrom: '#db2777',
    gradientTo: '#9d174d'
  },
  {
    id: 'sec-20',
    name: 'Assessment 20: Morphology and Syntax',
    grammarCategory: 'Morfologia e Sintaxe (Prefixos, Sufixos e Classes de Palavras)',
    order: 20,
    gradientFrom: '#4f46e5',
    gradientTo: '#312e81'
  }
];

export const DEFAULT_EXERCISES: Exercise[] = [
  // --- SECTION 1: SIMPLE PRESENT ---
  {
    id: 'ex-1-1',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 1 - Escolha a alternativa correta',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Eu gosto de laranja"</b>' },
    options: ['I like orange', 'I likes orange'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-1-2',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 2 - Escolha a alternativa correta',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Eu não leio"</b>' },
    options: ['I not read', 'I don’t read'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-1-3',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 3 - Escolha a alternativa correta',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Você quer?"</b>' },
    options: ['do you want?', 'does you want?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-1-4',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 4 - Escolha a alternativa correta',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Ela gosta de café"</b>' },
    options: ['she like coffee', 'she likes coffee'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-1-5',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 5 - Escolha a alternativa correta',
    order: 5,
    richText: { text: 'Traduza corretamente: <b>"Ela não vai"</b>' },
    options: ['she doesn’t go', 'she is not go'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-1-6',
    sectionId: 'sec-1',
    type: 'multiple_choice',
    title: 'Exercício 6 - Escolha a alternativa correta',
    order: 6,
    richText: { text: 'Traduza corretamente: <b>"Ela trabalha?"</b>' },
    options: ['does she work?', 'do she work?'],
    correctOptionIndex: 0
  },

  // --- SECTION 2: SIMPLE PAST ---
  {
    id: 'ex-2-1',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 1 - Escolha a alternativa correta',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Eu gostei de você"</b>' },
    options: ['I was like you', 'I liked you'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-2-2',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 2 - Escolha a alternativa correta',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Eu não trabalhei"</b>' },
    options: ['I not worked', 'I didn’t work'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-2-3',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 3 - Escolha a alternativa correta',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Eu conversei?"</b>' },
    options: ['do I talked?', 'did i talk?'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-2-4',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 4 - Escolha a alternativa correta',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Ela não foi"</b>' },
    options: ['she didn’t went', 'she didn’t go'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-2-5',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 5 - Mude a frase para negativa no passado',
    order: 5,
    richText: { text: 'Qual a forma negativa correta de: <b>"I LIKED YOU"</b> (eu gostei de você)?' },
    options: ['I didn’t like you', 'I didn’t liked you', 'I not liked you'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-2-6',
    sectionId: 'sec-2',
    type: 'multiple_choice',
    title: 'Exercício 6 - Verbos Regulares e Irregulares no Passado',
    order: 6,
    richText: { text: 'Qual das alternativas mostra a forma correta do verbo <b>"go"</b> no passado?' },
    options: ['goes', 'went', 'goed'],
    correctOptionIndex: 1
  },

  // --- SECTION 3: SIMPLE FUTURE ---
  {
    id: 'ex-3-1',
    sectionId: 'sec-3',
    type: 'multiple_choice',
    title: 'Exercício 1 - Escolha a alternativa correta',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Eu irei hoje"</b>' },
    options: ['I get go today', 'I will go today'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-3-2',
    sectionId: 'sec-3',
    type: 'multiple_choice',
    title: 'Exercício 2 - Escolha a alternativa correta (Negativa)',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Você não chorará"</b>' },
    options: ['you don’t will cry', 'you won’t cry'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-3-3',
    sectionId: 'sec-3',
    type: 'multiple_choice',
    title: 'Exercício 3 - Escolha a alternativa correta (Interrogativa)',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Eu limparei?"</b>' },
    options: ['do will i clean?', 'will i clean?'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-3-4',
    sectionId: 'sec-3',
    type: 'multiple_choice',
    title: 'Exercício 4 - Escolha a alternativa correta',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Nós não precisaremos?"</b>' },
    options: ['won’t we need?', 'don’t we will need?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-3-5',
    sectionId: 'sec-3',
    type: 'multiple_choice',
    title: 'Exercício 5 - Linha do Tempo (Presente/Passado/Futuro)',
    order: 5,
    richText: { text: 'Qual alternativa expressa: <b>"eu trabalho / eu trabalhei / eu trabalharei"</b>?' },
    options: ['I work / I worked / I will work', 'I’m work / I working / I still work'],
    correctOptionIndex: 0
  },

  // --- SECTION 4: TO BE TENSES ---
  {
    id: 'ex-4-1',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 1 - To Be no Presente',
    order: 1,
    richText: { text: 'Preencha a lacuna: <b>"I ___ happy"</b>' },
    options: ['am', 'is', 'are'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-4-2',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 2 - To Be no Presente (Negativa)',
    order: 2,
    richText: { text: 'Preencha a lacuna: <b>"She ___ my sister"</b>' },
    options: ['am not', 'is not', 'are not'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-4-3',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 3 - To Be no Presente (Interrogativa)',
    order: 3,
    richText: { text: 'Preencha a lacuna: <b>"___ she beautiful?"</b>' },
    options: ['am', 'is', 'are'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-4-4',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 4 - To Be no Futuro',
    order: 4,
    richText: { text: 'Preencha a lacuna: <b>"He ___ a vet"</b>' },
    options: ['will are', 'will be', 'will been'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-4-5',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 5 - To Be no Futuro (Negativa)',
    order: 5,
    richText: { text: 'Preencha a lacuna: <b>"She ___ a veterinarian"</b>' },
    options: ['won’t be', 'will don’t be', 'will been not'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-4-6',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 6 - To Be no Passado',
    order: 6,
    richText: { text: 'Preencha a lacuna: <b>"I ___ a student"</b>' },
    options: ['was', 'been', 'were'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-4-7',
    sectionId: 'sec-4',
    type: 'multiple_choice',
    title: 'Exercício 7 - To Be no Passado (Negativa)',
    order: 7,
    richText: { text: 'Preencha a lacuna: <b>"They ___ at my house"</b>' },
    options: ['wasn’t', 'did not', 'weren’t'],
    correctOptionIndex: 2
  },

  // --- SECTION 5: TO BE CONTINUOUS ---
  {
    id: 'ex-5-1',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 1 - Present Continuous',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Eu estou trabalhando"</b>' },
    options: ['I am working', 'I is working', 'I was working'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-5-2',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 2 - Past Continuous',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Eles estavam cozinhando"</b>' },
    options: ['They were cooking', 'They was cooking', 'They are cooking'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-5-3',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 3 - Past Continuous (Negativa)',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Ele não estava vendo"</b>' },
    options: ['He wasn’t seeing', 'He not was seeing', 'He didn’t seeing'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-5-4',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 4 - Future Continuous (Negativa)',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Ela não estará escrevendo"</b>' },
    options: ['She won’t be writing', 'She won’t writing', 'She isn’t writing'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-5-5',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 5 - Future Continuous',
    order: 5,
    richText: { text: 'Traduza corretamente: <b>"Eles estarão ajudando"</b>' },
    options: ['They will be helping', 'They will helping', 'They are helping'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-5-6',
    sectionId: 'sec-5',
    type: 'multiple_choice',
    title: 'Exercício 6 - Future Continuous (Negativa)',
    order: 6,
    richText: { text: 'Traduza corretamente: <b>"Nós não estaremos indo"</b>' },
    options: ['We won’t be going', 'We won’t going', 'We aren’t going'],
    correctOptionIndex: 0
  },

  // --- SECTION 6: WH QUESTIONS ---
  {
    id: 'ex-6-1',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 1 - WH Questions',
    order: 1,
    richText: { text: 'Qual a resposta mais adequada para: <b>"What do you drink?"</b>' },
    options: ['I drink coffee', 'I drink everyday'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-6-2',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 2 - WH Questions',
    order: 2,
    richText: { text: 'Qual a resposta mais adequada para: <b>"Where do you drink?"</b>' },
    options: ['I drink at the restaurant', 'I drink on Fridays'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-6-3',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 3 - WH Questions',
    order: 3,
    richText: { text: 'Qual a resposta mais adequada para: <b>"Why do you drink?"</b>' },
    options: ['I drink because I like', 'I drink with my friends'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-6-4',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 4 - Encontre a pergunta correta',
    order: 4,
    richText: { text: 'Encontre a pergunta adequada para a resposta: <b>"I sometimes have breakfast"</b>' },
    options: ['How often?', 'How?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-6-5',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 5 - Encontre a pergunta correta',
    order: 5,
    richText: { text: 'Encontre a pergunta adequada para a resposta: <b>"I go to school"</b>' },
    options: ['Where?', 'Why?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-6-6',
    sectionId: 'sec-6',
    type: 'multiple_choice',
    title: 'Exercício 6 - Resposta Incoerente (Odd Answer)',
    order: 6,
    richText: { text: 'Selecione a resposta que <b>NÃO</b> se encaixa na pergunta: <b>"Why did you drink coffee?"</b>' },
    options: ['specifically yes', 'because I need', 'because I want'],
    correctOptionIndex: 0
  },

  // --- SECTION 7: PRESENT PERFECT ---
  {
    id: 'ex-7-1',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 1 - Escolha a alternativa correta',
    order: 1,
    richText: { text: 'Preencha a lacuna: <b>"What have you..."</b>' },
    options: ['took', 'taken'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-7-2',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 2 - Escolha a alternativa correta',
    order: 2,
    richText: { text: 'Preencha a lacuna: <b>"How much have you..."</b>' },
    options: ['eaten', 'ate'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-7-3',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 3 - Escolha a alternativa correta',
    order: 3,
    richText: { text: 'Preencha a lacuna: <b>"What has he done?"</b>' },
    options: ['he was done the homework', 'he has done the homework'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-7-4',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 4 - Escolha a alternativa correta',
    order: 4,
    richText: { text: 'Preencha a lacuna: <b>"Why have they passed?"</b>' },
    options: ['because they have studied', 'because they were studied'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-7-5',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 5 - Resposta Adequada',
    order: 5,
    richText: { text: 'Qual a resposta ideal para a pergunta: <b>"Has he eaten anything?"</b>' },
    options: ['he hasn’t eaten', 'he was eating chicken'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-7-6',
    sectionId: 'sec-7',
    type: 'multiple_choice',
    title: 'Exercício 6 - Complementos do Present Perfect',
    order: 6,
    richText: { text: 'Selecione o complemento adequado: <b>"Have you ___ watched this movie?"</b>' },
    options: ['ever', 'been', 'just', 'never'],
    correctOptionIndex: 0
  },

  // --- SECTION 8: THERE TO BE ---
  {
    id: 'ex-8-1',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 1 - There to Be no Passado',
    order: 1,
    richText: { text: 'Preencha a lacuna: <b>"___ a dog yesterday"</b>' },
    options: ['there is', 'there are', 'there was', 'there were', 'there will be'],
    correctOptionIndex: 2
  },
  {
    id: 'ex-8-2',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 2 - There to Be no Futuro',
    order: 2,
    richText: { text: 'Preencha a lacuna: <b>"___ two houses tomorrow"</b>' },
    options: ['there is', 'there are', 'there was', 'there were', 'there will be'],
    correctOptionIndex: 4
  },
  {
    id: 'ex-8-3',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 3 - There to Be no Passado',
    order: 3,
    richText: { text: 'Preencha a lacuna: <b>"___ a man here last monday"</b>' },
    options: ['there is', 'there are', 'there was', 'there were', 'there will be'],
    correctOptionIndex: 2
  },
  {
    id: 'ex-8-4',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 4 - Tradução Adequada',
    order: 4,
    richText: { text: 'Escolha a melhor tradução para: <b>"There is a snake in here"</b>' },
    options: ['tem uma cobra aqui', 'tinha uma cobra aqui'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-8-5',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 5 - Tradução Adequada',
    order: 5,
    richText: { text: 'Escolha a melhor tradução para: <b>"There were people in there"</b>' },
    options: ['haviam pessoas lá', 'há pessoas lá'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-8-6',
    sectionId: 'sec-8',
    type: 'multiple_choice',
    title: 'Exercício 6 - Tradução Adequada (Negativa)',
    order: 6,
    richText: { text: 'Escolha a melhor tradução para: <b>"There wasn’t a plan for this"</b>' },
    options: ['não tinham planos pra isso', 'não tinha um plano pra isso'],
    correctOptionIndex: 1
  },

  // --- SECTION 9: COMPARATIVES & SUPERLATIVES ---
  {
    id: 'ex-9-1',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 1 - Igualdade',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Ela é tão linda quanto eu"</b>' },
    options: ['she is as beautiful as me', 'she is more beautiful than me'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-9-2',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 2 - Comparativo de Superioridade',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Ele é mais alto que você"</b>' },
    options: ['he is taller than you', 'he is more tall than you'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-9-3',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 3 - Superlativo',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Eu sou o mais velho aqui"</b>' },
    options: ['I am the most old here', 'I am the oldest here'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-9-4',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 4 - Comparativo de Superioridade Irregular',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Ela foi melhor que eu"</b>' },
    options: ['she was better than me', 'she the was the best than me'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-9-5',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 5 - Superlativo',
    order: 5,
    richText: { text: 'Preencha a lacuna: <b>"She is ___ in the team"</b>' },
    options: ['the slowest', 'the most slow'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-9-6',
    sectionId: 'sec-9',
    type: 'multiple_choice',
    title: 'Exercício 6 - Superlativo Irregular',
    order: 6,
    richText: { text: 'Preencha a lacuna: <b>"This is not bad, this is ___"</b>' },
    options: ['the worst', 'the baddest'],
    correctOptionIndex: 0
  },

  // --- SECTION 10: MODAL VERBS ---
  {
    id: 'ex-10-1',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 1 - Modal de Habilidade/Capacidade',
    order: 1,
    richText: { text: 'Traduza corretamente: <b>"Eu consigo nadar"</b>' },
    options: ['I can swim', 'I should swim'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-10-2',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 2 - Modal de Possibilidade/Permissão',
    order: 2,
    richText: { text: 'Traduza corretamente: <b>"Ela podia comer"</b>' },
    options: ['she may eat', 'she could eat'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-10-3',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 3 - Modal de Obrigação/Conselho',
    order: 3,
    richText: { text: 'Traduza corretamente: <b>"Nós devemos ir"</b>' },
    options: ['we would go', 'we should go'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-10-4',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 4 - Modal de Dedução Lógica',
    order: 4,
    richText: { text: 'Traduza corretamente: <b>"Eles devem estar felizes"</b> (dedução lógica)' },
    options: ['they would be happy', 'they must be happy'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-10-5',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 5 - Modal Lógico',
    order: 5,
    richText: { text: 'Escolha a opção que faz sentido lógico: <b>"They don’t have money..."</b>' },
    options: ['they must be hungry', 'they could be hungry'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-10-6',
    sectionId: 'sec-10',
    type: 'multiple_choice',
    title: 'Exercício 6 - Modal Lógico',
    order: 6,
    richText: { text: 'Escolha a opção que faz sentido lógico: <b>"You want to be a doctor..."</b>' },
    options: ['you will study hard', 'you must study hard'],
    correctOptionIndex: 1
  },

  // --- SECTION 11: PRONOUNS ---
  {
    id: 'ex-11-1',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 1 - Substituição por Pronome',
    order: 1,
    richText: { text: 'Substitua a expressão sublinhada por um pronome: <b>"You study with <u>that girl</u>"</b>' },
    options: ['her', 'she'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-11-2',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 2 - Substituição por Pronome',
    order: 2,
    richText: { text: 'Substitua a expressão sublinhada por um pronome: <b>"My mother teach <u>the students</u>"</b>' },
    options: ['they', 'them'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-11-3',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 3 - Substituição por Pronome Possessivo',
    order: 3,
    richText: { text: 'Substitua a expressão sublinhada por um pronome: <b>"That is <u>John’s</u> car"</b>' },
    options: ['his', 'he'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-11-4',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 4 - Pronomes Possessivos',
    order: 4,
    richText: { text: 'Escolha a opção correta: <b>"This is ___ car"</b>' },
    options: ['they', 'their'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-11-5',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 5 - Pronomes Possessivos',
    order: 5,
    richText: { text: 'Escolha a opção correta: <b>"The car in the street is ___"</b>' },
    options: ['our', 'ours'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-11-6',
    sectionId: 'sec-11',
    type: 'multiple_choice',
    title: 'Exercício 6 - Pronomes Possessivos',
    order: 6,
    richText: { text: 'Escolha a opção correta: <b>"Is that house ___?"</b>' },
    options: ['your', 'yours'],
    correctOptionIndex: 1
  },

  // --- SECTION 12: QUANTIFIERS ---
  {
    id: 'ex-12-1',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 1 - Quantificadores em Perguntas',
    order: 1,
    richText: { text: 'Escolha a palavra adequada: <b>"Do you need ____"</b>' },
    options: ['anything', 'something', 'nothing'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-12-2',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 2 - Quantificadores em Negativas',
    order: 2,
    richText: { text: 'Escolha a palavra adequada: <b>"I don’t play ___"</b>' },
    options: ['anything', 'something', 'nothing'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-12-3',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 3 - Quantificadores em Afirmativas',
    order: 3,
    richText: { text: 'Escolha a palavra adequada: <b>"I want to eat ___"</b>' },
    options: ['anything', 'something', 'nothing'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-12-4',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 4 - Quantificadores de Lugar',
    order: 4,
    richText: { text: 'Escolha a palavra adequada: <b>"They traveled ___"</b>' },
    options: ['anywhere', 'somewhere', 'nowhere'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-12-5',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 5 - Quantificadores de Pessoas',
    order: 5,
    richText: { text: 'Escolha a palavra adequada: <b>"They talked to ___"</b>' },
    options: ['anybody', 'somebody', 'nobody'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-12-6',
    sectionId: 'sec-12',
    type: 'multiple_choice',
    title: 'Exercício 6 - Quantificadores de Quantidade',
    order: 6,
    richText: { text: 'Escolha a palavra adequada: <b>"I have ___ friends"</b>' },
    options: ['any', 'some', 'no'],
    correctOptionIndex: 1
  },

  // --- SECTION 13: CONJUNCTIONS ---
  {
    id: 'ex-13-1',
    sectionId: 'sec-13',
    type: 'multiple_choice',
    title: 'Exercício 1 - Conjunções no Contexto',
    order: 1,
    richText: { text: 'Escolha a conjunção correta para preencher a frase:<br/>"I am a religious person, me <b>[blank]</b> my family love to go to church..."' },
    options: ['and', 'but'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-13-2',
    sectionId: 'sec-13',
    type: 'multiple_choice',
    title: 'Exercício 2 - Conjunções no Contexto',
    order: 2,
    richText: { text: 'Escolha a conjunção correta para preencher a frase:<br/>"...on Sundays, <b>[blank]</b> we never stay a lot in the church because on Sundays we like to go to the park too."' },
    options: ['but', 'with'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-13-3',
    sectionId: 'sec-13',
    type: 'multiple_choice',
    title: 'Exercício 3 - Conjunções no Contexto',
    order: 3,
    richText: { text: 'Escolha a conjunção correta para preencher a frase:<br/>"So we stay some hours <b>[blank]</b> after that we come back home..."' },
    options: ['or', 'and'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-13-4',
    sectionId: 'sec-13',
    type: 'multiple_choice',
    title: 'Exercício 4 - Conjunções no Contexto',
    order: 4,
    richText: { text: 'Escolha a conjunção correta para preencher a frase:<br/>"I really like my life, sometimes I’m sad <b>[blank]</b> I try to be happy somehow..."' },
    options: ['or', 'but'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-13-5',
    sectionId: 'sec-13',
    type: 'multiple_choice',
    title: 'Exercício 5 - Conjunções no Contexto',
    order: 5,
    richText: { text: 'Escolha a conjunção correta para preencher a frase:<br/>"Life is short to complain, I live <b>[blank]</b> my dog in my house..."' },
    options: ['but', 'with'],
    correctOptionIndex: 1
  },

  // --- SECTION 14: POSSESSIVE ADJECTIVES ---
  {
    id: 'ex-14-1',
    sectionId: 'sec-14',
    type: 'multiple_choice',
    title: 'Exercício 1 - Adjetivos Possessivos (Fácil)',
    order: 1,
    richText: { text: 'Complete a frase de forma equivalente:<br/>"I have a black dog. -> <b>My dog...</b>"' },
    options: ['is black', 'has black', 'is a black dog'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-14-2',
    sectionId: 'sec-14',
    type: 'multiple_choice',
    title: 'Exercício 2 - Adjetivos Possessivos (Fácil)',
    order: 2,
    richText: { text: 'Complete a frase de forma equivalente:<br/>"You have a big house. -> <b>Your house...</b>"' },
    options: ['is big', 'is a big house', 'big'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-14-3',
    sectionId: 'sec-14',
    type: 'multiple_choice',
    title: 'Exercício 3 - Adjetivos Possessivos (Fácil)',
    order: 3,
    richText: { text: 'Complete a frase de forma equivalente:<br/>"She has a blue bike. -> <b>Her bike...</b>"' },
    options: ['is blue', 'is blue bike', 'blue'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-14-4',
    sectionId: 'sec-14',
    type: 'multiple_choice',
    title: 'Exercício 4 - Adjetivos Possessivos (Médio)',
    order: 4,
    richText: { text: 'Complete a frase de forma equivalente:<br/>"Katherine had a dark horse. -> <b>Her horse...</b>"' },
    options: ['was dark', 'is dark', 'dark'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-14-5',
    sectionId: 'sec-14',
    type: 'multiple_choice',
    title: 'Exercício 5 - Adjetivos Possessivos (Médio)',
    order: 5,
    richText: { text: 'Complete a frase de forma equivalente:<br/>"John had a long day. -> <b>His day...</b>"' },
    options: ['was long', 'long', 'is long'],
    correctOptionIndex: 0
  },

  // --- SECTION 15: ADVERBS OF MANNER ---
  {
    id: 'ex-15-1',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 1 - Formação de Advérbios',
    order: 1,
    richText: { text: 'Preencha a lacuna com o advérbio correto:<br/>"She was <b>calm</b> when she played, so she played ___"' },
    options: ['calmly', 'calm', 'calmer'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-15-2',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 2 - Formação de Advérbios',
    order: 2,
    richText: { text: 'Preencha a lacuna com o advérbio correto:<br/>"They were <b>happy</b> driving, so they drove ___"' },
    options: ['happily', 'happy', 'happylike'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-15-3',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 3 - Formação de Advérbios',
    order: 3,
    richText: { text: 'Preencha a lacuna com o advérbio correto:<br/>"He was <b>slow</b> to fix the machine, so he fixed the machine ___"' },
    options: ['slowly', 'slow', 'slowest'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-15-4',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 4 - Advérbio Irregular',
    order: 4,
    richText: { text: 'Preencha a lacuna com o advérbio correto:<br/>"We are <b>good</b> when we play soccer, so we play soccer ___"' },
    options: ['well', 'good', 'goodly'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-15-5',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 5 - Tradução de Advérbios',
    order: 5,
    richText: { text: 'Qual a tradução da palavra em destaque: <b>"She dressed <u>quickly</u> to work"</b>?' },
    options: ['rapidamente', 'calmamente', 'silenciosamente'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-15-6',
    sectionId: 'sec-15',
    type: 'multiple_choice',
    title: 'Exercício 6 - Tradução de Advérbios',
    order: 6,
    richText: { text: 'Qual a tradução da palavra em destaque: <b>"She broke her cellphone <u>accidentally</u>"</b>?' },
    options: ['acidentalmente', 'propositadamente', 'rapidamente'],
    correctOptionIndex: 0
  },

  // --- SECTION 16: RELATIVE CLAUSES ---
  {
    id: 'ex-16-1',
    sectionId: 'sec-16',
    type: 'multiple_choice',
    title: 'Exercício 1 - Combinação de Frases com "Who"',
    order: 1,
    richText: { text: 'Escolha a frase que junta corretamente as duas ideias usando um pronome relativo:<br/><b>"Luke is my friend"</b> + (professor / who)' },
    options: ['Luke, who is a professor, is my friend', 'Luke is my friend who is professor'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-16-2',
    sectionId: 'sec-16',
    type: 'multiple_choice',
    title: 'Exercício 2 - Combinação de Frases com "Who"',
    order: 2,
    richText: { text: 'Escolha a frase que junta corretamente as duas ideias usando um pronome relativo:<br/><b>"Kathy was a terrible player"</b> + (guitar / who)' },
    options: ['Kathy, who played guitar, was a terrible player', 'Kathy was a terrible player who guitar'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-16-3',
    sectionId: 'sec-16',
    type: 'multiple_choice',
    title: 'Exercício 3 - Combinação de Frases com "Where"',
    order: 3,
    richText: { text: 'Escolha a frase que junta corretamente as duas ideias usando um pronome relativo:<br/><b>"That stadium is really big"</b> + (exploded / where)' },
    options: ['That stadium where the bomb exploded is really big', 'That stadium is really big where exploded'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-16-4',
    sectionId: 'sec-16',
    type: 'multiple_choice',
    title: 'Exercício 4 - Combinação de Frases com "That"',
    order: 4,
    richText: { text: 'Escolha a frase que junta corretamente as duas ideias usando um pronome relativo:<br/><b>"My computer is really important for me"</b> + (study / that)' },
    options: ['My computer that I use to study is really important for me', 'My computer is really important for me that study'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-16-5',
    sectionId: 'sec-16',
    type: 'multiple_choice',
    title: 'Exercício 5 - Combinação de Frases com "When"',
    order: 5,
    richText: { text: 'Escolha a frase que junta corretamente as duas ideias usando um pronome relativo:<br/><b>"December we go to the beach"</b> + (Christmas / when)' },
    options: ['December, when we have Christmas, we go to the beach', 'December we go to the beach when Christmas'],
    correctOptionIndex: 0
  },

  // --- SECTION 17: TAG QUESTIONS ---
  {
    id: 'ex-17-1',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 1 - Tag Questions',
    order: 1,
    richText: { text: 'Escolha a Tag Question correta:<br/>"You are a student, <b>_______?</b>"' },
    options: ['are you?', 'aren’t you?'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-17-2',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 2 - Tag Questions',
    order: 2,
    richText: { text: 'Escolha a Tag Question correta:<br/>"They are friends, <b>_______?</b>"' },
    options: ['aren’t they?', 'do they?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-17-3',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 3 - Tag Questions',
    order: 3,
    richText: { text: 'Escolha a Tag Question correta:<br/>"She is your sister, <b>_______?</b>"' },
    options: ['is she?', 'isn’t she?'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-17-4',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 4 - Tag Questions',
    order: 4,
    richText: { text: 'Escolha a Tag Question correta:<br/>"I wasn’t here, <b>_______?</b>"' },
    options: ['was I?', 'wasn’t I?'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-17-5',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 5 - Tag Questions',
    order: 5,
    richText: { text: 'Escolha a Tag Question correta:<br/>"You like coffee, <b>_______?</b>"' },
    options: ['are you?', 'don’t you?'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-17-6',
    sectionId: 'sec-17',
    type: 'multiple_choice',
    title: 'Exercício 6 - Tag Questions',
    order: 6,
    richText: { text: 'Escolha a Tag Question correta:<br/>"He has kids, <b>_______?</b>"' },
    options: ['has he?', 'doesn’t he?'],
    correctOptionIndex: 1
  },

  // --- SECTION 18: PREPOSITIONS OF PLACE ---
  {
    id: 'ex-18-1',
    sectionId: 'sec-18',
    type: 'multiple_choice',
    title: 'Exercício 1 - Preposição "In"',
    order: 1,
    richText: { text: 'Se a caixa preta está dentro de uma caixa branca:<br/>"The black box is <b>_______</b> the white box."' },
    options: ['in', 'on', 'under', 'behind'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-18-2',
    sectionId: 'sec-18',
    type: 'multiple_choice',
    title: 'Exercício 2 - Preposição "On"',
    order: 2,
    richText: { text: 'Se a caixa preta está em cima de uma caixa branca:<br/>"The black box is <b>_______</b> the white box."' },
    options: ['on', 'under', 'in front of', 'between'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-18-3',
    sectionId: 'sec-18',
    type: 'multiple_choice',
    title: 'Exercício 3 - Preposição "Under"',
    order: 3,
    richText: { text: 'Se a caixa preta está debaixo de uma caixa branca:<br/>"The black box is <b>_______</b> the white box."' },
    options: ['under', 'above', 'on the side', 'among'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-18-4',
    sectionId: 'sec-18',
    type: 'multiple_choice',
    title: 'Exercício 4 - Preposição "On the side"',
    order: 4,
    richText: { text: 'Se a caixa preta está ao lado de uma caixa branca:<br/>"The black box is <b>_______</b> the white box."' },
    options: ['on the side', 'above', 'between', 'in'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-18-5',
    sectionId: 'sec-18',
    type: 'multiple_choice',
    title: 'Exercício 5 - Preposição "Between"',
    order: 5,
    richText: { text: 'Se a caixa preta está no meio de duas caixas brancas:<br/>"The black box is <b>_______</b> the white boxes."' },
    options: ['between', 'among', 'on', 'under'],
    correctOptionIndex: 0
  },

  // --- SECTION 19: PHONETICS ---
  {
    id: 'ex-19-1',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 1 - Som da Letra "A"',
    order: 1,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"A"</b> em inglês?' },
    options: ['/ei/ "Meire"', '/a/ "Árvore"'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-19-2',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 2 - Som da Letra "B"',
    order: 2,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"B"</b> em inglês?' },
    options: ['/bei/ "Beiço"', '/bí/ "Bicicleta"'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-19-3',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 3 - Som da Letra "C"',
    order: 3,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"C"</b> em inglês?' },
    options: ['/sí/ "Silmara"', '/cei/ "Parceiro"'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-19-4',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 4 - Som da Letra "D"',
    order: 4,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"D"</b> em inglês?' },
    options: ['/dí/ "Dia"', '/dei/ "Deitar"'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-19-5',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 5 - Som da Letra "E"',
    order: 5,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"E"</b> em inglês?' },
    options: ['/í/ "Iguana"', '/ei/ "Feijão"'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-19-6',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 6 - Som da Letra "I"',
    order: 6,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"I"</b> em inglês?' },
    options: ['/ei/ "Viajei"', '/ai/ "Tainara"'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-19-7',
    sectionId: 'sec-19',
    type: 'multiple_choice',
    title: 'Exercício 7 - Som da Letra "K"',
    order: 7,
    richText: { text: 'Qual palavra soa mais perto da pronúncia correta da letra <b>"K"</b> em inglês?' },
    options: ['/quei/ "Queijo"', '/qui/ "Quiabo"'],
    correctOptionIndex: 0
  },

  // --- SECTION 20: MORPHOLOGY AND SYNTAX ---
  {
    id: 'ex-20-1',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 1 - Sufixos',
    order: 1,
    richText: { text: 'Escolha o sufixo correto para expressar a ausência de lar (sem teto): <b>"home____"</b>' },
    options: ['-less', '-ness'],
    correctOptionIndex: 0
  },
  {
    id: 'ex-20-2',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 2 - Sufixos',
    order: 2,
    richText: { text: 'Escolha o sufixo correto para o substantivo derivado de insist: <b>"insist____"</b>' },
    options: ['-ive', '-ence'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-20-3',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 3 - Prefixos',
    order: 3,
    richText: { text: 'Escolha o prefixo de negação correto para a palavra possible: <b>"____possible"</b>' },
    options: ['mis-', 'im-'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-20-4',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 4 - Prefixos',
    order: 4,
    richText: { text: 'Escolha o prefixo correto para a palavra respect: <b>"____respect"</b>' },
    options: ['ir-', 'dis-'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-20-5',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 5 - Significado Morfológico',
    order: 5,
    richText: { text: 'Qual o significado correto do radical em destaque na palavra <b>biology</b>?' },
    options: ['related to think (pensar)', 'related to study (estudo)'],
    correctOptionIndex: 1
  },
  {
    id: 'ex-20-6',
    sectionId: 'sec-20',
    type: 'multiple_choice',
    title: 'Exercício 6 - Significado Morfológico',
    order: 6,
    richText: { text: 'Qual o significado correto do radical em destaque na palavra <b>psychology</b>?' },
    options: ['related to the mind (mente)', 'related to problems (problemas)'],
    correctOptionIndex: 0
  }
];
