import { IntroIllustration } from 'assets';
import type { Wallet } from 'ethers';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, Text, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { useMutation } from 'react-query';
import type { AuthWallet } from 'store/auth/AuthStore';
import { useSetAuth } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { wrappedEthers } from 'wrappedEthers';

import { Button, Layout } from '../ui';

export const Intro = (): JSX.Element => {
    const setAuth = useSetAuth();
    const [hasAccount, setHasAccount] = useState(false);

    useEffect(() => {
        const genHasAccount = async (): Promise<void> => {
            const existingAccount = await SecureStore.getItemAsync('account');
            if (existingAccount != null) {
                setHasAccount(true);
            }
        };
        genHasAccount();
    }, []);

    useEffect(() => {
        const genAuthIfExists = async (): Promise<void> => {
            const existingWallet = await SecureStore.getItemAsync('wallet');
            if (existingWallet == null) {
                return;
            }

            await LocalAuthentication.getEnrolledLevelAsync();
            const result = await LocalAuthentication.authenticateAsync();

            if (result.success) {
                const walletJSON: AuthWallet = JSON.parse(existingWallet);

                setAuth({
                    isAuth: true,
                    wallet: walletJSON,
                });
            } else {
                setAuth({
                    isAuth: false,
                    wallet: null,
                });
            }
        };
        genAuthIfExists();
    }, []);

    const genDelayedWallet = async (): Promise<Wallet | null> => {
        return await new Promise((resolve) => {
            setTimeout(() => {
                const wallet = wrappedEthers.Wallet.createRandom();
                resolve(wallet);
            }, 1000);
        });
    };

    const createOrLoginWallet = async (): Promise<void> => {
        await LocalAuthentication.getEnrolledLevelAsync();
        const result = await LocalAuthentication.authenticateAsync();

        if (!result.success) {
            return;
        }

        if (hasAccount) {
            const existingWallet = await SecureStore.getItemAsync('account');
            await SecureStore.setItemAsync('wallet', existingWallet);
            const walletJSON = JSON.parse(existingWallet);
            setAuth({
                isAuth: true,
                wallet: walletJSON,
            });
        } else {
            const wallet = await genDelayedWallet();
            if (wallet == null) {
                return;
            }
            const createdWallet: AuthWallet = {
                privateKey: wallet.privateKey,
                publicKey: wallet.publicKey,
                address: wallet.address,
            };
            await SecureStore.setItemAsync(
                'account',
                JSON.stringify(createdWallet),
            );
            await SecureStore.setItemAsync(
                'wallet',
                JSON.stringify(createdWallet),
            );
            setAuth({
                isAuth: true,
                wallet: createdWallet,
            });
        }
    };

    const mutation = useMutation(createOrLoginWallet);

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
                    </View>

                    <View style={styles.connect}>
                        <Button
                            loading={mutation.isLoading}
                            onPress={mutation.mutate}
                            color="secondary"
                        >
                            {hasAccount
                                ? 'Login to Medical ID'
                                : 'Create Medical ID'}
                        </Button>
                        <Button
                            buttonOverride={{
                                style: {
                                    marginTop: 8,
                                },
                            }}
                            color="primary"
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
        marginTop: 180,
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
