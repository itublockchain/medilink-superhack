import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Paths } from 'constants/Paths';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useScreenOptions } from 'hooks';
import { Home } from 'pages/Home';
import { Intro } from 'pages/Intro';
import { MedicalCards } from 'pages/MedicalCards';
import { Messages } from 'pages/Messages';
import React, { useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { QueryClientProvider } from 'react-query';
import { RecoilRoot } from 'recoil';
import { useAuth } from 'store/auth/AuthStore';
import { usePoppins } from 'styles/theme';
import { mediLinkQueryClient } from 'utils/ReactQueryUtils';
import { MedilinkEAS } from 'utils/eas';

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
                    </StackNavigator.Navigator>
                ) : (
                    <Intro />
                )}
            </NavigationContainer>
        </EasContextProvider>
    );
}

const EasContext = React.createContext<MedilinkEAS>(new MedilinkEAS(''));
export const useEas = (): MedilinkEAS => {
    return useContext(EasContext);
};

function EasContextProvider({ children }: { children: ReactNode }): ReactNode {
    const [easService, setEasService] = useState(new MedilinkEAS(''));

    const auth = useAuth();
    useEffect(() => {
        if (auth.isAuth) {
            setEasService(new MedilinkEAS(auth.wallet.privateKey));
        }
    }, [auth]);

    return (
        <EasContext.Provider value={easService}>{children}</EasContext.Provider>
    );
}
