import { useNavigation } from '@react-navigation/native';
import { Navbar } from 'components';
import { Paths, permissions } from 'constants/permissions';
import { useMedicalData } from 'hooks/useMedicalData';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import type { HealthPermission } from 'react-native-health';
import { useMutation } from 'react-query';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Button, Layout } from 'ui';
import { useEas } from 'utils/eas';
import { wrappedEthers } from 'wrappedEthers';

const initialPermissions: Record<HealthPermission, boolean> | Object = {};

permissions.permissions.read.forEach((item) => {
    initialPermissions[item] = true;
});

export const CreateMedicalCard = (): ReactNode => {
    const [state, setState] = useState(initialPermissions);
    const [recipient, setRecipient] = useState('');
    const eas = useEas();
    const navigation = useNavigation();
    const medicalData = useMedicalData();

    const mutation = useMutation({
        mutationFn: async () =>
            eas.genCreateAttestation({
                recipient,
                data: JSON.stringify(medicalData),
            }),
        onSuccess: () => {
            Alert.alert('Your medical card created successfully!');
            setTimeout(() => {
                navigation.navigate(Paths.MEDICAL_CARDS as never);
            }, 2000);
        },
    });

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Layout>
                        <Text style={styles.label}>Attest to:</Text>
                        <TextInput
                            placeholder="Enter address"
                            value={recipient}
                            onChangeText={setRecipient}
                            style={styles.input}
                        />
                        <Text style={styles.label}>Select data</Text>
                        {permissions.permissions.read.map((item) => (
                            <View key={item} style={styles.permission}>
                                <Text style={styles.text}>{item}</Text>
                                <Switch
                                    trackColor={{
                                        true: colors.tertiary,
                                        false: colors.light,
                                    }}
                                    onChange={(): void => {
                                        setState({
                                            ...state,
                                            [item]: !state[item],
                                        });
                                    }}
                                    value={state[item]}
                                />
                            </View>
                        ))}
                        <Button
                            loading={mutation.isLoading}
                            disabled={!wrappedEthers.utils.isAddress(recipient)}
                            onPress={mutation.mutate}
                            color="secondary"
                            buttonOverride={{
                                style: {
                                    marginTop: 16,
                                },
                            }}
                        >
                            {!wrappedEthers.utils.isAddress(recipient)
                                ? 'Enter a valid address'
                                : 'Create'}
                        </Button>
                    </Layout>
                </ScrollView>
                <Navbar />
            </View>
        </SafeAreaView>
    );
};

//eslint-disable-next-line
const styles = StyleSheet.create({
    wrapper: {
        height: '100%',
        backgroundColor: colors.background,
    },
    input: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.tertiary,
        borderRadius: 12,
        padding: 8,
        height: 48,
        fontFamily: Poppins.regular,
    },
    label: {
        marginTop: 12,
        opacity: 0.5,
        fontFamily: Poppins.medium,
    },
    permission: {
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontFamily: Poppins.light,
        fontSize: 16,
    },
});
