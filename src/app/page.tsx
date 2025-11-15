"use client";

import { useState, useEffect } from "react";
import { Sparkles, Heart, Star, Trophy, Book, Music, Volume2, VolumeX, Crown, ShoppingCart, Zap, Gift, Lock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Configuração do Stripe (substitua pela sua chave pública)
const stripePromise = loadStripe("pk_test_YOUR_STRIPE_PUBLIC_KEY");

// Tipos de personagens disponíveis
const characters = [
  { id: "rabbit", name: "Coelhinho Luna", emoji: "🐰", color: "from-pink-400 to-purple-500", description: "Rápida e curiosa!" },
  { id: "robot", name: "Robô Zap", emoji: "🤖", color: "from-cyan-400 to-blue-500", description: "Inteligente e lógico!" },
  { id: "cat", name: "Gatinha Mel", emoji: "🐱", color: "from-orange-400 to-pink-500", description: "Ágil e criativa!" },
  { id: "dragon", name: "Dragão Fogo", emoji: "🐉", color: "from-red-400 to-orange-500", description: "Corajoso e forte!" },
  { id: "unicorn", name: "Unicórnio Arco-Íris", emoji: "🦄", color: "from-purple-400 to-pink-400", description: "Mágico e especial!" },
  { id: "fox", name: "Raposa Astuta", emoji: "🦊", color: "from-orange-500 to-red-400", description: "Esperta e estratégica!" },
];

// Reinos disponíveis (expandidos)
const kingdoms = [
  {
    id: "forest",
    name: "Floresta dos Animais",
    icon: "🌳",
    color: "from-green-400 to-emerald-600",
    description: "Descubra os segredos da natureza!",
    challenges: 5,
    difficulty: "Fácil",
  },
  {
    id: "mountain",
    name: "Montanha das Cores",
    icon: "🏔️",
    color: "from-purple-400 to-pink-500",
    description: "Explore o arco-íris mágico!",
    challenges: 5,
    difficulty: "Médio",
  },
  {
    id: "island",
    name: "Ilha dos Números",
    icon: "🏝️",
    color: "from-blue-400 to-cyan-500",
    description: "Resolva puzzles matemáticos!",
    challenges: 5,
    difficulty: "Médio",
  },
  {
    id: "castle",
    name: "Castelo das Palavras",
    icon: "🏰",
    color: "from-indigo-400 to-purple-500",
    description: "Aprenda novas palavras mágicas!",
    challenges: 5,
    difficulty: "Difícil",
    premium: true,
  },
  {
    id: "space",
    name: "Espaço Estelar",
    icon: "🚀",
    color: "from-slate-700 to-blue-900",
    description: "Explore as estrelas e planetas!",
    challenges: 5,
    difficulty: "Difícil",
    premium: true,
  },
  {
    id: "ocean",
    name: "Oceano Profundo",
    icon: "🌊",
    color: "from-blue-500 to-teal-400",
    description: "Mergulhe nas profundezas!",
    challenges: 5,
    difficulty: "Difícil",
    premium: true,
  },
];

// Tipos de desafios expandidos
const challengeTypes = [
  {
    type: "math",
    title: "Desafio Matemático",
    icon: "🔢",
    generateChallenge: (level: number) => {
      const num1 = Math.floor(Math.random() * (5 + level * 3)) + 1;
      const num2 = Math.floor(Math.random() * (5 + level * 3)) + 1;
      const operations = ["+", "-", "×"];
      const op = operations[Math.floor(Math.random() * operations.length)];
      let answer = 0;
      let question = "";
      
      if (op === "+") {
        answer = num1 + num2;
        question = `Quanto é ${num1} + ${num2}?`;
      } else if (op === "-") {
        answer = Math.max(num1, num2) - Math.min(num1, num2);
        question = `Quanto é ${Math.max(num1, num2)} - ${Math.min(num1, num2)}?`;
      } else {
        answer = num1 * num2;
        question = `Quanto é ${num1} × ${num2}?`;
      }
      
      return {
        question,
        answer: answer.toString(),
        options: [
          answer.toString(),
          (answer + 1).toString(),
          (answer - 1).toString(),
          (answer + 2).toString(),
        ].sort(() => Math.random() - 0.5),
      };
    },
  },
  {
    type: "pattern",
    title: "Complete o Padrão",
    icon: "🎨",
    generateChallenge: () => {
      const patterns = [
        { sequence: ["🔴", "🔵", "🔴", "🔵", "🔴"], answer: "🔵" },
        { sequence: ["⭐", "⭐", "🌙", "⭐", "⭐"], answer: "🌙" },
        { sequence: ["🌸", "🌺", "🌸", "🌺", "🌸"], answer: "🌺" },
        { sequence: ["🍎", "🍊", "🍎", "🍊", "🍎"], answer: "🍊" },
        { sequence: ["🦋", "🐝", "🦋", "🐝", "🦋"], answer: "🐝" },
        { sequence: ["🌞", "🌙", "🌞", "🌙", "🌞"], answer: "🌙" },
      ];
      const pattern = patterns[Math.floor(Math.random() * patterns.length)];
      return {
        question: `Qual vem depois? ${pattern.sequence.join(" ")} ___`,
        answer: pattern.answer,
        options: ["🔴", "🔵", "⭐", "🌙", "🌸", "🌺", "🍎", "🍊"]
          .filter((_, i) => i < 4)
          .sort(() => Math.random() - 0.5),
      };
    },
  },
  {
    type: "memory",
    title: "Jogo da Memória",
    icon: "🧠",
    generateChallenge: () => {
      const items = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"];
      const selected = items.slice(0, 4);
      const sequence = [...selected].sort(() => Math.random() - 0.5);
      return {
        question: `Memorize: ${sequence.join(" ")}`,
        answer: sequence[0],
        options: items.slice(0, 4).sort(() => Math.random() - 0.5),
        isMemory: true,
      };
    },
  },
  {
    type: "word",
    title: "Encontre a Palavra",
    icon: "📝",
    generateChallenge: () => {
      const words = [
        { word: "GATO", hint: "Animal que faz miau 🐱" },
        { word: "SOL", hint: "Brilha no céu durante o dia ☀️" },
        { word: "FLOR", hint: "Planta bonita e colorida 🌸" },
        { word: "CASA", hint: "Lugar onde moramos 🏠" },
        { word: "LIVRO", hint: "Usamos para ler histórias 📚" },
      ];
      const selected = words[Math.floor(Math.random() * words.length)];
      const wrongWords = ["BOLA", "MESA", "ÁGUA", "PEIXE", "ÁRVORE"];
      return {
        question: selected.hint,
        answer: selected.word,
        options: [selected.word, ...wrongWords.slice(0, 3)].sort(() => Math.random() - 0.5),
      };
    },
  },
  {
    type: "logic",
    title: "Desafio de Lógica",
    icon: "🧩",
    generateChallenge: () => {
      const puzzles = [
        { question: "Se 2 + 2 = 4, então 3 + 3 = ?", answer: "6", options: ["5", "6", "7", "8"] },
        { question: "Qual é maior: 5 ou 3?", answer: "5", options: ["3", "5", "Igual", "Nenhum"] },
        { question: "Quantas patas tem um cachorro?", answer: "4", options: ["2", "3", "4", "5"] },
        { question: "Qual vem depois de 5?", answer: "6", options: ["4", "5", "6", "7"] },
      ];
      const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
      return puzzle;
    },
  },
];

// Pacotes de compra
const shopPackages = [
  {
    id: "stars_100",
    name: "100 Estrelas Mágicas",
    icon: "⭐",
    price: 0.99,
    stars: 100,
    popular: false,
  },
  {
    id: "stars_500",
    name: "500 Estrelas Mágicas",
    icon: "✨",
    price: 3.99,
    stars: 500,
    popular: true,
    bonus: 50,
  },
  {
    id: "stars_1000",
    name: "1000 Estrelas Mágicas",
    icon: "🌟",
    price: 6.99,
    stars: 1000,
    popular: false,
    bonus: 150,
  },
  {
    id: "premium",
    name: "Versão Premium",
    icon: "👑",
    price: 9.99,
    description: "Acesso completo a todos os reinos e sem anúncios!",
    isPremium: true,
  },
  {
    id: "subscription",
    name: "Assinatura Mensal",
    icon: "🎮",
    price: 4.99,
    description: "Novos conteúdos todo mês + 200 estrelas mensais!",
    isSubscription: true,
  },
];

// Componente de pagamento Stripe
function StripeCheckout({ amount, onSuccess }: { amount: number; onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    // Aqui você faria a chamada para seu backend para criar o PaymentIntent
    // Por enquanto, simulamos o sucesso
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border-2 border-gray-200 rounded-xl">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
            },
          }}
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-6 text-lg"
      >
        {loading ? "Processando..." : `Pagar $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

export default function Home() {
  const [gameState, setGameState] = useState<"intro" | "selectCharacter" | "map" | "challenge" | "victory" | "shop">("intro");
  const [selectedCharacter, setSelectedCharacter] = useState<typeof characters[0] | null>(null);
  const [currentKingdom, setCurrentKingdom] = useState<typeof kingdoms[0] | null>(null);
  const [currentChallenge, setCurrentChallenge] = useState<any>(null);
  const [score, setScore] = useState(0);
  const [completedKingdoms, setCompletedKingdoms] = useState<string[]>([]);
  const [magicPieces, setMagicPieces] = useState(0);
  const [stars, setStars] = useState(50); // Moeda do jogo
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [isPremium, setIsPremium] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<typeof shopPackages[0] | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"paypal" | "stripe" | null>(null);
  const [challengeStreak, setChallengeStreak] = useState(0);
  const [achievements, setAchievements] = useState<string[]>([]);

  // Animação de entrada
  useEffect(() => {
    if (gameState === "intro") {
      const timer = setTimeout(() => {
        // Auto-avança após animação
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [gameState]);

  const startGame = () => {
    setGameState("selectCharacter");
  };

  const selectCharacter = (character: typeof characters[0]) => {
    setSelectedCharacter(character);
    setGameState("map");
  };

  const enterKingdom = (kingdom: typeof kingdoms[0]) => {
    // Verifica se o reino é premium
    if (kingdom.premium && !isPremium && !hasSubscription) {
      alert("Este reino é exclusivo para membros Premium! Visite a loja para desbloquear.");
      return;
    }
    
    setCurrentKingdom(kingdom);
    generateNewChallenge();
    setGameState("challenge");
  };

  const generateNewChallenge = () => {
    const challengeType = challengeTypes[Math.floor(Math.random() * challengeTypes.length)];
    const challenge = challengeType.generateChallenge(magicPieces);
    setCurrentChallenge({ ...challenge, type: challengeType });
    setShowHint(false);
    setFeedback(null);
  };

  const checkAnswer = (answer: string) => {
    if (answer === currentChallenge.answer) {
      setFeedback("correct");
      const points = 100 + (challengeStreak * 10);
      setScore(score + points);
      setMagicPieces(magicPieces + 1);
      setStars(stars + 5);
      setChallengeStreak(challengeStreak + 1);
      
      // Conquistas
      if (challengeStreak + 1 === 5 && !achievements.includes("streak_5")) {
        setAchievements([...achievements, "streak_5"]);
      }
      
      setTimeout(() => {
        if (currentKingdom && !completedKingdoms.includes(currentKingdom.id)) {
          setCompletedKingdoms([...completedKingdoms, currentKingdom.id]);
        }
        
        if (completedKingdoms.length + 1 >= kingdoms.filter(k => !k.premium || isPremium || hasSubscription).length) {
          setGameState("victory");
        } else {
          setGameState("map");
        }
      }, 2000);
    } else {
      setFeedback("wrong");
      setChallengeStreak(0);
      setTimeout(() => setFeedback(null), 1500);
    }
  };

  const resetGame = () => {
    setGameState("intro");
    setSelectedCharacter(null);
    setCurrentKingdom(null);
    setScore(0);
    setCompletedKingdoms([]);
    setMagicPieces(0);
    setChallengeStreak(0);
  };

  const openShop = () => {
    setShowShop(true);
  };

  const closeShop = () => {
    setShowShop(false);
    setSelectedPackage(null);
    setPaymentMethod(null);
  };

  const handlePurchaseSuccess = () => {
    if (selectedPackage) {
      if (selectedPackage.isPremium) {
        setIsPremium(true);
        alert("🎉 Parabéns! Você agora é um membro Premium!");
      } else if (selectedPackage.isSubscription) {
        setHasSubscription(true);
        setStars(stars + 200);
        alert("🎮 Assinatura ativada! Você ganhou 200 estrelas!");
      } else {
        const totalStars = selectedPackage.stars + (selectedPackage.bonus || 0);
        setStars(stars + totalStars);
        alert(`⭐ Você ganhou ${totalStars} estrelas!`);
      }
      closeShop();
    }
  };

  // Tela de introdução
  if (gameState === "intro") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDelay: "0s" }}>⭐</div>
          <div className="absolute top-40 right-20 text-5xl animate-bounce" style={{ animationDelay: "0.5s" }}>🌟</div>
          <div className="absolute bottom-32 left-32 text-7xl animate-bounce" style={{ animationDelay: "1s" }}>✨</div>
          <div className="absolute bottom-20 right-40 text-6xl animate-bounce" style={{ animationDelay: "1.5s" }}>💫</div>
        </div>

        <div className="text-center space-y-8 animate-in fade-in duration-1000 relative z-10">
          <div className="space-y-4">
            <h1 className="text-6xl sm:text-8xl font-bold text-white drop-shadow-2xl animate-in zoom-in duration-700">
              ✨ Aventuras do Mundo Encantado ✨
            </h1>
            <p className="text-2xl sm:text-3xl text-white/95 font-medium animate-in slide-in-from-bottom duration-1000">
              Uma jornada mágica de aprendizado e diversão!
            </p>
            <p className="text-lg sm:text-xl text-white/80 animate-in slide-in-from-bottom duration-1000 delay-200">
              Explore reinos fantásticos, resolva desafios e aprenda brincando!
            </p>
          </div>
          
          <div className="flex flex-col items-center gap-6 animate-in slide-in-from-bottom duration-1000 delay-300">
            <div className="flex gap-6 text-7xl">
              <span className="animate-bounce" style={{ animationDelay: "0s" }}>🌟</span>
              <span className="animate-bounce" style={{ animationDelay: "0.2s" }}>🎮</span>
              <span className="animate-bounce" style={{ animationDelay: "0.4s" }}>📚</span>
              <span className="animate-bounce" style={{ animationDelay: "0.6s" }}>🏆</span>
            </div>
            
            <Button
              onClick={startGame}
              size="lg"
              className="text-2xl px-16 py-10 bg-white text-purple-600 hover:bg-purple-50 hover:scale-110 transition-all duration-300 shadow-2xl rounded-full font-bold"
            >
              <Sparkles className="mr-3 h-10 w-10" />
              Começar Aventura
            </Button>

            <p className="text-white/70 text-sm">Para crianças de 5 a 10 anos</p>
          </div>
        </div>
      </div>
    );
  }

  // Seleção de personagem
  if (gameState === "selectCharacter") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-500 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg">
              Escolha seu Personagem
            </h2>
            <p className="text-2xl text-white/90">
              Quem vai te acompanhar nessa aventura?
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map((character) => (
              <Card
                key={character.id}
                className="p-8 cursor-pointer hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur border-4 border-transparent hover:border-white shadow-2xl hover:shadow-purple-500/50"
                onClick={() => selectCharacter(character)}
              >
                <div className="text-center space-y-4">
                  <div className="text-9xl animate-bounce">{character.emoji}</div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {character.name}
                  </h3>
                  <p className="text-gray-600 font-medium">{character.description}</p>
                  <Button className={`w-full bg-gradient-to-r ${character.color} text-white border-0 hover:shadow-xl transition-all py-6 text-lg font-bold`}>
                    Escolher
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Mapa dos reinos
  if (gameState === "map") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-500 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header com informações do jogador */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="text-6xl">{selectedCharacter?.emoji}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{selectedCharacter?.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{score} pontos</span>
                    </span>
                    {challengeStreak > 0 && (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        🔥 {challengeStreak}x combo
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                  {magicPieces} Peças
                </Badge>
                <Badge variant="secondary" className="text-lg px-4 py-2 bg-yellow-100 text-yellow-700">
                  ⭐ {stars} Estrelas
                </Badge>
                {isPremium && (
                  <Badge className="text-lg px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                    <Crown className="h-5 w-5 mr-2" />
                    Premium
                  </Badge>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="rounded-full"
                >
                  {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                <Button
                  onClick={openShop}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Loja
                </Button>
              </div>
            </div>
          </div>

          {/* Título do mapa */}
          <div className="text-center space-y-2">
            <h2 className="text-5xl sm:text-6xl font-bold text-white drop-shadow-lg">
              Mapa do Mundo Encantado
            </h2>
            <p className="text-2xl text-white/90">
              Escolha um reino para explorar!
            </p>
          </div>

          {/* Reinos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {kingdoms.map((kingdom) => {
              const isCompleted = completedKingdoms.includes(kingdom.id);
              const isLocked = kingdom.premium && !isPremium && !hasSubscription;
              
              return (
                <Card
                  key={kingdom.id}
                  className={`p-8 cursor-pointer hover:scale-105 transition-all duration-300 bg-white/95 backdrop-blur border-4 shadow-2xl ${
                    isCompleted ? "border-green-400" : isLocked ? "border-gray-300 opacity-75" : "border-transparent hover:border-white"
                  }`}
                  onClick={() => enterKingdom(kingdom)}
                >
                  <div className="text-center space-y-4">
                    <div className="relative">
                      <div className="text-8xl animate-bounce">{kingdom.icon}</div>
                      {isCompleted && (
                        <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-2">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {isLocked && (
                        <div className="absolute -top-2 -right-2 bg-gray-700 rounded-full p-2">
                          <Lock className="h-6 w-6 text-white" />
                        </div>
                      )}
                      {kingdom.premium && (
                        <Badge className="absolute -top-2 -left-2 bg-gradient-to-r from-yellow-400 to-orange-500">
                          <Crown className="h-4 w-4 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {kingdom.name}
                    </h3>
                    <p className="text-gray-600">{kingdom.description}</p>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline">{kingdom.difficulty}</Badge>
                      <Badge variant="outline">{kingdom.challenges} desafios</Badge>
                    </div>
                    <Button 
                      className={`w-full bg-gradient-to-r ${kingdom.color} text-white border-0 hover:shadow-xl transition-all font-bold py-6 text-lg`}
                      disabled={isLocked}
                    >
                      {isLocked ? "🔒 Bloqueado" : isCompleted ? "Explorar Novamente" : "Explorar"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Progresso */}
          <Card className="p-6 bg-white/95 backdrop-blur shadow-2xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-800 text-lg">Progresso da Aventura</span>
                <span className="text-sm text-gray-600">
                  {completedKingdoms.length} de {kingdoms.length} reinos
                </span>
              </div>
              <Progress value={(completedKingdoms.length / kingdoms.length) * 100} className="h-4" />
            </div>
          </Card>

          {/* Conquistas */}
          {achievements.length > 0 && (
            <Card className="p-6 bg-white/95 backdrop-blur shadow-2xl">
              <h3 className="font-bold text-gray-800 text-lg mb-4">🏆 Conquistas Desbloqueadas</h3>
              <div className="flex gap-3 flex-wrap">
                {achievements.includes("streak_5") && (
                  <Badge className="bg-orange-500 text-white px-4 py-2">
                    🔥 Sequência de 5!
                  </Badge>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Modal da Loja */}
        {showShop && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <Card className="max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    🛍️ Loja Mágica
                  </h2>
                  <Button variant="outline" onClick={closeShop}>✕</Button>
                </div>

                {!selectedPackage ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {shopPackages.map((pkg) => (
                      <Card
                        key={pkg.id}
                        className={`p-6 cursor-pointer hover:scale-105 transition-all border-4 ${
                          pkg.popular ? "border-purple-500 shadow-purple-500/50" : "border-transparent"
                        }`}
                        onClick={() => setSelectedPackage(pkg)}
                      >
                        {pkg.popular && (
                          <Badge className="mb-3 bg-purple-500">🔥 Mais Popular</Badge>
                        )}
                        <div className="text-center space-y-4">
                          <div className="text-6xl">{pkg.icon}</div>
                          <h3 className="text-2xl font-bold text-gray-800">{pkg.name}</h3>
                          {pkg.description && (
                            <p className="text-gray-600">{pkg.description}</p>
                          )}
                          {pkg.stars && (
                            <div className="space-y-1">
                              <p className="text-3xl font-bold text-purple-600">{pkg.stars} ⭐</p>
                              {pkg.bonus && (
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                  +{pkg.bonus} bônus!
                                </Badge>
                              )}
                            </div>
                          )}
                          <p className="text-3xl font-bold text-gray-800">${pkg.price}</p>
                          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-6 text-lg">
                            Comprar Agora
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center space-y-4 p-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl">
                      <div className="text-7xl">{selectedPackage.icon}</div>
                      <h3 className="text-3xl font-bold text-gray-800">{selectedPackage.name}</h3>
                      <p className="text-4xl font-bold text-purple-600">${selectedPackage.price}</p>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-gray-800">Escolha o método de pagamento:</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <Button
                          onClick={() => setPaymentMethod("paypal")}
                          variant={paymentMethod === "paypal" ? "default" : "outline"}
                          className="py-8 text-lg font-bold"
                        >
                          <img src="https://www.paypalobjects.com/webstatic/icon/pp258.png" alt="PayPal" className="h-8 mr-2" />
                          PayPal
                        </Button>
                        <Button
                          onClick={() => setPaymentMethod("stripe")}
                          variant={paymentMethod === "stripe" ? "default" : "outline"}
                          className="py-8 text-lg font-bold"
                        >
                          <Zap className="h-8 w-8 mr-2" />
                          Cartão
                        </Button>
                      </div>

                      {paymentMethod === "paypal" && (
                        <div className="mt-6">
                          <PayPalScriptProvider options={{ "client-id": "YOUR_PAYPAL_CLIENT_ID", currency: "USD" }}>
                            <PayPalButtons
                              style={{ layout: "vertical" }}
                              createOrder={(data, actions) => {
                                return actions.order.create({
                                  purchase_units: [
                                    {
                                      amount: {
                                        value: selectedPackage.price.toString(),
                                      },
                                    },
                                  ],
                                });
                              }}
                              onApprove={(data, actions) => {
                                return actions.order!.capture().then(() => {
                                  handlePurchaseSuccess();
                                });
                              }}
                            />
                          </PayPalScriptProvider>
                        </div>
                      )}

                      {paymentMethod === "stripe" && (
                        <div className="mt-6">
                          <Elements stripe={stripePromise}>
                            <StripeCheckout
                              amount={selectedPackage.price}
                              onSuccess={handlePurchaseSuccess}
                            />
                          </Elements>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedPackage(null);
                        setPaymentMethod(null);
                      }}
                      className="w-full"
                    >
                      ← Voltar
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    );
  }

  // Desafio
  if (gameState === "challenge" && currentChallenge) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${currentKingdom?.color} p-4 sm:p-8`}>
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header do desafio */}
          <div className="bg-white/95 backdrop-blur rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-5xl">{currentKingdom?.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-800">{currentKingdom?.name}</h3>
                  <p className="text-sm text-gray-600">{currentChallenge.type.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Star className="h-5 w-5 mr-2 fill-yellow-400 text-yellow-400" />
                  {score}
                </Badge>
                {challengeStreak > 0 && (
                  <Badge className="text-lg px-4 py-2 bg-orange-500">
                    🔥 {challengeStreak}x
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Área do desafio */}
          <Card className="p-8 sm:p-12 bg-white/95 backdrop-blur shadow-2xl">
            <div className="space-y-8">
              {/* Ícone do desafio */}
              <div className="text-center">
                <div className="text-9xl mb-6 animate-bounce">{currentChallenge.type.icon}</div>
                <h3 className="text-4xl font-bold text-gray-800 mb-6">
                  {currentChallenge.question}
                </h3>
              </div>

              {/* Opções de resposta */}
              <div className="grid grid-cols-2 gap-4">
                {currentChallenge.options.map((option: string, index: number) => (
                  <Button
                    key={index}
                    onClick={() => checkAnswer(option)}
                    disabled={feedback !== null}
                    className={`text-2xl py-10 font-bold transition-all duration-300 hover:scale-105 ${
                      feedback === "correct" && option === currentChallenge.answer
                        ? "bg-green-500 hover:bg-green-600 scale-110"
                        : feedback === "wrong" && option === currentChallenge.answer
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                    }`}
                  >
                    {option}
                  </Button>
                ))}
              </div>

              {/* Feedback */}
              {feedback === "correct" && (
                <div className="text-center animate-in zoom-in duration-500">
                  <div className="text-8xl mb-4">🎉</div>
                  <p className="text-4xl font-bold text-green-600 mb-2">Muito bem!</p>
                  <p className="text-2xl text-gray-600">+{100 + (challengeStreak * 10)} pontos</p>
                  <p className="text-xl text-purple-600">+5 estrelas ⭐</p>
                </div>
              )}

              {feedback === "wrong" && (
                <div className="text-center animate-in shake duration-500">
                  <div className="text-8xl mb-4">😅</div>
                  <p className="text-3xl font-bold text-orange-600">Tente novamente!</p>
                  <p className="text-lg text-gray-600 mt-2">Você consegue!</p>
                </div>
              )}

              {/* Botão de dica */}
              {!showHint && feedback === null && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(true)}
                    className="text-lg px-8 py-6"
                  >
                    💡 Precisa de uma dica?
                  </Button>
                </div>
              )}

              {showHint && (
                <div className="bg-yellow-100 border-4 border-yellow-400 rounded-2xl p-8 text-center animate-in slide-in-from-top duration-500">
                  <p className="text-xl text-gray-800">
                    <strong>Dica:</strong> Pense com calma e tente de novo! Você consegue! 💪
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Botão voltar */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setGameState("map")}
              className="bg-white/90 backdrop-blur text-lg px-8 py-6 font-bold"
            >
              ← Voltar ao Mapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Tela de vitória
  if (gameState === "victory") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Confetes animados */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-4xl animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            >
              {["🎉", "🎊", "⭐", "🌟", "✨"][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>

        <div className="text-center space-y-8 animate-in zoom-in duration-1000 relative z-10">
          <div className="space-y-4">
            <div className="text-9xl animate-bounce mb-6">🏆</div>
            <h1 className="text-6xl sm:text-8xl font-bold text-white drop-shadow-2xl">
              Parabéns!
            </h1>
            <p className="text-3xl sm:text-4xl text-white/95 font-medium">
              Você completou todas as aventuras!
            </p>
            <p className="text-xl text-white/80">
              Você é um verdadeiro herói do Mundo Encantado! 🌟
            </p>
          </div>

          <Card className="p-10 bg-white/95 backdrop-blur shadow-2xl max-w-2xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-center justify-center gap-6">
                <div className="text-8xl">{selectedCharacter?.emoji}</div>
                <div className="text-left">
                  <p className="text-lg text-gray-600">Pontuação Final</p>
                  <p className="text-5xl font-bold text-purple-600">{score}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="text-center p-6 bg-purple-100 rounded-2xl">
                  <Sparkles className="h-10 w-10 text-purple-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-purple-600">{magicPieces}</p>
                  <p className="text-sm text-gray-600">Peças Mágicas</p>
                </div>
                <div className="text-center p-6 bg-yellow-100 rounded-2xl">
                  <Trophy className="h-10 w-10 text-yellow-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-yellow-600">{completedKingdoms.length}</p>
                  <p className="text-sm text-gray-600">Reinos Completados</p>
                </div>
                <div className="text-center p-6 bg-orange-100 rounded-2xl">
                  <Star className="h-10 w-10 text-orange-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-orange-600">{stars}</p>
                  <p className="text-sm text-gray-600">Estrelas Coletadas</p>
                </div>
                <div className="text-center p-6 bg-green-100 rounded-2xl">
                  <Zap className="h-10 w-10 text-green-500 mx-auto mb-2" />
                  <p className="text-3xl font-bold text-green-600">{achievements.length}</p>
                  <p className="text-sm text-gray-600">Conquistas</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={resetGame}
              size="lg"
              className="text-2xl px-10 py-8 bg-white text-purple-600 hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-xl rounded-full font-bold"
            >
              <Sparkles className="mr-3 h-8 w-8" />
              Nova Aventura
            </Button>
            <Button
              onClick={() => setGameState("map")}
              size="lg"
              variant="outline"
              className="text-2xl px-10 py-8 bg-white/90 backdrop-blur hover:scale-105 transition-all duration-300 shadow-xl rounded-full font-bold"
            >
              <Book className="mr-3 h-8 w-8" />
              Continuar Explorando
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
