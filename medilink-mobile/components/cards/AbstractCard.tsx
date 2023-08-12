import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';

type Props = {
    title: string;
    average: string;
    asset: any;
};

export const AbstractCard = ({ average, asset, title }: Props): ReactNode => {
    return (
        <View style={styles.wrapper}>
            <View style={[styles.row, styles.between]}>
                <Text style={styles.title}>{title}</Text>
                <Image style={{ width: 32, height: 32 }} source={asset} />
            </View>
            <View style={styles.column}>
                <Text style={styles.subtitle}>Average: </Text>
                <Text style={styles.text}>{average}</Text>
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
        fontSize: 14,
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
