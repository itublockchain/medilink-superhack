import type { StackNavigationOptions } from '@react-navigation/stack';

import { colors } from '../styles/colors';

type Progress = { progress: number };

const forFade = ({
    current,
}: {
    current: Record<string, Progress>;
}): Record<string, { opacity: Progress }> => ({
    cardStyle: {
        opacity: current.progress,
    },
});

export const useScreenOptions = (): StackNavigationOptions => {
    return {
        headerStyle: {
            backgroundColor: '#FFFEF8',
            borderBottomColor: colors.primary,
            borderBottomWidth: 1,
        },
        headerTitleStyle: {
            color: '#25292D',
            fontWeight: '400',
        },
        headerBackTitle: '',
        headerBackTitleStyle: {
            color: colors.primary,
        },
        headerTintColor: colors.primary,
        headerShadowVisible: false,
        cardStyleInterpolator: forFade,
    };
};
