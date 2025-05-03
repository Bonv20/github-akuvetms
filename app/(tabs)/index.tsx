import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { Brain, Zap, Trophy, Crown, Flame } from 'lucide-react-native';

const { width } = Dimensions.get('window');
const BRAIN_LOGO = 'https://images.pexels.com/photos/4064840/pexels-photo-4064840.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';

// Initialize streak data for new users
const MOCK_STREAK = {
  current: 0,
  longest: 0,
  lastLogin: new Date().toISOString().split('T')[0],
  milestones: [3, 7, 14, 30, 60, 90],
  nextMilestone: 3,
};

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <LinearGradient
        colors={['#0088ff', '#00c6ff']}
        style={styles.heroContainer}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View entering={FadeInDown.delay(200).duration(1000)} style={styles.heroContent}>
          <Image 
            source={{ uri: BRAIN_LOGO }}
            style={styles.heroImage}
          />
          <Text style={styles.heroTitle}>BrainBoost</Text>
          <Text style={styles.heroSubtitle}>Train your brain, unlock your potential</Text>
        </Animated.View>
      </LinearGradient>

      {/* Streak Section */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(1000)}
        style={styles.streakContainer}
      >
        <LinearGradient
          colors={['#ff6b6b', '#ff8e8e']}
          style={styles.streakGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.streakHeader}>
            <Flame size={32} color="#ffffff" />
            <Text style={styles.streakTitle}>Daily Streak</Text>
          </View>
          <View style={styles.streakContent}>
            <View style={styles.streakStats}>
              <View style={styles.streakStat}>
                <Text style={styles.streakNumber}>{MOCK_STREAK.current}</Text>
                <Text style={styles.streakLabel}>Current Days</Text>
              </View>
              <View style={styles.streakDivider} />
              <View style={styles.streakStat}>
                <Text style={styles.streakNumber}>{MOCK_STREAK.longest}</Text>
                <Text style={styles.streakLabel}>Longest Streak</Text>
              </View>
            </View>
            <View style={styles.streakProgress}>
              <Text style={styles.streakProgressText}>
                {MOCK_STREAK.nextMilestone - MOCK_STREAK.current} days until {MOCK_STREAK.nextMilestone} day milestone!
              </Text>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill,
                    { width: `${(MOCK_STREAK.current / MOCK_STREAK.nextMilestone) * 100}%` }
                  ]} 
                />
              </View>
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Stats Section */}
      <Animated.View 
        entering={FadeInRight.delay(400).duration(1000)}
        style={styles.statsContainer}
      >
        <View style={styles.statCard}>
          <Brain size={32} color="#0088ff" />
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>Brain Games</Text>
        </View>
        <View style={styles.statCard}>
          <Trophy size={32} color="#ffd700" />
          <Text style={styles.statNumber}>1.2M+</Text>
          <Text style={styles.statLabel}>Players</Text>
        </View>
        <View style={styles.statCard}>
          <Crown size={32} color="#ff6b6b" />
          <Text style={styles.statNumber}>50M+</Text>
          <Text style={styles.statLabel}>Games Played</Text>
        </View>
      </Animated.View>

      {/* Daily Challenge */}
      <Animated.View 
        entering={FadeInDown.delay(600).duration(1000)}
        style={styles.challengeContainer}
      >
        <LinearGradient
          colors={['#00cc88', '#00eea1']}
          style={styles.challengeGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Zap size={32} color="#ffffff" style={styles.challengeIcon} />
          <Text style={styles.challengeTitle}>Daily Challenge</Text>
          <Text style={styles.challengeDescription}>
            Complete today's set of brain training exercises
          </Text>
          <TouchableOpacity style={styles.challengeButton}>
            <Text style={styles.challengeButtonText}>Start Challenge</Text>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>

      {/* Featured Games */}
      <Animated.View 
        entering={FadeInRight.delay(800).duration(1000)}
        style={styles.featuredContainer}
      >
        <Text style={styles.sectionTitle}>Featured Games</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredScroll}
        >
          <TouchableOpacity style={styles.featuredCard}>
            <View style={[styles.featuredIcon, { backgroundColor: '#0088ff' }]}>
              <Brain size={32} color="#ffffff" />
            </View>
            <Text style={styles.featuredTitle}>Number Memory</Text>
            <Text style={styles.featuredDescription}>
              Remember growing sequences of numbers
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredCard}>
            <View style={[styles.featuredIcon, { backgroundColor: '#00cc88' }]}>
              <Brain size={32} color="#ffffff" />
            </View>
            <Text style={styles.featuredTitle}>Word Memory</Text>
            <Text style={styles.featuredDescription}>
              Memorize and recall word lists
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.featuredCard}>
            <View style={[styles.featuredIcon, { backgroundColor: '#ff6b6b' }]}>
              <Brain size={32} color="#ffffff" />
            </View>
            <Text style={styles.featuredTitle}>Stroop Test</Text>
            <Text style={styles.featuredDescription}>
              Test your mental flexibility
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  heroContainer: {
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 18,
    color: '#ffffff',
    opacity: 0.9,
  },
  streakContainer: {
    padding: 20,
    marginTop: -30,
  },
  streakGradient: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  streakTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 12,
  },
  streakContent: {
    gap: 20,
  },
  streakStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  streakStat: {
    alignItems: 'center',
  },
  streakNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  streakLabel: {
    fontSize: 14,
    color: '#ffffff',
    opacity: 0.9,
  },
  streakDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  streakProgress: {
    marginTop: 8,
  },
  streakProgressText: {
    fontSize: 14,
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  statCard: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    width: width * 0.27,
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
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  challengeContainer: {
    padding: 20,
  },
  challengeGradient: {
    borderRadius: 20,
    padding: 24,
  },
  challengeIcon: {
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  challengeDescription: {
    fontSize: 16,
    color: '#ffffff',
    opacity: 0.9,
    marginBottom: 20,
  },
  challengeButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 30,
    alignSelf: 'flex-start',
  },
  challengeButtonText: {
    color: '#00cc88',
    fontSize: 16,
    fontWeight: '600',
  },
  featuredContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 16,
  },
  featuredScroll: {
    paddingRight: 20,
  },
  featuredCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginRight: 16,
    width: width * 0.7,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  featuredIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  featuredTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
  },
  featuredDescription: {
    fontSize: 16,
    color: '#666666',
    lineHeight: 22,
  },
});