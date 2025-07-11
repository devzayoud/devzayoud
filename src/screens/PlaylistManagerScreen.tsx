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

const PlaylistManagerScreen: React.FC<NavigationProps> = ({navigation}) => {
  const {state, dispatch} = useIPTV();
  const {playlists} = state;
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showXtremeDialog, setShowXtremeDialog] = useState(false);
  const [importUrl, setImportUrl] = useState('');
  const [importName, setImportName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  
  // Xtreme Code states
  const [xtremeCredentials, setXtremeCredentials] = useState({
    server: '',
    username: '',
    password: ''
  });
  const [isXtremeConnecting, setIsXtremeConnecting] = useState(false);

  const handleImport = async () => {
    if (!importUrl.trim() || !importName.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsImporting(true);
    try {
      // Simulate playlist import
      const newPlaylist = {
        id: `pl_${Date.now()}`,
        name: importName.trim(),
        url: importUrl.trim(),
        channels: [], // Would be populated from actual M3U parsing
        lastUpdated: new Date()
      };
      
      dispatch({type: 'ADD_PLAYLIST', payload: newPlaylist});
      setImportUrl('');
      setImportName('');
      setShowImportDialog(false);
      Alert.alert('Success', 'Playlist imported successfully!');
    } catch (error) {
      Alert.alert('Error', 'Failed to import playlist. Please check the URL and try again.');
    } finally {
      setIsImporting(false);
    }
  };

  const handleXtremeLogin = async () => {
    if (!xtremeCredentials.server.trim() || !xtremeCredentials.username.trim() || !xtremeCredentials.password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsXtremeConnecting(true);
    try {
      // Simulate Xtreme Code connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockPlaylists = [
        {
          id: `xtreme_live_${Date.now()}`,
          name: `${xtremeCredentials.username} - Live TV`,
          url: `${xtremeCredentials.server}/get.php?username=${xtremeCredentials.username}&password=${xtremeCredentials.password}&type=m3u_plus&output=ts`,
          channels: [],
          lastUpdated: new Date()
        },
        {
          id: `xtreme_vod_${Date.now() + 1}`,
          name: `${xtremeCredentials.username} - Movies`,
          url: `${xtremeCredentials.server}/get.php?username=${xtremeCredentials.username}&password=${xtremeCredentials.password}&type=m3u_plus&output=m3u8`,
          channels: [],
          lastUpdated: new Date()
        }
      ];

      mockPlaylists.forEach(playlist => {
        dispatch({type: 'ADD_PLAYLIST', payload: playlist});
      });

      setShowXtremeDialog(false);
      setXtremeCredentials({ server: '', username: '', password: '' });
      Alert.alert('Success', 'Xtreme Code playlists imported successfully!');
      
    } catch (error) {
      Alert.alert('Error', 'Failed to connect to Xtreme Code server. Please check your credentials and try again.');
    } finally {
      setIsXtremeConnecting(false);
    }
  };

  const handleRemove = (playlistId: string) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (playlist) {
      Alert.alert(
        'Remove Playlist',
        `Are you sure you want to remove "${playlist.name}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Remove', 
            style: 'destructive',
            onPress: () => dispatch({type: 'REMOVE_PLAYLIST', payload: playlistId})
          }
        ]
      );
    }
  };

  const renderPlaylist = ({item}: {item: any}) => (
    <View style={styles.playlistCard}>
      <View style={styles.playlistInfo}>
        <Text style={styles.playlistName}>{item.name}</Text>
        <Text style={styles.playlistUrl} numberOfLines={1}>{item.url}</Text>
        <Text style={styles.playlistMeta}>
          {item.channels.length} channels • Updated: {item.lastUpdated.toLocaleDateString()}
        </Text>
      </View>
      <View style={styles.playlistActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => Alert.alert('Refresh', 'Playlist refreshed successfully!')}>
          <Icon name="refresh" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleRemove(item.id)}>
          <Icon name="delete" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </View>
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
          <Text style={styles.headerTitle}>Playlist Management</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowXtremeDialog(true)}>
            <Icon name="vpn-key" size={20} color={COLORS.background} />
            <Text style={styles.addButtonText}>Xtreme Code</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowImportDialog(true)}>
            <Icon name="add" size={20} color={COLORS.background} />
            <Text style={styles.addButtonText}>Add M3U</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistics */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{playlists.length}</Text>
          <Text style={styles.statLabel}>Total Playlists</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {playlists.reduce((total, playlist) => total + playlist.channels.length, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Channels</Text>
        </View>
      </View>

      {/* Playlists List */}
      {playlists.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="playlist-play" size={64} color={COLORS.textSecondary} />
          <Text style={styles.emptyStateText}>No playlists imported</Text>
          <Text style={styles.emptyStateSubtext}>
            Import M3U8 playlists to get started with IPTV channels
          </Text>
        </View>
      ) : (
        <FlatList
          data={playlists}
          renderItem={renderPlaylist}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.playlistsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Import M3U Dialog */}
      <Modal
        visible={showImportDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImportDialog(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Import New Playlist</Text>
              <TouchableOpacity
                onPress={() => setShowImportDialog(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Playlist Name *</Text>
              <TextInput
                style={styles.textInput}
                value={importName}
                onChangeText={setImportName}
                placeholder="Enter a name for this playlist"
                placeholderTextColor={COLORS.textSecondary}
              />
              
              <Text style={styles.inputLabel}>M3U8 Playlist URL *</Text>
              <TextInput
                style={styles.textInput}
                value={importUrl}
                onChangeText={setImportUrl}
                placeholder="https://example.com/playlist.m3u8"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowImportDialog(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, (!importUrl.trim() || !importName.trim() || isImporting) && styles.disabledButton]}
                onPress={handleImport}
                disabled={!importUrl.trim() || !importName.trim() || isImporting}>
                <Text style={styles.confirmButtonText}>
                  {isImporting ? 'Importing...' : 'Import Playlist'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Xtreme Code Dialog */}
      <Modal
        visible={showXtremeDialog}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowXtremeDialog(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Xtreme Code Login</Text>
              <TouchableOpacity
                onPress={() => setShowXtremeDialog(false)}>
                <Icon name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.inputLabel}>Server URL *</Text>
              <TextInput
                style={styles.textInput}
                value={xtremeCredentials.server}
                onChangeText={(text) => setXtremeCredentials({...xtremeCredentials, server: text})}
                placeholder="http://your-server.com:8080"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Username *</Text>
              <TextInput
                style={styles.textInput}
                value={xtremeCredentials.username}
                onChangeText={(text) => setXtremeCredentials({...xtremeCredentials, username: text})}
                placeholder="Enter your username"
                placeholderTextColor={COLORS.textSecondary}
                autoCapitalize="none"
              />
              
              <Text style={styles.inputLabel}>Password *</Text>
              <TextInput
                style={styles.textInput}
                value={xtremeCredentials.password}
                onChangeText={(text) => setXtremeCredentials({...xtremeCredentials, password: text})}
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textSecondary}
                secureTextEntry={true}
                autoCapitalize="none"
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowXtremeDialog(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.confirmButton, (!xtremeCredentials.server.trim() || !xtremeCredentials.username.trim() || !xtremeCredentials.password.trim() || isXtremeConnecting) && styles.disabledButton]}
                onPress={handleXtremeLogin}
                disabled={!xtremeCredentials.server.trim() || !xtremeCredentials.username.trim() || !xtremeCredentials.password.trim() || isXtremeConnecting}>
                <Text style={styles.confirmButtonText}>
                  {isXtremeConnecting ? 'Connecting...' : 'Login & Import'}
                </Text>
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
    gap: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: COLORS.background,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 5,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.textSecondary,
    marginTop: 15,
    marginBottom: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  playlistsList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  playlistCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.primary,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 5,
  },
  playlistUrl: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  playlistMeta: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  playlistActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: COLORS.background,
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
    maxWidth: 500,
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
  inputLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 10,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: COLORS.text,
    fontSize: 16,
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

export default PlaylistManagerScreen;