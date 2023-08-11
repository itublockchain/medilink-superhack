import { Navbar } from 'components';
import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from 'styles/colors';

export const MedicalCards = (): ReactNode => {
    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView></ScrollView>
                <Navbar />
            </View>
        </SafeAreaView>
    );
};

//eslint-disable-next-line
const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: colors.background,
    },
});
