import { useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { CurrencyCode, SUPPORTED_CURRENCIES } from '@/constants/currencies';
import { useCurrencyStore } from '@/store/currencyStore';

export default function CurrencySelector() {
  const { selectedCurrency, setCurrency, isFetchingRates, rateError } = useCurrencyStore();
  const [modalVisible, setModalVisible] = useState(false);

  const selected = SUPPORTED_CURRENCIES.find((c) => c.code === selectedCurrency)!;
  const displayLabel = `${selected.symbol} ▾`;

  const handleChange = (value: CurrencyCode) => {
    setCurrency(value);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.row} onPress={() => setModalVisible(true)} activeOpacity={0.7}>
        <Text style={styles.label}>{displayLabel}</Text>
        {isFetchingRates && <ActivityIndicator size="small" color="#FFFFFF" />}
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
          <ScrollView>
            {SUPPORTED_CURRENCIES.map((c, index) => (
              <TouchableOpacity
                key={c.code}
                style={[
                  styles.option,
                  index < SUPPORTED_CURRENCIES.length - 1 && styles.optionDivider,
                  c.code === selectedCurrency && styles.optionSelected,
                ]}
                onPress={() => handleChange(c.code)}
                activeOpacity={0.7}
              >
                <Text style={styles.optionSymbol}>{c.symbol}</Text>
                <View style={styles.optionMeta}>
                  <Text style={styles.optionCode}>{c.code}</Text>
                  <Text style={styles.optionLabel}>{c.label}</Text>
                </View>
                {c.code === selectedCurrency && (
                  <Text style={styles.optionCheck}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      {rateError !== null && (
        <Text style={styles.errorText}>Rate unavailable — showing MYR</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },

  // Selector row
  row: {
    paddingTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Modal sheet
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 24,
    maxHeight: '60%',
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

  // Currency options list
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  optionDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F3F4F6',
  },
  optionSelected: {
    backgroundColor: '#EEF2FF',
  },
  optionSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A2E',
    width: 36,
  },
  optionMeta: {
    flex: 1,
  },
  optionCode: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
  },
  optionLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 1,
  },
  optionCheck: {
    fontSize: 16,
    color: '#1a3c6e',
    fontWeight: '700',
  },

  // Error
  errorText: {
    fontSize: 11,
    color: '#FCA5A5',
    marginTop: 4,
  },
});
