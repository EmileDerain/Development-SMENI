import React, { useState, useRef } from 'react';
import { Text, View, StyleSheet, SafeAreaView, TouchableWithoutFeedback, TextInput } from 'react-native';
import DatePicker from 'react-native-date-picker';
import colors from '../assets/colors/colors';
import DropDownPicker from 'react-native-dropdown-picker'; // Import DropDownPicker



const PatientInformation = ({ onChangeInput }) => {
  DropDownPicker.setListMode("SCROLLVIEW");
  const [selectedMedicalID, setSelectedMedicalID] = useState(''); 
  const [selectedName, setSelectedName] = useState('');
  const [selectedSurname, setSelectedSurname] = useState('');
  const [selectedBirthDate, setSelectedBirthDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState('');
  const [selectedHeight, setSelectedHeight] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [open, setOpen] = useState(false);
  const [genderOptions, setGenderOptions] = useState([
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
  ]);

  const pickerRef = useRef(null);
  const handleMedicalIDChange = (text) => {
    const medicalID = text.replace(/[^0-9]/g, '');
    setSelectedMedicalID(medicalID);
    onChangeInput({
      selectedMedicalID: medicalID,
      selectedName,
      selectedSurname,
      selectedBirthDate,
      selectedWeight,
      selectedHeight,
      selectedGender,
    });
  };

  const handleNameChange = (text) => {
    setSelectedName(text);
    onChangeInput({
      selectedMedicalID,
      selectedName: text,
      selectedSurname,
      selectedBirthDate,
      selectedWeight,
      selectedHeight,
      selectedGender,
    });
  };

  const handleSurnameChange = (text) => {
    setSelectedSurname(text);
    onChangeInput({
      selectedMedicalID,
      selectedName,
      selectedSurname: text,
      selectedBirthDate,
      selectedWeight,
      selectedHeight,
      selectedGender,
    });
  };

  const handleDateChange = (date) => {
    const today = new Date();
    const minDate = new Date(1900, 0, 1);

    if (date >= minDate && date <= today) {
      setSelectedBirthDate(date);
      onChangeInput({
        selectedMedicalID,
        selectedName,
        selectedSurname,
        selectedBirthDate: date,
        selectedWeight,
        selectedHeight,
        selectedGender,
    });
    };
  };

  const handleWeightChange = (text) => {
    const weight = text.replace(/[^0-9]/g, '');
    setSelectedWeight(weight);
    onChangeInput({
      selectedMedicalID,
      selectedName,
      selectedSurname,
      selectedBirthDate,
      selectedWeight: weight,
      selectedHeight,
      selectedGender,
    });
  };

  const handleHeightChange = (text) => {
    const height = text.replace(/[^0-9]/g, '');
    setSelectedHeight(height);
    onChangeInput({
      selectedMedicalID,
      selectedName,
      selectedSurname,
      selectedBirthDate,
      selectedWeight,
      selectedHeight: height,
      selectedGender,
    });
  };

  const handleGenderChange = (value) => {
    setSelectedGender(value);
    onChangeInput({
      selectedMedicalID,
      selectedName,
      selectedSurname,
      selectedBirthDate,
      selectedWeight,
      selectedHeight,
      selectedGender: value,
    });
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
            <Text style={styles.label}>Medical ID:</Text>
            <TextInput
              style={styles.input}
              value={selectedMedicalID}
              keyboardType="numeric"
              onChangeText={handleMedicalIDChange}
            />  
          </SafeAreaView>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Name:</Text>
            <TextInput
              style={styles.input}
              value={selectedName}
              onChangeText={handleNameChange}
            />
          </SafeAreaView>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Surname:</Text>
            <TextInput
              style={styles.input}
              value={selectedSurname}
              onChangeText={handleSurnameChange}
            />
          </SafeAreaView>
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
            <Text style={styles.label}>Weight (kg):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={selectedWeight}
              onChangeText={handleWeightChange}
            />
          </SafeAreaView>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Height (cm):</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={selectedHeight}
              onChangeText={handleHeightChange}
            />
          </SafeAreaView>
          <SafeAreaView style={styles.row}>
            <Text style={styles.label}>Gender:</Text>
            <DropDownPicker
              open={open}
              items={genderOptions}
              value = {selectedGender}
              placeholder='Select a Gender'
              placeholderStyle={{color: colors.icons}}
              setOpen={setOpen}
              setValue={setSelectedGender}
              setItems={setGenderOptions}
              onChangeValue={handleGenderChange}
              style={ [styles.dropdownPicker, styles.input]}
              dropDownDirection='BOTTOM'
              dropDownContainerStyle={styles.dropdownContainer}
            />

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
  dropdownPicker: {
    backgroundColor: colors.inputBackground,
    borderWidth: 0,
    borderRadius: 30,
    borderColor: colors.inputBackground,
    color: colors.default,
    padding: 0,
    width: '50%',
    textAlign: 'center',
    alignContent: 'center',
    margin: 10,
  },
  dropdownContainer: {
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
    color: colors.default,
    width: '50%',
    textAlign: 'center',
    alignContent: 'center',
    margin: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    //flex: 1,
    fontSize: 16,
    fontWeight: '500',
    margin: 10,
    color: colors.textLight,
  },
  input: {
    flex: 0.5, 
    borderRadius: 30,
    backgroundColor: colors.inputBackground,
    borderColor: colors.inputBackground,
    color: colors.default,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 10,
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
  picker: {
    flex: 2,
    marginTop: 10,
    marginHorizontal: 10,
    //position: 'absolute',

    backgroundColor: colors.background,
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
