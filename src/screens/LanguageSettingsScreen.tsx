import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {NavigationProps} from '../types';
import {useIPTV} from '../context/IPTVContext';
import {COLORS} from '../utils/constants';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', region: 'Spain/Latin America' },
  { code: 'fr', name: 'French', nativeName: 'Français', region: 'France' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', region: 'Germany' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', region: 'Italy' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', region: 'Brazil/Portugal' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', region: 'Russia' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', region: 'Middle East', rtl: true },
  { code: 'zh', name: 'Chinese', nativeName: '中文', region: 'China' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', region: 'Japan' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', region: 'South Korea' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'India' },
  { code: 'tr', name: 'Turkish', nativeName: 'Türkçe', region: 'Turkey' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', region: 'Netherlands' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski', region: 'Poland' },
];

const LanguageSettingsScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();
  const {settings} = state;
  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === settings.language) || SUPPORTED_LANGUAGES[0];

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLanguageChange = (languageCode: string) => {
    dispatch({
      type: 'UPDATE_SETTINGS',
      payload: { language: languageCode }
    });
    
    const newLanguage = SUPPORTED_LANGUAGES.find(lang => lang.code === languageCode);
    if (newLanguage) {
      setTimeout(() => {
        alert(`Language changed to ${newLanguage.name} (${newLanguage.nativeName})`);
      }, 100);
    }
  };

  const renderLanguage = ({item}: {item: any}) => (
    <TouchableOpacity
      style={[
        styles.languageCard,
        settings.language === item.code && styles.selectedLanguage
      ]}
      onPress={() => handleLanguageChange(item.code)}>
      <View style={styles.languageInfo}>
        <View style={styles.languageHeader}>
          <Text style={[
            styles.languageCode,
            settings.language === item.code && styles.selectedText
          ]}>
            {item.code.toUpperCase()}
          </Text>
          {settings.language === item.code && (
            <Icon name="check" size={16} color={COLORS.primary} />
          )}
        </View>
        <Text style={[
          styles.languageName,
          settings.language === item.code && styles.selectedText
        ]}>
          {item.nativeName}
        </Text>
        <Text style={[
          styles.languageEnglishName,
          settings.language === item.code && styles.selectedText
        ]}>
          {item.name}
        </Text>
        <Text style={[
          styles.languageRegion,
          settings.language === item.code && styles.selectedText
        ]}>
          {item.region}
        </Text>
        {item.rtl && (
          <View style={styles.rtlBadge}>
            <Text style={styles.rtlBadgeText}>RTL</Text>
          </View>
        )}
        {settings.language === item.code && (
          <View style={styles.currentBadge}>
            <Text style={styles.currentBadgeText}>CURRENT</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

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
          <Text style={styles.headerTitle}>Language Settings</Text>
        </View>
        <View style={styles.headerRight}>
          <View style={styles.currentLanguageBadge}>
            <Icon name="language" size={16} color={COLORS.primary} />
            <Text style={styles.currentLanguageText}>
              Current: {currentLanguage.nativeName}
            </Text>
          </View>
        </View>
      </View>

      {/* Current Language Display */}
      <View style={styles.currentLanguageSection}>
        <Text style={styles.sectionTitle}>Current Language</Text>
        <View style={styles.currentLanguageCard}>
          <View style={styles.currentLanguageIcon}>
            <Icon name="language" size={32} color={COLORS.primary} />
          </View>
          <View style={styles.currentLanguageInfo}>
            <Text style={styles.currentLanguageName}>
              {currentLanguage.nativeName}
            </Text>
            <Text style={styles.currentLanguageDetails}>
              {currentLanguage.name} • {currentLanguage.region}
            </Text>
            {currentLanguage.rtl && (
              <View style={styles.rtlIndicator}>
                <Text style={styles.rtlIndicatorText}>Right-to-Left</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color={COLORS.primary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search languages..."
          placeholderTextColor={COLORS.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Languages List */}
      <View style={styles.languagesSection}>
        <Text style={styles.sectionTitle}>Select Language</Text>
        {filteredLanguages.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="language" size={64} color={COLORS.textSecondary} />
            <Text style={styles.emptyStateText}>No languages found</Text>
            <Text style={styles.emptyStateSubtext}>Try adjusting your search</Text>
          </View>
        ) : (
          <FlatList
            data={filteredLanguages}
            renderItem={renderLanguage}
            keyExtractor={item => item.code}
            numColumns={2}
            contentContainerStyle={styles.languagesList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Information */}
      <View style={styles.infoSection}>
        <View style={styles.infoCard}>
          <Icon name="info" size={20} color={COLORS.primary} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Language Information</Text>
            <Text style={styles.infoText}>
              • Language changes take effect immediately across the entire application{'\n'}
              • Your preference is saved and will persist between sessions{'\n'}
              • RTL languages will automatically adjust the interface direction{'\n'}
              • Some content may still appear in the original language if translations are not available
            </Text>
          </View>
        </View>
      </View>
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
  currentLanguageBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}20`,
  },
  currentLanguageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 5,
  },
  currentLanguageSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  currentLanguageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 20,
  },
  currentLanguageIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: `${COLORS.primary}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  currentLanguageInfo: {
    flex: 1,
  },
  currentLanguageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  currentLanguageDetails: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 10,
  },
  rtlIndicator: {
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  rtlIndicatorText: {
    fontSize: 10,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 12,
  },
  languagesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 15,
    marginBottom: 5,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  languagesList: {
    paddingBottom: 20,
  },
  languageCard: {
    flex: 1,
    margin: 5,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.textSecondary,
    padding: 15,
  },
  selectedLanguage: {
    borderColor: COLORS.primary,
    backgroundColor: `${COLORS.primary}10`,
  },
  languageInfo: {
    alignItems: 'center',
  },
  languageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  languageCode: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginRight: 5,
  },
  languageName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  languageEnglishName: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 4,
    textAlign: 'center',
  },
  languageRegion: {
    fontSize: 10,
    color: COLORS.textSecondary,
    marginBottom: 8,
    textAlign: 'center',
  },
  selectedText: {
    color: COLORS.primary,
  },
  rtlBadge: {
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 5,
  },
  rtlBadgeText: {
    fontSize: 8,
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  currentBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  currentBadgeText: {
    fontSize: 8,
    color: COLORS.background,
    fontWeight: 'bold',
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: `${COLORS.primary}10`,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 12,
    padding: 15,
  },
  infoContent: {
    flex: 1,
    marginLeft: 10,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 5,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.text,
    lineHeight: 16,
  },
});

export default LanguageSettingsScreen;