import {useNavigation} from '@react-navigation/native';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import SoundReader from '../components/SoundReader';
import {useDispatch, useSelector} from 'react-redux';
import {exempleSlice} from '../store/exempleSlice';
import colors from '../assets/colors/colors';

const DiagnoHelpScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    //TODO regarde ca: JE DETESTE TS !!!
    const counterValue = useSelector(state => state.exemple.value) as number; // Accéder à la valeur de la propriété 'c' dans la tranche 'exemple34'
    return (
        <View style={styles.container}>
            {/* header */}
            <SafeAreaView style={styles.headerWrapper}>
                <Text style={[styles.text, styles.title]}>Diagnostic Page</Text>
                <MaterialCommunityIcons
                    name="dots-horizontal"
                    size={24}
                    color={colors.icons}
                />
            </SafeAreaView>

            {/* Audio reader component */}
            <SoundReader transfertInfo={'info'}/>

            {/* IA prediction*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 65,
        marginLeft: 25,
        marginRight: 20,
    },
    text: {
        color: '#0E1012',
        fontFamily: 'Nunito Sans',
        fontStyle: 'normal',
        fontWeight: '400',
        fontSize: 17,
        lineHeight: 32,
        letterSpacing: 0.01,
    },
    title: {
        fontWeight: '700',
        fontSize: 27,
    },
    subtitle: {
        fontWeight: '600',
        fontSize: 17,
    },

    image: {
        width: '50%',
        aspectRatio: 1,
    },
});

export default DiagnoHelpScreen;
