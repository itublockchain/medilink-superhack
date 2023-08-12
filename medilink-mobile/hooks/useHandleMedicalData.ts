import AppleHealthKit, { HealthUnit } from 'react-native-health';
import {
    useSetActivitySamples,
    useSetBiologicalSex,
    useSetBloodType,
    useSetDailyStepCountSamples,
    useSetHearthRateSamples,
    useSetHeight,
    useSetRestingHearthRate,
    useSetSleepSamples,
    useSetStandTime,
    useSetWeight,
} from 'store/health/HealthStore';
import { getHealthEndDateOption, getHealthStartDateOption } from 'utils/date';

type ReturnType = {
    handleMedicalData: () => void;
};

export const useHandleMedicalData = (): ReturnType => {
    const setSteps = useSetDailyStepCountSamples();
    const setActivitySamples = useSetActivitySamples();
    const setStandTime = useSetStandTime();
    const setSleepSamples = useSetSleepSamples();
    const setHearthRateSamples = useSetHearthRateSamples();
    const setRestingHeartRate = useSetRestingHearthRate();
    const setBloodType = useSetBloodType();
    const setHeight = useSetHeight();
    const setWeight = useSetWeight();
    const setBiologicalSex = useSetBiologicalSex();

    const handleMedicalData = (): void => {
        AppleHealthKit.getDailyStepCountSamples(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setSteps(response);
            },
        );

        AppleHealthKit.getActivitySummary(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setActivitySamples(response);
            },
        );

        AppleHealthKit.getAppleStandTime(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setStandTime(response);
            },
        );

        AppleHealthKit.getSleepSamples(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setSleepSamples(response);
            },
        );

        AppleHealthKit.getHeartRateSamples(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setHearthRateSamples(response);
            },
        );

        AppleHealthKit.getRestingHeartRate(
            {
                startDate: getHealthStartDateOption(),
                endDate: getHealthEndDateOption(),
            },
            (err, response) => {
                setRestingHeartRate(response);
            },
        );

        AppleHealthKit.getBloodType({}, (err, response) => {
            setBloodType(response);
        });

        AppleHealthKit.getLatestHeight({}, (err, response) => {
            setHeight(response);
        });

        AppleHealthKit.getLatestWeight({}, (err, response) => {
            setWeight(response);
        });

        AppleHealthKit.getBiologicalSex({}, (err, response) => {
            setBiologicalSex(response);
        });
    };

    return { handleMedicalData };
};
