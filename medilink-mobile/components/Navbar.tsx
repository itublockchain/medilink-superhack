import { useNavigation, useRoute } from '@react-navigation/native';
import { message, messageFilled } from 'icons/message.icon';
import { useMemo } from 'react';
import type { ReactNode } from 'react';
import { Text, View } from 'react-native';
import { Dimensions, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import 'wrappedEthers';

import { Paths } from '../constants';
import { home, homeFilled, user, userFilled } from '../icons';
import { colors } from '../styles/colors';
import { Icon } from '../ui';

type NavbarItem = {
    name: string;
    icon: string;
    iconActive: string;
    isActive: boolean;
    path: Paths;
};

const Navbar = (): JSX.Element => {
    const navigation = useNavigation();
    const route = useRoute();

    const navbarItems = useMemo(() => {
        return [
            {
                name: '',
                icon: user(20),
                iconActive: userFilled(20),
                isActive:
                    route.name === Paths.MEDICAL_CARDS ||
                    route.name === Paths.CREATE_MEDICAL_CARD,
                path: Paths.MEDICAL_CARDS,
            },
            {
                name: '',
                icon: home(20),
                iconActive: homeFilled(20),
                isActive: route.name === Paths.HOME,
                path: Paths.HOME,
            },
            {
                name: '',
                icon: message(20),
                iconActive: messageFilled(20),
                isActive: route.name === Paths.MESSAGES,
                path: Paths.MESSAGES,
            },
        ].filter((item) => item != null) as Array<NavbarItem>;
    }, []);

    return (
        <View style={styles.wrapper}>
            {navbarItems.map(
                ({ isActive, name, icon, iconActive, path }, index) => {
                    const iconColor = !isActive
                        ? styles.icon.color
                        : styles.iconActive.color;

                    return (
                        <NavbarButton
                            onPress={(): void => {
                                navigation.navigate(path as never);
                            }}
                            key={index}
                        >
                            <View style={styles.button}>
                                <View
                                    style={[
                                        styles.iconWrapper,
                                        isActive && styles.iconWrapperActive,
                                    ]}
                                >
                                    <Icon color={iconColor}>
                                        {isActive ? iconActive : icon}
                                    </Icon>
                                </View>
                                <Text style={styles.text}>{name}</Text>
                            </View>
                        </NavbarButton>
                    );
                },
            )}
        </View>
    );
};

type NavbarButtonProps = {
    children: ReactNode | JSX.Element;
    onPress: () => void;
};

const NavbarButton = ({
    children,
    onPress,
}: NavbarButtonProps): JSX.Element => {
    return <TouchableOpacity onPress={onPress}>{children}</TouchableOpacity>;
};

export { Navbar };

//eslint-disable-next-line
export const styles = StyleSheet.create({
    wrapper: {
        left: 0,
        bottom: 0,
        position: 'absolute',
        width: Dimensions.get('window').width,
        backgroundColor: colors.light,
        paddingLeft: 40,
        paddingRight: 40,
        paddingTop: 4,
        paddingBottom: 0,
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        display: 'flex',
        alignItems: 'center',
    },
    iconWrapper: {
        paddingLeft: 16,
        paddingRight: 16,
        paddingTop: 6,
        paddingBottom: 6,
        backgroundColor: '#FFFFF4',
        borderRadius: 12,
    },
    iconWrapperActive: {
        backgroundColor: colors.tertiary,
    },
    text: {
        marginTop: 6,
        color: colors.tertiary,
        fontSize: 12,
    },
    icon: {
        color: colors.tertiary,
    },
    iconActive: {
        color: '#6C355C',
    },
});
