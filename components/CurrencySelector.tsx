import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/constants/currencies';
import { useCurrencyStore } from '@/store/currencyStore';

export default function CurrencySelector() {
  const { selectedCurrency, setCurrency, isFetchingRates, rateError } = useCurrencyStore();
  const [modalVisible, setModalVisible] = useState(false);

  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency)!;

  const handleChange = (value: CurrencyCode) => {
    setCurrency(value);
    if (Platform.OS === 'ios') setModalVisible(false);
  };

  return (
    <View>
      {Platform.OS === 'ios' ? (
        <>
          <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
            <Text style={styles.label}>
              {selected.symbol} {selected.code}
            </Text>
            {isFetchingRates ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.chevron}>▾</Text>
            )}
          </TouchableOpacity>

          <Modal
            visible={modalVisible}
            transparent
            animationType="slide"
            onRequestClose={() => setModalVisible(false)}
          >
            <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
            <View style={styles.sheet}>
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Select Currency</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>
              </View>
              <Picker
                selectedValue={selectedCurrency}
                onValueChange={(value) => handleChange(value as CurrencyCode)}
              >
                {SUPPORTED_CURRENCIES.map((c) => (
                  <Picker.Item
                    key={c.code}
                    label={`${c.symbol} ${c.code} — ${c.label}`}
                    value={c.code}
                  />
                ))}
              </Picker>
            </View>
          </Modal>
        </>
      ) : (
        <View style={styles.androidWrapper}>
          <Picker
            selectedValue={selectedCurrency}
            onValueChange={(value) => handleChange(value as CurrencyCode)}
            style={styles.androidPicker}
            dropdownIconColor="#FFFFFF"
          >
            {SUPPORTED_CURRENCIES.map((c) => (
              <Picker.Item
                key={c.code}
                label={`${c.symbol} ${c.code} — ${c.label}`}
                value={c.code}
              />
            ))}
          </Picker>
          {isFetchingRates && (
            <ActivityIndicator size="small" color="#FFFFFF" style={styles.androidSpinner} />
          )}
        </View>
      )}

      {rateError !== null && (
        <Text style={styles.errorText}>Rate unavailable — showing MYR</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  // iOS selector row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  chevron: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.75)',
    lineHeight: 18,
  },

  // iOS modal sheet
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E7EB',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  doneButton: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a3c6e',
  },

  // Android picker
  androidWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  androidPicker: {
    color: '#FFFFFF',
    flex: 1,
    height: 40,
    marginLeft: -8,
  },
  androidSpinner: {
    marginLeft: 4,
  },

  // Error
  errorText: {
    fontSize: 11,
    color: '#FCA5A5',
    marginTop: 4,
  },
});
