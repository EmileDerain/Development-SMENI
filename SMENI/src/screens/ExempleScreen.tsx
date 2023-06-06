import {useNavigation} from '@react-navigation/native';
import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import ExempleCompo from "../components/ExempleCompo";
import { useSelector, useDispatch } from 'react-redux';
import {exempleSlice} from "../store/exempleSlice";

const ExempleScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
                    //TODO regarde ca: JE DETESTE TS !!!
    const counterValue = useSelector((state) => state.exemple.value) as number; // Accéder à la valeur de la propriété 'c' dans la tranche 'exemple34'
    return (
        <View>
            <Text style={styles.text}>Exemple Screen</Text>
            <ExempleCompo transfertInfo={"info"}/>
            <Pressable
                onPress={() => {
                    // update selected product
                    dispatch(exempleSlice.actions.decrement());
                }}
            >
                <Text style={styles.text}>Counter Value: {counterValue}</Text>
                <Image source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Un1.svg/768px-Un1.svg.png' }} style={styles.image} />
            </Pressable>
            <Pressable
                onPress={() => {
                    // TU TE FICHE DE MOI ???!!
                    navigation.navigate("Exemple2");
                }}
            >
                <Image source={{ uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQsAAAC9CAMAAACTb6i8AAAAilBMVEX///8Aq0/8//4AqkwAq1Ajsl4ApD75/vwBqk8ApkIAp0UAqUm85MvL6dbc8uViwof0/fef1rHp9/Ct3L0vsmNDt2+Lz6J9zJqX1a0ApDqDzp46t2x2yZTh9Ojs+fGP0adcv4BNvHjB5tC24sYnsWBtxY7S7Nu84cpJu3Wl2bhXwX9xxo4AozSc2LPFWyf8AAALcUlEQVR4nO2diXLiOBCGMTJCRwieQBIczgDJhszk/V9vjS+1bMkHyDY4+rdqKwP4+mi1uqWWGAysrKysrKysrKysrKysrKysrKysrHqtYfT//ukiGt527jpu3+S48+2mLooHxhBCTt8UPBNlh8Tuq+ngd33XzQn9O9SxCo92fcNNilCvBottr1k47KUGi2X/PAUUmldHMXT7zcJxq7MY952FM65hF13fa7MilgWQIRbEkAw+Wf0LGGKBDYmZY8Go6gK04ApmWKD1oxGtf4zB4DP1JT5w0ywqn6VED+biObRWX2KqvUSPWdBH9TW0ltFfFg7iNS2jxywKYGBlf9JnFkWWoYqhe83CQToHulNdp98sHMS0MPLNpOcs9M1EYRl9Z+EQ/qS+1C7nQHvPwiG6ZjLNNpObZEHMJXtBNkYcjWVkYdwkC4eZyvVC+b4mAp1S6ZlukgU7TQxLczkZxk2ywJ+mzlcmqTfpiIX3+KlsxG2zkHKTTljs3ynGdLTNX7x1FjDo6oLF1Ofn6xOGcj6tfRagmXTA4ju9eH6IoQMWwjLaZ/EDhlLQKPNmFywCGG43LIYcpMuIzuR3O2Ex2PFuWMhRNn9Xvds2iw3rhsVWHunOTGJ2wmIzQt2wWHHpSCrfQBcsNqP4llpn8cKLjuyAhTfiXfUjDzA5dPlX9t22WaRW0QGLMfSdhJ7kd1tnIayii/jiBcYX2fqPtll4R9BkO4g7n9OeBOFsMt0yC2gVnbAYP2NE3OA/jvfZ9yIWVDfecKHGyqccylbRUZ46O2JKMV/li21DFsTwuNa/kfopvSO7hXGt9f6/T9Wl0/FOg2JLdUFvYBXyIzXCYvI1L9JuofUHDYyD61GwzBM1weIRc1QohkcL9YXNs+BL9eOAuKJJFvPcVfIHMPTTCgutVYx47nkaYPHKqrR3hOeKORzTLJjGKuTONJZ5FhN9QZQszh6aZsGWuh5EZbrGWYxdVLkb8HPtxCwLNtf2IKp7NM5iWqcSDy+aZFHQgyg/b5rFQ731Nr4yNzMjLYq5xqEZZrFJGkgQYCeiRbGTL4fhBlnwynFFIsMs3hOfxN8f17E+C7tYKs2fmWOBdD2IFoVhFqe4D3EdLlYs7QufT17CYo4FX5yUWmpRmGWxTsvjYAY6L153QuHaJoNthKlVcDNGWSyTWI6txHH7sngDg8kzgyzqJ3gmWaSL89AIuK3SZWrouREW9WWQxaeffBWwDmairrGFwmJpaF9YjBIDoDCC+lL3IgiLTh7MqpY2qCZljsUkibKkcX5NdoJGTx8U/GsZq8TPNitzLJKvlFA4dPeuMgsS9jM75iSnFEMbpp+vjsyxGMcT6KD1Bz7kn9Jb8N35TWVRdocy6C8OPgq+aPwBD9qpvUUcbH4zw0Ob18lknzpZ+j7ewmMe1d6CJrn6u8G1dtfLbAzurYfSNhJqswBh903BaHRO4NFXNgE4LfZ1QzAaZTFVdiIwQM/C6HRtdJMs1ipvQRCSrjl+xiJx4p1aSZMsPpTegh6kjWmGg9lCSH1IS2qQxVoZPqAv1WcTFY91NKwGWayUBp+tYpTVl9wsK8XqNkce5fk1LD7VcRb78wtZnNR9QvEWPT1l8aZmQaTc7Zew+NZ0j7l6+F/AQjssU2QYPWWh3YKKHH8bC080EYKotGkPztca9JvFRjwVeT5hcDAp8Bj9ZAESM/YyeJYcqd5j9JMFCLWCUFMe4NIbRj9ZgMkAvMkmJ1RnGP1kITLOsADek6qCkK4riVnwAp0Pl/4FJd5A4GMlZ+S84XVF4hvmf8///pGWjus8RnzUVK8Pl6Av8U/J3AgXH1si9B3/fR51LThjoGfUKItDyiLO0qXaUp3HCFnkVlJICh4STEZvoSPCouJp6CKc1Ex6WGuHsf6EE5pXszhPdnGW//gsZRHXFMiziRqPUYHFHBG6EkNjoIeKZqAifXFRy/CEC+P+QNHWd9exQIyFU6GK3BOkqfE1pAkCTfBZiYXj+ILkRqxGQaIW6IU6LbNg7km7x3jKIl2C+iT1EWqPUZEFYaLKK9mpm4AyuIkfBLqtssC7gt3FkzTVZWkFwgt0dOrbq8hC6ohi/0nf0lc2YcfQJgsazXM8zBQ6rNIRPrGOaiiTVBlGVRYOe01OOhiHhR9wjCiq+WiRBQsnkfcupiqlJkB80YoP0H0S1f1V6kei04oE7/PcIqiotI9rpWqw+EOvYsHD72GrniWEjwzrLJ9BHq8c4MqwmJzyFncMr4gIE64qeHgshteTohjAwhkdxAkUJ5+GjepiFmHZwAqX1ssxWLD06MNNDhRfVobFq5+rSUzLJmGjWNJd+reXnB+ycAJLjYTT7+bNp+l8nXONXYRhzQsuXxMgVekM/sIBHsVUSYbFW8E0GqGvaZTxBOYll8kxEgvxDaSB2kv25BeyCCuMA2MsRZH6uPAUcIRH6TFqsJDGhLwUy0s2xmucRVg2MCovqkFu5gJwVxSFx6jFwmH56GaCU8triUUY7Z7KKzdZfv/Mo2gligGurL/AWXch3X++/t1DwlTbYUH8s1m4vl+ySJb/zW+itYc9T84wMiwOrxm9ydtngPgqEqwmbYcFCsNqbzy+5DeRYFqi3juoKL54kmcmfXkYeQtNtR0WxfPDJXqioPPJpqt1WSDJZcipcEttZLN+glrX+Xkb4OnzHqMuCwJXD3lcmpJpyXdmtur/ty0/HJwI3gOWY4zaLAiIvffyWre2+lRZLLucsFgwLckYRl0WcCQj6HbkUYF7YDF45jqPUc5C/u7ZSir+ktaq3AcLWPcZBJ/gaUpZbOSJlszomDRcdB8spNkSKcbIsNj/yUraqgw6i/h48Nh3wsLTxRjleSq8rp9P7sQY0r2wGPwAY4aGUSsfYVPFmedt5yNXs5DSEmAYdXJ2DrbBeRPpe/rgd8NiAvqD7Nq7inYB1nIu/onWkvbYd8MCLr4CHqMyC9fBYsOIT98BkwTJQrb7YeE5wg0KwyjN2dOsHUySDUeIwG1x4vZ3PywGm/MCgWiam6UPn83ZV9mk/fV1FT4pHCT6OFOlIg94jLLVO2IRmPZiFWuarK6pMCcwDO3JF+txDlHkBl6Zha/cFQuF9uUswtgEbKiyiZfro1HGUu6dxYKVs2DyNsHJnIvLxArI8PdNu2FBL2IxHMcSL32GPW05CzCjnhZgENg3P9KOWCC31lhOcoc8mvvxRU7hRXswlbIAW11KqxHQJg25TrgbFrkMqYrGIx7+UkrwXNm6kjIWYA3s0IVj8RwU7ExZFyx8fRlvgcJYCxGcLicZDt6Sey5kMabAWXzIixFgYz2mO09sNCyyCxmuZ4FrDfAleo2LJsCK74d0VMM95XJ1oQV7S/9+y07R0EXy1ukvTT63les+Tj/Ry9/I9D6NymSxVLPzV+VK0eKaitWpNB9uisllh6tnjqLbAe+ln1N/hGdXw17Lgtf4JW+hyOO50OkOR53u93DWdSyCbvySLmQTD97DvWR23S/mvrKO76Idm4fzaOwXjmEvutwcJtZVLFx/NigoX9Npx4h7HqwEk6GT0vqeFnQNC4KzU7uVFM+bsW/x0oZ37iyc61jw7/Kj8jpEFRLyHlxdLmNPdQULdLygfSRzI9KPeX5QxZ21r4tZEEQ0PzNYqDjlkPaqnN2Cs3CusQv/ok3/49Ygxh+GyTBU97q8prFwvwKdonplF4beY+cmnIVzOQu+Gnq1NY6jCDQHL74r9yHuQheycIMw6wIlsSU8+BZ600hm1hVVE9H8fStqk8Wty7JIlS3LLWRxOy27GVVnMeh+gKFZuTXC6Od+s9BtKK7Uz21kDU2p1iSPR/psGHBFZwXt/f7CQH7Nuu6JS0t+iehOxbE7qTtCN57tjsdR33Q87k41+lMrKysrKysrKysrKysrKysrKysrK6t71//YAhlKrR+6/AAAAABJRU5ErkJggg==' }} style={styles.image} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    text: {
        color: '#000',
    },
    image: {
        width: '50%',
        aspectRatio: 1,
    },
});

export default ExempleScreen;
