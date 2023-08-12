import * as SecureStore from 'expo-secure-store';
import { copy } from 'icons';
import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Share, StyleSheet, Text, View } from 'react-native';
import { useAuthNullSafe, useSetAuth } from 'store/auth/AuthStore';
import {
    useBiologicalSex,
    useBloodType,
    useHeight,
    useWeight,
} from 'store/health/HealthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Button } from 'ui';
import { formatAddress } from 'utils/formatAddress';

type Props = {
    showLogout?: boolean;
};

export const Details = ({ showLogout = false }: Props): ReactNode => {
    const auth = useAuthNullSafe();
    const setAuth = useSetAuth();

    const weight = useWeight();
    const height = useHeight();
    const bloodType = useBloodType();
    const sex = useBiologicalSex();

    const onShare = useCallback(async () => {
        try {
            const result = await Share.share({
                message: auth.wallet.address,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch {
            // alert.error('Failed to share');
        }
    }, [auth]);

    return (
        <View style={styles.wrapper}>
            <View>
                <Text style={styles.header}>
                    {formatAddress(auth.wallet.address, 8)}
                </Text>
            </View>
            <View style={{ marginTop: 12 }}>
                <Button
                    onPress={onShare}
                    buttonOverride={{
                        style: styles.copy,
                    }}
                    leftIcon={copy}
                />
            </View>
            <View style={styles.infoWrapper}>
                <Info
                    title="Weight"
                    value={
                        weight?.value
                            ? String(Math.ceil(weight.value)) + ' lbs'
                            : null
                    }
                />
                <Info
                    title="Height"
                    value={
                        height?.value
                            ? ((height.value * 2.54) / 100).toFixed(2)
                            : 'Unknown'
                    }
                />
                <Info title="Blood Type" value={bloodType?.value} />
                <Info title="Weight" value={sex?.value} />
            </View>
            {showLogout && (
                <View style={{ marginTop: 18 }}>
                    <Button
                        buttonOverride={{
                            style: {
                                width: 100,
                                height: 32,
                            },
                        }}
                        onPress={async (): Promise<void> => {
                            await SecureStore.deleteItemAsync('wallet');
                            setAuth({
                                isAuth: false,
                                wallet: null,
                            });
                        }}
                    >
                        Log out
                    </Button>
                </View>
            )}
        </View>
    );
};

const Info = ({
    title,
    value,
}: {
    title: string;
    value?: string | number | null;
}): ReactNode => {
    return (
        <View style={styles.infoWrapper}>
            <View style={styles.info}>
                <Text style={styles.infoTitle}>{title}</Text>
                <Text style={styles.infoText}>{value ?? 'Unknown'}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        paddingVertical: 24,
        paddingHorizontal: 12,
        backgroundColor: colors.light,
    },
    header: {
        fontSize: 20,
        fontFamily: Poppins.medium,
    },
    copy: {
        width: 32,
        height: 32,
        borderRadius: 48,
    },
    infoWrapper: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        marginHorizontal: 12,
        alignItems: 'center',
    },
    infoTitle: {
        fontSize: 16,
        fontFamily: Poppins.medium,
    },
    infoText: {
        fontSize: 14,
        marginTop: 4,
        fontFamily: Poppins.light,
        textTransform: 'capitalize',
    },
});
