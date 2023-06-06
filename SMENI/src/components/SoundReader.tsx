import {View, Text, StyleSheet} from "react-native";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../assets/colors/colors';
import { SafeAreaView } from "react-native-safe-area-context";

const SoundReader = ({transfertInfo}: { transfertInfo: string }) => {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.editWrapper}>
                <SafeAreaView style={styles.audioEdit}>
                    <MaterialCommunityIcons
                        name="play-circle"
                        size={24}
                        paddingRight={5}
                        color={colors.icons}
                    />
                    <MaterialCommunityIcons
                        name="pause-circle"
                        size={24}
                        paddingRight={5}
                        color={colors.icons}
                    />
                    <MaterialCommunityIcons
                        name="volume-minus"
                        size={24}
                        paddingRight={5}
                        color={colors.icons}
                    />
                    <MaterialCommunityIcons
                        name="volume-plus"
                        size={24}
                        paddingRight={5}
                        color={colors.icons}
                    />
                </SafeAreaView>
                <SafeAreaView style={styles.bookmark}>
                    <MaterialCommunityIcons
                        name="bookmark-plus"
                        size={24}
                        color={colors.icons}
                    />
                </SafeAreaView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    editWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginHorizontal: 30,
        justifyContent: 'space-between',
    },
    audioEdit: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    bookmark: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontWeight: "500",
        fontSize: 18,
    },
    text: {
        color: '#000',
    },
    text2: {
        color: '#f00',
    },
});

export default SoundReader;
