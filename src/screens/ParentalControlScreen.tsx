import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const ParentalControlScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();
  const {settings, channels} = state;
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [showChangePinDialog, setShowChangePinDialog] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);

  const categories = Array.from(new Set(channels.map(ch => ch.category)));

  const handlePinSubmit = () => {
    if (pinInput === settings.parentalControl.pin) {
      setShowPinDialog(false);
      setPinInput('');
      setPinError('');
      setIsUnlocked(true);
      // Auto-lock after 30 minutes
      setTimeout(() => {
        setIsUnlocked(false);
      }, 30 * 60 * 1000);
    } else {
      setPinError('Incorrect PIN');
      setPinInput('');
    }
  };

  const handleChangePinSubmit = () => {
    if (newPin.length !== 4) {
      setPinError('PIN must be 4 digits');
      return;
    }
    
    if (newPin !== confirmPin) {
      setPinError('PINs do not match');
      return;
    }

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        parentalControl: {
          ...settings.parentalControl,
          pin: newPin
        }
      }
    });

    setShowChangePinDialog(false);
    setNewPin('');
    setConfirmPin('');
    setPinError('');
    Alert.alert('Success', 'PIN changed successfully');
  };

  const toggleParentalControl = () => {
    if (settings.parentalControl.enabled && !isUnlocked) {
      setShowPinDialog(true);
      return;
    }

    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        parentalControl: {
          ...settings.parentalControl,
          enabled: !settings.parentalControl.enabled
        }
      }
    });
  };

  const toggleCategoryLock = (category: string) => {
    if (!isUnlocked) {
      setShowPinDialog(true);
      return;
    }

    const lockedCategories = settings.parentalControl.lockedCategories || [];
    const isLocked = lockedCategories.includes(category);
    
    const updatedCategories = isLocked
      ? lockedCategories.filter(cat => cat !== category)
      : [...lockedCategories, category];
    
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: {
        parentalControl: {
          ...settings.parentalControl,
          lockedCategories: updatedCategories
        }
      }
    });
  };

  const renderCategory = ({item}: {item: string}) => {
    const isLocked = settings.parentalControl.lockedCategories?.includes(item);
    
    return (
      <TouchableOpacity
        style={[
          styles.categoryCard,
          isLocked ? styles.lockedCategory : styles.unlockedCategory
        ]}
        onPress={() => toggleCategoryLock(item)}>
        <View style={styles.categoryInfo}>
          <Text style={[styles.categoryName, isLocked && styles.lockedText]}>
            {item}
          </Text>
          <Text style={[styles.categoryStatus, isLocked && styles.lockedText]}>
            {isLocked ? 'Locked' : 'Accessible'}
          </Text>
        </View>
        <Icon
          name={isLocked ? 'lock' : 'lock-open'}
          size={24}
          color={isLocked ? COLORS.error : COLORS.success}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Parental Control</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={[
            styles.statusBadge,
            settings.parentalControl.enabled ? styles.protectedBadge : styles.unprotectedBadge
          ]}>
            <Icon
              name="shield"
              size={16}
              color={settings.parentalControl.enabled ? COLORS.error : COLORS.textSecondary}
            />
            <Text style={[
              styles.statusText,
              settings.parentalControl.enabled ? styles.protectedText : styles.unprotectedText
            ]}>
              {settings.parentalControl.enabled ? 'PROTECTED' : 'UNPROTECTED'}
            </Text>
          </View>
        </View>
      </View>

      {/* Main Controls */}
      <View style={styles.controlsContainer}>
        <View style={styles.controlCard}>
          <View style={styles.controlHeader}>
            <Icon name="security" size={24} color={COLORS.primary} />
            <Text style={styles.controlTitle}>Parental Control</Text>
          </View>
          <Text style={styles.controlDescription}>
            Enable or disable parental control to restrict access to selected categories.
          </Text>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              settings.parentalControl.enabled ? styles.disableButton : styles.enableButton
            ]}
            onPress={toggleParentalControl}>
            <Text style={styles.toggleButtonText}>
              {settings.parentalControl.enabled ? 'Disable Protection' : 'Enable Protection'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlCard}>
          <View style={styles.controlHeader}>
            <Icon name="vpn-key" size={24} color={COLORS.primary} />
            <Text style={styles.controlTitle}>Change PIN</Text>
          </View>
          <Text style={styles.controlDescription}>
            Current PIN: ••••
          </Text>
          <TouchableOpacity
            style={styles.changePinButton}
            onPress={() => setShowChangePinDialog(true)}>
            <Text style={styles.changePinButtonText}>Change PIN</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.controlCard}>
          <View style={styles.controlHeader}>
            <Icon
              name={isUnlocked ? 'lock-open' : 'lock'}
              size={24}
              color={isUnlocked ? COLORS.success : COLORS.error}
            />
            <Text style={styles.controlTitle}>Current Status</Text>
          </View>
          <Text style={[
            styles.statusDescription,
            isUnlocked ? styles.unlockedStatus : styles.lockedStatus
          ]}>
            {isUnlocked ? 'Unlocked (30 min session)' : 'Locked'}
          </Text>
          <Text style={styles.controlDescription}>
            Locked Categories: {settings.parentalControl.lockedCategories?.length || 0}
          </Text>
        </View>
      </View>

      {/* Category Management */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Category Access Control</Text>
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item}
          numColumns={2}
          contentContainerStyle={styles.categoriesList}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* PIN Verification Dialog */}
      <Modal
        visible={showPinDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowPinDialog(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Enter PIN</Text>
              <TouchableOpacity onPress={() => setShowPinDialog(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>
                This content is restricted. Enter PIN to continue.
              </Text>
              <TextInput
                style={styles.pinInput}
                value={pinInput}
                onChangeText={(text) => setPinInput(text.slice(0, 4))}
                placeholder="Enter 4-digit PIN"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={4}
              />
              {pinError && (
                <Text style={styles.errorText}>{pinError}</Text>
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowPinDialog(false);
                  setPinInput('');
                  setPinError('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, pinInput.length !== 4 && styles.disabledButton]}
                onPress={handlePinSubmit}
                disabled={pinInput.length !== 4}>
                <Text style={styles.confirmButtonText}>Unlock</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change PIN Dialog */}
      <Modal
        visible={showChangePinDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChangePinDialog(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Change PIN</Text>
              <TouchableOpacity onPress={() => setShowChangePinDialog(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>New PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={newPin}
                onChangeText={(text) => setNewPin(text.slice(0, 4))}
                placeholder="Enter new 4-digit PIN"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={4}
              />
              
              <Text style={styles.inputLabel}>Confirm PIN</Text>
              <TextInput
                style={styles.pinInput}
                value={confirmPin}
                onChangeText={(text) => setConfirmPin(text.slice(0, 4))}
                placeholder="Confirm new PIN"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={true}
                keyboardType="numeric"
                maxLength={4}
              />
              
              {pinError && (
                <Text style={styles.errorText}>{pinError}</Text>
              )}
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowChangePinDialog(false);
                  setNewPin('');
                  setConfirmPin('');
                  setPinError('');
                }}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, (newPin.length !== 4 || confirmPin.length !== 4) && styles.disabledButton]}
                onPress={handleChangePinSubmit}
                disabled={newPin.length !== 4 || confirmPin.length !== 4}>
                <Text style={styles.confirmButtonText}>Change PIN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
  },
  protectedBadge: {
    borderColor: COLORS.error,
    backgroundColor: `${COLORS.error}20`,
  },
  unprotectedBadge: {
    borderColor: COLORS.textSecondary,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  protectedText: {
    color: COLORS.error,
  },
  unprotectedText: {
    color: COLORS.textSecondary,
  },
  controlsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  controlCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
  },
  controlHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  controlTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 10,
  },
  controlDescription: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 15,
    lineHeight: 16,
  },
  toggleButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  enableButton: {
    backgroundColor: COLORS.success,
  },
  disableButton: {
    backgroundColor: COLORS.error,
  },
  toggleButtonText: {
    color: COLORS.text,
    fontWeight: 'bold',
    fontSize: 12,
  },
  changePinButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  changePinButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  statusDescription: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  unlockedStatus: {
    color: COLORS.success,
  },
  lockedStatus: {
    color: COLORS.error,
  },
  categoriesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  categoriesList: {
    paddingBottom: 20,
  },
  categoryCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: 5,
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
  },
  lockedCategory: {
    borderColor: COLORS.error,
    backgroundColor: `${COLORS.error}20`,
  },
  unlockedCategory: {
    borderColor: COLORS.success,
    backgroundColor: `${COLORS.success}20`,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  categoryStatus: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  lockedText: {
    color: COLORS.error,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    width: '80%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalBody: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 14,
    color: COLORS.text,
    marginBottom: 15,
    textAlign: 'center',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 10,
  },
  pinInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 18,
    textAlign: 'center',
    letterSpacing: 10,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: COLORS.primary,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
  },
});

export default ParentalControlScreen;