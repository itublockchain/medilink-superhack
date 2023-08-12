import { useNavigation } from '@react-navigation/native';
import { HearthIcon } from 'assets';
import { Navbar } from 'components';
import { Details } from 'components/Details';
import { Paths } from 'constants/Paths';
import { useRefresh } from 'hooks/useRefresh';
import { send } from 'icons';
import type { ReactNode } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Linking,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useQuery } from 'react-query';
import { useAuthNullSafe } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Button, Layout } from 'ui';
import { queryKeys } from 'utils/api';
import { useEas } from 'utils/eas';
import type { AttestationDto } from 'utils/eas';
import { formatAddress } from 'utils/formatAddress';

export const MedicalCards = (): ReactNode => {
    const auth = useAuthNullSafe();
    const eas = useEas();
    const navigation = useNavigation();

    const { data, isLoading, refetch } = useQuery({
        queryFn: async (): Promise<Array<AttestationDto>> =>
            eas.genUsersAttestation(auth.wallet.address),
        queryKey: queryKeys.MEDICAL_CARDS,
    });
    const medicalCards = data ? data.reverse() : [];

    const refreshProps = useRefresh(() => {
        refetch();
    });

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView
                    refreshControl={<RefreshControl {...refreshProps} />}
                >
                    <Details showLogout={true} />
                    <Layout>
                        <View style={{ paddingBottom: 120 }}>
                            {medicalCards.length === 0 && isLoading && (
                                <ActivityIndicator style={{ marginTop: 24 }} />
                            )}
                            {medicalCards.length === 0 && !isLoading && (
                                <Text
                                    style={{
                                        fontFamily: Poppins.light,
                                        fontSize: 18,
                                        textAlign: 'center',
                                        marginTop: 24,
                                    }}
                                >
                                    You don’t have any medical cards. Tap plus
                                    button to create one
                                </Text>
                            )}
                            {medicalCards.map((item) => {
                                return (
                                    <View key={item.id} style={styles.card}>
                                        <View style={styles.row}>
                                            <Text style={styles.date}>
                                                {new Date(
                                                    item.time * 1000,
                                                ).toDateString()}
                                            </Text>

                                            <Image source={HearthIcon} />
                                        </View>
                                        <View>
                                            <Text style={styles.title}>
                                                Medical Report
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.recipient}>
                                                Attested to:{' '}
                                                {formatAddress(item.recipient)}
                                            </Text>
                                        </View>
                                        <View>
                                            <Button
                                                onPress={async (): Promise<void> => {
                                                    await Linking.openURL(
                                                        `https://optimism-goerli-bedrock.easscan.org/attestation/view/${item.id}`,
                                                    );
                                                }}
                                                color="primary"
                                                leftIcon={send}
                                            >
                                                Details
                                            </Button>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    </Layout>
                </ScrollView>
                <Button
                    onPress={(): void =>
                        navigation.navigate(Paths.CREATE_MEDICAL_CARD as never)
                    }
                    buttonOverride={{
                        style: styles.createButton,
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    createButton: {
        position: 'absolute',
        bottom: 72,
        width: 48,
        left: Dimensions.get('screen').width / 2 - 24,
        borderRadius: 48,
    },
    card: {
        padding: 12,
        shadowColor: 'rgba(171, 100, 150, 0.57)', // IOS
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        borderRadius: 12,
        backgroundColor: colors.primary,
        width: '100%',
        marginTop: 16,
    },
    date: {
        fontFamily: Poppins.medium,
        opacity: 0.5,
    },
    title: {
        fontFamily: Poppins.medium,
        opacity: 1,
        fontSize: 20,
        marginTop: 8,
    },
    recipient: {
        fontFamily: Poppins.medium,
        opacity: 0.5,
        fontSize: 12,
        marginTop: 12,
    },
});
