import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {useNavigation} from "@react-navigation/native";


const ExempleScreen2 = () => {
    const navigation = useNavigation();

    return (
        <View>
            <Text style={styles.text}>Exemple2 Screen</Text>
            <Pressable
                onPress={() => {
                    // navigate to the temp screen
                    navigation.navigate("TempScreen");
                }}
            >
                <Text style={styles.text}>Go to TempScreen</Text>
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#000',
    },
});

export default ExempleScreen2;
