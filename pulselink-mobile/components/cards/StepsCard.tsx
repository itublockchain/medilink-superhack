import { Steps } from 'assets';
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useDailyStepCountSamples } from 'store/health/HealthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';

export const StepsCard = (): ReactNode => {
    const steps = useDailyStepCountSamples();

    return (
        <View style={styles.wrapper}>
            <View style={[styles.row, styles.between]}>
                <Text style={styles.title}>Steps</Text>
                <Image source={Steps} />
            </View>
            <View style={styles.column}>
                <Text style={styles.subtitle}>Average: </Text>
                <Text style={styles.text}>Value</Text>
            </View>
            <View style={styles.column}>
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>Normal</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        padding: 12,
        shadowColor: 'rgba(171, 100, 150, 0.57)', // IOS
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        borderRadius: 12,
        backgroundColor: colors.primary,
        width: '48%',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    between: {
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: Poppins.medium,
        fontSize: 18,
    },
    subtitle: {
        fontFamily: Poppins.light,
        fontSize: 14,
    },
    text: {
        fontFamily: Poppins.medium,
        fontSize: 20,
    },
    column: {
        marginTop: 4,
    },
    badge: {
        alignItems: 'center',
        borderRadius: 20,
        backgroundColor: '#2C9737',
        padding: 4,
        width: 64,
        marginTop: 12,
    },
    badgeText: {
        color: colors.light,
        fontSize: 12,
    },
});
