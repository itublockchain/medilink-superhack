import { RouteProp, useRoute } from '@react-navigation/native';
import { Navbar } from 'components';
import type { Paths } from 'constants/Paths';
import type { ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colors } from 'styles/colors';
import { Layout } from 'ui';
import type { ParamList } from 'utils/params';

type ChatRouteProp = RouteProp<ParamList, Paths.CHAT>;

export const Chat = (): ReactNode => {
    const route = useRoute<ChatRouteProp>();
    const address = route.params?.address;

    console.log(address);

    return (
        <SafeAreaView style={{ backgroundColor: colors.light }}>
            <View style={styles.wrapper}>
                <ScrollView>
                    <Layout>
                        <View></View>
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
});
