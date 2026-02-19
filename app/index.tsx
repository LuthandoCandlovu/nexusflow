import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COLORS = {
  primary: "#4361EE",
  secondary: "#3A56D4",
  accent: "#4CC9F0",
  success: "#06D6A0",
  warning: "#FFB703",
  error: "#E63946",
  dark: "#1E1E2E",
  light: "#F8F9FF",
  gray: "#6C757D",
  lightGray: "#E9ECEF",
  background: "#FFFFFF",
};

export default function LoginScreen() {
  // ============ STATE MANAGEMENT ============
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ============ POPIA COMPLIANCE ============
  const [consentGiven, setConsentGiven] = useState(false);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  // ============ LOAD REMEMBERED USER ============
  useEffect(() => {
    loadRememberedUser();
  }, []);

  const loadRememberedUser = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem("nexusflow_email");
      const savedConsent = await AsyncStorage.getItem("nexusflow_consent");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
      if (savedConsent === "true") {
        setConsentGiven(true);
      }
    } catch (error) {
      console.log("Error loading saved data");
    }
  };

  // ============ EMAIL VALIDATION ============
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // ============ PASSWORD VALIDATION ============
  const validatePassword = (password: string): boolean => {
    return password.length >= 8;
  };

  // ============ PROFESSIONAL LOGIN HANDLER ============
  const handleLogin = async () => {
    // Reset errors
    setEmailError("");
    setPasswordError("");

    // Validate email
    if (!email) {
      setEmailError("Email is required");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError("Password is required");
      return;
    }
    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters");
      return;
    }

    // Check POPIA consent
    if (!consentGiven) {
      setShowConsentModal(true);
      return;
    }

    performLogin();
  };

  // ============ ACTUAL LOGIN FUNCTION ============
  const performLogin = async () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(async () => {
      setIsLoading(false);

      // Save credentials if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem("nexusflow_email", email);
        await AsyncStorage.setItem("nexusflow_consent", "true");
      }

      // Professional welcome message
      Alert.alert(
        "👋 Welcome to NexusFlow",
        "You have successfully signed in",
        [
          {
            text: "Continue",
            onPress: () => router.push("/dashboard"),
            style: "default",
          },
        ],
      );
    }, 1500);
  };

  // ============ POPIA CONSENT HANDLER ============
  const handleConsent = async (accepted: boolean) => {
    setShowConsentModal(false);
    if (accepted) {
      setConsentGiven(true);
      await AsyncStorage.setItem("nexusflow_consent", "true");
      performLogin();
    }
  };

  // ============ RENDER ============
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ============ NEXUSFLOW LOGO SECTION ============ */}
          <View style={styles.logoSection}>
            <View style={styles.logoContainer}>
              <View style={styles.logoOuterRing}>
                <View style={styles.logoInnerRing}>
                  <View style={styles.logoCircle}>
                    <Text style={styles.logoText}>N</Text>
                  </View>
                </View>
              </View>
            </View>
            <Text style={styles.appName}>NEXUSFLOW</Text>
            <View style={styles.badgeContainer}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>ENTERPRISE</Text>
              <View style={styles.badgeDot} />
            </View>
          </View>

          {/* ============ WELCOME SECTION ============ */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>Sign in to continue</Text>
          </View>

          {/* ============ FORM SECTION ============ */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Email</Text>
              <View
                style={[
                  styles.inputContainer,
                  emailError ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={emailError ? COLORS.error : COLORS.gray}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setEmail(text);
                    setEmailError("");
                  }}
                  value={email}
                  placeholder="name@company.com"
                  placeholderTextColor={COLORS.gray + "80"}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isLoading}
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={14}
                    color={COLORS.error}
                  />
                  <Text style={styles.errorText}>{emailError}</Text>
                </View>
              ) : null}
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>Password</Text>
              <View
                style={[
                  styles.inputContainer,
                  passwordError ? styles.inputError : null,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={passwordError ? COLORS.error : COLORS.gray}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => {
                    setPassword(text);
                    setPasswordError("");
                  }}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor={COLORS.gray + "80"}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={COLORS.gray}
                  />
                </TouchableOpacity>
              </View>
              {passwordError ? (
                <View style={styles.errorContainer}>
                  <Ionicons
                    name="alert-circle"
                    size={14}
                    color={COLORS.error}
                  />
                  <Text style={styles.errorText}>{passwordError}</Text>
                </View>
              ) : null}
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberContainer}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              >
                <View
                  style={[
                    styles.checkbox,
                    rememberMe && styles.checkboxChecked,
                  ]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.rememberText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Alert.alert(
                    "Reset Password",
                    "Enter your email address to receive a password reset link",
                  )
                }
                disabled={isLoading}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
              activeOpacity={0.9}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <View style={styles.buttonContent}>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </View>
              )}
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account? </Text>
              <TouchableOpacity
                onPress={() =>
                  Alert.alert("Sign Up", "Contact your administrator")
                }
              >
                <Text style={styles.signupLink}>Contact Admin</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ============ KHALIL DEVELOPER CREDIT ============ */}
          <View style={styles.footer}>
            <View style={styles.creditCard}>
              <Text style={styles.creditText}>Khalil Developer</Text>
              <Text style={styles.creditSubtext}>
                Clean and Neat UI in React Native
              </Text>
              <View style={styles.hashTags}>
                <View style={styles.hashTagContainer}>
                  <Text style={styles.hashTag}>#coding</Text>
                </View>
                <View style={styles.hashTagContainer}>
                  <Text style={styles.hashTag}>#programming</Text>
                </View>
                <View style={styles.hashTagContainer}>
                  <Text style={styles.hashTag}>#reactnative</Text>
                </View>
              </View>

              {/* ============ POPIA COMPLIANCE BADGE ============ */}
              <TouchableOpacity
                style={styles.popiaBadge}
                onPress={() => setShowPrivacyModal(true)}
              >
                <Ionicons
                  name="shield-checkmark"
                  size={16}
                  color={COLORS.primary}
                />
                <Text style={styles.popiaText}>POPIA Compliant</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* ============ POPIA CONSENT MODAL ============ */}
      <Modal
        visible={showConsentModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconContainer}>
                <Ionicons name="shield" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.modalTitle}>POPIA Compliance</Text>
              <Text style={styles.modalSubtitle}>
                Protection of Personal Information Act
              </Text>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                We value your privacy and are committed to protecting your
                personal information in accordance with the Protection of
                Personal Information Act (POPIA).
              </Text>

              <View style={styles.bulletPoints}>
                <View style={styles.bulletPoint}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={COLORS.success}
                  />
                  <Text style={styles.bulletText}>
                    We never share your data
                  </Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={COLORS.success}
                  />
                  <Text style={styles.bulletText}>256-bit encryption</Text>
                </View>
                <View style={styles.bulletPoint}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={COLORS.success}
                  />
                  <Text style={styles.bulletText}>
                    You can delete your data anytime
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.privacyLink}
                onPress={() => {
                  setShowConsentModal(false);
                  setShowPrivacyModal(true);
                }}
              >
                <Text style={styles.privacyLinkText}>Read Privacy Policy</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.declineButton]}
                onPress={() => handleConsent(false)}
              >
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.acceptButton]}
                onPress={() => handleConsent(true)}
              >
                <Text style={styles.acceptButtonText}>Accept & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ============ PRIVACY POLICY MODAL ============ */}
      <Modal
        visible={showPrivacyModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.privacyModal]}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPrivacyModal(false)}
              >
                <Ionicons name="close" size={24} color={COLORS.dark} />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
            </View>

            <ScrollView style={styles.privacyContent}>
              <Text style={styles.privacySectionTitle}>
                1. Information We Collect
              </Text>
              <Text style={styles.privacyText}>
                We collect only essential information: your email address and
                authentication credentials. This information is necessary to
                provide you with secure access to NexusFlow.
              </Text>

              <Text style={styles.privacySectionTitle}>
                2. How We Use Your Information
              </Text>
              <Text style={styles.privacyText}>
                • To authenticate your identity{"\n"}• To provide customer
                support{"\n"}• To improve our services{"\n"}• To comply with
                legal obligations
              </Text>

              <Text style={styles.privacySectionTitle}>3. Data Protection</Text>
              <Text style={styles.privacyText}>
                Your data is encrypted using industry-standard 256-bit AES
                encryption. We implement regular security audits and maintain
                SOC2 compliance.
              </Text>

              <Text style={styles.privacySectionTitle}>
                4. Your Rights (POPIA)
              </Text>
              <Text style={styles.privacyText}>
                • Right to access your data{"\n"}• Right to correct your data
                {"\n"}• Right to delete your data{"\n"}• Right to object to
                processing{"\n"}• Right to lodge a complaint
              </Text>

              <Text style={styles.privacySectionTitle}>
                5. Contact Information
              </Text>
              <Text style={styles.privacyText}>
                Information Officer:{"\n"}
                privacy@nexusflow.com{"\n"}
                +27 (0) 11 123 4567
              </Text>
            </ScrollView>

            <TouchableOpacity
              style={styles.gotItButton}
              onPress={() => setShowPrivacyModal(false)}
            >
              <Text style={styles.gotItButtonText}>Got it</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },

  // ============ LOGO STYLES ============
  logoSection: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoOuterRing: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
  },
  logoInnerRing: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: COLORS.primary + "25",
    justifyContent: "center",
    alignItems: "center",
  },
  logoCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily:
      Platform.OS === "ios" ? "HelveticaNeue-Bold" : "sans-serif-bold",
  },
  appName: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.dark,
    letterSpacing: 2,
    marginBottom: 12,
    fontFamily:
      Platform.OS === "ios" ? "HelveticaNeue-Bold" : "sans-serif-bold",
  },
  badgeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "10",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginHorizontal: 6,
  },
  badgeText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 1,
  },

  // ============ WELCOME STYLES ============
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 8,
    fontFamily:
      Platform.OS === "ios" ? "HelveticaNeue-Bold" : "sans-serif-bold",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: "400",
  },

  // ============ FORM STYLES ============
  formSection: {
    width: "100%",
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.dark,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.lightGray,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 56,
    backgroundColor: COLORS.light + "80",
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: COLORS.error + "08",
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
    color: COLORS.dark,
    fontWeight: "400",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginLeft: 6,
    fontWeight: "500",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  rememberText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: "500",
  },
  forgotText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 16,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  signupText: {
    fontSize: 14,
    color: COLORS.gray,
  },
  signupLink: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ============ FOOTER STYLES ============
  footer: {
    marginTop: 60,
  },
  creditCard: {
    backgroundColor: COLORS.light,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  creditText: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 4,
  },
  creditSubtext: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
  },
  hashTags: {
    flexDirection: "row",
    marginBottom: 16,
  },
  hashTagContainer: {
    backgroundColor: COLORS.primary + "10",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  hashTag: {
    fontSize: 12,
    color: COLORS.primary,
    fontWeight: "600",
  },
  popiaBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary + "08",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  popiaText: {
    fontSize: 13,
    color: COLORS.primary,
    fontWeight: "600",
    marginLeft: 8,
  },

  // ============ MODAL STYLES ============
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  privacyModal: {
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 24,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: COLORS.dark,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: "center",
  },
  modalBody: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 15,
    color: COLORS.dark,
    lineHeight: 22,
    marginBottom: 20,
    textAlign: "center",
  },
  bulletPoints: {
    marginBottom: 20,
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  bulletText: {
    fontSize: 14,
    color: COLORS.dark,
    marginLeft: 12,
  },
  privacyLink: {
    alignItems: "center",
  },
  privacyLinkText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  modalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  declineButton: {
    backgroundColor: COLORS.lightGray,
  },
  declineButtonText: {
    color: COLORS.gray,
    fontSize: 16,
    fontWeight: "600",
  },
  acceptButton: {
    backgroundColor: COLORS.primary,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  closeButton: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 8,
  },
  privacyContent: {
    marginBottom: 20,
  },
  privacySectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark,
    marginTop: 16,
    marginBottom: 8,
  },
  privacyText: {
    fontSize: 14,
    color: COLORS.gray,
    lineHeight: 20,
  },
  gotItButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 16,
  },
  gotItButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
