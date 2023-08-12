import { useNavigation } from '@react-navigation/native';
import { Bot } from 'assets';
import { Paths } from 'constants/Paths';
import type { ReactNode } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { colors } from 'styles/colors';
import { Poppins } from 'styles/theme';
import { Icon } from 'ui';
import { formatAddress } from 'utils/formatAddress';
import { getUserAvatar } from 'utils/getUserAvatar';

type Props = {
    address: string;
    isBot: boolean;
};

export const Message = ({ address, isBot }: Props): ReactNode => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={(): void => {
                const params = [Paths.CHAT, { address }];
                navigation.navigate(...(params as never));
            }}
            style={styles.card}
        >
            <View style={styles.row}>
                <View style={[styles.avatar, !isBot && styles.padding]}>
                    {isBot ? (
                        <Image
                            source={Bot}
                            style={{
                                width: 48,
                                height: 48,
                                borderRadius: 48,
                            }}
                        />
                    ) : (
                        <Icon size={40}>{getUserAvatar(address, 40)}</Icon>
                    )}
                </View>
                <Text style={styles.text}>
                    {isBot ? 'Medical Assistant' : formatAddress(address, 10)}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        shadowColor: 'rgba(138, 133, 67, 0.72)',
        shadowOpacity: 1, // IOS
        shadowRadius: 1, //IOS
        borderRadius: 14,
        paddingVertical: 20,
        paddingHorizontal: 12,
        marginTop: 12,
        shadowOffset: { height: 2, width: 2 }, // IOS
        width: '100%',
        backgroundColor: '#FDFCE9',
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 40,

        marginRight: 8,
    },
    text: {
        fontFamily: Poppins.regular,
        fontSize: 16,
    },
    padding: {
        padding: 6,
    },
});
