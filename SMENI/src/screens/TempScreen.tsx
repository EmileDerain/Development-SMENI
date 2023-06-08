import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {HeartBeat} from "../store/model";

const TempScreen = () => {
    const prediction = HeartBeat("../store/murmur.wav");
    return (
        <View>
            <Text style={styles.text}>Exemple3 Screen</Text>

            <Text style={styles.text}>
            {/*    call model.js which is in ../store/model.js*/}
                {prediction}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#000',
    },
});

export default TempScreen;
