import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Paths } from 'constants/Paths';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useScreenOptions } from 'hooks';
import { Chat } from 'pages/Chat';
import { CreateMedicalCard } from 'pages/CreateMedicalCard';
import { Home } from 'pages/Home';
import { Intro } from 'pages/Intro';
import { MedicalCards } from 'pages/MedicalCards';
import { Messages } from 'pages/Messages';
import React from 'react';
import type { ReactNode } from 'react';
import { Auth0Provider } from 'react-native-auth0';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { CLIENT_ID, DOMAIN } from 'secret';
import { useAuth } from 'store/auth/AuthStore';
import { usePoppins } from 'styles/theme';
import { mediLinkQueryClient } from 'utils/ReactQueryUtils';
import { EasContextProvider } from 'utils/eas';

const StackNavigator = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App(): ReactNode {
    const fontsLoaded = usePoppins();

    React.useEffect(() => {
        const hideSplashScreen = async (): Promise<void> => {
            await SplashScreen.hideAsync();
        };

        if (fontsLoaded) {
            setTimeout(() => {
                hideSplashScreen();
            }, 250);
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={mediLinkQueryClient}>
            <StatusBar style="dark" />
            <RecoilRoot>
                <Main />
            </RecoilRoot>
        </QueryClientProvider>
    );
}

function Main(): JSX.Element {
    const { isAuth } = useAuth();
    const screenOptions = useScreenOptions();
    return (
        <Auth0Provider domain={DOMAIN} clientId={CLIENT_ID}>
            <EasContextProvider>
                <NavigationContainer>
                    {isAuth ? (
                        <StackNavigator.Navigator>
                            <StackNavigator.Screen
                                options={screenOptions}
                                name={Paths.HOME}
                                component={Home}
                            />
                            <StackNavigator.Screen
                                options={screenOptions}
                                name={Paths.MEDICAL_CARDS}
                                component={MedicalCards}
                            />
                            <StackNavigator.Screen
                                options={screenOptions}
                                name={Paths.MESSAGES}
                                component={Messages}
                            />
                            <StackNavigator.Screen
                                options={screenOptions}
                                name={Paths.CREATE_MEDICAL_CARD}
                                component={CreateMedicalCard}
                            />
                            <StackNavigator.Screen
                                options={screenOptions}
                                name={Paths.CHAT}
                                component={Chat}
                            />
                        </StackNavigator.Navigator>
                    ) : (
                        <Intro />
                    )}
                </NavigationContainer>
            </EasContextProvider>
        </Auth0Provider>
    );
}
