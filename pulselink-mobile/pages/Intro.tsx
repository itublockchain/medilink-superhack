import { IntroIllustration } from 'assets';
import type { Wallet } from 'ethers';
import * as SecureStore from 'expo-secure-store';
import { useEffect } from 'react';
import { Alert, Image, KeyboardAvoidingView, Text, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import type { AuthWallet } from 'store/auth/AuthStore';
import { useSetAuth } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { wrappedEthers } from 'wrappedEthers';

import { Layout } from '../ui';
import { Button } from '../ui/Button';

export const Intro = (): JSX.Element => {
    const setAuth = useSetAuth();

    useEffect(() => {
        const genAuthIfExists = async (): Promise<void> => {
            const existingWallet = await SecureStore.getItemAsync('wallet');
            if (existingWallet == null) {
                return;
            }

            const walletJSON: AuthWallet = JSON.parse(existingWallet);

            setAuth({
                isAuth: true,
                wallet: walletJSON,
            });
        };
        genAuthIfExists();
    }, []);

    const genDelayedWallet = async (): Promise<Wallet> => {
        return await new Promise((resolve) => {
            setTimeout(() => {
                const wallet = wrappedEthers.Wallet.createRandom();
                resolve(wallet);
            }, 1000);
        });
    };

    const createWallet = async (): Promise<void> => {
        const wallet = await genDelayedWallet();
        const createdWallet: AuthWallet = {
            privateKey: wallet.privateKey,
            publicKey: wallet.publicKey,
            address: wallet.address,
        };
        await SecureStore.setItemAsync('wallet', JSON.stringify(createdWallet));
        Alert.alert('Medical ID created successfully');
        setAuth({
            isAuth: true,
            wallet: createdWallet,
        });
    };

    const mutation = useMutation(createWallet);

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={-24}
            behavior="padding"
            enabled
        >
            <View style={styles.wrapper}>
                <Layout padding={false}>
                    <View style={[styles.illustrationWrapper]}>
                        <Image
                            source={IntroIllustration}
                            style={styles.illustration}
                        />
                        <Text
                            style={{
                                fontSize: 48,
                                fontFamily: Poppins.semibold,
                            }}
                        >
                            PulseLink
                        </Text>
                    </View>

                    <View style={styles.connect}>
                        <Button
                            loading={mutation.isLoading}
                            onPress={mutation.mutate}
                            color="tertiary"
                        >
                            Create Medical ID
                        </Button>
                        <Button
                            buttonOverride={{
                                style: {
                                    marginTop: 8,
                                },
                            }}
                            color="secondary"
                        >
                            Connect by WorldID
                        </Button>
                    </View>
                </Layout>
            </View>
        </KeyboardAvoidingView>
    );
};

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: colors.background,
    },
    logoWrapper: {
        marginTop: Dimensions.get('screen').height * 0.25,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
    },
    illustrationWrapper: {
        marginTop: 120,
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
    },
    illustration: {
        width: '90%',
        height: Dimensions.get('screen').height / 2,
        resizeMode: 'contain',
    },
    logo: {
        width: '90%',
        height: 80,
        resizeMode: 'contain',
    },
    connect: {
        marginTop: 'auto',
        marginBottom: 72,
    },
});
