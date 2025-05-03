import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeIn,
  SlideInDown,
  useAnimatedStyle,
  withSequence,
  withTiming,
  runOnJS,
  useSharedValue
} from 'react-native-reanimated';
import { Button } from '../ui/button';
import { Brain, Timer, Heart, Target } from 'lucide-react-native';
import { BackButton } from '../ui/back-button';

const { width } = Dimensions.get('window');
const TILE_SIZE = Math.min(width * 0.4, 150);

const COLORS = ['#ff0000', '#0088ff', '#00cc00', '#ffd700'] as const;
const COLOR_NAMES = ['Red', 'Blue', 'Green', 'Yellow'] as const;

export function PatternMemoryGame() {
  const [phase, setPhase] = useState<'start' | 'playing' | 'end'>('start');
  const [pattern, setPattern] = useState<number[]>([]);
  const [userInput, setUserInput] = useState<number[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(60);
  const [canClick, setCanClick] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const tileAnimations = COLORS.map(() => useSharedValue(1));

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

  const generateNext = () => {
    const next = Math.floor(Math.random() * 4);
    const newPattern = [...pattern, next];
    setPattern(newPattern);
    setUserInput([]);
    playPattern(newPattern);
  };

  const flashTile = async (index: number) => {
    return new Promise<void>((resolve) => {
      tileAnimations[index].value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 200 }, () => {
          runOnJS(resolve)();
        })
      );
    });
  };

  const playPattern = async (patt: number[]) => {
    setCanClick(false);
    for (let i = 0; i < patt.length; i++) {
      await flashTile(patt[i]);
      await new Promise(r => setTimeout(r, 200));
    }
    setCanClick(true);
  };

  const handleStart = () => {
    setPhase('playing');
    setPattern([]);
    setScore(0);
    setLives(3);
    setTimeLeft(60);
    setGameStarted(true);
    setTimeout(() => generateNext(), 500);
  };

  const handleTilePress = (index: number) => {
    if (!canClick) return;

    const newInput = [...userInput, index];
    setUserInput(newInput);

    if (index !== pattern[newInput.length - 1]) {
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) {
          setPhase('end');
        }
        return newLives;
      });
      setUserInput([]);
      if (lives > 1) {
        playPattern(pattern);
      }
    } else if (newInput.length === pattern.length) {
      setScore((s) => s + 1);
      setTimeout(() => generateNext(), 500);
    }
  };

  const animatedStyles = tileAnimations.map((anim) =>
    useAnimatedStyle(() => ({
      transform: [{ scale: anim.value }],
    }))
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#845ec2', '#a178df']}
        style={styles.gradient}
      >
        <BackButton />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Brain size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>Pattern Memory</Text>

          {phase === 'start' && (
            <Animated.View 
              entering={SlideInDown.duration(1000)}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Watch the pattern of colored tiles and repeat it in the correct order. Each successful round adds one more step!
              </Text>
              
              <View style={styles.rulesContainer}>
                <View style={styles.ruleItem}>
                  <Timer size={24} color="#845ec2" />
                  <Text style={styles.ruleText}>60 seconds to play</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Target size={24} color="#845ec2" />
                  <Text style={styles.ruleText}>Each success adds a step</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Heart size={24} color="#845ec2" />
                  <Text style={styles.ruleText}>3 lives to complete patterns</Text>
                </View>
              </View>

              <Button onPress={handleStart} style={styles.startButton}>
                Start Game
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
                  <Heart size={20} color="#ffffff" />
                  <Text style={styles.statText}>{lives}</Text>
                </View>
                <View style={styles.statBox}>
                  <Target size={20} color="#ffffff" />
                  <Text style={styles.statText}>{score}</Text>
                </View>
              </View>

              <View style={styles.gameArea}>
                <View style={styles.tilesContainer}>
                  {COLORS.map((color, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => handleTilePress(index)}
                      activeOpacity={0.8}
                    >
                      <Animated.View
                        style={[
                          styles.tile,
                          { backgroundColor: color },
                          animatedStyles[index],
                        ]}
                      />
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={styles.hint}>
                  {canClick ? 'Your turn!' : 'Watch carefully...'}
                </Text>
              </View>
            </Animated.View>
          )}

          {phase === 'end' && (
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
  gameArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tilesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
    maxWidth: TILE_SIZE * 2 + 32,
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    borderRadius: TILE_SIZE * 0.2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  hint: {
    fontSize: 18,
    color: '#ffffff',
    marginTop: 32,
    opacity: 0.9,
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