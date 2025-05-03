import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Brain, Trophy, Target, Timer, Zap, Crown, Medal, Star } from 'lucide-react-native';
import { BeltDisplay } from '../../components/belt-system/belt-rank';

const { width } = Dimensions.get('window');

const MOCK_DATA = {
  totalScore: 0,
  totalGamesPlayed: 0,
  averageScore: 0,
  timeSpent: '0h 0m',
  highestStreak: 0,
  gamesBreakdown: {
    numberMemory: { played: 0, avgScore: 0, bestScore: 0 },
    wordMemory: { played: 0, avgScore: 0, bestScore: 0 },
    stroopChallenge: { played: 0, avgScore: 0, bestScore: 0 },
    patternMemory: { played: 0, avgScore: 0, bestScore: 0 },
  },
  recentAchievements: [],
};

export default function StatsScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <LinearGradient
          colors={['#0088ff', '#00c6ff']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Trophy size={48} color="#ffffff" />
            <Text style={styles.headerTitle}>Your Progress</Text>
          </View>
        </LinearGradient>

        {/* Belt Rank Display */}
        <Animated.View 
          entering={FadeInDown.delay(200).duration(1000)}
          style={styles.beltContainer}
        >
          <BeltDisplay score={MOCK_DATA.totalScore} />
        </Animated.View>

        {/* Overview Stats */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(1000)}
          style={styles.statsContainer}
        >
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Target size={24} color="#0088ff" />
              <Text style={styles.statNumber}>{MOCK_DATA.totalGamesPlayed}</Text>
              <Text style={styles.statLabel}>Games Played</Text>
            </View>
            <View style={styles.statCard}>
              <Star size={24} color="#ffd700" />
              <Text style={styles.statNumber}>{MOCK_DATA.averageScore}%</Text>
              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
            <View style={styles.statCard}>
              <Timer size={24} color="#00cc88" />
              <Text style={styles.statNumber}>{MOCK_DATA.timeSpent}</Text>
              <Text style={styles.statLabel}>Time Spent</Text>
            </View>
            <View style={styles.statCard}>
              <Zap size={24} color="#ff6b6b" />
              <Text style={styles.statNumber}>{MOCK_DATA.highestStreak}</Text>
              <Text style={styles.statLabel}>Best Streak</Text>
            </View>
          </View>
        </Animated.View>

        {/* Game Performance */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(1000)}
          style={styles.section}
        >
          <Text style={styles.sectionTitle}>Game Performance</Text>
          <View style={styles.gameStats}>
            <View style={[styles.gameCard, { backgroundColor: '#0088ff' }]}>
              <Brain size={32} color="#ffffff" />
              <Text style={styles.gameTitle}>Number Memory</Text>
              <View style={styles.gameMetrics}>
                <Text style={styles.metricText}>Played: {MOCK_DATA.gamesBreakdown.numberMemory.played}</Text>
                <Text style={styles.metricText}>Best: {MOCK_DATA.gamesBreakdown.numberMemory.bestScore}</Text>
                <Text style={styles.metricText}>Avg: {MOCK_DATA.gamesBreakdown.numberMemory.avgScore}%</Text>
              </View>
            </View>

            <View style={[styles.gameCard, { backgroundColor: '#00cc88' }]}>
              <Brain size={32} color="#ffffff" />
              <Text style={styles.gameTitle}>Word Memory</Text>
              <View style={styles.gameMetrics}>
                <Text style={styles.metricText}>Played: {MOCK_DATA.gamesBreakdown.wordMemory.played}</Text>
                <Text style={styles.metricText}>Best: {MOCK_DATA.gamesBreakdown.wordMemory.bestScore}</Text>
                <Text style={styles.metricText}>Avg: {MOCK_DATA.gamesBreakdown.wordMemory.avgScore}%</Text>
              </View>
            </View>

            <View style={[styles.gameCard, { backgroundColor: '#ff6b6b' }]}>
              <Brain size={32} color="#ffffff" />
              <Text style={styles.gameTitle}>Stroop Challenge</Text>
              <View style={styles.gameMetrics}>
                <Text style={styles.metricText}>Played: {MOCK_DATA.gamesBreakdown.stroopChallenge.played}</Text>
                <Text style={styles.metricText}>Best: {MOCK_DATA.gamesBreakdown.stroopChallenge.bestScore}</Text>
                <Text style={styles.metricText}>Avg: {MOCK_DATA.gamesBreakdown.stroopChallenge.avgScore}%</Text>
              </View>
            </View>

            <View style={[styles.gameCard, { backgroundColor: '#845ec2' }]}>
              <Brain size={32} color="#ffffff" />
              <Text style={styles.gameTitle}>Pattern Memory</Text>
              <View style={styles.gameMetrics}>
                <Text style={styles.metricText}>Played: {MOCK_DATA.gamesBreakdown.patternMemory.played}</Text>
                <Text style={styles.metricText}>Best: {MOCK_DATA.gamesBreakdown.patternMemory.bestScore}</Text>
                <Text style={styles.metricText}>Avg: {MOCK_DATA.gamesBreakdown.patternMemory.avgScore}%</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Achievements */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(1000)}
          style={[styles.section, styles.achievementsSection]}
        >
          <Text style={styles.sectionTitle}>Recent Achievements</Text>
          <View style={styles.achievements}>
            {MOCK_DATA.recentAchievements.length === 0 ? (
              <View style={styles.emptyState}>
                <Medal size={48} color="#cccccc" />
                <Text style={styles.emptyStateText}>Play games to earn achievements!</Text>
              </View>
            ) : (
              MOCK_DATA.recentAchievements.map((achievement, index) => {
                const Icon = achievement.icon;
                return (
                  <View key={index} style={styles.achievementCard}>
                    <View style={styles.achievementIcon}>
                      <Icon size={24} color="#0088ff" />
                    </View>
                    <View style={styles.achievementInfo}>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    </View>
                    <Medal size={20} color="#ffd700" />
                  </View>
                );
              })
            )}
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 80,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 16,
  },
  beltContainer: {
    marginTop: -50,
    marginHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  statsContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: width * 0.42,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    padding: 20,
  },
  gameStats: {
    gap: 16,
  },
  gameCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  gameTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  gameMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  metricText: {
    color: '#ffffff',
    fontSize: 14,
  },
  achievementsSection: {
    paddingBottom: 40,
  },
  achievements: {
    gap: 12,
  },
  achievementCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f9ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 14,
    color: '#666666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
  emptyStateText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
});