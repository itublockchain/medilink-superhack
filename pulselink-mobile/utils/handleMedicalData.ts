import AppleHealthKit from 'react-native-health';
import { getHealthEndDateOption, getHealthStartDateOption } from 'utils/date';

export const handleMedicalData = (): void => {
    AppleHealthKit.getDailyStepCountSamples(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('STEPS', response);
        },
    );

    AppleHealthKit.getActivitySummary(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('Activity', response);
        },
    );

    AppleHealthKit.getAppleStandTime(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('STAND TIME', response);
        },
    );

    AppleHealthKit.getSleepSamples(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('SLEEP SAMPLES', response);
        },
    );

    AppleHealthKit.getHeartRateSamples(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('HEART RATE SAMPLES', response);
        },
    );

    AppleHealthKit.getRestingHeartRate(
        {
            startDate: getHealthStartDateOption(),
            endDate: getHealthEndDateOption(),
        },
        (err, response) => {
            console.log('RESTING HEART RATE', response);
        },
    );

    AppleHealthKit.getBloodType({}, (err, response) => {
        console.log('BLOOD', response);
    });

    AppleHealthKit.getLatestHeight({}, (err, response) => {
        console.log('HEIGHT', response.value);
    });

    AppleHealthKit.getLatestWeight({}, (err, response) => {
        console.log('WEIGHT', response.value);
    });

    AppleHealthKit.getBiologicalSex({}, (err, response) => {
        console.log('Gender', response.value);
    });
    return;
};
