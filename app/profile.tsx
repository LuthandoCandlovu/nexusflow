import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const COLORS = {
  primary: "#4361EE",
  primaryDark: "#2D47D0",
  accent: "#7B2FBE",
  accentLight: "#F3EAFF",
  danger: "#E63946",
  dangerLight: "#FEF0F1",
  text: "#0D0F14",
  subtext: "#6B7280",
  border: "#E8EAED",
  surface: "#FFFFFF",
  background: "#F4F5F9",
  gold: "#F59E0B",
};

export default function ProfileScreen() {
  // ── Animation values ──────────────────────────────────────
  const headerAnim = useRef(new Animated.Value(0)).current;
  const avatarAnim = useRef(new Animated.Value(0)).current;
  const nameAnim = useRef(new Animated.Value(0)).current;
  const badgeAnim = useRef(new Animated.Value(0)).current;
  const cardAnim = useRef(new Animated.Value(0)).current;
  const btnAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Staggered entrance
    Animated.stagger(80, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.spring(avatarAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.spring(nameAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.spring(badgeAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.spring(cardAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 8,
      }),
      Animated.spring(btnAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 55,
        friction: 8,
      }),
    ]).start();

    // Pulse loop on avatar ring
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1.0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  // ── Helpers ───────────────────────────────────────────────
  const fadeUp = (anim: Animated.Value, yFrom = 30) => ({
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [yFrom, 0],
        }),
      },
    ],
  });

  const scaleIn = (anim: Animated.Value) => ({
    opacity: anim,
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.7, 1] }),
      },
    ],
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── Header ── */}
      <Animated.View style={[styles.header, fadeUp(headerAnim, -20)]}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Content ── */}
      <View style={styles.content}>
        {/* Avatar with pulsing ring */}
        <Animated.View style={[styles.avatarSection, scaleIn(avatarAnim)]}>
          <Animated.View
            style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]}
          />
          <LinearGradient
            colors={["#4361EE", "#7B2FBE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>NX</Text>
          </LinearGradient>
          <View style={styles.onlineDot} />
        </Animated.View>

        {/* Name & email */}
        <Animated.View style={[{ alignItems: "center" }, fadeUp(nameAnim)]}>
          <Text style={styles.name}>NexusFlow User</Text>
          <Text style={styles.email}>user@nexusflow.com</Text>
        </Animated.View>

        {/* Badge */}
        <Animated.View style={[scaleIn(badgeAnim), { marginTop: 12 }]}>
          <LinearGradient
            colors={["#F59E0B22", "#4361EE22"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <Ionicons name="star" size={12} color={COLORS.gold} />
            <Text style={styles.badgeText}>Pro Member</Text>
          </LinearGradient>
        </Animated.View>

        {/* Stats card */}
        <Animated.View style={[styles.statsCard, fadeUp(cardAnim)]}>
          <LinearGradient
            colors={["#4361EE", "#7B2FBE"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.statsGradient}
          >
            {[
              { label: "Projects", value: "12", icon: "folder-outline" },
              { label: "Tasks", value: "48", icon: "checkmark-circle-outline" },
              { label: "Teams", value: "3", icon: "people-outline" },
            ].map((stat, i, arr) => (
              <React.Fragment key={stat.label}>
                <View style={styles.statItem}>
                  <Ionicons
                    name={stat.icon as any}
                    size={18}
                    color="rgba(255,255,255,0.7)"
                  />
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={styles.statDivider} />}
              </React.Fragment>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* Sign Out */}
        <Animated.View style={[{ width: "100%" }, fadeUp(btnAnim)]}>
          <TouchableOpacity
            style={styles.signOutBtn}
            onPress={() => router.push("/")}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={18} color={COLORS.danger} />
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.3,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Content */
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 44,
  },

  /* Avatar */
  avatarSection: {
    position: "relative",
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pulseRing: {
    position: "absolute",
    width: 112,
    height: 112,
    borderRadius: 56,
    borderWidth: 2,
    borderColor: "#4361EE44",
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 1,
  },
  onlineDot: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#22C55E",
    borderWidth: 2.5,
    borderColor: COLORS.surface,
  },

  /* Name / Email */
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.2,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: COLORS.subtext,
  },

  /* Badge */
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#F59E0B33",
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.gold,
    letterSpacing: 0.3,
  },

  /* Stats card */
  statsCard: {
    width: "100%",
    marginTop: 32,
    marginBottom: 28,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#4361EE",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  statsGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.2)",
  },

  /* Sign Out */
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.dangerLight,
    borderWidth: 1,
    borderColor: "#F9C0C4",
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.danger,
    letterSpacing: 0.2,
  },
});
