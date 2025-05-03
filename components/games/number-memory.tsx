import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutUp } from 'react-native-reanimated';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Brain, Timer, Target, Heart } from 'lucide-react-native';
import { BackButton } from '../ui/back-button';
import { useGameStats } from '@/hooks/useGameStats';

const getRandomNumber = (length: number) => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

export function NumberMemoryGame() {
  const { saveGameStats } = useGameStats();
  const [level, setLevel] = useState(2);
  const [generatedNumber, setGeneratedNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [showNumber, setShowNumber] = useState(true);
  const [score, setScore] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [mistakeStreak, setMistakeStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const startTime = useRef<number>(0);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      if (timeLeft <= 0) {
        handleGameOver();
      } else {
        const timer = setTimeout(() => {
          setTimeLeft((prev) => prev - 1);
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [timeLeft, gameStarted, gameOver]);

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const number = getRandomNumber(level);
      setGeneratedNumber(number);
      setShowNumber(true);
      setUserInput('');

      const timer = setTimeout(() => {
        setShowNumber(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [score, level, gameOver, gameStarted]);

  const handleGameOver = async () => {
    setGameOver(true);
    const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
    
    await saveGameStats({
      game_type: 'number_memory',
      score,
      best_streak: bestStreak,
      time_spent: timeSpent
    });
  };

  const handleCheck = () => {
    if (userInput === generatedNumber) {
      setScore((prev) => prev + 1);
      setLevel((prev) => prev + 1);
      setMistakeStreak(0);
      setCurrentStreak(prev => {
        const newStreak = prev + 1;
        setBestStreak(current => Math.max(current, newStreak));
        return newStreak;
      });
    } else {
      setCurrentStreak(0);
      setMistakeStreak((prev) => {
        const newStreak = prev + 1;
        if (newStreak >= 2 && level > 1) {
          setLevel((prevLevel) => Math.max(1, prevLevel - 1));
          return 0;
        }
        return newStreak;
      });
    }
  };

  const handleStart = () => {
    setLevel(2);
    setScore(0);
    setMistakeStreak(0);
    setCurrentStreak(0);
    setBestStreak(0);
    setTimeLeft(60);
    setGameOver(false);
    setGameStarted(true);
    startTime.current = Date.now();
  };

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0088ff', '#00c6ff']}
          style={styles.gradient}
        >
          <BackButton />
          <Animated.View 
            entering={SlideInDown.duration(1000)}
            style={styles.content}
          >
            <View style={styles.iconContainer}>
              <Brain size={48} color="#ffffff" />
            </View>
            <Text style={styles.title}>Number Memory</Text>
            <Text style={styles.description}>
              Challenge your memory by remembering sequences of numbers. Each correct answer makes the sequence longer!
            </Text>
            
            <View style={styles.rulesContainer}>
              <View style={styles.ruleItem}>
                <Timer size={24} color="#0088ff" />
                <Text style={styles.ruleText}>60 seconds to play</Text>
              </View>
              <View style={styles.ruleItem}>
                <Target size={24} color="#0088ff" />
                <Text style={styles.ruleText}>Each success adds a digit</Text>
              </View>
              <View style={styles.ruleItem}>
                <Heart size={24} color="#0088ff" />
                <Text style={styles.ruleText}>Two mistakes reduces digits</Text>
              </View>
            </View>

            <Button onPress={handleStart} style={styles.startButton}>
              Start Game
            </Button>
          </Animated.View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0088ff', '#00c6ff']}
        style={styles.gradient}
      >
        <BackButton />
        <View style={styles.content}>
          <View style={styles.header}>
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
                <Text style={styles.statText}>{level}</Text>
              </View>
            </View>
          </View>

          {gameOver ? (
            <Animated.View 
              entering={FadeIn}
              style={styles.gameOverContainer}
            >
              <Text style={styles.gameOverTitle}>Game Over!</Text>
              <Text style={styles.finalScore}>Final Score: {score}</Text>
              <Button onPress={handleStart} style={styles.restartButton}>
                Play Again
              </Button>
            </Animated.View>
          ) : (
            <View style={styles.gameContainer}>
              {showNumber ? (
                <Animated.Text 
                  entering={FadeIn}
                  exiting={FadeOut}
                  style={styles.number}
                >
                  {generatedNumber}
                </Animated.Text>
              ) : (
                <Animated.View 
                  entering={FadeIn}
                  style={styles.inputContainer}
                >
                  <Input
                    placeholder="Enter the number"
                    value={userInput}
                    onChangeText={setUserInput}
                    maxLength={generatedNumber.length}
                    style={styles.input}
                  />
                  <Button onPress={handleCheck} style={styles.submitButton}>
                    Submit
                  </Button>
                </Animated.View>
              )}
            </View>
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
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
    opacity: 0.9,
  },
  rulesContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 24,
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
  },
  header: {
    marginBottom: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
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
  gameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  number: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 8,
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: '#ffffff',
    width: '100%',
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