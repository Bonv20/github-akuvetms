import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, withSequence, withTiming, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { Brain, Timer, Star, Target } from 'lucide-react-native';
import { Button } from '../ui/button';
import { BackButton } from '../ui/back-button';

const { width } = Dimensions.get('window');

interface Card {
  id: number;
  word: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const LEVELS = {
  easy: {
    pairs: 4,
    words: ['snow', 'cake', 'goal', 'big'],
  },
  medium: {
    pairs: 6,
    words: ['star', 'moon', 'sun', 'rain', 'wind', 'cloud'],
  },
  hard: {
    pairs: 8,
    words: ['ocean', 'river', 'lake', 'storm', 'beach', 'wave', 'coral', 'shell'],
  },
};

export function CardFlipMnemonicsGame() {
  const [phase, setPhase] = useState<'start' | 'playing' | 'end'>('start');
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState<number>(0);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(90);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const cardRotations = cards.map(() => useSharedValue(0));

  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && phase === 'playing') {
      setPhase('end');
    }
  }, [timeLeft, phase]);

  const initializeCards = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    const level = LEVELS[selectedDifficulty];
    const words = [...level.words, ...level.words];
    const shuffled = words
      .map((word, index) => ({
        id: index,
        word,
        isFlipped: false,
        isMatched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs(0);
    setScore(0);
    setCombo(0);
    setTimeLeft(90);
  };

  const handleCardPress = (index: number) => {
    if (
      flippedIndices.length === 2 ||
      flippedIndices.includes(index) ||
      cards[index].isMatched
    ) {
      return;
    }

    // Animate card flip
    cardRotations[index].value = withSequence(
      withTiming(1, { duration: 150 }),
      withTiming(0, { duration: 150 })
    );

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIndex, secondIndex] = newFlipped;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      if (firstCard.word === secondCard.word) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map((card, i) => 
            i === firstIndex || i === secondIndex
              ? { ...card, isMatched: true }
              : card
          ));
          setFlippedIndices([]);
          setMatchedPairs(prev => prev + 1);
          setCombo(prev => prev + 1);
          setScore(prev => prev + (10 * (combo + 1)));

          // Check if all pairs are matched
          if (matchedPairs + 1 === LEVELS[difficulty].pairs) {
            const timeBonus = Math.floor(timeLeft * 0.5);
            setScore(prev => prev + timeBonus);
            setPhase('end');
          }
        }, 500);
      } else {
        // No match
        setTimeout(() => {
          setFlippedIndices([]);
          setCombo(0);
        }, 1000);
      }
    }
  };

  const handleStart = (selectedDifficulty: 'easy' | 'medium' | 'hard') => {
    setDifficulty(selectedDifficulty);
    setPhase('playing');
    initializeCards(selectedDifficulty);
  };

  const getCardStyle = (index: number) => {
    const isFlipped = flippedIndices.includes(index);
    const isMatched = cards[index].isMatched;
    return [
      styles.card,
      (isFlipped || isMatched) && styles.cardFlipped,
    ];
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
          <Text style={styles.title}>Memory Match</Text>

          {phase === 'start' && (
            <Animated.View 
              entering={FadeIn}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Match pairs of words to test your memory. Choose your difficulty level:
              </Text>
              
              <View style={styles.difficultyContainer}>
                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#00cc88' }]}
                  onPress={() => handleStart('easy')}
                >
                  <Text style={styles.difficultyTitle}>Easy</Text>
                  <Text style={styles.difficultyDesc}>4 pairs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#0088ff' }]}
                  onPress={() => handleStart('medium')}
                >
                  <Text style={styles.difficultyTitle}>Medium</Text>
                  <Text style={styles.difficultyDesc}>6 pairs</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.difficultyButton, { backgroundColor: '#ff6b6b' }]}
                  onPress={() => handleStart('hard')}
                >
                  <Text style={styles.difficultyTitle}>Hard</Text>
                  <Text style={styles.difficultyDesc}>8 pairs</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {phase === 'playing' && (
            <Animated.View entering={FadeIn} style={styles.gameContainer}>
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
                  <Star size={20} color="#ffffff" />
                  <Text style={styles.statText}>{combo}x</Text>
                </View>
              </View>

              <View style={styles.cardsGrid}>
                {cards.map((card, index) => (
                  <TouchableOpacity
                    key={card.id}
                    style={getCardStyle(index)}
                    onPress={() => handleCardPress(index)}
                    activeOpacity={0.8}
                  >
                    {(flippedIndices.includes(index) || card.isMatched) ? (
                      <Text style={styles.cardText}>{card.word}</Text>
                    ) : (
                      <Text style={styles.cardText}>?</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </Animated.View>
          )}

          {phase === 'end' && (
            <Animated.View 
              entering={FadeIn}
              style={styles.gameOverContainer}
            >
              <Text style={styles.gameOverTitle}>
                {timeLeft > 0 ? 'Congratulations!' : 'Time\'s Up!'}
              </Text>
              <View style={styles.resultsContainer}>
                <View style={styles.resultItem}>
                  <Target size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Final Score</Text>
                  <Text style={styles.resultValue}>{score}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Star size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Best Combo</Text>
                  <Text style={styles.resultValue}>{combo}x</Text>
                </View>
                {timeLeft > 0 && (
                  <View style={styles.resultItem}>
                    <Timer size={32} color="#ffffff" />
                    <Text style={styles.resultLabel}>Time Bonus</Text>
                    <Text style={styles.resultValue}>+{Math.floor(timeLeft * 0.5)}</Text>
                  </View>
                )}
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
  gameContainer: {
    flex: 1,
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
  cardsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 12,
  },
  card: {
    width: width * 0.2,
    aspectRatio: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
  },
  cardFlipped: {
    backgroundColor: '#ffffff',
  },
  cardText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  gameOverContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameOverTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 32,
  },
  resultsContainer: {
    width: '100%',
    gap: 16,
    marginBottom: 32,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 16,
    borderRadius: 12,
  },
  resultLabel: {
    flex: 1,
    fontSize: 18,
    color: '#ffffff',
    marginLeft: 12,
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  restartButton: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
});