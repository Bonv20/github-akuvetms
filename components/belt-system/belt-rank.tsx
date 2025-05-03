import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Medal } from 'lucide-react-native';

export type BeltRank = 'white' | 'blue' | 'purple' | 'brown' | 'black';

interface BeltConfig {
  color: string;
  minScore: number;
  name: string;
  emoji: string;
  description: string;
}

export const BELT_RANKS: Record<BeltRank, BeltConfig> = {
  white: {
    color: '#FFFFFF',
    minScore: 0,
    name: 'White Belt',
    emoji: '⚪',
    description: 'Beginning your cognitive journey',
  },
  blue: {
    color: '#0088FF',
    minScore: 1000,
    name: 'Blue Belt',
    emoji: '🔵',
    description: 'Developing mental skills',
  },
  purple: {
    color: '#8B5CF6',
    minScore: 2500,
    name: 'Purple Belt',
    emoji: '🟣',
    description: 'Advanced cognitive abilities',
  },
  brown: {
    color: '#8B4513',
    minScore: 5000,
    name: 'Brown Belt',
    emoji: '🟤',
    description: 'Near mastery level',
  },
  black: {
    color: '#000000',
    minScore: 10000,
    name: 'Black Belt',
    emoji: '⚫',
    description: 'Elite mental performance',
  },
};

export function calculateBeltRank(score: number): BeltRank {
  if (score >= BELT_RANKS.black.minScore) return 'black';
  if (score >= BELT_RANKS.brown.minScore) return 'brown';
  if (score >= BELT_RANKS.purple.minScore) return 'purple';
  if (score >= BELT_RANKS.blue.minScore) return 'blue';
  return 'white';
}

export function calculateProgress(score: number, currentBelt: BeltRank): number {
  const nextBelt = Object.entries(BELT_RANKS).find(
    ([_, config]) => config.minScore > score
  );

  if (!nextBelt) return 100;

  const currentMin = BELT_RANKS[currentBelt].minScore;
  const nextMin = nextBelt[1].minScore;
  const progress = ((score - currentMin) / (nextMin - currentMin)) * 100;

  return Math.min(Math.max(progress, 0), 100);
}

interface BeltDisplayProps {
  score: number;
  showProgress?: boolean;
}

export function BeltDisplay({ score, showProgress = true }: BeltDisplayProps) {
  const currentBelt = calculateBeltRank(score);
  const progress = calculateProgress(score, currentBelt);
  const beltConfig = BELT_RANKS[currentBelt];

  return (
    <View style={styles.container}>
      <View style={[styles.beltHeader, { backgroundColor: beltConfig.color === '#FFFFFF' ? '#f0f0f0' : beltConfig.color }]}>
        <Medal size={40} color={beltConfig.color === '#FFFFFF' ? '#666666' : '#FFFFFF'} />
        <View style={styles.beltTitleContainer}>
          <Text style={[styles.beltName, { color: beltConfig.color === '#FFFFFF' ? '#333333' : '#FFFFFF' }]}>
            {beltConfig.name} {beltConfig.emoji}
          </Text>
          <Text style={[styles.score, { color: beltConfig.color === '#FFFFFF' ? '#666666' : 'rgba(255,255,255,0.9)' }]}>
            {score.toLocaleString()} points
          </Text>
        </View>
      </View>
      
      <View style={styles.contentContainer}>
        <Text style={styles.description}>{beltConfig.description}</Text>
        
        {showProgress && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { 
                    width: `${progress}%`,
                    backgroundColor: beltConfig.color === '#FFFFFF' ? '#666666' : beltConfig.color
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>{Math.round(progress)}% to next belt</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  beltHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  beltTitleContainer: {
    marginLeft: 12,
    flex: 1,
  },
  beltName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  score: {
    fontSize: 16,
    opacity: 0.9,
  },
  contentContainer: {
    padding: 20,
    backgroundColor: '#ffffff',
  },
  description: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 16,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
});