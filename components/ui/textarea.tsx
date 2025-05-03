import { TextInput, StyleSheet } from 'react-native';

interface TextareaProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: object;
  numberOfLines?: number;
}

export function Textarea({ placeholder, value, onChangeText, style, numberOfLines = 4 }: TextareaProps) {
  return (
    <TextInput
      style={[styles.textarea, style]}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      multiline
      numberOfLines={numberOfLines}
      textAlignVertical="top"
    />
  );
}

const styles = StyleSheet.create({
  textarea: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    width: '100%',
    minHeight: 120,
  },
});