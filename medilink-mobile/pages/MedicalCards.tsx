import type { Attestation } from '@ethereum-attestation-service/eas-sdk';
import { Navbar } from 'components';
import { Details } from 'components/Details';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Dimensions, SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useAuthNullSafe } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Button, Layout } from 'ui';
import { useEas } from 'utils/eas';

export const MedicalCards = (): ReactNode => {
    const auth = useAuthNullSafe();
    const eas = useEas();
    const [medicalCards, setMedicalCards] = useState<Array<Attestation>>([]);

    useEffect(() => {
        eas.genUsersAttestation(auth.wallet.address);
    }, [auth.wallet.address]);

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Details showLogout={true} />
                    <Layout></Layout>
                </ScrollView>
                <Button
                    buttonOverride={{
                        style: styles.createButton,
                    }}
                    onPress={async (): Promise<void> => {
                        const res = await eas.genCreateAttestation({
                            recipient: ethers.constants.AddressZero,
                            data: JSON.stringify({}),
                        });

                        console.log(res);
                    }}
                >
                    +
                </Button>
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
    createButton: {
        position: 'absolute',
        bottom: 72,
        width: 48,
        left: Dimensions.get('screen').width / 2 - 24,
        borderRadius: 48,
    },
});
