import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Brain, Timer, Type, CircleCheck as CheckCircle } from 'lucide-react-native';
import { BackButton } from '../ui/back-button';
import { useGameStats } from '@/hooks/useGameStats';

const WORD_POOL = [
  "apple", "bottle", "cloud", "dance", "eagle", "forest", "grape", "honey",
  "island", "jungle", "kite", "lemon", "mirror", "night", "ocean", "pencil",
  "queen", "river", "star", "tree", "umbrella", "valley", "window", "xylophone",
  "yellow", "zebra"
];

const getRandomWords = (count: number) => {
  const shuffled = [...WORD_POOL].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function WordMemoryGame() {
  const { saveGameStats } = useGameStats();
  const [phase, setPhase] = useState<"start" | "memorize" | "recall" | "result">("start");
  const [wordCount, setWordCount] = useState(5);
  const [words, setWords] = useState<string[]>([]);
  const [userInput, setUserInput] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const startTime = useRef<number>(0);

  const handleStart = (count: number) => {
    const randomWords = getRandomWords(count);
    setWords(randomWords);
    setWordCount(count);
    setPhase("memorize");
    setTimeLeft(60);
    startTime.current = Date.now();
  };

  useEffect(() => {
    if (phase === "memorize" && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (phase === "memorize" && timeLeft <= 0) {
      setPhase("recall");
    }
  }, [phase, timeLeft]);

  const handleReady = () => {
    setPhase("recall");
  };

  const handleCheck = async () => {
    const typedWords = userInput
      .toLowerCase()
      .split(/[\s,]+/)
      .filter((w) => w.trim() !== "");
    const correct = typedWords.filter((word) => words.includes(word));
    const uniqueCorrect = [...new Set(correct)];
    const newScore = uniqueCorrect.length;
    setScore(newScore);
    
    const newStreak = newScore === words.length ? currentStreak + 1 : 0;
    setCurrentStreak(newStreak);
    setBestStreak(Math.max(bestStreak, newStreak));

    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
    await saveGameStats({
      game_type: 'word_memory',
      score: newScore,
      best_streak: Math.max(bestStreak, newStreak),
      time_spent: timeSpent
    });

    setPhase("result");
  };

  const handleRestart = () => {
    setPhase("start");
    setUserInput("");
    setWords([]);
    setScore(0);
    setCurrentStreak(0);
    setBestStreak(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#00cc88', '#00eea1']}
        style={styles.gradient}
      >
        <BackButton />
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconContainer}>
            <Type size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>Word Memory</Text>

          {phase === "start" && (
            <Animated.View 
              entering={SlideInDown.duration(1000)}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Test your memory by remembering as many words as possible. Choose your challenge level:
              </Text>
              <View style={styles.buttonGrid}>
                {[5, 10, 15, 20].map((num) => (
                  <TouchableOpacity
                    key={num}
                    style={styles.levelButton}
                    onPress={() => handleStart(num)}
                  >
                    <Text style={styles.levelNumber}>{num}</Text>
                    <Text style={styles.levelText}>words</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {phase === "memorize" && (
            <Animated.View entering={FadeIn}>
              <View style={styles.timerContainer}>
                <Timer size={24} color="#ffffff" />
                <Text style={styles.timerText}>{timeLeft}s left to memorize</Text>
              </View>
              <View style={styles.wordsGrid}>
                {words.map((word, i) => (
                  <View key={i} style={styles.wordCard}>
                    <Text style={styles.wordText}>{word}</Text>
                  </View>
                ))}
              </View>
              <Button onPress={handleReady} style={styles.readyButton}>
                I am Ready
              </Button>
            </Animated.View>
          )}

          {phase === "recall" && (
            <Animated.View entering={FadeIn} style={styles.recallContainer}>
              <Text style={styles.instruction}>
                Type all the words you remember:
              </Text>
              <Textarea
                placeholder="Separate words with spaces or commas"
                value={userInput}
                onChangeText={setUserInput}
                style={styles.textarea}
              />
              <Button onPress={handleCheck} style={styles.submitButton}>
                Check Answers
              </Button>
            </Animated.View>
          )}

          {phase === "result" && (
            <Animated.View entering={FadeIn} style={styles.resultContainer}>
              <View style={styles.scoreContainer}>
                <CheckCircle size={48} color="#ffffff" />
                <Text style={styles.scoreText}>
                  You remembered {score} of {words.length} words!
                </Text>
              </View>
              <View style={styles.wordsList}>
                <Text style={styles.wordsTitle}>Words were:</Text>
                <View style={styles.wordsGrid}>
                  {words.map((word, i) => (
                    <View key={i} style={styles.wordCard}>
                      <Text style={styles.wordText}>{word}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <Button onPress={handleRestart} style={styles.playAgainButton}>
                Play Again
              </Button>
            </Animated.View>
          )}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    padding: 20,
    minHeight: '100%',
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 24,
  },
  startContainer: {
    alignItems: 'center',
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  levelButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    width: 120,
  },
  levelNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  levelText: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  timerText: {
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 8,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  wordCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    minWidth: 100,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 16,
    color: '#00cc88',
    fontWeight: '600',
  },
  readyButton: {
    backgroundColor: '#ffffff',
    marginTop: 32,
    width: '100%',
  },
  recallContainer: {
    alignItems: 'center',
  },
  instruction: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 24,
  },
  textarea: {
    backgroundColor: '#ffffff',
    marginBottom: 24,
    width: '100%',
  },
  submitButton: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
  resultContainer: {
    alignItems: 'center',
  },
  scoreContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  scoreText: {
    fontSize: 24,
    color: '#ffffff',
    marginTop: 16,
  },
  wordsList: {
    width: '100%',
    marginBottom: 32,
  },
  wordsTitle: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
  },
  playAgainButton: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
});