import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableWithoutFeedback } from 'react-native';
import DatePicker from 'react-native-date-picker';
import colors from '../assets/colors/colors';
import RNPickerSelect from 'react-native-picker-select';

const PatientInformation = ({ onChangeInput }) => {
  const [selectedBirthDate, setSelectedBirthDate] = useState(new Date());
  const [selectedWeight, setSelectedWeight] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const weightOptions = Array.from({ length: 301 }, (_, index) => {
    return { label: index.toString(), value: index.toString() };
  });

  const pickerRef = useRef(null);

  const handleDateChange = (date) => {
    const today = new Date();
    const minDate = new Date(1900, 0, 1);

    if (date >= minDate && date <= today) {
      setSelectedBirthDate(date);
      onChangeInput({ selectedBirthDate: date, text: selectedWeight });
    }
  };

  const handleWeightChange = (itemValue) => {
    setSelectedWeight(itemValue);
    onChangeInput({ text: selectedBirthDate, selectedBirthDate: itemValue });
  };

  const toggleDatePicker = () => {
    setShowDatePicker(!showDatePicker);
  };

  const handleOutsidePress = () => {
    if (showDatePicker) {
      setShowDatePicker(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handleOutsidePress}>
      <View style={styles.container}>
        <SafeAreaView style={styles.informationWrapper}>
          <Text style={[styles.text, styles.subtitle]}>Patient Information :</Text>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Birth date:</Text>
            {!showDatePicker && (
              <Text style={styles.input} onPress={toggleDatePicker}>
                {selectedBirthDate.toLocaleDateString()}
              </Text>
            )}
            {showDatePicker && (
              <DatePicker
                ref={pickerRef}
                date={selectedBirthDate}
                onDateChange={handleDateChange}
                mode="date"
                minimumDate={new Date(1900, 0, 1)}
                maximumDate={new Date()}
                textColor="#000000"
                style={styles.picker}
              />
            )}
          </SafeAreaView>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Weight:</Text>
            <SafeAreaView style={[styles.weightInput]}>
              <RNPickerSelect
                onValueChange={handleWeightChange}
                style={pickerSelectStyles}
                value={selectedWeight}
                items={weightOptions}
              />
            </SafeAreaView>
          </SafeAreaView>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subtitle: {
    fontWeight: '700',
    fontSize: 17,
  },
  weightInput: {
    borderRadius: 30,
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
    color: colors.default,
    padding:0,
    width: '50%',
    textAlign: 'center',
    alignContent: 'center',
    margin: 10,
  },
  input: {
    borderRadius: 30,
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
    color: colors.default,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '40%',
    textAlign: 'center',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
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
  informationWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    margin: 10,
    color: colors.textLight,
  },
  picker: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: 'black',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
		color: 'black',
	},
	inputAndroid: {
    color: '#0E1012',
    fontFamily: 'Nunito Sans',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 32,
    letterSpacing: 0.01,
    marginHorizontal: 15,
    marginVertical: -5,
    padding: 0,
	},
	underline: { borderTopWidth: 0 },
	icon: {
		position: 'absolute',
		backgroundColor: 'transparent',
		borderTopWidth: 5,
		borderTopColor: '#00000099',
		borderRightWidth: 5,
		borderRightColor: 'transparent',
		borderLeftWidth: 5,
		borderLeftColor: 'transparent',
		width: 0,
		height: 0,
		top: 20,
		right: 15,
	},
});

export default PatientInformation;
