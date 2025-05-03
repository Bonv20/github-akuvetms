import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';
import { Button } from '../ui/button';
import { Brain, Timer, Target, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import { BackButton } from '../ui/back-button';

const COLORS = ['Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange'] as const;
type ColorType = typeof COLORS[number];

const HEX: Record<ColorType, string> = {
  Red: '#ff0000',
  Blue: '#0088ff',
  Green: '#00cc00',
  Yellow: '#ffd700',
  Purple: '#800080',
  Orange: '#ffa500',
};

export function StroopChallengeGame() {
  const [phase, setPhase] = useState<'start' | 'playing' | 'end'>('start');
  const [word, setWord] = useState<ColorType>('Red');
  const [fontColor, setFontColor] = useState<ColorType>('Blue');
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (phase === 'playing' && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (phase === 'playing' && timeLeft === 0) {
      setPhase('end');
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [timeLeft, phase]);

  const generateNew = () => {
    const newWord = COLORS[Math.floor(Math.random() * COLORS.length)];
    let newColor;
    do {
      newColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    } while (newColor === newWord);
    setWord(newWord);
    setFontColor(newColor);
  };

  const handleStart = () => {
    setPhase('playing');
    setScore(0);
    setMistakes(0);
    setTimeLeft(60);
    setGameStarted(true);
    generateNew();
  };

  const handleChoice = (choice: ColorType) => {
    if (choice === fontColor) {
      setScore((prev) => prev + 1);
      setMistakes(0);
    } else {
      setMistakes((prev) => prev + 1);
    }

    if (mistakes + 1 >= 3) {
      setTimeout(() => {
        setMistakes(0);
      }, 500);
    }

    generateNew();
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#ff6b6b', '#ff8e8e']}
        style={styles.gradient}
      >
        <BackButton />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Brain size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>Stroop Challenge</Text>

          {phase === 'start' && (
            <Animated.View 
              entering={SlideInDown.duration(1000)}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Test your brain's ability to process conflicting information. Choose the color of the text, not what it says!
              </Text>
              
              <View style={styles.rulesContainer}>
                <View style={styles.ruleItem}>
                  <Timer size={24} color="#ff6b6b" />
                  <Text style={styles.ruleText}>60 seconds to play</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Target size={24} color="#ff6b6b" />
                  <Text style={styles.ruleText}>Choose text COLOR, not word</Text>
                </View>
                <View style={styles.ruleItem}>
                  <AlertTriangle size={24} color="#ff6b6b" />
                  <Text style={styles.ruleText}>3 mistakes reduces difficulty</Text>
                </View>
              </View>

              <Button onPress={handleStart} style={styles.startButton}>
                Start Challenge
              </Button>
            </Animated.View>
          )}

          {phase === 'playing' && (
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
                  <AlertTriangle size={20} color="#ffffff" />
                  <Text style={styles.statText}>{mistakes}</Text>
                </View>
              </View>

              <View style={styles.wordContainer}>
                <Text style={[styles.word, { color: HEX[fontColor] }]}>{word}</Text>
              </View>

              <View style={styles.colorGrid}>
                {COLORS.map((color) => (
                  <TouchableOpacity
                    key={color}
                    style={[styles.colorButton, { backgroundColor: HEX[color] }]}
                    onPress={() => handleChoice(color)}
                  >
                    <Text style={styles.colorButtonText}>{color}</Text>
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
              <Text style={styles.gameOverTitle}>Time's Up!</Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <Button onPress={handleStart} style={styles.restartButton}>
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
  rulesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    marginBottom: 32,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ruleText: {
    fontSize: 16,
    color: '#333333',
    marginLeft: 12,
  },
  startButton: {
    backgroundColor: '#ffffff',
    width: '100%',
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
  wordContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  word: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  colorButton: {
    width: '45%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colorButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
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
    marginBottom: 16,
  },
  finalScore: {
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 32,
  },
  restartButton: {
    backgroundColor: '#ffffff',
    width: '100%',
  },
});