import AppleHealthKit from 'react-native-health';
import type { HealthKitPermissions } from 'react-native-health';

const PermissionsRef = AppleHealthKit.Constants.Permissions;

export const permissions = {
    permissions: {
        read: [
            PermissionsRef.ActiveEnergyBurned,
            PermissionsRef.ActivitySummary,
            PermissionsRef.AppleStandTime,
            PermissionsRef.BloodType,
            PermissionsRef.BodyFatPercentage,
            PermissionsRef.BodyTemperature,
            PermissionsRef.DateOfBirth,
            PermissionsRef.DistanceWalkingRunning,
            PermissionsRef.DistanceCycling,
            PermissionsRef.DistanceSwimming,
            PermissionsRef.EnergyConsumed,
            PermissionsRef.Height,
            PermissionsRef.Workout,
            PermissionsRef.Weight,
            PermissionsRef.Water,
            PermissionsRef.Steps,
            PermissionsRef.StepCount,
            PermissionsRef.RunningSpeed,
            PermissionsRef.HeartRate,
            PermissionsRef.HeartRateVariability,
            PermissionsRef.RestingHeartRate,
            PermissionsRef.WalkingHeartRateAverage,
        ],
        write: [],
    },
} as HealthKitPermissions;

// <Button
// title="INIT"
// onPress={() => {
//   AppleHealthKit.initHealthKit(permissions, (error: string, result) => {
//     /* Called after we receive a response from the system */

//     console.log(result);
//     if (error) {
//       console.log("[ERROR] Cannot grant permissions!");
//     }

//     /* Can now read or write to HealthKit */

//     const options = {
//       startDate: new Date(2020, 1, 1).toISOString(),
//     };

//     AppleHealthKit.getRestingHeartRate(
//       options,
//       (callbackError: string, result) => {
//         /* Samples are now collected from HealthKit */
//       }
//     );
//   });
// }}
// />

// <Button
// title="Status"
// onPress={() => {
//   console.log(
//     AppleHealthKit.getAuthStatus(
//       permissions,
//       (callbackError: string, result) => {
//         console.log(callbackError, result);
//         /* Samples are now collected from HealthKit */
//       }
//     )
//   );
// }}
// />
