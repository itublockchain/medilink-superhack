import { useMemo } from 'react';
import type { HealthActivitySummary, HealthValue } from 'react-native-health';
import {
    useActivitySamples,
    useBiologicalSex,
    useBloodType,
    useDailyStepCountSamples,
    useHearthRateSamples,
    useHeight,
    useRestingHearthRate,
    useSleepSamples,
    useStandTime,
    useWeight,
} from 'store/health/HealthStore';

type ReturnType = {
    averageSteps: number;
    averageActiviy: number;
    averageStandtime: number;
    averageSleepTime: number;
    averageHearthRate: number;
    aveageRestingHearthRate: number;
    bloodType: string;
    weightData: string;
    heightData: string;
    biologicalSex: string;
};

export const useMedicalData = (): ReturnType => {
    const steps = useDailyStepCountSamples();
    const activitySamples = useActivitySamples();
    const standTime = useStandTime();
    const sleepSamples = useSleepSamples();
    const hearthRateSamples = useHearthRateSamples();
    const restingHeartRate = useRestingHearthRate();
    const bloodType = useBloodType();
    const height = useHeight();
    const weight = useWeight();
    const biologicalSex = useBiologicalSex();

    const averageSteps = useMemo(() => {
        return averageHealthValueCalculator(steps);
    }, [steps]);

    const averageActiviy = useMemo(() => {
        return averageHealthActivityCalculator(activitySamples);
    }, [activitySamples]);

    const averageStandtime = useMemo(() => {
        return averageHealthValueCalculator(standTime);
    }, [standTime]);

    const averageSleepTime = useMemo(() => {
        return averageHealthValueCalculator(sleepSamples);
    }, [sleepSamples]);

    const averageHearthRate = useMemo(() => {
        return averageHealthValueCalculator(hearthRateSamples);
    }, [hearthRateSamples]);

    const aveageRestingHearthRate = useMemo(() => {
        return averageHealthValueCalculator(restingHeartRate);
    }, [restingHeartRate]);

    const weightData = weight?.value
        ? String(Math.ceil(weight.value)) + ' lbs'
        : null;
    const heightData = height?.value
        ? ((height.value * 2.54) / 100).toFixed(2) + ' m'
        : 'Unknown';

    return {
        averageSteps,
        averageActiviy,
        averageStandtime,
        averageSleepTime,
        averageHearthRate,
        aveageRestingHearthRate,
        bloodType: bloodType?.value ? String(bloodType.value) : 'Unknown',
        weightData,
        heightData,
        biologicalSex: biologicalSex?.value
            ? String(biologicalSex?.value)
            : 'Unknown',
    };
};

const averageHealthValueCalculator = (data: Array<HealthValue>): number => {
    if (data.length === 0) {
        return -1;
    }
    let total = 0;
    data.forEach((item) => {
        total += item.value;
    });
    return Math.ceil(total / data.length);
};

const averageHealthActivityCalculator = (
    data: Array<HealthActivitySummary>,
): number => {
    if (data.length === 0) {
        return -1;
    }
    let total = 0;
    data.forEach((item) => {
        total += item.appleExerciseTime;
    });
    return Math.ceil(total / data.length);
};
