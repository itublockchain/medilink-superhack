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
    averageSteps: string;
    averageActiviy: string;
    averageStandtime: string;
    averageSleepTime: string;
    averageHearthRate: string;
    averageRestingHearthRate: string;
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
        return averageHealthActivityCalculator(activitySamples, ' kcal');
    }, [activitySamples]);

    const averageStandtime = useMemo(() => {
        return averageHealthValueCalculator(standTime, ' mins');
    }, [standTime]);

    const averageSleepTime = useMemo(() => {
        return averageHealthValueCalculator(sleepSamples, ' mins');
    }, [sleepSamples]);

    const averageHearthRate = useMemo(() => {
        return averageHealthValueCalculator(hearthRateSamples, ' bpm');
    }, [hearthRateSamples]);

    const averageRestingHearthRate = useMemo(() => {
        return averageHealthValueCalculator(restingHeartRate, ' bpm');
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
        averageRestingHearthRate,
        bloodType: bloodType?.value ? String(bloodType.value) : 'Unknown',
        weightData,
        heightData,
        biologicalSex: biologicalSex?.value
            ? String(biologicalSex?.value)
            : 'Unknown',
    };
};

const averageHealthValueCalculator = (
    data: Array<HealthValue>,
    ext = '',
): string => {
    if (data == null) return 'Unknown';
    if (data.length === 0) {
        return 'Unknown';
    }
    let total = 0;
    data.forEach((item) => {
        total += item.value;
    });
    return String(Math.ceil(total / data.length)) + ext;
};

const averageHealthActivityCalculator = (
    data: Array<HealthActivitySummary>,
    ext = '',
): string => {
    if (data == null) return 'Unknown';
    if (data.length === 0) {
        return 'Unknown';
    }
    let total = 0;
    data.forEach((item) => {
        total += item.activeEnergyBurned;
    });
    return String(Math.ceil(total / data.length)) + ext;
};
