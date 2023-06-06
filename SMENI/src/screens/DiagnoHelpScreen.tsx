import {useNavigation} from '@react-navigation/native';
import {
    Image,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import SoundReader from "../components/SoundReader";
import { useSelector, useDispatch } from 'react-redux';
import {exempleSlice} from "../store/exempleSlice";

const DiagnoHelpScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    //TODO regarde ca: JE DETESTE TS !!!
    const counterValue = useSelector((state) => state.exemple.value) as number; // Accéder à la valeur de la propriété 'c' dans la tranche 'exemple34'
    return (
        <View style={styles.background}>
            <Text style={[styles.text, styles.title ]}>Diagnostic Page</Text>
            <SoundReader transfertInfo={"info"}/>
            <Pressable
                onPress={() => {
                    // update selected product
                    dispatch(exempleSlice.actions.decrement());
                }}
            >
                <Text style={styles.text}>Counter tg: {counterValue}</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#fff',
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
