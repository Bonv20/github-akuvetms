import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, SlideInDown, FadeInDown } from 'react-native-reanimated';
import { Brain, Timer, Target, Type, Shuffle } from 'lucide-react-native';
import { Button } from '../ui/button';
import { BackButton } from '../ui/back-button';

const { width } = Dimensions.get('window');

const WORD_PAIRS = [
  { word: 'CAT', anagrams: ['COT', 'ACT', 'CAP', 'CAM'] },
  { word: 'DOG', anagrams: ['DOT', 'GOD', 'DUG', 'DIG'] },
  { word: 'BOX', anagrams: ['OCA', 'OBX', 'OXV', 'OBP'] },
  { word: 'SUN', anagrams: ['SIN', 'UNS', 'SUP', 'SUL'] },
  { word: 'TOP', anagrams: ['TAP', 'POT', 'OPT', 'TOL'] },
  { word: 'PEN', anagrams: ['PAN', 'NEP', 'PET', 'PIN'] },
  { word: 'CUP', anagrams: ['COP', 'CPU', 'CUT', 'CLP'] },
  { word: 'HAT', anagrams: ['HIT', 'HOT', 'AHT', 'HAT'] },
  { word: 'BAT', anagrams: ['BTA', 'TBA', 'BLA', 'BFA'] },
  { word: 'MAP', anagrams: ['MOP', 'AMP', 'NAP', 'RAP'] },
  { word: 'LOG', anagrams: ['LOP', 'GOL', 'LOB', 'LOX'] },
  { word: 'JAM', anagrams: ['JOM', 'MAJ', 'JAD', 'JAR'] },
  { word: 'RAT', anagrams: ['RAP', 'TAR', 'TAD', 'RAN'] },
  { word: 'SIT', anagrams: ['SIP', 'TIS', 'TIP', 'SIN'] },
  { word: 'POT', anagrams: ['PAT', 'OPT', 'PIT', 'PUT'] },
  { word: 'BED', anagrams: ['BUD', 'EBD', 'BOD', 'BAD'] },
  { word: 'LAP', anagrams: ['LOP', 'ALP', 'LIP', 'LEP'] },
  { word: 'CAR', anagrams: ['CAB', 'RAC', 'CAT', 'CAN'] },
  { word: 'FAN', anagrams: ['FIN', 'NAF', 'FON', 'FAM'] },
  { word: 'MAN', anagrams: ['MIN', 'NAM', 'MAM', 'MAT'] },
  { word: 'STAR', anagrams: ['STOR', 'TSAR', 'STIR', 'STUR'] },
  { word: 'LAMP', anagrams: ['LOMP', 'PALM', 'LIPM', 'LAMT'] },
  { word: 'SAND', anagrams: ['SOND', 'DNES', 'SAND', 'SEND'] },
  { word: 'MILK', anagrams: ['MALK', 'KIML', 'MIKP', 'MILP'] },
  { word: 'FISH', anagrams: ['FIOS', 'FISH', 'MIFS', 'FUSH'] },
  { word: 'WINE', anagrams: ['WOIN', 'NAWI', 'WMIE', 'WINE'] },
  { word: 'TREE', anagrams: ['TERE', 'TEMR', 'TPEE', 'TLEE'] },
  { word: 'BOOK', anagrams: ['BOAK', 'OBOK', 'BOEK', 'BQOK'] },
  { word: 'LAND', anagrams: ['LOND', 'LPAN', 'LANK', 'LAND'] },
  { word: 'PARK', anagrams: ['LKAR', 'PCKA', 'PARK', 'PARL'] }
];

interface GameState {
  currentWord: string;
  options: string[];
  correctAnswerIndex: number;
}

export function AnagramsGame() {
  const [phase, setPhase] = useState<'start' | 'playing' | 'end'>('start');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentGame, setCurrentGame] = useState<GameState | null>(null);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const generateGame = () => {
    const randomPair = WORD_PAIRS[Math.floor(Math.random() * WORD_PAIRS.length)];
    const correctAnswerIndex = randomPair.anagrams.findIndex(word => {
      const sortedWord = word.split('').sort().join('');
      const sortedOriginal = randomPair.word.split('').sort().join('');
      return sortedWord === sortedOriginal;
    });
    
    setCurrentGame({
      currentWord: randomPair.word,
      options: randomPair.anagrams,
      correctAnswerIndex: correctAnswerIndex >= 0 ? correctAnswerIndex : 0,
    });
    setLastAnswerCorrect(null);
  };

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

  const handleStart = () => {
    setPhase('playing');
    setScore(0);
    setTimeLeft(60);
    setStreak(0);
    setBestStreak(0);
    generateGame();
  };

  const handleAnswer = (selectedIndex: number) => {
    if (!currentGame) return;

    const isCorrect = selectedIndex === currentGame.correctAnswerIndex;
    setLastAnswerCorrect(isCorrect);

    if (isCorrect) {
      setScore((prev) => prev + 1);
      setStreak((prev) => {
        const newStreak = prev + 1;
        setBestStreak((best) => Math.max(best, newStreak));
        return newStreak;
      });
    } else {
      setStreak(0);
    }

    setTimeout(generateGame, 1000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#6366F1']}
        style={styles.gradient}
      >
        <BackButton />
        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Type size={48} color="#ffffff" />
          </View>
          <Text style={styles.title}>Anagrams</Text>

          {phase === 'start' && (
            <Animated.View 
              entering={SlideInDown.duration(1000)}
              style={styles.startContainer}
            >
              <Text style={styles.description}>
                Test your word skills! Choose the correct word that uses the same letters as the given word.
              </Text>
              
              <View style={styles.rulesContainer}>
                <View style={styles.ruleItem}>
                  <Timer size={24} color="#8B5CF6" />
                  <Text style={styles.ruleText}>60 seconds to play</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Target size={24} color="#8B5CF6" />
                  <Text style={styles.ruleText}>Find matching anagrams</Text>
                </View>
                <View style={styles.ruleItem}>
                  <Shuffle size={24} color="#8B5CF6" />
                  <Text style={styles.ruleText}>Letters are mixed up</Text>
                </View>
              </View>

              <Button onPress={handleStart} style={styles.startButton}>
                Start Game
              </Button>
            </Animated.View>
          )}

          {phase === 'playing' && currentGame && (
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

              <View style={styles.gameArea}>
                <Animated.View 
                  entering={FadeInDown}
                  style={styles.wordContainer}
                >
                  <Text style={styles.wordTitle}>Find the anagram for:</Text>
                  <Text style={styles.word}>{currentGame.currentWord}</Text>
                </Animated.View>

                <View style={styles.optionsGrid}>
                  {currentGame.options.map((option, index) => {
                    const isCorrect = index === currentGame.correctAnswerIndex;
                    const showResult = lastAnswerCorrect !== null;
                    const buttonStyle = [
                      styles.optionButton,
                      showResult && isCorrect && styles.correctButton,
                      showResult && !isCorrect && styles.wrongButton,
                    ];

                    return (
                      <TouchableOpacity
                        key={index}
                        style={buttonStyle}
                        onPress={() => handleAnswer(index)}
                        disabled={lastAnswerCorrect !== null}
                      >
                        <Text style={styles.optionText}>{option}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </Animated.View>
          )}

          {phase === 'end' && (
            <Animated.View 
              entering={FadeIn}
              style={styles.gameOverContainer}
            >
              <Text style={styles.gameOverTitle}>Time's Up!</Text>
              <View style={styles.resultsContainer}>
                <View style={styles.resultItem}>
                  <Target size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Final Score</Text>
                  <Text style={styles.resultValue}>{score}</Text>
                </View>
                <View style={styles.resultItem}>
                  <Brain size={32} color="#ffffff" />
                  <Text style={styles.resultLabel}>Best Streak</Text>
                  <Text style={styles.resultValue}>{bestStreak}</Text>
                </View>
              </View>
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
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    borderRadius: 20,
    width: '100%',
  },
  wordTitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 12,
  },
  word: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 4,
  },
  optionsGrid: {
    width: '100%',
    gap: 16,
  },
  optionButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
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
  correctButton: {
    backgroundColor: 'rgba(34, 197, 94, 0.6)', // Green
  },
  wrongButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.6)', // Red
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    letterSpacing: 2,
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