import {View, Text, StyleSheet} from "react-native";

const SoundReader = ({transfertInfo}: { transfertInfo: string }) => {
    return (
        <View>
            <Text style={[styles.name, styles.text]}>EXEMPLE</Text>
            <Text style={styles.text2}>{transfertInfo}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
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
