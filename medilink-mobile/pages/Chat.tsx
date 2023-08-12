import type { RouteProp } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import { HearthIcon } from 'assets';
import { Navbar } from 'components';
import type { Paths } from 'constants/Paths';
import { useRefresh } from 'hooks/useRefresh';
import { paperclip } from 'icons/paperclip.icon';
import { useState } from 'react';
import type { Dispatch, ReactNode, SetStateAction } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Image,
    KeyboardAvoidingView,
    Linking,
    Modal,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useMutation, useQuery } from 'react-query';
import { useAuthNullSafe } from 'store/auth/AuthStore';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Button, Layout } from 'ui';
import type { Message, SendMessageDto } from 'utils/api';
import { apiPostSendMessage, queryKeys } from 'utils/api';
import type { AttestationDto } from 'utils/eas';
import { useEas } from 'utils/eas';
import { formatAddress } from 'utils/formatAddress';
import type { ParamList } from 'utils/params';

type ChatRouteProp = RouteProp<ParamList, Paths.CHAT>;

export const Chat = (): ReactNode => {
    const route = useRoute<ChatRouteProp>();
    const address = route.params?.address;
    const [input, setInput] = useState('');
    const auth = useAuthNullSafe();
    const [isSelectingAttachment, setIsSelectingAttachment] = useState(false);
    const [selectedAttachment, setSelectedAttachment] = useState<string | null>(
        null,
    );

    const sendMessageMutation = useMutation({
        mutationFn: async (data: SendMessageDto) => apiPostSendMessage(data),
        onSuccess: (res) => {
            console.log(res.data);
            setMessages((prev) => [...prev, res.data]);
        },
        onMutate: () => {
            setInput('');
            setSelectedAttachment(null);
        },
    });
    const [messages, setMessages] = useState<Array<Message>>([]);

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <KeyboardAvoidingView
                behavior="padding"
                keyboardVerticalOffset={32}
                enabled
            >
                <View style={styles.wrapper}>
                    {isSelectingAttachment && (
                        <AttachmentModal
                            setIsSelectingAttachment={setIsSelectingAttachment}
                            setSelectedAttachment={setSelectedAttachment}
                        />
                    )}
                    <ScrollView>
                        <Layout>
                            <View
                                style={{
                                    marginBottom: 120,
                                }}
                            >
                                {messages.map((item, index) => {
                                    const isOutgoing =
                                        item.sender === auth.wallet.address;
                                    return (
                                        <View
                                            key={index}
                                            style={[
                                                styles.message,
                                                isOutgoing
                                                    ? styles.outgoing
                                                    : styles.incoming,
                                            ]}
                                        >
                                            {item.message &&
                                                item.message.trim() !== '' && (
                                                    <Text
                                                        style={
                                                            styles.messageText
                                                        }
                                                    >
                                                        {item.message}
                                                    </Text>
                                                )}
                                            {item.attachmentId != null && (
                                                <Text
                                                    onPress={async (): Promise<void> => {
                                                        await Linking.openURL(
                                                            `https://optimism-goerli-bedrock.easscan.org/attestation/view/${item.attachmentId}`,
                                                        );
                                                    }}
                                                    style={
                                                        styles.messageAttachment
                                                    }
                                                >
                                                    {item.attachmentId}
                                                </Text>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        </Layout>
                    </ScrollView>

                    {selectedAttachment != null && (
                        <View style={styles.attachmentWrapper}>
                            <View style={styles.attachment}>
                                <Text>
                                    You selected medical id of{' '}
                                    <Text
                                        style={{
                                            color: 'blue',
                                        }}
                                        onPress={async (): Promise<void> => {
                                            await Linking.openURL(
                                                `https://optimism-goerli-bedrock.easscan.org/attestation/view/${selectedAttachment}`,
                                            );
                                        }}
                                    >
                                        {selectedAttachment}
                                    </Text>
                                </Text>
                            </View>
                        </View>
                    )}

                    <View style={styles.inputWrapper}>
                        <Button
                            onPress={(): void => {
                                setIsSelectingAttachment(true);
                            }}
                            color="secondary"
                            leftIcon={paperclip}
                            buttonOverride={{
                                style: styles.attachmentButton,
                            }}
                        />
                        <TextInput
                            onSubmitEditing={(): void => {
                                if (
                                    selectedAttachment == null &&
                                    input.trim() === ''
                                ) {
                                    setInput('');
                                    return;
                                }

                                const payload = {
                                    id: -1,
                                    message: input,
                                    sender: auth.wallet.address,
                                    receiver: address,
                                    attachment_id: selectedAttachment,
                                    chat_id: address === 'bot' ? 0 : -1,
                                };

                                setMessages((prevState) => [
                                    ...prevState,
                                    {
                                        ...payload,
                                        attachmentId: payload.attachment_id,
                                    },
                                ]);

                                sendMessageMutation.mutate(payload);
                            }}
                            placeholder="Enter your message"
                            style={styles.input}
                            value={input}
                            onChangeText={setInput}
                        />
                    </View>
                    <Navbar />
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

type Props = {
    setIsSelectingAttachment: Dispatch<SetStateAction<boolean>>;
    setSelectedAttachment: Dispatch<SetStateAction<string | null>>;
};

const AttachmentModal = ({
    setIsSelectingAttachment,
    setSelectedAttachment,
}: Props): ReactNode => {
    const eas = useEas();
    const auth = useAuthNullSafe();
    const { data, isLoading, refetch } = useQuery({
        queryFn: async (): Promise<Array<AttestationDto>> =>
            eas.genUsersAttestation(auth.wallet.address),
        queryKey: queryKeys.MEDICAL_CARDS,
    });
    const medicalCards = data ? data.reverse() : [];
    const refreshProps = useRefresh(() => {
        refetch();
    });

    return (
        <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={(): void => {
                setIsSelectingAttachment(false);
            }}
        >
            <SafeAreaView>
                <View style={styles.modal}>
                    <ScrollView
                        refreshControl={<RefreshControl {...refreshProps} />}
                    >
                        <Layout>
                            {medicalCards.length === 0 && isLoading && (
                                <ActivityIndicator style={{ marginTop: 24 }} />
                            )}
                            {medicalCards.length === 0 && !isLoading && (
                                <Text
                                    style={{
                                        fontFamily: Poppins.light,
                                        fontSize: 18,
                                        textAlign: 'center',
                                        marginTop: 24,
                                    }}
                                >
                                    You don’t have any medical cards.
                                </Text>
                            )}
                            {medicalCards.map((item) => {
                                return (
                                    <TouchableOpacity
                                        onPress={(): void => {
                                            setSelectedAttachment(item.id);
                                            setIsSelectingAttachment(false);
                                        }}
                                        key={item.id}
                                        style={styles.card}
                                    >
                                        <View style={styles.row}>
                                            <Text style={styles.date}>
                                                {new Date(
                                                    item.time * 1000,
                                                ).toDateString()}
                                            </Text>

                                            <Image source={HearthIcon} />
                                        </View>
                                        <View>
                                            <Text style={styles.title}>
                                                Medical Report
                                            </Text>
                                        </View>
                                        <View>
                                            <Text style={styles.recipient}>
                                                Attested to:{' '}
                                                {formatAddress(item.recipient)}
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                            <Button
                                onPress={(): void =>
                                    setIsSelectingAttachment(false)
                                }
                                buttonOverride={{
                                    style: {
                                        marginTop: 32,
                                    },
                                }}
                            >
                                Close
                            </Button>
                        </Layout>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </Modal>
    );
};

//eslint-disable-next-line
const styles = StyleSheet.create({
    modal: {
        height: '100%',
    },
    wrapper: {
        height: '100%',
        backgroundColor: colors.background,
    },
    inputWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 72,
        width: '100%',
        paddingLeft: 24,
        borderRadius: 12,
        paddingRight: 24,
    },
    attachmentWrapper: {
        position: 'absolute',
        flexDirection: 'row',
        alignItems: 'center',
        bottom: 120,
        paddingLeft: 24,

        paddingRight: 24,
    },
    attachment: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        padding: 12,
        width: '100%',
    },
    input: {
        borderWidth: 1,
        borderRadius: 4,
        borderStyle: 'solid',
        paddingLeft: 12,
        paddingRight: 12,
        height: 40,
        borderColor: '#FFF388',
        backgroundColor: colors.light,
        width: Dimensions.get('screen').width - 54 - 40,
        fontFamily: Poppins.regular,
        fontSize: 16,
    },
    attachmentButton: {
        marginRight: 6,
        width: 40,
        height: 40,
        shadowOffset: { height: 0, width: 0 },
        shadowOpacity: 1,
        shadowColor: '#8A854340',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    card: {
        padding: 12,
        shadowColor: 'rgba(171, 100, 150, 0.57)', // IOS
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        borderRadius: 12,
        backgroundColor: colors.primary,
        width: '100%',
        marginTop: 16,
    },
    date: {
        fontFamily: Poppins.medium,
        opacity: 0.5,
    },
    title: {
        fontFamily: Poppins.medium,
        opacity: 1,
        fontSize: 20,
        marginTop: 8,
    },
    recipient: {
        fontFamily: Poppins.medium,
        opacity: 0.5,
        fontSize: 12,
        marginTop: 12,
    },
    message: {
        borderRadius: 12,
        width: '100%',
        padding: 16,
        marginTop: 20,
    },
    incoming: {
        backgroundColor: '#FDFCE9',
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        shadowColor: '#8A854399',
    },
    outgoing: {
        backgroundColor: '#FFFCC1',
        shadowOffset: { height: 2, width: 2 }, // IOS
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        shadowColor: '#8A854399',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
        fontFamily: Poppins.light,
        marginBottom: 12,
    },
    messageAttachment: {
        fontSize: 12,
        color: 'blue',
        fontFamily: Poppins.light,
    },
});
