import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Paths } from 'constants/Paths';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useScreenOptions } from 'hooks';
import { Home } from 'pages/Home';
import { Intro } from 'pages/Intro';
import React from 'react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { useAuth } from 'store/auth/AuthStore';
import { usePoppins } from 'styles/theme';
import { pulseLinkQueryClient } from 'utils/ReactQueryUtils';

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
            }, 1000);
        }
    }, [fontsLoaded]);

    if (!fontsLoaded) {
        return null;
    }

    return (
        <QueryClientProvider client={pulseLinkQueryClient}>
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
        <NavigationContainer>
            {isAuth ? (
                <StackNavigator.Navigator>
                    <StackNavigator.Screen
                        options={screenOptions}
                        name={Paths.HOME}
                        component={Home}
                    />
                </StackNavigator.Navigator>
            ) : (
                <Intro />
            )}
        </NavigationContainer>
    );
}
