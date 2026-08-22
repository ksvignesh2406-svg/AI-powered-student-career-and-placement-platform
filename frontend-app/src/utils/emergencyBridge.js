/* =====================================================
   CAMPUS EMERGENCY & SOS REAL-TIME INTER-TAB BRIDGE
   BroadcastChannel + Storage Event Synchronization
===================================================== */

const SOS_STORAGE_KEY = "campus_active_sos_event";
const ACK_STORAGE_KEY = "campus_sos_ack_event";
const CHANNEL_NAME = "campus_emergency_bridge_channel";

let channel = null;
try {
  if (typeof window !== "undefined" && window.BroadcastChannel) {
    channel = new BroadcastChannel(CHANNEL_NAME);
  }
} catch (e) {
  console.warn("BroadcastChannel initialization warning:", e);
}

/**
 * Publish Student SOS Distress Signal
 */
export function publishStudentSOS(sosData) {
  const eventPayload = {
    id: sosData.id || `SOS-${Date.now()}`,
    studentName: sosData.studentName || "Student",
    studentId: sosData.studentId || "26BCE1123",
    location: sosData.location || "Block B, Academic Area",
    timestamp: Date.now(),
    status: "ACTIVE",
  };

  try {
    window.localStorage.setItem(SOS_STORAGE_KEY, JSON.stringify(eventPayload));
    if (channel) {
      channel.postMessage({ type: "STUDENT_SOS_ACTIVATED", payload: eventPayload });
    }
  } catch (err) {
    console.error("Failed to broadcast SOS:", err);
  }

  return eventPayload;
}

/**
 * Cancel Student SOS Distress Signal
 */
export function cancelStudentSOS(sosId) {
  const eventPayload = {
    id: sosId,
    status: "CANCELLED",
    timestamp: Date.now(),
  };

  try {
    window.localStorage.removeItem(SOS_STORAGE_KEY);
    window.localStorage.removeItem(ACK_STORAGE_KEY);
    if (channel) {
      channel.postMessage({ type: "STUDENT_SOS_CANCELLED", payload: eventPayload });
    }
  } catch (err) {
    console.error("Failed to cancel SOS:", err);
  }
}

/**
 * Send Security Acknowledgement back to Student
 */
export function sendSecurityAcknowledgement(ackData) {
  const ackPayload = {
    sosId: ackData.sosId,
    officer: ackData.officer || "Officer Suresh Kumar (Unit Alpha)",
    eta: ackData.eta || "2 mins",
    message:
      ackData.message ||
      "Campus Security Command has acknowledged your distress signal. Patrol Unit Alpha is en route with an ETA of ~2 minutes. Please stay calm.",
    timestamp: Date.now(),
  };

  try {
    window.localStorage.setItem(ACK_STORAGE_KEY, JSON.stringify(ackPayload));
    if (channel) {
      channel.postMessage({ type: "SECURITY_ACK_TRIGGERED", payload: ackPayload });
    }
  } catch (err) {
    console.error("Failed to broadcast Security Acknowledgement:", err);
  }

  return ackPayload;
}

/**
 * Subscribe to real-time Emergency SOS & Acknowledgement events
 */
export function subscribeEmergencyEvents(onEvent) {
  const handleBroadcastMessage = (event) => {
    if (event.data && onEvent) {
      onEvent(event.data);
    }
  };

  const handleStorageEvent = (event) => {
    if (!event.newValue) return;
    try {
      if (event.key === SOS_STORAGE_KEY) {
        const payload = JSON.parse(event.newValue);
        if (payload.status === "ACTIVE") {
          onEvent?.({ type: "STUDENT_SOS_ACTIVATED", payload });
        } else if (payload.status === "CANCELLED") {
          onEvent?.({ type: "STUDENT_SOS_CANCELLED", payload });
        }
      } else if (event.key === ACK_STORAGE_KEY) {
        const payload = JSON.parse(event.newValue);
        onEvent?.({ type: "SECURITY_ACK_TRIGGERED", payload });
      }
    } catch (err) {
      console.warn("Storage event parse warning:", err);
    }
  };

  if (channel) {
    channel.addEventListener("message", handleBroadcastMessage);
  }
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    if (channel) {
      channel.removeEventListener("message", handleBroadcastMessage);
    }
    window.removeEventListener("storage", handleStorageEvent);
  };
}

/**
 * Read currently active SOS from storage if any
 */
export function getActiveSOSEvent() {
  try {
    const raw = window.localStorage.getItem(SOS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/**
 * Read current Acknowledgement from storage if any
 */
export function getActiveACKEvent() {
  try {
    const raw = window.localStorage.getItem(ACK_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

