import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Dimensions, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Brain, Dumbbell as Numbers, Type, Palette, Grid2x2 as Grid, Calculator, Shuffle, Lock, Search } from 'lucide-react-native';
import { NumberMemoryGame } from '../../components/games/number-memory';
import { WordMemoryGame } from '../../components/games/word-memory';
import { StroopChallengeGame } from '../../components/games/stroop-challenge';
import { PatternMemoryGame } from '../../components/games/pattern-memory';
import { MathBlitzGame } from '../../components/games/math-blitz';
import { AnagramsGame } from '../../components/games/anagrams';
import { CardFlipMnemonicsGame } from '../../components/games/card-flip-mnemonics';
import { WasItThereGame } from '../../components/games/was-it-there';
import { calculateBeltRank, BeltRank } from '../../components/belt-system/belt-rank';

const { width } = Dimensions.get('window');

type GameType = 'numbers' | 'words' | 'stroop' | 'pattern' | 'math' | 'anagrams' | 'cards' | 'was-it-there' | null;

const GAMES_BANNER = 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

interface GameCard {
  id: GameType;
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string[];
  image: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  timeLimit: string;
  requiredBelt: BeltRank;
}

// Games ordered by belt rank
const GAMES: GameCard[] = [
  // White Belt Games
  {
    id: 'numbers',
    title: 'Number Memory',
    description: 'Remember sequences of numbers as they get longer',
    icon: <Numbers size={32} color="#ffffff" />,
    gradient: ['#0088ff', '#00c6ff'],
    image: 'https://images.pexels.com/photos/3760810/pexels-photo-3760810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '60 sec',
    requiredBelt: 'white'
  },
  {
    id: 'words',
    title: 'Word Memory',
    description: 'Memorize and recall lists of random words',
    icon: <Type size={32} color="#ffffff" />,
    gradient: ['#00cc88', '#00eea1'],
    image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '60 sec',
    requiredBelt: 'white'
  },
  // Blue Belt Games
  {
    id: 'stroop',
    title: 'Stroop Challenge',
    description: 'Test your brain with color and word conflicts',
    icon: <Palette size={32} color="#ffffff" />,
    gradient: ['#ff6b6b', '#ff8e8e'],
    image: 'https://images.pexels.com/photos/5428836/pexels-photo-5428836.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Hard',
    timeLimit: '60 sec',
    requiredBelt: 'blue'
  },
  {
    id: 'anagrams',
    title: 'Anagrams',
    description: 'Find words made from the same letters',
    icon: <Shuffle size={32} color="#ffffff" />,
    gradient: ['#8B5CF6', '#6366F1'],
    image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '60 sec',
    requiredBelt: 'blue'
  },
  // Purple Belt Games
  {
    id: 'pattern',
    title: 'Pattern Memory',
    description: 'Remember and repeat growing color sequences',
    icon: <Grid size={32} color="#ffffff" />,
    gradient: ['#845ec2', '#a178df'],
    image: 'https://images.pexels.com/photos/2911521/pexels-photo-2911521.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Easy',
    timeLimit: '60 sec',
    requiredBelt: 'purple'
  },
  {
    id: 'math',
    title: 'Math Blitz',
    description: 'Quick calculations to test your mental math',
    icon: <Calculator size={32} color="#ffffff" />,
    gradient: ['#845ec2', '#a178df'],
    image: 'https://images.pexels.com/photos/3729557/pexels-photo-3729557.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '60 sec',
    requiredBelt: 'purple'
  },
  {
    id: 'cards',
    title: 'Card Flip Mnemonics',
    description: 'Match related concepts through words, images, and hints',
    icon: <Grid size={32} color="#ffffff" />,
    gradient: ['#6366F1', '#8B5CF6'],
    image: 'https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '90 sec',
    requiredBelt: 'purple'
  },
  {
    id: 'was-it-there',
    title: 'Was It There?',
    description: 'Test your recognition memory with word sequences',
    icon: <Search size={32} color="#ffffff" />,
    gradient: ['#6366F1', '#8B5CF6'],
    image: 'https://images.pexels.com/photos/267669/pexels-photo-267669.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    difficulty: 'Medium',
    timeLimit: '60 sec',
    requiredBelt: 'purple'
  }
];

export default function GamesScreen() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);
  // For demo purposes, let's assume the user has some points
  // In a real app, this would come from your state management system
  const userPoints = 0; // Start with 0 points for white belt
  const userBelt = calculateBeltRank(userPoints);

  if (selectedGame === 'numbers') return <NumberMemoryGame />;
  if (selectedGame === 'words') return <WordMemoryGame />;
  if (selectedGame === 'stroop') return <StroopChallengeGame />;
  if (selectedGame === 'pattern') return <PatternMemoryGame />;
  if (selectedGame === 'math') return <MathBlitzGame />;
  if (selectedGame === 'anagrams') return <AnagramsGame />;
  if (selectedGame === 'cards') return <CardFlipMnemonicsGame />;
  if (selectedGame === 'was-it-there') return <WasItThereGame />;

  const isGameLocked = (requiredBelt: BeltRank) => {
    const beltRanks: BeltRank[] = ['white', 'blue', 'purple', 'brown', 'black'];
    const userRankIndex = beltRanks.indexOf(userBelt);
    const requiredRankIndex = beltRanks.indexOf(requiredBelt);
    return userRankIndex < requiredRankIndex;
  };

  // Group games by belt rank
  const gamesByBelt = GAMES.reduce((acc, game) => {
    if (!acc[game.requiredBelt]) {
      acc[game.requiredBelt] = [];
    }
    acc[game.requiredBelt].push(game);
    return acc;
  }, {} as Record<BeltRank, GameCard[]>);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Banner */}
        <LinearGradient
          colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.3)']}
          style={styles.heroBanner}
        >
          <Image 
            source={{ uri: GAMES_BANNER }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerContent}>
            <Animated.View entering={FadeInDown.delay(200).duration(1000)}>
              <Text style={styles.bannerTitle}>Brain Training Games</Text>
              <Text style={styles.bannerSubtitle}>Challenge yourself with our collection of cognitive games</Text>
            </Animated.View>
          </View>
        </LinearGradient>

        {/* Games Grid */}
        <View style={styles.gamesContainer}>
          {(['white', 'blue', 'purple'] as BeltRank[]).map((belt) => (
            <View key={belt} style={styles.beltSection}>
              <Text style={styles.beltTitle}>{belt.charAt(0).toUpperCase() + belt.slice(1)} Belt Games</Text>
              <View style={styles.beltGames}>
                {gamesByBelt[belt]?.map((game, index) => {
                  const locked = isGameLocked(game.requiredBelt);
                  
                  return (
                    <Animated.View
                      key={game.id}
                      entering={FadeInRight.delay(200 * (index + 1)).duration(1000)}
                      style={styles.gameCardWrapper}
                    >
                      <TouchableOpacity
                        style={styles.gameCard}
                        onPress={() => !locked && setSelectedGame(game.id)}
                        disabled={locked}
                      >
                        <Image 
                          source={{ uri: game.image }}
                          style={[styles.gameImage, locked && styles.gameImageLocked]}
                        />
                        <LinearGradient
                          colors={game.gradient}
                          style={styles.gameContent}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <View style={styles.gameIcon}>
                            {locked ? <Lock size={32} color="#ffffff" /> : game.icon}
                          </View>
                          <View style={styles.gameInfo}>
                            <Text style={styles.gameTitle}>{game.title}</Text>
                            {locked ? (
                              <Text style={styles.lockedText}>
                                Unlock at {game.requiredBelt} belt
                              </Text>
                            ) : (
                              <Text style={styles.gameDescription}>{game.description}</Text>
                            )}
                            <View style={styles.gameMetrics}>
                              <View style={styles.metricBadge}>
                                <Text style={styles.metricText}>{game.difficulty}</Text>
                              </View>
                              <View style={styles.metricBadge}>
                                <Text style={styles.metricText}>{game.timeLimit}</Text>
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      </TouchableOpacity>
                    </Animated.View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroBanner: {
    width: '100%',
    height: 200,
    overflow: 'hidden',
    borderRadius: 12,
    marginBottom: 20,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  bannerContent: {
    position: 'relative',
    padding: 20,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  gamesContainer: {
    padding: 16,
  },
  beltSection: {
    marginBottom: 24,
  },
  beltTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
    paddingLeft: 4,
  },
  beltGames: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gameCardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  gameCard: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 12,
    height: 200,
  },
  gameImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gameImageLocked: {
    opacity: 0.5,
  },
  gameContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    padding: 16,
    justifyContent: 'space-between',
  },
  gameIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameInfo: {
    alignItems: 'flex-start',
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameDescription: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  lockedText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameMetrics: {
    flexDirection: 'row',
    gap: 8,
  },
  metricBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  metricText: {
    fontSize: 12,
    color: '#ffffff',
  },
});