import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import AppleHealthKit, {
  HealthKitPermissions,
  HealthPermission,
} from "react-native-health";
import { RSA } from "react-native-rsa-native";

let message =
  "my secret messageaksofkoasfkoasfkoaskfokasfokoasfkoasfkoasfkoasfkokaosfkafskafskoasfko apsflpasflpasflplafsplpafslpafslpafslpafslasfkoasfkakosfkoasfkosfkoasfkoasfoasfkoafsokko";

const PermissionsRef = AppleHealthKit.Constants.Permissions;

/* Permission options */
const permissions = {
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

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="INIT"
        onPress={() => {
          AppleHealthKit.initHealthKit(permissions, (error: string, result) => {
            /* Called after we receive a response from the system */

            console.log(result);
            if (error) {
              console.log("[ERROR] Cannot grant permissions!");
            }

            /* Can now read or write to HealthKit */

            const options = {
              startDate: new Date(2020, 1, 1).toISOString(),
            };

            AppleHealthKit.getRestingHeartRate(
              options,
              (callbackError: string, result) => {
                /* Samples are now collected from HealthKit */
              }
            );
          });
        }}
      />
      <Button
        title="Status"
        onPress={() => {
          console.log(
            AppleHealthKit.getAuthStatus(
              permissions,
              (callbackError: string, result) => {
                console.log(callbackError, result);
                /* Samples are now collected from HealthKit */
              }
            )
          );
        }}
      />
      <Button
        title="Keys"
        onPress={() => {
          RSA.generateKeys(4096) // set key size
            .then((keys) => {
              console.log("4096 private:", keys.private); // the private key
              console.log("4096 public:", keys.public); // the public key
              RSA.encrypt(message, keys.public).then((encodedMessage) => {
                console.log(`the encoded message is ${encodedMessage}`);
                console.log("HERE------");
                RSA.decrypt(encodedMessage, keys.private).then(
                  (decryptedMessage) => {
                    console.log(`The original message was ${decryptedMessage}`);
                  }
                );
              });
            });
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
