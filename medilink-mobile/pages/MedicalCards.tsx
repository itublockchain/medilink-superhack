import { Navbar } from 'components';
import { Details } from 'components/Details';
import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthNullSafe } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Button } from 'ui';
import { MedilinkEAS } from 'utils/eas';

export const MedicalCards = (): ReactNode => {
    const auth = useAuthNullSafe();

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Details showLogout={true} />
                    <Button
                        onPress={async (): Promise<void> => {
                            const eas = new MedilinkEAS(auth.wallet.privateKey);
                        }}
                    >
                        Get attestation
                    </Button>
                </ScrollView>
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
