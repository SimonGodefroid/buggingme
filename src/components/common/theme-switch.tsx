import { Button, Tooltip } from '@nextui-org/react';
import { useTheme } from 'next-themes';

export enum Theme {
  dark = 'dark',
  light = 'light',
}

export default function ThemeSwitch() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <Tooltip
      content={`Switch to ${resolvedTheme === Theme.light ? Theme.dark : Theme.light} theme`}
    >
      <Button
        variant="light"
        onClick={() => {
          setTheme(resolvedTheme === Theme.light ? Theme.dark : Theme.light);
        }}
      >
        <span suppressHydrationWarning>
          {resolvedTheme === Theme.light ? '🌙' : '🌞'}
        </span>
      </Button>
    </Tooltip>
  );
}
