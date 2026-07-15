import { Question } from "./types";

export const categories = [
  "Mathematics",
  "Logic",
  "Linguistics",
  "Spatial",
  "Memory",
  "Science",
  "Patterns",
  "Quantitative",
  "Philosophy",
  "Processing"
] as const;

export const categoryColors: Record<string, string> = {
  Mathematics: "#3B82F6",
  Logic: "#8B5CF6",
  Linguistics: "#EC4899",
  Spatial: "#06B6D4",
  Memory: "#F59E0B",
  Science: "#10B981",
  Patterns: "#F97316",
  Quantitative: "#6366F1",
  Philosophy: "#A78BFA",
  Processing: "#14B8A6"
};

export const questionBank: Question[] = [
  // ==================== MATHEMATICS ====================
  {
    id: 1,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 1,
    question: "If a sphere is inscribed inside a cube of side length 6, what is the volume of the space inside the cube but outside the sphere?",
    options: {
      A: "216 - 36π",
      B: "216 - 18π",
      C: "108 - 18π",
      D: "216 - 72π"
    },
    correct: "A",
    explanation: "The volume of the cube is s³ = 6³ = 216. The sphere has diameter 6, meaning radius r = 3. Its volume is (4/3)πr³ = (4/3)π(27) = 36π."
  },
  {
    id: 2,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 2,
    question: "A prime number p has the property that p + 2 and p + 4 are also prime. How many such prime numbers p exist?",
    options: {
      A: "Exactly 1",
      B: "Exactly 2",
      C: "Infinitely many",
      D: "None"
    },
    correct: "A",
    explanation: "Only p = 3 satisfies this (3, 5, 7 are prime). For any other prime p, one of p, p+2, or p+4 must be a multiple of 3, thus composite."
  },
  {
    id: 3,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 3,
    question: "Find the positive integer value of x that satisfies the equation: log_x(2) + log_2(x) = 2.5",
    options: {
      A: "2",
      B: "4",
      C: "8",
      D: "16"
    },
    correct: "B",
    explanation: "Setting log_2(x) = y, we get 1/y + y = 2.5, which solves to y = 2 or y = 0.5. Thus x = 2² = 4 (positive integer) or x = 2^0.5 = √2."
  },
  {
    id: 4,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 1,
    question: "What is the remainder when 3^2026 is divided by 10?",
    options: {
      A: "1",
      B: "3",
      C: "9",
      D: "7"
    },
    correct: "C",
    explanation: "Powers of 3 modulo 10 cycle through 3, 9, 7, 1 (period of 4). Since 2026 mod 4 = 2, the units digit is the second in the cycle, which is 9."
  },
  {
    id: 5,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 2,
    question: "Let f(x) = x³ - 3x² + 3x. Find the derivative of the composite function f(f(x)) evaluated at x = 1.",
    options: {
      A: "0",
      B: "1",
      C: "3",
      D: "9"
    },
    correct: "A",
    explanation: "By the chain rule, (f(f(x)))' = f'(f(x)) * f'(x). Since f'(x) = 3x² - 6x + 3, evaluating at x = 1 gives f'(1) = 3 - 6 + 3 = 0, making the whole derivative 0."
  },
  {
    id: 6,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 3,
    question: "A container has 10 red and 10 blue balls. If 3 balls are drawn at random without replacement, what is the probability that at least 2 are red?",
    options: {
      A: "3/8",
      B: "1/2",
      C: "7/12",
      D: "5/8"
    },
    correct: "B",
    explanation: "By symmetry, since the number of red and blue balls is equal, the probability of drawing more red than blue is exactly equal to drawing more blue than red, which is 1/2."
  },
  {
    id: 7,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 1,
    question: "Find the sum of the infinite geometric series: 1/2 + 2/4 + 3/8 + 4/16 + ...",
    options: {
      A: "1.5",
      B: "2",
      C: "2.5",
      D: "3"
    },
    correct: "B",
    explanation: "This is an arithmetico-geometric series. Letting S = sum_{n=1}^inf n/2^n, we can subtract S/2 = sum_{n=1}^inf n/2^{n+1} to get S/2 = sum_{n=1}^inf 1/2^n = 1. Hence, S = 2."
  },
  {
    id: 8,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 2,
    question: "How many positive integer divisors does the number 2026 have?",
    options: {
      A: "2",
      B: "3",
      C: "8",
      D: "4"
    },
    correct: "D",
    explanation: "The prime factorization of 2026 is 2 * 1013 (where 1013 is prime). The number of divisors is therefore (1 + 1) * (1 + 1) = 4 (divisors are 1, 2, 1013, 2026)."
  },
  {
    id: 9,
    category: "Mathematics",
    categoryColor: "#3B82F6",
    difficulty: 3,
    question: "A square matrix A satisfies the equation A² - A + I = 0, where I is the identity matrix. What is A⁶ equal to?",
    options: {
      A: "A",
      B: "-I",
      C: "I",
      D: "0"
    },
    correct: "C",
    explanation: "Multiply A² - A + I = 0 by (A + I) to get A³ + I = 0, which means A³ = -I. Squaring both sides yields A⁶ = (-I)² = I."
  },

  // ==================== LOGIC ====================
  {
    id: 10,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 1,
    question: "Five people sit in a row. A cannot sit next to B. C must sit next to D. How many valid seating arrangements exist?",
    options: {
      A: "12",
      B: "18",
      C: "24",
      D: "36"
    },
    correct: "C",
    explanation: "Treat CD as a single unit (2! ways). Total arrangements of {A, B, E, (CD)} is 4! * 2! = 48. From this, subtract cases where A and B are adjacent (treat AB and CD as units, so 3! * 2! * 2! = 24). 48 - 24 = 24."
  },
  {
    id: 11,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 2,
    question: "If some Glips are Glops, and all Glops are Glups, which of the following statements must be logically true?",
    options: {
      A: "All Glips are Glups",
      B: "Some Glips are Glups",
      C: "No Glips are Glups",
      D: "Some Glups are not Glips"
    },
    correct: "B",
    explanation: "Since some Glips are Glops, and every Glop is guaranteed to be a Glup, those Glips that are Glops must also be Glups."
  },
  {
    id: 12,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 3,
    question: "On an island, residents are either Knights (always tell the truth) or Knaves (always lie). Resident A says: 'At least one of us is a Knave.' Resident B says nothing. What are A and B?",
    options: {
      A: "Both are Knaves",
      B: "A is a Knight, B is a Knave",
      C: "A is a Knave, B is a Knight",
      D: "Both are Knights"
    },
    correct: "B",
    explanation: "If A were a Knave, his statement would be false, meaning both are Knights (contradicting A is a Knave). Thus A is a Knight, his statement is true, meaning at least one is a Knave, which must be B."
  },
  {
    id: 13,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 1,
    question: "A grandfather clock strikes once at 1:00, twice at 2:00, and so on. It also strikes exactly once on every half-hour. How many times does it strike in a full 24-hour day?",
    options: {
      A: "180",
      B: "156",
      C: "144",
      D: "204"
    },
    correct: "A",
    explanation: "The hour strikes sum to 1 + 2 + ... + 12 = 78, happening twice in 24 hours (156 strikes). There are 24 half-hour marks, adding 24 strikes. 156 + 24 = 180."
  },
  {
    id: 14,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 2,
    question: "If P is true, then Q is true. If Q is false, then R is false. If R is true, what is the logical status of P and Q?",
    options: {
      A: "P is true, Q is undetermined",
      B: "Both P and Q must be true",
      C: "Both P and Q are undetermined",
      D: "Q must be true, but P is undetermined"
    },
    correct: "D",
    explanation: "If Q is false, R is false. By contrapositive, if R is true, Q must be true. However, Q being true does not logically force P to be true (affirming the consequent)."
  },
  {
    id: 15,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 3,
    question: "Three boxes contain fruits. Box 1 is labeled Apples, Box 2 Oranges, and Box 3 Apples & Oranges. Every box is mislabeled. You draw an Apple from Box 3. What are the true contents of Box 1 and Box 2?",
    options: {
      A: "Box 1 has Oranges, Box 2 has Apples",
      B: "Box 1 has Apples & Oranges, Box 2 has Apples",
      C: "Box 1 has Oranges, Box 2 has Apples & Oranges",
      D: "Box 1 has Apples & Oranges, Box 2 has Oranges"
    },
    correct: "C",
    explanation: "Since Box 3 is mislabeled, it cannot contain Apples & Oranges. Drawing an Apple means Box 3 contains Apples. Box 2 (labeled Oranges) must contain Apples & Oranges (as it cannot be Oranges or Apples). Thus, Box 1 has Oranges."
  },
  {
    id: 16,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 1,
    question: "Four cards have a number on one side and a letter on the other. Rule: 'If a card has an even number, it must have a vowel on the other.' Cards show: [4], [7], [A], [B]. Which cards must you turn over to test this rule?",
    options: {
      A: "4 and A",
      B: "7 and B",
      C: "4 and 7",
      D: "4 and B"
    },
    correct: "D",
    explanation: "To test 'P => Q', you must check P (even number 4) to ensure Q is true, and check not-Q (consonant B) to ensure P is not true (contrapositive). Checking vowels or odd numbers is redundant."
  },
  {
    id: 17,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 2,
    question: "A cube is painted blue on all outer faces, then sliced into 27 equal smaller cubes. How many of these small cubes have exactly two blue painted faces?",
    options: {
      A: "8",
      B: "6",
      C: "12",
      D: "18"
    },
    correct: "C",
    explanation: "Cubes with exactly two painted faces lie along the edges of the original cube (excluding the corners). A cube has 12 edges, and there is exactly 1 such cube per edge."
  },
  {
    id: 18,
    category: "Logic",
    categoryColor: "#8B5CF6",
    difficulty: 3,
    question: "If 'A - C' means A is the brother of C, and 'C + B' means C is the father of B, which expression represents that A is the uncle of B?",
    options: {
      A: "A - C + B",
      B: "A + C - B",
      C: "B - C + A",
      D: "A - B + C"
    },
    correct: "A",
    explanation: "A - C means A is the brother of C. C + B means C is the father of B. Therefore, C's brother A is the uncle of B."
  },

  // ==================== LINGUISTICS ====================
  {
    id: 19,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 1,
    question: "Which of the following words is the direct antonym of the word 'Ephemeral'?",
    options: {
      A: "Transient",
      B: "Perpetual",
      C: "Fleeting",
      D: "Evanescent"
    },
    correct: "B",
    explanation: "Ephemeral means lasting for a very short time. Perpetual means never ending or changing, making it the direct opposite."
  },
  {
    id: 20,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 2,
    question: "Complete the analogical relationship: 'Pernicious' is to 'Harmful' as 'Pusillanimous' is to...",
    options: {
      A: "Bold",
      B: "Cowardly",
      C: "Generous",
      D: "Intelligent"
    },
    correct: "B",
    explanation: "Pernicious is a synonym for extremely harmful. Pusillanimous is a synonym for showing a lack of courage, or cowardly."
  },
  {
    id: 21,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 3,
    question: "Which of the following literary sentences contains a clear example of a 'Zeugma'?",
    options: {
      A: "The leaves danced in the howling wind.",
      B: "The crimson liquid spilled onto the snow.",
      C: "He took his hat and his leave.",
      D: "I can resist anything except temptation."
    },
    correct: "C",
    explanation: "A zeugma is a figure of speech where a single verb applies to two nouns in entirely different senses (concrete 'took his hat' vs. abstract 'took his leave')."
  },
  {
    id: 22,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 1,
    question: "What is the primary definition of the word 'Obfuscate'?",
    options: {
      A: "To clarify an argument",
      B: "To render obscure, unclear, or unintelligible",
      C: "To predict future events",
      D: "To simplify a mechanism"
    },
    correct: "B",
    explanation: "To obfuscate means to make something obscure, dark, or difficult to understand."
  },
  {
    id: 23,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 2,
    question: "Complete the analogical pair: 'Sycophant' is to 'Flattery' as 'Iconoclast' is to...",
    options: {
      A: "Rebellion",
      B: "Conformity",
      C: "Sculpture",
      D: "Isolation"
    },
    correct: "A",
    explanation: "A sycophant is characterized by flattery. An iconoclast is characterized by rebellion (destroying established images, dogmas, or institutions)."
  },
  {
    id: 24,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 3,
    question: "Identify the word containing Latin roots that literally translate to 'all-knowing':",
    options: {
      A: "Omnipotent",
      B: "Omniscient",
      C: "Ubiquitous",
      D: "Prescient"
    },
    correct: "B",
    explanation: "Omniscient combines the Latin roots 'omnis' (all) and 'scientia' (knowledge), meaning all-knowing."
  },
  {
    id: 25,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 1,
    question: "Select the most accurate synonym for the word 'Taciturn':",
    options: {
      A: "Talkative",
      B: "Reserved",
      C: "Loquacious",
      D: "Hostile"
    },
    correct: "B",
    explanation: "Taciturn describes a person who is reserved, quiet, or untalkative in speech."
  },
  {
    id: 26,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 2,
    question: "In semantics and cognitive science, the term 'Heuristic' refers to which of the following?",
    options: {
      A: "An interactive, practical method of problem-solving",
      B: "A thorough mathematical proof",
      C: "A rigorous scientific validation process",
      D: "A chronological timeline analysis"
    },
    correct: "A",
    explanation: "A heuristic is a practical, 'rule-of-thumb' approach to problem-solving that is sufficient for immediate goals but not guaranteed to be optimal."
  },
  {
    id: 27,
    category: "Linguistics",
    categoryColor: "#EC4899",
    difficulty: 3,
    question: "Complete the analogy: 'Anachronism' is to 'Time' as 'Solecism' is to...",
    options: {
      A: "Grammar",
      B: "Geography",
      C: "Mathematics",
      D: "Logic"
    },
    correct: "A",
    explanation: "An anachronism is an error in chronology or time placement. A solecism is a grammatical mistake or breach of etiquette."
  },

  // ==================== SPATIAL ====================
  {
    id: 28,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 1,
    question: "A cube is unfolded into a 2D plane. Which of the following layouts CANNOT be folded back into a 3D cube?",
    options: {
      A: "T-shape (4-in-a-row with 2 opposite wings)",
      B: "Cross shape (4-in-a-row with 2 wings on the same side)",
      C: "Z-shape (3-in-a-row with 3 staggered)",
      D: "Line-of-5 (5-in-a-row with 1 side wing)"
    },
    correct: "D",
    explanation: "A valid cube net can have at most 4 squares in a single line. Five in a row leads to overlapping faces, leaving one end of the cube completely open."
  },
  {
    id: 29,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 2,
    question: "An analog clock reads 3:15. If the clock itself is rotated 90 degrees counter-clockwise on the wall, what time do the hands point to in the new spatial frame?",
    options: {
      A: "9:45",
      B: "12:00",
      C: "6:30",
      D: "1:15"
    },
    correct: "B",
    explanation: "At 3:15, both hands point horizontally to the 3. Rotating the clock 90° counter-clockwise swings the 3 position up to the 12 position. Hence, both hands point to the 12."
  },
  {
    id: 30,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 3,
    question: "Which three-dimensional geometric solid produces a triangle from the front view, a circle from the bottom view, and a triangle from the side view?",
    options: {
      A: "Cone",
      B: "Square Pyramid",
      C: "Sphere",
      D: "Triangular Prism"
    },
    correct: "A",
    explanation: "A cone has a circular base (circle from bottom) and tapers to a point (producing triangles from the front and side orthogonal projections)."
  },
  {
    id: 31,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 1,
    question: "How many total individual triangles are present in a regular hexagram (Star of David)?",
    options: {
      A: "6",
      B: "8",
      C: "10",
      D: "12"
    },
    correct: "B",
    explanation: "A Star of David has 6 small outer triangles (the points of the star) and 2 large intersecting central triangles. 6 + 2 = 8 triangles."
  },
  {
    id: 32,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 2,
    question: "On a standard six-sided die, opposite faces always sum to 7. If the top face is 5 and the front face is 3, what number lies on the right-hand face?",
    options: {
      A: "1",
      B: "6",
      C: "2",
      D: "4"
    },
    correct: "A",
    explanation: "Opposite to 5 is 2 (bottom). Opposite to 3 is 4 (back). The remaining faces are 1 and 6. Standard dice are right-handed: 1, 2, 3 run counter-clockwise around their shared corner. If 5 is top and 3 is front, 1 is on the right."
  },
  {
    id: 33,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 3,
    question: "A three-dimensional boundary projection of a four-dimensional hypercube (tesseract) consists of how many cubic boundary cells?",
    options: {
      A: "4",
      B: "6",
      C: "8",
      D: "16"
    },
    correct: "C",
    explanation: "Just as a 3D cube is bounded by 6 2D squares, a 4D tesseract is bounded by 8 3D cubes."
  },
  {
    id: 34,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 1,
    question: "What is the minimum number of straight, continuous planar cuts required to divide a circular pizza into exactly 8 equal slices?",
    options: {
      A: "3",
      B: "4",
      C: "8",
      D: "6"
    },
    correct: "A",
    explanation: "Three straight cuts intersecting at the center of the circle at 45-degree angles will produce exactly 8 equal sectors."
  },
  {
    id: 35,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 2,
    question: "A solid 3x3x3 wooden cube is painted black on all six outer faces. It is then sliced into 27 smaller 1x1x1 cubes. How many of these small cubes have exactly one painted face?",
    options: {
      A: "4",
      B: "6",
      C: "8",
      D: "12"
    },
    correct: "B",
    explanation: "Small cubes with exactly one painted face are those situated in the center of each of the 6 faces of the large 3x3x3 cube. Thus, there are exactly 6 such cubes."
  },
  {
    id: 36,
    category: "Spatial",
    categoryColor: "#06B6D4",
    difficulty: 3,
    question: "If a solid sphere is sliced by 4 distinct intersecting planes, what is the maximum number of pieces it can be partitioned into?",
    options: {
      A: "11",
      B: "14",
      C: "15",
      D: "16"
    },
    correct: "C",
    explanation: "The formula for the maximum number of regions in 3D space divided by n planes is (n³ + 5n + 6) / 6. For n = 4, this is (64 + 20 + 6) / 6 = 15 pieces."
  },

  // ==================== MEMORY ====================
  {
    id: 37,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 1,
    question: "If the word 'NEURAL' is encoded numerically as '14-5-21-18-1-12', which sequence encodes the word 'EDGE'?",
    options: {
      A: "5-3-7-5",
      B: "5-4-7-5",
      C: "4-5-6-4",
      D: "5-4-8-5"
    },
    correct: "B",
    explanation: "The encoding corresponds directly to the 1-based position of each letter in the English alphabet: E=5, D=4, G=7, E=5."
  },
  {
    id: 38,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 2,
    question: "Recall the sequence: 4, 8, 12, 24, 28, 56, 60. Which of the following numbers should logically succeed this sequence?",
    options: {
      A: "64",
      B: "100",
      C: "120",
      D: "116"
    },
    correct: "C",
    explanation: "The pattern alternates between doubling and adding four: 4(*2)=8, 8(+4)=12, 12(*2)=24, 24(+4)=28, 28(*2)=56, 56(+4)=60. The next step is 60(*2) = 120."
  },
  {
    id: 39,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 3,
    question: "In neuroanatomy, a common mnemonic for cranial nerves is 'Oh, Oh, Oh, To Touch And Feel Very Good Velvet, Ah, Heaven'. What nerve does the eighth word 'Very' represent?",
    options: {
      A: "Vestibulocochlear",
      B: "Vagus",
      C: "Visual",
      D: "Vocal"
    },
    correct: "A",
    explanation: "The mnemonic stands for: Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear (eighth nerve)."
  },
  {
    id: 40,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 1,
    question: "In the international NATO phonetic alphabet, which code word is designated to represent the letter 'S'?",
    options: {
      A: "Sierra",
      B: "Shadow",
      C: "Sugar",
      D: "Sam"
    },
    correct: "A",
    explanation: "The letter 'S' is standardized as 'Sierra' in the NATO phonetic alphabet."
  },
  {
    id: 41,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 2,
    question: "In the Roman numeral notation system, what numerical value is represented by the character 'D'?",
    options: {
      A: "50",
      B: "100",
      C: "500",
      D: "1000"
    },
    correct: "C",
    explanation: "The Roman numeral characters represent: I=1, V=5, X=10, L=50, C=100, D=500, M=1000."
  },
  {
    id: 42,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 3,
    question: "What is the seventh decimal digit of the mathematical constant Pi (π ≈ 3.14159265...)?",
    options: {
      A: "5",
      B: "6",
      C: "2",
      D: "8"
    },
    correct: "B",
    explanation: "The digits of π after the decimal point are 1 (1st), 4 (2nd), 1 (3rd), 5 (4th), 9 (5th), 2 (6th), 6 (7th)."
  },
  {
    id: 43,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 1,
    question: "Which of the following colors is NOT a component of the standard primary additive color wheel (RGB)?",
    options: {
      A: "Green",
      B: "Yellow",
      C: "Blue",
      D: "Red"
    },
    correct: "B",
    explanation: "The additive primary colors used in digital displays are Red, Green, and Blue (RGB). Yellow is a subtractive primary color or a secondary additive color."
  },
  {
    id: 44,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 2,
    question: "In computer science, what is the standard decimal ASCII representation of the uppercase letter 'A'?",
    options: {
      A: "65",
      B: "97",
      C: "48",
      D: "12"
    },
    correct: "A",
    explanation: "In ASCII, 'A' starts at 65, while lowercase 'a' starts at 97, and the character '0' starts at 48."
  },
  {
    id: 45,
    category: "Memory",
    categoryColor: "#F59E0B",
    difficulty: 3,
    question: "In digital storage units, what is the exact number of bytes contained in a single Mebibyte (MiB)?",
    options: {
      A: "1,000,000",
      B: "1,024,000",
      C: "1,048,576",
      D: "1,073,741"
    },
    correct: "C",
    explanation: "A Mebibyte (MiB) uses binary prefixes and contains exactly 1024 * 1024 = 1,048,576 bytes."
  },

  // ==================== SCIENCE ====================
  {
    id: 46,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 1,
    question: "Which chemical element on the periodic table is designated with the atomic number 1?",
    options: {
      A: "Helium",
      B: "Hydrogen",
      C: "Lithium",
      D: "Oxygen"
    },
    correct: "B",
    explanation: "Hydrogen is the simplest element, consisting of one proton, and has the atomic number 1."
  },
  {
    id: 47,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 2,
    question: "What primary optical lens type is prescribed to correct the eye condition of Myopia (nearsightedness)?",
    options: {
      A: "Concave",
      B: "Convex",
      C: "Bifocal",
      D: "Cylindrical"
    },
    correct: "A",
    explanation: "Myopia causes light to focus in front of the retina. A concave (diverging) lens spreads light rays out, shifting the focus back onto the retina."
  },
  {
    id: 48,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 3,
    question: "In quantum mechanics, what physical quantity does the Planck constant (h) fundamental define?",
    options: {
      A: "The invariant speed of light in vacuum",
      B: "The quantum of electromagnetic action",
      C: "The universal gravitational constant",
      D: "The rest mass of a free electron"
    },
    correct: "B",
    explanation: "The Planck constant is the quantum of electromagnetic action, relating the energy of a photon to its frequency (E = hf)."
  },
  {
    id: 49,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 1,
    question: "Which gas is the most abundant constituent in Earth's atmospheric composition?",
    options: {
      A: "Oxygen",
      B: "Nitrogen",
      C: "Carbon Dioxide",
      D: "Argon"
    },
    correct: "B",
    explanation: "Earth's dry atmosphere is composed of approximately 78.08% Nitrogen, 20.95% Oxygen, and small amounts of other gases."
  },
  {
    id: 50,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 2,
    question: "Which cellular organelle is uniquely responsible for conducting cellular respiration and synthesizing ATP?",
    options: {
      A: "Ribosome",
      B: "Mitochondria",
      C: "Golgi Apparatus",
      D: "Nucleus"
    },
    correct: "B",
    explanation: "Mitochondria are often referred to as the powerhouses of the cell because they generate most of the cell's supply of ATP."
  },
  {
    id: 51,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 3,
    question: "According to Einstein's general theory of relativity, what effect does a gravitational lens have on passing light?",
    options: {
      A: "It bends the light's geometric path through warped spacetime",
      B: "It physically slows down the speed of light waves",
      C: "It absorbs and dissipates light into dark energy",
      D: "It forces the light to increase its frequency"
    },
    correct: "A",
    explanation: "Gravity bends the fabric of spacetime itself. Light travels in straight lines (geodesics) through this warped space, appearing curved to external observers."
  },
  {
    id: 52,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 1,
    question: "What is the correct chemical formula representing a molecule of ozone?",
    options: {
      A: "O2",
      B: "CO2",
      C: "O3",
      D: "H2O"
    },
    correct: "C",
    explanation: "Ozone is an allotrope of oxygen consisting of three oxygen atoms bonded together (O₃)."
  },
  {
    id: 53,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 2,
    question: "What type of chemical bond is established when valence electrons are shared equally between two nonmetal atoms?",
    options: {
      A: "Ionic",
      B: "Covalent",
      C: "Hydrogen",
      D: "Metallic"
    },
    correct: "B",
    explanation: "A covalent bond is formed by the sharing of electron pairs between atoms, typically nonmetals with similar electronegativities."
  },
  {
    id: 54,
    category: "Science",
    categoryColor: "#10B981",
    difficulty: 3,
    question: "What is the approximate scientific radioactive half-life of Carbon-14?",
    options: {
      A: "5,730 years",
      B: "1,200 years",
      C: "24,000 years",
      D: "4.5 billion years"
    },
    correct: "A",
    explanation: "Carbon-14 has a half-life of roughly 5,730 years, making it highly effective for dating organic materials up to about 50,000 years old."
  },

  // ==================== PATTERNS ====================
  {
    id: 55,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 1,
    question: "Complete the sequence logically: O, T, T, F, F, S, S, ...",
    options: {
      A: "S",
      B: "N",
      C: "E",
      D: "T"
    },
    correct: "C",
    explanation: "The letters represent the initials of the English counting numbers: One, Two, Three, Four, Five, Six, Seven. The next is Eight, which starts with 'E'."
  },
  {
    id: 56,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 2,
    question: "Identify the next term in this letter pattern: AZ, CX, EV, GT, ...",
    options: {
      A: "HS",
      B: "IR",
      C: "KP",
      D: "JQ"
    },
    correct: "B",
    explanation: "The first letter increases by 2 steps forward (A -> C -> E -> G -> I). The second letter decreases by 2 steps backward (Z -> X -> V -> T -> R). Hence, the next term is IR."
  },
  {
    id: 57,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 1,
    question: "What is the next number in the following sequence: 2, 3, 5, 8, 13, 21, ...",
    options: {
      A: "34",
      B: "29",
      C: "42",
      D: "38"
    },
    correct: "A",
    explanation: "This is the Fibonacci sequence, where each term is the sum of the preceding two terms: 13 + 21 = 34."
  },
  {
    id: 58,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 1,
    question: "Find the missing term: 1, 8, 27, 64, ...",
    options: {
      A: "100",
      B: "125",
      C: "81",
      D: "144"
    },
    correct: "B",
    explanation: "The terms are perfect cubes of consecutive positive integers: 1³, 2³, 3³, 4³. The next term is 5³ = 125."
  },
  {
    id: 59,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 2,
    question: "Look at this grid sequence: Row 1: [1, 2, 4], Row 2: [3, 6, 12], Row 3: [5, 10, ?]. What is the missing value?",
    options: {
      A: "15",
      B: "18",
      C: "22",
      D: "20"
    },
    correct: "D",
    explanation: "Each row represents a geometric progression with a common ratio of 2. For the third row: 5 * 2 = 10, and 10 * 2 = 20."
  },
  {
    id: 60,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 3,
    question: "In a shape series, Shape 1 has 3 sides, Shape 2 has 4 sides, Shape 3 has 6 sides, and Shape 4 has 10 sides. How many sides does Shape 5 possess?",
    options: {
      A: "14",
      B: "15",
      C: "16",
      D: "18"
    },
    correct: "D",
    explanation: "The differences between the number of sides form a geometric sequence of powers of 2: +1, +2, +4. The next difference must be +8, yielding 10 + 8 = 18 sides."
  },
  {
    id: 61,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 1,
    question: "Complete the numerical pattern: 3, 5, 9, 17, 33, ...",
    options: {
      A: "49",
      B: "65",
      C: "57",
      D: "64"
    },
    correct: "B",
    explanation: "The pattern can be calculated as 2n - 1 for each successive term: 3(*2-1)=5, 5(*2-1)=9... 33(*2-1) = 65. (Or, the differences are powers of 2: +2, +4, +8, +16, +32)."
  },
  {
    id: 62,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 2,
    question: "Identify the next logical term: 1A, 2B, 4D, 7G, 11K, ...",
    options: {
      A: "16P",
      B: "15O",
      C: "17Q",
      D: "16O"
    },
    correct: "A",
    explanation: "The numbers increment by +1, +2, +3, +4, +5, so the next is 11 + 5 = 16. The letter index shifts forward by the same offset: A(+1)B(+2)D(+3)G(+4)K(+5)P."
  },
  {
    id: 63,
    category: "Patterns",
    categoryColor: "#F97316",
    difficulty: 3,
    question: "Find the next sequence term in this classic progression: 11, 21, 1211, 111221, ...",
    options: {
      A: "211211",
      B: "111222",
      C: "312211",
      D: "132211"
    },
    correct: "C",
    explanation: "This is the 'Look-and-Say' sequence. The term '111221' is read aloud as 'three 1s, two 2s, one 1', resulting in the next term: 312211."
  },

  // ==================== QUANTITATIVE ====================
  {
    id: 64,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 1,
    question: "A store offers a 20% discount on a jacket. If the jacket's original price is $80, what is the final discounted price?",
    options: {
      A: "$64",
      B: "$60",
      C: "$72",
      D: "$56"
    },
    correct: "A",
    explanation: "The discount is 20% of $80, which is $16. The final price is $80 - $16 = $64."
  },
  {
    id: 65,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 2,
    question: "A car travels at 60 mph. A passenger train travels 50% faster than the car. How far does the train travel in exactly 4 hours?",
    options: {
      A: "300 miles",
      B: "320 miles",
      C: "360 miles",
      D: "400 miles"
    },
    correct: "C",
    explanation: "The train's speed is 60 * 1.5 = 90 mph. In 4 hours, it travels 90 * 4 = 360 miles."
  },
  {
    id: 66,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 3,
    question: "A sum of money doubles itself in exactly 8 years under a simple interest plan. What is the annual interest rate of the plan?",
    options: {
      A: "10.0%",
      B: "12.5%",
      C: "15.0%",
      D: "8.0%"
    },
    correct: "B",
    explanation: "Under simple interest, to double the principal P, the interest gained must equal P. Since I = P * R * T / 100, we get P = P * R * 8 / 100, which yields R = 100 / 8 = 12.5%."
  },
  {
    id: 67,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 1,
    question: "If 5 automated manufacturing machines can construct 5 widgets in exactly 5 minutes, how many minutes does it take 100 machines to build 100 widgets?",
    options: {
      A: "5 minutes",
      B: "100 minutes",
      C: "20 minutes",
      D: "50 minutes"
    },
    correct: "A",
    explanation: "Since 5 machines construct 5 widgets in 5 minutes, the rate is 1 machine constructing 1 widget in 5 minutes. Thus, 100 machines working in parallel will construct 100 widgets in the same 5 minutes."
  },
  {
    id: 68,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 2,
    question: "A drawer contains 5 pairs of black socks and 5 pairs of white socks, all loose. In pitch darkness, what is the minimum number of single socks you must draw to guarantee obtaining at least one matching pair?",
    options: {
      A: "2",
      B: "3",
      C: "5",
      D: "11"
    },
    correct: "B",
    explanation: "By the Pigeonhole Principle, there are only 2 colors (categories). Drawing 3 socks (pigeons) guarantees that at least two of them must share the same color."
  },
  {
    id: 69,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 3,
    question: "If an electronics retailer operates with a profit margin of 25% on the selling price of their goods, what is their exact markup percentage relative to the cost of the goods?",
    options: {
      A: "25.0%",
      B: "30.0%",
      C: "33.3%",
      D: "50.0%"
    },
    correct: "C",
    explanation: "If selling price = 100, profit margin is 25, meaning cost is 75. The markup on cost is profit divided by cost: 25 / 75 = 1/3 = 33.33%."
  },
  {
    id: 70,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 1,
    question: "If the radius of a circle is increased by exactly 10%, by what percentage does the area of the circle increase?",
    options: {
      A: "10%",
      B: "21%",
      C: "20%",
      D: "44%"
    },
    correct: "B",
    explanation: "Area is proportional to r². A new radius of 1.1r yields an area of π(1.1r)² = 1.21πr², which is a 21% increase over the original area."
  },
  {
    id: 71,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 2,
    question: "An old clock gains exactly 5 minutes every hour. If it is calibrated correctly at 12:00 PM, what time will its display show when the actual clock time is 6:00 PM on the same day?",
    options: {
      A: "6:30 PM",
      B: "6:25 PM",
      C: "7:00 PM",
      D: "6:05 PM"
    },
    correct: "A",
    explanation: "From 12:00 PM to 6:00 PM is exactly 6 hours. At 5 minutes gained per hour, the clock gains 6 * 5 = 30 minutes, showing 6:30 PM."
  },
  {
    id: 72,
    category: "Quantitative",
    categoryColor: "#6366F1",
    difficulty: 3,
    question: "A rowing boat travels 12 miles upstream in 3 hours, and returns 12 miles downstream in 2 hours. What is the speed of the current?",
    options: {
      A: "0.5 mph",
      B: "2.0 mph",
      C: "1.0 mph",
      D: "1.5 mph"
    },
    correct: "C",
    explanation: "Let b = boat speed, c = current speed. Upstream: b - c = 12/3 = 4. Downstream: b + c = 12/2 = 6. Solving this system gives b = 5 mph and c = 1 mph."
  },

  // ==================== PHILOSOPHY ====================
  {
    id: 73,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 1,
    question: "Which rationalist philosopher formulated the foundational proposition 'Cogito, ergo sum' (I think, therefore I am)?",
    options: {
      A: "John Locke",
      B: "René Descartes",
      C: "Immanuel Kant",
      D: "David Hume"
    },
    correct: "B",
    explanation: "René Descartes proposed this in his Discourse on the Method as a first step in demonstrating the certainty of self-existence."
  },
  {
    id: 74,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 2,
    question: "In normative ethics, the moral theory of Utilitarianism dictates that an action is morally right if it:",
    options: {
      A: "Strictly conforms to absolute divine commandments",
      B: "Maximizes the greatest happiness or well-being for the greatest number of people",
      C: "Is motivated purely by a universalizable goodwill and duty",
      D: "Respects individual absolute libertarian rights above all else"
    },
    correct: "B",
    explanation: "Utilitarianism, championed by Bentham and Mill, is a consequentialist theory focusing on maximizing utility or happiness for the largest population."
  },
  {
    id: 75,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 3,
    question: "The 'Ship of Theseus' is a classic metaphysical thought experiment that primarily questions the nature of:",
    options: {
      A: "Identity, continuity, and the material composition of objects over time",
      B: "The fundamental justice and structural legitimacy of the state",
      C: "The perceptual limits of objective human sensory knowledge",
      D: "The ethical morality of warfare and proportional defense"
    },
    correct: "A",
    explanation: "The puzzle asks if a ship that has had all of its wooden planks replaced one by one remains the same identical ship, exploring theories of identity and material constitution."
  },
  {
    id: 76,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 1,
    question: "Which ancient Greek philosopher authored the dialogue 'The Republic' featuring the famous Allegory of the Cave?",
    options: {
      A: "Aristotle",
      B: "Plato",
      C: "Socrates",
      D: "Epicurus"
    },
    correct: "B",
    explanation: "Plato wrote 'The Republic' around 375 BC, describing the cave allegory to illustrate the effects of education and the lack of it on human nature."
  },
  {
    id: 77,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 2,
    question: "What is the primary study and concern of the philosophical branch known as Epistemology?",
    options: {
      A: "The aesthetic definition of beauty, taste, and art forms",
      B: "The fundamental nature, justification, scope, and limits of knowledge",
      C: "The comparative analysis of human moral values and actions",
      D: "The structural validity and soundness of logical arguments"
    },
    correct: "B",
    explanation: "Epistemology studies knowledge—what it is, how we acquire it, and how we can justify what we claim to know."
  },
  {
    id: 78,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 3,
    question: "In existentialist philosophy (such as Sartre), the concept of 'bad faith' (mauvaise foi) refers to:",
    options: {
      A: "Engaging in illegal activities under the guise of morality",
      B: "Adopting false values and denying one's own fundamental freedom and responsibility",
      C: "Holding a strict skepticism toward any supernatural entities",
      D: "Intentionally breaching a signed social or legal contract"
    },
    correct: "B",
    explanation: "Sartre defined bad faith as a phenomenon where humans lie to themselves to escape the anxiety of absolute freedom and responsibility, playing roles instead of acting authentically."
  },
  {
    id: 79,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 1,
    question: "Which of the following philosophers is most famously associated with the concept of the 'Will to Power' and modern Nihilism?",
    options: {
      A: "Friedrich Nietzsche",
      B: "Jean-Paul Sartre",
      C: "Albert Camus",
      D: "Søren Kierkegaard"
    },
    correct: "A",
    explanation: "Friedrich Nietzsche wrote extensively about the Will to Power, the death of God, and the threat of impending nihilism in European civilization."
  },
  {
    id: 80,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 2,
    question: "What is the primary moral guidance and focus advocated by the Hellenistic school of Stoicism?",
    options: {
      A: "The continuous pursuit of refined physical and sensory pleasures",
      B: "Accepting events outside our control and cultivating inner virtue and self-mastery",
      C: "Systematically doubting the existence of any external physical reality",
      D: "The proactive accumulation of societal wealth, prestige, and political power"
    },
    correct: "B",
    explanation: "Stoicism teaches that virtue is the only true good and that we should focus on controlling our own reactions and judgments rather than external factors."
  },
  {
    id: 81,
    category: "Philosophy",
    categoryColor: "#A78BFA",
    difficulty: 3,
    question: "In analytical philosophy and scientific modeling, what is the meaning of the Latin phrase 'Ceteris Paribus'?",
    options: {
      A: "All other conditions or variables remaining equal",
      B: "The causal action must always precede the observed effect",
      C: "The objective truth is entirely relative to the active observer",
      D: "The simplest explanation should always be preferred"
    },
    correct: "A",
    explanation: "'Ceteris Paribus' is a Latin phrase translating literally to 'with other things the same', used to isolate specific relationships in science and logic."
  },

  // ==================== PROCESSING ====================
  {
    id: 82,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 1,
    question: "If you encrypt character strings by shifting each letter forward by +3 positions in the alphabet (Caesar Cipher), what does the word 'HAL' become?",
    options: {
      A: "IBM",
      B: "KDO",
      C: "JCN",
      D: "LEP"
    },
    correct: "B",
    explanation: "Shifting forward by 3: H(+3)=K, A(+3)=D, L(+3)=O. Hence, 'HAL' becomes 'KDO'."
  },
  {
    id: 83,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 2,
    question: "A central processing unit (CPU) executes exactly 4 instructions per clock cycle. If the clock speed is 3.0 GHz, how many instructions can it theoretically execute in 1 second?",
    options: {
      A: "1.2 Billion",
      B: "3.0 Billion",
      C: "12 Billion",
      D: "7.5 Billion"
    },
    correct: "C",
    explanation: "3.0 GHz represents 3,000,000,000 cycles per second. At 4 instructions per cycle, it executes 3 billion * 4 = 12 billion instructions per second."
  },
  {
    id: 84,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 3,
    question: "In computer science, what is the maximum number of comparison steps required by a binary search algorithm to find or rule out an element in a sorted array of 1024 items?",
    options: {
      A: "10",
      B: "11",
      C: "512",
      D: "1024"
    },
    correct: "A",
    explanation: "Binary search has log₂(N) complexity. For N = 1024, log₂(1024) is exactly 10, meaning at most 10 cuts are needed."
  },
  {
    id: 85,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 1,
    question: "In networking and data processing systems, what does the term 'latency' primarily refer to?",
    options: {
      A: "The peak capacity throughput of data transfer across a network link",
      B: "The time delay incurred between requesting a data transfer and its commencement",
      C: "The cumulative payload size of a processed data packet",
      D: "The error-rate percentage of lost packets during a transmission"
    },
    correct: "B",
    explanation: "Latency is the measure of time delay from the input trigger of a request to the first bit of data arriving at the destination."
  },
  {
    id: 86,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 2,
    question: "Which fundamental computer science data structure operates strictly on a Last-In, First-Out (LIFO) mechanism?",
    options: {
      A: "Queue",
      B: "Stack",
      C: "Binary Tree",
      D: "Min-Heap"
    },
    correct: "B",
    explanation: "A Stack operates on a Last-In, First-Out (LIFO) base, where the last item pushed is the first to be popped (like a stack of plates)."
  },
  {
    id: 87,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 3,
    question: "In theoretical computer science, what is the primary component of a Turing Machine that stores the processed symbols and can be read from or written to?",
    options: {
      A: "An infinite linear tape partitioned into individual cells",
      B: "A rotating high-speed magnetic disk cylinder",
      C: "A fixed register containing index addresses",
      D: "A hierarchy of multi-level cache memory"
    },
    correct: "A",
    explanation: "A Turing Machine consists of an infinite tape divided into cells, a tape head that reads/writes symbols, a state register, and a table of transition rules."
  },
  {
    id: 88,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 1,
    question: "What is the primary algorithmic purpose of a cryptographic or lookup hash function?",
    options: {
      A: "To encrypt a file so it can only be decrypted with a private key",
      B: "To map data of arbitrary size to highly uniform, fixed-size representative values",
      C: "To sort an array of floating-point numbers in ascending order",
      D: "To compress high-resolution video streams for transmission"
    },
    correct: "B",
    explanation: "A hash function maps data of arbitrary size to values of a fixed size, which are typically used in hash tables, caching, or message integrity checks."
  },
  {
    id: 89,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 2,
    question: "In packet-switched routing protocols, what does the TTL (Time to Live) field in an IP header prevent?",
    options: {
      A: "Packet corruption and checksum mismatch errors",
      B: "Infinite routing loops where packets circulate indefinitely",
      C: "Unauthorized packet decryption and sniffing",
      D: "Excessive transmission latency at the physical layer"
    },
    correct: "B",
    explanation: "The TTL field acts as a hop limit. Every router decrements TTL by 1. If TTL reaches 0, the packet is discarded, preventing packets from looping forever in network cycles."
  },
  {
    id: 90,
    category: "Processing",
    categoryColor: "#14B8A6",
    difficulty: 3,
    question: "Which graph search algorithm is mathematically most efficient for finding the single-source shortest path in a weighted graph with positive weights?",
    options: {
      A: "Depth-First Search (DFS)",
      B: "Dijkstra's Algorithm",
      C: "Bubble Sort Algorithm",
      D: "Prim's Minimum Spanning Tree Algorithm"
    },
    correct: "B",
    explanation: "Dijkstra's Algorithm is highly efficient (O(V² + E) or O(E + V log V) with a binary heap) and is designed specifically to find shortest paths in non-negative weighted graphs."
  }
];
