import { useEas } from 'App';
import { Navbar } from 'components';
import { Details } from 'components/Details';
import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthNullSafe } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Button } from 'ui';

export const MedicalCards = (): ReactNode => {
    const auth = useAuthNullSafe();
    const eas = useEas();

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Details showLogout={true} />
                    <Button
                        onPress={async (): Promise<void> => {
                            const res = await eas.genNullableAttestation(
                                '0xa8711e5be29ec502a06d239bca43b10c4d40239051975b886fe89c9969b19044',
                            );

                            console.log(res);
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
