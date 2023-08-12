import { Calories, HeartRate, SleepTime, Steps } from 'assets';
import { Navbar } from 'components';
import { Details } from 'components/Details';
import { AbstractCard } from 'components/cards/AbstractCard';
import { permissions } from 'constants/permissions';
import { useHandleMedicalData } from 'hooks/useHandleMedicalData';
import { useMedicalData } from 'hooks/useMedicalData';
import { useRefresh } from 'hooks/useRefresh';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AppleHealthKit from 'react-native-health';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Layout } from 'ui';

enum HomeStep {
    PERMISSSION_FAILED,
    PERMISSSION_REQUESTED,
    READY,
}

export const Home = (): ReactNode => {
    const [step, setStep] = useState<HomeStep>(HomeStep.PERMISSSION_REQUESTED);
    const { handleMedicalData } = useHandleMedicalData();

    const refreshProps = useRefresh(() => {
        handleMedicalData();
    });

    useEffect(() => {
        setTimeout(() => {
            AppleHealthKit.initHealthKit(permissions, (error) => {
                if (error) {
                    setStep(HomeStep.PERMISSSION_FAILED);
                    console.log('[ERROR] Cannot grant permissions!');
                    return;
                }

                handleMedicalData();
                setStep(HomeStep.READY);
            });
        }, 1000);
    }, []);

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView
                    refreshControl={<RefreshControl {...refreshProps} />}
                >
                    <Main step={step} />
                </ScrollView>
                <Navbar />
            </View>
        </SafeAreaView>
    );
};

const Main = ({ step }: { step: HomeStep }): ReactNode => {
    const medicalData = useMedicalData();
    switch (step) {
        case HomeStep.PERMISSSION_REQUESTED:
            return (
                <View style={styles.fullheight}>
                    <ActivityIndicator />
                    <View>
                        <Text style={styles.text}>
                            Requesting Apple permission
                        </Text>
                    </View>
                </View>
            );
        case HomeStep.PERMISSSION_FAILED:
            return (
                <View style={styles.fullheight}>
                    <Text style={styles.text}>
                        Enable permissions to Apple Health to proceed.
                    </Text>

                    <Text style={styles.text}>Settings {'>'} Health</Text>
                </View>
            );
        case HomeStep.READY:
            return (
                <View>
                    <Details />
                    <Layout>
                        <View style={styles.row}>
                            <AbstractCard
                                title="Steps"
                                average={medicalData.averageSteps}
                                asset={Steps}
                            />
                            <AbstractCard
                                title="Hearth rate"
                                average={medicalData.averageRestingHearthRate}
                                asset={HeartRate}
                            />
                        </View>
                        <View style={styles.row}>
                            <AbstractCard
                                title="Resting rate"
                                average={medicalData.averageRestingHearthRate}
                                asset={HeartRate}
                            />

                            <AbstractCard
                                average={medicalData.averageActiviy}
                                title="Calories burnt"
                                asset={Calories}
                            />
                        </View>
                        <View style={[styles.row, { marginBottom: 120 }]}>
                            <AbstractCard
                                average={medicalData.averageStandtime}
                                title="Stand time"
                                asset={SleepTime}
                            />
                            <AbstractCard
                                average={medicalData.averageSleepTime}
                                title="Sleep time"
                                asset={SleepTime}
                            />
                        </View>
                    </Layout>
                </View>
            );
    }
};

//eslint-disable-next-line
const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: colors.background,
    },
    fullheight: {
        height: Dimensions.get('screen').height - 200,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    text: {
        marginTop: 12,
        fontFamily: Poppins.regular,
    },
    row: {
        marginTop: 24,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    },
});
