import { Text as DefaultText, View as DefaultView, TextInput as DefaultTextInput, TouchableOpacity as DefaultButton } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

// --- ThemedText ---
export type TextProps = ThemeProps & DefaultText['props'] & {
  type?: 'default' | 'title' | 'subtitle' | 'link';
};

export function ThemedText({ style, lightColor, darkColor, type = 'default', ...rest }: TextProps) {
  const { colors } = useTheme();

  const fontSize = type === 'title' ? 32 : type === 'subtitle' ? 20 : 16;
  const fontWeight = type === 'title' || type === 'subtitle' ? 'bold' : 'normal';
  const color = type === 'link' ? colors.primary : colors.text;

  return (
    <DefaultText
      style={[{ color, fontSize, fontWeight }, style]}
      {...rest}
    />
  );
}

// --- ThemedView ---
export type ViewProps = ThemeProps & DefaultView['props'];

export function ThemedView({ style, lightColor, darkColor, ...rest }: ViewProps) {
  const { colors } = useTheme();
  return <DefaultView style={[{ backgroundColor: colors.background }, style]} {...rest} />;
}

// --- ThemedTextInput ---
export type TextInputProps = ThemeProps & DefaultTextInput['props'];

export function ThemedTextInput({ style, lightColor, darkColor, ...rest }: TextInputProps) {
    const { colors } = useTheme();
    return (
        <DefaultTextInput
            style={[
                {
                    backgroundColor: colors.inputBackground,
                    color: colors.text,
                    borderColor: colors.borderColor,
                    borderWidth: 1,
                    borderRadius: 8,
                    padding: 15,
                    fontSize: 16,
                },
                style
            ]}
            placeholderTextColor={colors.icon}
            {...rest}
        />
    );
}

// --- ThemedButton ---
export type ButtonProps = ThemeProps & DefaultButton['props'] & {
    title: string;
};

export function ThemedButton({ style, lightColor, darkColor, title, ...rest }: ButtonProps) {
    const { colors } = useTheme();
    return (
        <DefaultButton
            style={[
                {
                    backgroundColor: colors.primary,
                    padding: 15,
                    borderRadius: 8,
                    alignItems: 'center',
                },
                style
            ]}
            {...rest}
        >
            <ThemedText type="subtitle" style={{ color: '#fff' }}>{title}</ThemedText>
        </DefaultButton>
    );
}
