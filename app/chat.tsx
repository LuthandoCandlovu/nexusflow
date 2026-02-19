import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Design Tokens ─────────────────────────────────────────────
const COLORS = {
  primary: "#4361EE",
  primaryLight: "#EEF1FD",
  primaryDark: "#2D47D0",
  surface: "#FFFFFF",
  background: "#F4F5F9",
  border: "#E8EAED",
  text: "#0D0F14",
  subtext: "#6B7280",
  muted: "#9CA3AF",
  online: "#22C55E",
  sent: "#4361EE",
  received: "#FFFFFF",
};

// ── Sample Messages ───────────────────────────────────────────
type Message = {
  id: string;
  text: string;
  sender: "me" | "other";
  time: string;
  name?: string;
};

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    sender: "other",
    name: "Sarah K.",
    text: "Hey team! The design review is set for 3pm today.",
    time: "9:01 AM",
  },
  {
    id: "2",
    sender: "me",
    text: "Perfect, I'll have the mockups ready by then.",
    time: "9:03 AM",
  },
  {
    id: "3",
    sender: "other",
    name: "James R.",
    text: "Should we loop in the client as well?",
    time: "9:05 AM",
  },
  {
    id: "4",
    sender: "me",
    text: "Good idea — I'll send them the invite now.",
    time: "9:07 AM",
  },
  {
    id: "5",
    sender: "other",
    name: "Sarah K.",
    text: "Great, see everyone at 3! 🚀",
    time: "9:08 AM",
  },
];

// ── Avatar initials ───────────────────────────────────────────
const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

// ── Message Bubble ────────────────────────────────────────────
function MessageBubble({ item }: { item: Message }) {
  const isMe = item.sender === "me";
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 9,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.bubbleRow,
        isMe ? styles.bubbleRowMe : styles.bubbleRowOther,
        {
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0],
              }),
            },
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
        },
      ]}
    >
      {/* Other avatar */}
      {!isMe && (
        <View style={styles.bubbleAvatar}>
          <Text style={styles.bubbleAvatarText}>
            {item.name ? getInitials(item.name) : "?"}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.bubbleWrap,
          isMe ? styles.bubbleWrapMe : styles.bubbleWrapOther,
        ]}
      >
        {!isMe && item.name && (
          <Text style={styles.bubbleSender}>{item.name}</Text>
        )}
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther]}
        >
          <Text style={[styles.bubbleText, isMe && styles.bubbleTextMe]}>
            {item.text}
          </Text>
        </View>
        <Text style={[styles.bubbleTime, isMe && styles.bubbleTimeMe]}>
          {item.time}
        </Text>
      </View>
    </Animated.View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const flatRef = useRef<FlatList>(null);

  const headerAnim = useRef(new Animated.Value(0)).current;
  const inputAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(headerAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
      Animated.spring(inputAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 60,
        friction: 8,
      }),
    ]).start();
  }, []);

  const sendMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: trimmed,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.surface} />

      {/* ── Header ── */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerAnim,
            transform: [
              {
                translateY: headerAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-16, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={COLORS.text} />
        </TouchableOpacity>

        {/* Title & status */}
        <View style={styles.headerCenter}>
          <View style={styles.headerAvatarGroup}>
            {["SK", "JR"].map((initials, i) => (
              <View
                key={initials}
                style={[
                  styles.headerAvatar,
                  { marginLeft: i === 0 ? 0 : -10, zIndex: 2 - i },
                ]}
              >
                <Text style={styles.headerAvatarText}>{initials}</Text>
              </View>
            ))}
          </View>
          <View>
            <Text style={styles.headerTitle}>Team Chat</Text>
            <View style={styles.onlineRow}>
              <View style={styles.onlineDot} />
              <Text style={styles.onlineText}>3 members online</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.text} />
        </TouchableOpacity>
      </Animated.View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={flatRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <MessageBubble item={item} />}
          contentContainerStyle={styles.messageList}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            flatRef.current?.scrollToEnd({ animated: false })
          }
        />

        {/* ── Input Bar ── */}
        <Animated.View
          style={[
            styles.inputBar,
            {
              opacity: inputAnim,
              transform: [
                {
                  translateY: inputAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [20, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
            <Ionicons name="add" size={22} color={COLORS.subtext} />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message…"
            placeholderTextColor={COLORS.muted}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
            multiline
          />

          <TouchableOpacity
            style={[
              styles.sendBtn,
              input.trim() ? styles.sendBtnActive : styles.sendBtnInactive,
            ]}
            onPress={sendMessage}
            activeOpacity={0.8}
          >
            <Ionicons
              name="send"
              size={16}
              color={input.trim() ? "#fff" : COLORS.muted}
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ── Styles ─────────────────────────────────────────────────────
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  headerAvatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  headerAvatarText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#fff",
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  onlineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.online,
  },
  onlineText: {
    fontSize: 11,
    color: COLORS.online,
    fontWeight: "600",
  },

  /* Message list */
  messageList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  bubbleRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
  },
  bubbleRowMe: {
    justifyContent: "flex-end",
  },
  bubbleRowOther: {
    justifyContent: "flex-start",
  },
  bubbleAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primaryDark,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  bubbleAvatarText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  bubbleWrap: {
    maxWidth: "72%",
  },
  bubbleWrapMe: {
    alignItems: "flex-end",
  },
  bubbleWrapOther: {
    alignItems: "flex-start",
  },
  bubbleSender: {
    fontSize: 11,
    fontWeight: "700",
    color: COLORS.primary,
    marginBottom: 3,
    marginLeft: 4,
    letterSpacing: 0.2,
  },
  bubble: {
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleMe: {
    backgroundColor: COLORS.sent,
    borderBottomRightRadius: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  bubbleOther: {
    backgroundColor: COLORS.received,
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  bubbleText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 21,
  },
  bubbleTextMe: {
    color: "#fff",
  },
  bubbleTime: {
    fontSize: 10,
    color: COLORS.muted,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: "500",
  },
  bubbleTimeMe: {
    marginLeft: 0,
    marginRight: 4,
    color: COLORS.subtext,
  },

  /* Input bar */
  inputBar: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: COLORS.surface,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  attachBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.background,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minHeight: 38,
    maxHeight: 100,
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
    fontSize: 15,
    color: COLORS.text,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  sendBtnActive: {
    backgroundColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  sendBtnInactive: {
    backgroundColor: COLORS.background,
  },
});
