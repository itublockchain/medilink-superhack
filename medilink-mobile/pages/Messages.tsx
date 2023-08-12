import { Navbar } from 'components';
import { Message } from 'components/messages/Message';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    Dimensions,
    Modal,
    SafeAreaView,
    StyleSheet,
    TextInput,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Button, Layout } from 'ui';

export const Messages = (): ReactNode => {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={(): void => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <TextInput
                            placeholder="Enter address"
                            style={styles.input}
                        />
                        <Button
                            color="secondary"
                            buttonOverride={{
                                style: {
                                    width: Dimensions.get('screen').width - 120,
                                    marginTop: 10,
                                    height: 32,
                                },
                            }}
                        >
                            Continue
                        </Button>
                        <Button
                            onPress={(): void => setModalVisible(false)}
                            color="primary"
                            buttonOverride={{
                                style: {
                                    width: Dimensions.get('screen').width - 120,
                                    marginTop: 10,
                                    height: 32,
                                },
                            }}
                        >
                            Close
                        </Button>
                    </View>
                </View>
            </Modal>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Layout>
                        <Message isBot={true} address="bot" />
                    </Layout>
                </ScrollView>
                <Button
                    onPress={(): void => setModalVisible(true)}
                    buttonOverride={{
                        style: styles.createButton,
                    }}
                >
                    +
                </Button>
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
    createButton: {
        position: 'absolute',
        bottom: 72,
        width: 48,
        left: Dimensions.get('screen').width / 2 - 24,
        borderRadius: 48,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3,
        elevation: 1,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: colors.tertiary,
        borderRadius: 12,
        padding: 8,
        height: 48,
        fontFamily: Poppins.regular,
        width: Dimensions.get('screen').width - 120,
    },
});
