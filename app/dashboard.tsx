import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const COLORS = {
  primary: '#4361EE',
  secondary: '#F72585',
  accent: '#4CC9F0',
  success: '#06D6A0',
  warning: '#FFB703',
  error: '#E63946',
  dark: '#1E1E2E',
  gray: '#6C757D',
  lightGray: '#F8F9FA',
  white: '#FFFFFF',
};

export default function DashboardScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userAvatar, setUserAvatar] = useState('');
  const [stats, setStats] = useState({
    activeUsers: 128,
    messagesToday: 347,
    tasksCompleted: 42,
    teamMembers: 12,
    storageUsed: 2.4,
    storageTotal: 100,
    meetingsToday: 3,
    pendingTasks: 8,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [meetingTitle, setMeetingTitle] = useState('');
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('weekly');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Sarah commented on Q1 report', time: '2m ago', read: false },
    { id: 2, title: 'Mike uploaded 3 files', time: '15m ago', read: false },
    { id: 3, title: 'Meeting in 30 minutes', time: '25m ago', read: false },
  ]);
  const [unreadCount, setUnreadCount] = useState(3);

  useEffect(() => {
    loadUserData();
    loadStats();
  }, []);

  const loadUserData = async () => {
    try {
      const email = await AsyncStorage.getItem('nexusflow_email');
      const role = await AsyncStorage.getItem('nexusflow_role');
      if (email) {
        setUserEmail(email);
        const name = email.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = name.replace(/\b\w/g, (l) => l.toUpperCase());
        setUserName(formattedName);
        setUserRole(role === 'admin' ? 'Administrator' : 'Team Member');
        setUserAvatar(formattedName.charAt(0) + (formattedName.split(' ')[1]?.charAt(0) || ''));
      }
    } catch (error) {
      console.log('Error loading user data');
    }
  };

  const loadStats = () => {
    setStats({
      activeUsers: Math.floor(Math.random() * 50) + 100,
      messagesToday: Math.floor(Math.random() * 100) + 300,
      tasksCompleted: Math.floor(Math.random() * 20) + 35,
      teamMembers: 12,
      storageUsed: Math.random() * 5 + 1,
      storageTotal: 100,
      meetingsToday: Math.floor(Math.random() * 5) + 1,
      pendingTasks: Math.floor(Math.random() * 10) + 5,
    });
  };

  const onRefresh = () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setTimeout(() => {
      loadStats();
      setRefreshing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }, 1500);
  };

  const handleLogout = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('nexusflow_email');
            await AsyncStorage.removeItem('nexusflow_role');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            router.replace('/');
          },
        },
      ]
    );
  };

  const handleInvite = () => {
    if (!inviteEmail || !inviteEmail.includes('@')) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // FIXED: Using string concatenation with +
    Alert.alert(
      '✅ Invitation Sent',
      'Invitation sent to ' + inviteEmail + '\nRole: ' + inviteRole.toUpperCase(),
      [{ 
        text: 'OK', 
        onPress: () => {
          setShowInviteModal(false);
          setInviteEmail('');
          setInviteRole('member');
        }
      }]
    );
  };

  const handleScheduleMeeting = () => {
    if (!meetingTitle || !meetingDate || !meetingTime) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Alert.alert(
      '📅 Meeting Scheduled',
      meetingTitle + '\n' + meetingDate + ' at ' + meetingTime,
      [{ 
        text: 'OK', 
        onPress: () => {
          setShowScheduleModal(false);
          setMeetingTitle('');
          setMeetingDate('');
          setMeetingTime('');
        }
      }]
    );
  };

  const handleGenerateReport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowReportModal(false);
    Alert.alert(
      '📊 Report Generated',
      reportType.toUpperCase() + ' report has been generated and downloaded',
      [{ text: 'View Report', onPress: () => {} }]
    );
  };

  const handleUpload = () => {
    setShowUploadModal(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setShowUploadModal(false);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('✅ Upload Complete', 'File has been uploaded successfully');
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const markNotificationAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    Haptics.selectionAsync();
  };

  const clearAllNotifications = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const StatCard = ({ title, value, icon, color, trend, onPress }) => (
    <TouchableOpacity style={styles.statCard} onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {trend && (
          <View style={styles.trendContainer}>
            <Ionicons name="trending-up" size={14} color={COLORS.success} />
            <Text style={styles.trendText}>+{trend}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const QuickAction = ({ icon, title, color, onPress }) => (
    <TouchableOpacity style={styles.quickAction} onPress={onPress}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionTitle}>{title}</Text>
    </TouchableOpacity>
  );

  const NotificationItem = ({ notification }) => (
    <TouchableOpacity 
      style={[styles.notificationItem, !notification.read && styles.notificationUnread]}
      onPress={() => markNotificationAsRead(notification.id)}
    >
      <View style={styles.notificationContent}>
        <Text style={styles.notificationTitle}>{notification.title}</Text>
        <Text style={styles.notificationTime}>{notification.time}</Text>
      </View>
      {!notification.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const ActivityItem = ({ user, action, time, avatar }) => (
    <View style={styles.activityItem}>
      <View style={[styles.activityAvatar, { backgroundColor: COLORS.primary }]}>
        <Text style={styles.activityAvatarText}>{avatar}</Text>
      </View>
      <View style={styles.activityContent}>
        <Text style={styles.activityText}>
          <Text style={styles.activityUser}>{user}</Text> {action}
        </Text>
        <Text style={styles.activityTime}>{time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome back,</Text>
          <View style={styles.userInfoContainer}>
            <Text style={styles.userName}>{userName || 'User'}</Text>
            <View style={styles.roleBadge}>
              <Ionicons name="shield-checkmark" size={14} color={COLORS.primary} />
              <Text style={styles.roleText}>{userRole || 'Team Member'}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => Alert.alert('Notifications', 'You have ' + unreadCount + ' unread notifications')}
          >
            <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>{unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/profile')}>
            <Text style={styles.profileInitials}>{userAvatar || 'U'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh} 
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {/* Enterprise Plan Banner */}
        <TouchableOpacity 
          style={styles.welcomeBanner}
          activeOpacity={0.9}
          onPress={() => Alert.alert(
            '✨ Enterprise Plan',
            'Your plan includes:\n\n• Unlimited team members\n• 100GB storage\n• Advanced analytics\n• 24/7 priority support\n• Custom integrations'
          )}
        >
          <View style={styles.welcomeBannerContent}>
            <View style={styles.bannerBadge}>
              <Ionicons name="star" size={16} color={COLORS.warning} />
              <Text style={styles.bannerBadgeText}>ACTIVE</Text>
            </View>
            <Text style={styles.welcomeBannerTitle}>Enterprise Plan</Text>
            <Text style={styles.welcomeBannerSubtitle}>
              You're on track • Q1 2026
            </Text>
            <View style={styles.bannerStats}>
              <View style={styles.bannerStat}>
                <Text style={styles.bannerStatValue}>99.9%</Text>
                <Text style={styles.bannerStatLabel}>Uptime</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStat}>
                <Text style={styles.bannerStatValue}>24/7</Text>
                <Text style={styles.bannerStatLabel}>Support</Text>
              </View>
              <View style={styles.bannerStatDivider} />
              <View style={styles.bannerStat}>
                <Text style={styles.bannerStatValue}>SOC2</Text>
                <Text style={styles.bannerStatLabel}>Compliant</Text>
              </View>
            </View>
          </View>
          <View style={styles.welcomeBannerGraphic}>
            <Ionicons name="stats-chart" size={64} color={COLORS.white + '80'} />
          </View>
        </TouchableOpacity>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <StatCard
            title="Active Users"
            value={stats.activeUsers}
            icon="people-outline"
            color={COLORS.primary}
            trend={12}
            onPress={() => Alert.alert('👥 Active Users', stats.activeUsers + ' users currently online')}
          />
          <StatCard
            title="Messages"
            value={stats.messagesToday}
            icon="chatbubble-outline"
            color={COLORS.secondary}
            trend={8}
            onPress={() => router.push('/chat')}
          />
          <StatCard
            title="Tasks"
            value={stats.tasksCompleted}
            icon="checkbox-outline"
            color={COLORS.success}
            trend={23}
            onPress={() => Alert.alert('✅ Tasks Completed', stats.tasksCompleted + ' tasks done today\n' + stats.pendingTasks + ' pending')}
          />
          <StatCard
            title="Team"
            value={stats.teamMembers}
            icon="people-circle-outline"
            color={COLORS.accent}
            onPress={() => Alert.alert('👪 Team Members', stats.teamMembers + ' active members\n3 online now')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>Customize</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickActionsGrid}>
            <QuickAction
              icon="person-add"
              title="Invite"
              color={COLORS.primary}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowInviteModal(true);
              }}
            />
            <QuickAction
              icon="chatbubbles"
              title="New Chat"
              color={COLORS.accent}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/chat');
              }}
            />
            <QuickAction
              icon="calendar"
              title="Schedule"
              color={COLORS.success}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowScheduleModal(true);
              }}
            />
            <QuickAction
              icon="document-text"
              title="Reports"
              color={COLORS.warning}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setShowReportModal(true);
              }}
            />
            <QuickAction
              icon="cloud-upload"
              title="Upload"
              color={COLORS.secondary}
              onPress={handleUpload}
            />
            <QuickAction
              icon="settings"
              title="Settings"
              color={COLORS.gray}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/profile');
              }}
            />
          </View>
        </View>

        {/* Notifications */}
        {notifications.filter(n => !n.read).length > 0 && (
          <View style={styles.notificationsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.notificationHeaderLeft}>
                <Ionicons name="notifications" size={20} color={COLORS.primary} />
                <Text style={styles.sectionTitle}>Notifications</Text>
              </View>
              <TouchableOpacity onPress={clearAllNotifications}>
                <Text style={styles.clearAllText}>Clear all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notificationsList}>
              {notifications.filter(n => !n.read).slice(0, 3).map(notification => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </View>
          </View>
        )}

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.activityList}>
            <ActivityItem
              user="Sarah Chen"
              action="commented on Q1 report"
              time="2 minutes ago"
              avatar="SC"
            />
            <ActivityItem
              user="Mike Ross"
              action="uploaded 3 files"
              time="15 minutes ago"
              avatar="MR"
            />
            <ActivityItem
              user="Lisa Park"
              action="completed task #234"
              time="32 minutes ago"
              avatar="LP"
            />
            <ActivityItem
              user="James Wilson"
              action="joined the team"
              time="1 hour ago"
              avatar="JW"
            />
          </View>
        </View>

        {/* Meetings Today */}
        <View style={styles.meetingsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.meetingHeaderLeft}>
              <Ionicons name="calendar" size={20} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Today's Meetings</Text>
            </View>
            <TouchableOpacity onPress={() => setShowScheduleModal(true)}>
              <Text style={styles.seeAllText}>Schedule +</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.meetingsList}>
            <View style={styles.meetingCard}>
              <View style={styles.meetingTime}>
                <Text style={styles.meetingTimeText}>10:00</Text>
                <Text style={styles.meetingAmPm}>AM</Text>
              </View>
              <View style={styles.meetingDetails}>
                <Text style={styles.meetingTitle}>Q1 Planning Meeting</Text>
                <Text style={styles.meetingDuration}>1 hour • 8 attendees</Text>
              </View>
              <TouchableOpacity style={styles.meetingButton}>
                <Text style={styles.meetingButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.meetingCard}>
              <View style={styles.meetingTime}>
                <Text style={styles.meetingTimeText}>2:00</Text>
                <Text style={styles.meetingAmPm}>PM</Text>
              </View>
              <View style={styles.meetingDetails}>
                <Text style={styles.meetingTitle}>Design Review</Text>
                <Text style={styles.meetingDuration}>1 hour • 5 attendees</Text>
              </View>
              <TouchableOpacity style={styles.meetingButton}>
                <Text style={styles.meetingButtonText}>Join</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Storage */}
        <View style={styles.storageSection}>
          <View style={styles.storageHeader}>
            <View style={styles.storageTitleContainer}>
              <Ionicons name="cloud-outline" size={20} color={COLORS.primary} />
              <Text style={styles.storageTitle}>Storage</Text>
            </View>
            <Text style={styles.storageValue}>
              {stats.storageUsed.toFixed(1)} GB / {stats.storageTotal} GB
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: (stats.storageUsed / stats.storageTotal * 100) + '%' }
              ]} 
            />
          </View>
          <View style={styles.storageFooter}>
            <Text style={styles.storageDetails}>
              {stats.storageUsed.toFixed(1)} GB used • {(stats.storageTotal - stats.storageUsed).toFixed(1)} GB free
            </Text>
            <TouchableOpacity 
              style={styles.upgradeButton}
              onPress={() => Alert.alert(
                '💎 Upgrade Storage',
                'Choose a plan that works for you:',
                [
                  { text: 'Pro • 500GB • .99/mo', onPress: () => Alert.alert('✅ Upgraded', 'Thank you for upgrading!') },
                  { text: 'Business • 2TB • .99/mo', onPress: () => Alert.alert('✅ Upgraded', 'Thank you for upgrading!') },
                  { text: 'Enterprise • Custom', onPress: () => Alert.alert('Contact Sales', 'sales@nexusflow.com') },
                  { text: 'Cancel', style: 'cancel' }
                ]
              )}
            >
              <Text style={styles.upgradeButtonText}>Upgrade</Text>
              <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>NexusFlow Enterprise v2.0.0</Text>
          <Text style={styles.footerText}>© 2026 • SOC2 Type II • POPIA Compliant</Text>
        </View>
      </ScrollView>

      {/* Invite Modal */}
      <Modal
        visible={showInviteModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Invite Team Member</Text>
                <Text style={styles.modalSubtitle}>Send an invitation to join your workspace</Text>
              </View>
              <TouchableOpacity onPress={() => setShowInviteModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Email Address</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="mail-outline" size={20} color={COLORS.gray} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="colleague@company.com"
                    placeholderTextColor={COLORS.gray + '80'}
                    value={inviteEmail}
                    onChangeText={setInviteEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Role</Text>
                <View style={styles.roleSelector}>
                  <TouchableOpacity 
                    style={[styles.roleOption, inviteRole === 'member' && styles.roleOptionActive]}
                    onPress={() => setInviteRole('member')}
                  >
                    <Text style={[styles.roleOptionText, inviteRole === 'member' && styles.roleOptionActiveText]}>
                      Member
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.roleOption, inviteRole === 'admin' && styles.roleOptionActive]}
                    onPress={() => setInviteRole('admin')}
                  >
                    <Text style={[styles.roleOptionText, inviteRole === 'admin' && styles.roleOptionActiveText]}>
                      Admin
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.roleOption, inviteRole === 'guest' && styles.roleOptionActive]}
                    onPress={() => setInviteRole('guest')}
                  >
                    <Text style={[styles.roleOptionText, inviteRole === 'guest' && styles.roleOptionActiveText]}>
                      Guest
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowInviteModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSendButton}
                onPress={handleInvite}
              >
                <Text style={styles.modalSendButtonText}>Send Invitation</Text>
                <Ionicons name="send" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Schedule Meeting Modal */}
      <Modal
        visible={showScheduleModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Schedule Meeting</Text>
                <Text style={styles.modalSubtitle}>Create a new meeting invite</Text>
              </View>
              <TouchableOpacity onPress={() => setShowScheduleModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Meeting Title</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="calendar-outline" size={20} color={COLORS.gray} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="Q1 Planning Meeting"
                    placeholderTextColor={COLORS.gray + '80'}
                    value={meetingTitle}
                    onChangeText={setMeetingTitle}
                  />
                </View>
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Date</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="today-outline" size={20} color={COLORS.gray} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="MM/DD/YYYY"
                    placeholderTextColor={COLORS.gray + '80'}
                    value={meetingDate}
                    onChangeText={setMeetingDate}
                  />
                </View>
              </View>
              
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Time</Text>
                <View style={styles.modalInputContainer}>
                  <Ionicons name="time-outline" size={20} color={COLORS.gray} />
                  <TextInput
                    style={styles.modalInput}
                    placeholder="HH:MM AM/PM"
                    placeholderTextColor={COLORS.gray + '80'}
                    value={meetingTime}
                    onChangeText={setMeetingTime}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowScheduleModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSendButton}
                onPress={handleScheduleMeeting}
              >
                <Text style={styles.modalSendButtonText}>Schedule</Text>
                <Ionicons name="checkmark" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Reports Modal */}
      <Modal
        visible={showReportModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Generate Report</Text>
                <Text style={styles.modalSubtitle}>Select report type and period</Text>
              </View>
              <TouchableOpacity onPress={() => setShowReportModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <View style={styles.modalInputGroup}>
                <Text style={styles.modalLabel}>Report Type</Text>
                <View style={styles.reportSelector}>
                  <TouchableOpacity 
                    style={[styles.reportOption, reportType === 'weekly' && styles.reportOptionActive]}
                    onPress={() => setReportType('weekly')}
                  >
                    <Text style={[styles.reportOptionText, reportType === 'weekly' && styles.reportOptionActiveText]}>
                      Weekly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.reportOption, reportType === 'monthly' && styles.reportOptionActive]}
                    onPress={() => setReportType('monthly')}
                  >
                    <Text style={[styles.reportOptionText, reportType === 'monthly' && styles.reportOptionActiveText]}>
                      Monthly
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.reportOption, reportType === 'quarterly' && styles.reportOptionActive]}
                    onPress={() => setReportType('quarterly')}
                  >
                    <Text style={[styles.reportOptionText, reportType === 'quarterly' && styles.reportOptionActiveText]}>
                      Quarterly
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.modalSendButton}
                onPress={handleGenerateReport}
              >
                <Text style={styles.modalSendButtonText}>Generate</Text>
                <Ionicons name="document-text" size={16} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Upload Progress Modal */}
      <Modal
        visible={showUploadModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.uploadModalContent}>
            <View style={styles.uploadHeader}>
              <Ionicons name="cloud-upload" size={48} color={COLORS.primary} />
              <Text style={styles.uploadTitle}>Uploading...</Text>
            </View>
            
            <View style={styles.uploadProgressContainer}>
              <View style={styles.uploadProgressBar}>
                <View style={[styles.uploadProgressFill, { width: uploadProgress + '%' }]} />
              </View>
              <Text style={styles.uploadProgressText}>{uploadProgress}%</Text>
            </View>
            
            <Text style={styles.uploadStatus}>
              {uploadProgress < 100 ? 'Transferring files...' : 'Complete!'}
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  greeting: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  userInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginRight: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative',
    marginRight: 16,
    padding: 4,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notificationBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  profileInitials: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  welcomeBanner: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  welcomeBannerContent: {
    flex: 1,
  },
  bannerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '20',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 12,
  },
  bannerBadgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  welcomeBannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 4,
  },
  welcomeBannerSubtitle: {
    fontSize: 14,
    color: COLORS.white + 'CC',
    marginBottom: 16,
  },
  bannerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white + '15',
    borderRadius: 12,
    padding: 12,
  },
  bannerStat: {
    flex: 1,
    alignItems: 'center',
  },
  bannerStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },
  bannerStatLabel: {
    fontSize: 11,
    color: COLORS.white + 'CC',
    marginTop: 2,
  },
  bannerStatDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.white + '30',
  },
  welcomeBannerGraphic: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginTop: 8,
  },
  statCard: {
    flexDirection: 'row',
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: '1%',
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 2,
  },
  statTitle: {
    fontSize: 13,
    color: COLORS.gray,
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendText: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '600',
    marginLeft: 4,
  },
  quickActionsSection: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: '600',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  quickAction: {
    width: '16.66%',
    alignItems: 'center',
    marginBottom: 16,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickActionTitle: {
    fontSize: 12,
    color: COLORS.dark,
    fontWeight: '500',
  },
  notificationsSection: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingVertical: 20,
  },
  notificationHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearAllText: {
    fontSize: 14,
    color: COLORS.gray,
    fontWeight: '500',
  },
  notificationsList: {
    paddingHorizontal: 20,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  notificationUnread: {
    backgroundColor: COLORS.primary + '05',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 2,
  },
  notificationTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  activitySection: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingVertical: 20,
  },
  activityList: {
    paddingHorizontal: 20,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  activityAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityAvatarText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 2,
  },
  activityUser: {
    fontWeight: '700',
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.gray,
  },
  meetingsSection: {
    backgroundColor: COLORS.white,
    marginTop: 20,
    paddingVertical: 20,
  },
  meetingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  meetingsList: {
    paddingHorizontal: 20,
  },
  meetingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray + '80',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  meetingTime: {
    alignItems: 'center',
    marginRight: 16,
  },
  meetingTimeText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.dark,
  },
  meetingAmPm: {
    fontSize: 12,
    color: COLORS.gray,
  },
  meetingDetails: {
    flex: 1,
  },
  meetingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  meetingDuration: {
    fontSize: 12,
    color: COLORS.gray,
  },
  meetingButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  meetingButtonText: {
    color: COLORS.white,
    fontSize: 13,
    fontWeight: '600',
  },
  storageSection: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  storageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  storageTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  storageTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginLeft: 8,
  },
  storageValue: {
    fontSize: 14,
    color: COLORS.gray,
  },
  progressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  storageFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storageDetails: {
    fontSize: 12,
    color: COLORS.gray,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  upgradeButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
    marginRight: 4,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 11,
    color: COLORS.gray,
    marginBottom: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
  },
  modalBody: {
    marginBottom: 24,
  },
  modalInputGroup: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 8,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.lightGray + '50',
  },
  modalInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.dark,
  },
  roleSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    marginRight: 8,
  },
  roleOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  roleOptionText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  roleOptionActiveText: {
    color: COLORS.white,
  },
  reportSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportOption: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: 12,
    marginRight: 8,
  },
  reportOptionActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  reportOptionText: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: '500',
  },
  reportOptionActiveText: {
    color: COLORS.white,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalCancelButton: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  modalCancelButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: '600',
  },
  modalSendButton: {
    flex: 1,
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    flexDirection: 'row',
  },
  modalSendButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
    marginRight: 8,
  },
  uploadModalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    marginHorizontal: 40,
  },
  uploadHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  uploadTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.dark,
    marginTop: 16,
  },
  uploadProgressContainer: {
    width: '100%',
    marginBottom: 16,
  },
  uploadProgressBar: {
    height: 8,
    backgroundColor: COLORS.lightGray,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  uploadProgressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 4,
  },
  uploadProgressText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
  },
  uploadStatus: {
    fontSize: 14,
    color: COLORS.gray,
  },
});
