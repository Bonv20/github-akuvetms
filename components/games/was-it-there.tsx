import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Brain, Timer, Target, CheckCircle2, XCircle } from 'lucide-react-native';
import { Button } from '../ui/button';
import { BackButton } from '../ui/back-button';

const { width } = Dimensions.get('window');

const WORD_POOL = [
  "apple", "banana", "cherry", "dragon", "elephant", "flower", "guitar", "honey",
  "island", "jacket", "kettle", "lemon", "monkey", "needle", "orange", "pencil",
  "queen", "rabbit", "sunset", "tiger", "umbrella", "violin", "window", "xylophone",
  "yellow", "zebra", "beach", "cloud", "dolphin", "eagle", "forest", "garden",
  "hammer", "igloo", "jungle", "koala", "lantern", "mountain", "notebook", "octopus",
  "planet", "quilt", "rainbow", "shark", "turtle", "unicorn", "volcano", "whale",
  "yogurt", "zeppelin"
];

interface GameConfig {
  wordCount: number;
  testCount: number;
  timePerWord: number;
}

const DIFFICULTY_LEVELS: Record<string, GameConfig> = {
  easy: { wordCount: 5, testCount: 5, timePerWord: 3 },
  medium: { wordCount: 10, testCount: 15, timePerWord: 2.5 },
  hard: { wordCount: 20, testCount: 30, timePerWord: 2 }
};

export function WasItThereGame() {
  const [phase, setPhase] = useState<'start' | 'memorize' | 'test' | 'end'>('start');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [words, setWords] = useState<string[]>([]);
  const [testWords, setTestWords] = useState<{ word: string; wasShown: boolean }[]>([]);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lastAnswer, setLastAnswer] = useState<'correct' | 'wrong' | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateGame = (config: GameConfig) => {
    // Shuffle and select words for memorization
    const shuffledPool = [...WORD_POOL].sort(() => Math.random() - 0.5);
    const selectedWords = shuffledPool.slice(0, config.wordCount);
    
    // Create test words (50% from shown words, 50% new)
    const testPoolSize = Math.floor(config.testCount / 2);
    const shownTestWords = selectedWords
      .slice(0, testPoolSize)
      .map(word => ({ word, wasShown: true }));
    
    const newTestWords = shuffledPool
      .filter(word => !selectedWords.includes(word))
      .slice(0, config.testCount - testPoolSize)
      .map(word => ({ word, wasShown: false }));

    setWords(selectedWords);
    setTestWords([...shownTestWords, ...newTestWords].sort(() => Math.random() - 0.5));
    setTimeLeft(config.wordCount * 3); // 3 seconds per word for memorization
  };

  useEffect(() => {
    if (phase === 'memorize' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (phase === 'memorize' && timeLeft === 0) {
      setPhase('test');
      setTimeLeft(DIFFICULTY_LEVELS[difficulty].timePerWord);
    } else if (phase === 'test' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (phase === 'test' && timeLeft === 0) {
      handleAnswer(false);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, phase]);

  const handleStart = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setPhase('memorize');
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    generateGame(DIFFICULTY_LEVELS[selectedDifficulty]);
  };

  const handleAnswer = (answer: boolean) => {
    const currentWord = testWords[currentTestIndex];
    const isCorrect = answer === currentWord.wasShown;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(Math.max(newStreak, bestStreak));
        return newStreak;
      });
      setLastAnswer('correct');
    } else {
      setStreak(0);
      setLastAnswer('wrong');
    }

    if (currentTestIndex < testWords.length - 1) {
      setCurrentTestIndex(prev => prev + 1);
      setTimeLeft(DIFFICULTY_LEVELS[difficulty].timePerWord);
      setTimeout(() => setLastAnswer(null), 500);
    } else {
      setPhase('end');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.gradient}
      >
        <BackButton />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Brain size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>Was It There?</Text>

          {phase === 'start' && (
            <Animated.View 
              entering={SlideInDown.duration(1000)}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Memorize a sequence of words, then identify which words were shown. Choose your difficulty:
              </Text>
              
              <View style={styles.difficultyContainer}>
                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#00cc88' }]}
                  onPress={() => handleStart('easy')}
                >
                  <Text style={styles.difficultyTitle}>Easy</Text>
                  <Text style={styles.difficultyDesc}>5 words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#0088ff' }]}
                  onPress={() => handleStart('medium')}
                >
                  <Text style={styles.difficultyTitle}>Medium</Text>
                  <Text style={styles.difficultyDesc}>10 words</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#ff6b6b' }]}
                  onPress={() => handleStart('hard')}
                >
                  <Text style={styles.difficultyTitle}>Hard</Text>
                  <Text style={styles.difficultyDesc}>20 words</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {phase === 'memorize' && (
            <Animated.View entering={FadeIn}>
              <View style={styles.timerContainer}>
                <Timer size={24} color="#ffffff" />
                <Text style={styles.timerText}>{timeLeft}s to memorize</Text>
              </View>

              <View style={styles.wordsGrid}>
                {words.map((word, index) => (
                  <View key={index} style={styles.wordCard}>
                    <Text style={styles.wordText}>{word}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          )}

          {phase === 'test' && (
            <Animated.View entering={FadeIn}>
              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Timer size={20} color="#ffffff" />
                  <Text style={styles.statText}>{timeLeft}s</Text>
                </View>
                <View style={styles.statBox}>
                  <Target size={20} color="#ffffff" />
                  <Text style={styles.statText}>{score}</Text>
                </View>
                <View style={styles.statBox}>
                  <Brain size={20} color="#ffffff" />
                  <Text style={styles.statText}>{streak}</Text>
                </View>
              </View>

              <View style={styles.testContainer}>
                <Text style={styles.question}>Was this word shown?</Text>
                <View style={[
                  styles.testWord,
                  lastAnswer === 'correct' && styles.correctAnswer,
                  lastAnswer === 'wrong' && styles.wrongAnswer,
                ]}>
                  <Text style={styles.testWordText}>
                    {testWords[currentTestIndex].word}
                  </Text>
                </View>

                <View style={styles.answerButtons}>
                  <TouchableOpacity
                    style={[styles.answerButton, styles.yesButton]}
                    onPress={() => handleAnswer(true)}
                  >
                    <CheckCircle2 size={32} color="#ffffff" />
                    <Text style={styles.answerButtonText}>Yes</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.answerButton, styles.noButton]}
                    onPress={() => handleAnswer(false)}
                  >
                    <XCircle size={32} color="#ffffff" />
                    <Text style={styles.answerButtonText}>No</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}

          {phase === 'end' && (
            <Animated.View 
              entering={FadeIn}
              style={styles.gameOverContainer}
            >
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <View style={styles.resultsContainer}>
                <View style={styles.resultItem}>
                  <Target size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Score</Text>
                  <Text style={styles.resultValue}>{score}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Brain size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Best Streak</Text>
                  <Text style={styles.resultValue}>{bestStreak}</Text>
                </View>
              </View>
              <Button onPress={() => handleStart(difficulty)} style={styles.restartButton}>
                Play Again
              </Button>
            </Animated.View>
          )}
        </View>
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
    flex: 1,
    padding: 20,
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
  difficultyContainer: {
    width: '100%',
    gap: 16,
  },
  difficultyButton: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  difficultyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  difficultyDesc: {
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    minWidth: width * 0.4,
    alignItems: 'center',
  },
  wordText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
  },
  statBox: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
  },
  statText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 4,
  },
  testContainer: {
    alignItems: 'center',
  },
  question: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 24,
  },
  testWord: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 32,
    minWidth: width * 0.8,
    alignItems: 'center',
  },
  correctAnswer: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  wrongAnswer: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  testWordText: {
    fontSize: 32,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  answerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  answerButton: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    minWidth: width * 0.4,
  },
  yesButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  noButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.3)',
  },
  answerButtonText: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginTop: 8,
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
  },
  resultsContainer: {
    flexDirection: 'row',
    gap: 32,
    marginBottom: 40,
  },
  resultItem: {
    alignItems: 'center',
  },
  resultLabel: {
    fontSize: 16,
    color: '#ffffff',
    marginTop: 8,
    marginBottom: 4,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  restartButton: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
});