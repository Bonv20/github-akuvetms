import { TextInput, StyleSheet } from 'react-native';

interface InputProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  maxLength?: number;
  style?: object;
}

export function Input({ placeholder, value, onChangeText, maxLength, style }: InputProps) {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      maxLength={maxLength}
      keyboardType="number-pad"
    />
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
});