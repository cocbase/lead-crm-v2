# 🚀 Quick Reference: Notification System

## How to Use in Your Code

### 1. Access Notification Functions
```typescript
import { useApp } from '../context/AppContext';

function MyComponent() {
  const { 
    notifications,              // Array of all notifications
    addNotification,            // Create new notification
    markNotificationRead,       // Mark single as read
    markAllNotificationsRead,   // Mark all as read
    clearNotification,          // Remove notification
    settings                    // User settings
  } = useApp();
}
```

### 2. Create a New Notification
```typescript
// Simple notification
addNotification({
  type: 'system',
  title: 'Update Complete',
  message: 'Your profile has been updated successfully'
});

// Notification with lead reference
addNotification({
  type: 'new_lead',
  title: 'New Lead Assigned',
  message: 'John Doe has been assigned to you',
  leadId: '123',
  leadName: 'John Doe'
});
```

### 3. Check Notification Preferences
```typescript
// Before creating a notification, check if enabled
if (settings.notifications.inApp.enabled) {
  addNotification({...});
}

// Check if sound is enabled
if (settings.notifications.inApp.sound) {
  // Sound will play automatically
}
```

### 4. Read Notification Data
```typescript
// Get unread count
const unreadCount = notifications.filter(n => !n.read).length;

// Get recent notifications
const recentNotifs = notifications.slice(0, 5);

// Find notification by ID
const notif = notifications.find(n => n.id === '123');
```

## Notification Type Reference

```typescript
type NotificationType = 
  | 'new_lead'             // Green icon, new lead assignment
  | 'follow_up_reminder'   // Blue icon, task reminder
  | 'lead_update'          // Orange icon, status change
  | 'system';              // Purple icon, system message
```

## Settings Keys

```typescript
settings.notifications.inApp.enabled  // Master toggle for in-app notifications
settings.notifications.inApp.sound    // Enable/disable notification sound
settings.notifications.email.*        // Email preferences (demo-only)
settings.notifications.push.*         // Push preferences (demo-only)
```

## localStorage Keys

- `leadcrm_notifications` → Notification history
- `leadcrm_settings` → User preferences
- `leadcrm_user` → Current user
- `leadcrm_leads` → Lead data
- `leadcrm_followups` → Follow-up data

## Common Patterns

### Pattern 1: Notify on Action
```typescript
const handleSave = () => {
  saveData();
  addNotification({
    type: 'system',
    title: 'Changes Saved',
    message: 'Your changes have been saved successfully'
  });
};
```

### Pattern 2: Notify with Lead Context
```typescript
const handleLeadUpdate = (lead) => {
  updateLead(lead.id, changes);
  addNotification({
    type: 'lead_update',
    title: 'Lead Updated',
    message: `${lead.name} status changed to ${lead.status}`,
    leadId: lead.id,
    leadName: lead.name
  });
};
```

### Pattern 3: Check Before Notifying
```typescript
const notifyIfEnabled = (notif) => {
  if (!settings.notifications.inApp.enabled) return;
  addNotification(notif);
};
```

## Customization

### Change Notification Sound
Edit `/src/app/context/AppContext.tsx` around line 380:
```typescript
oscillator.frequency.value = 800;  // Change pitch (Hz)
gainNode.gain.setValueAtTime(0.3, ...);  // Change volume (0-1)
```

### Disable Demo Notifications
Comment out lines ~295-330 in `/src/app/context/AppContext.tsx`

### Add New Notification Type
1. Add to type union in `Notification` interface
2. Add icon/color in `NotificationDropdown.tsx`
3. Use in your code: `addNotification({ type: 'my_new_type', ... })`

## Troubleshooting

### No notifications appearing?
- Check: `settings.notifications.inApp.enabled === true`
- Check: Browser console for errors
- Check: localStorage has `leadcrm_settings`

### No sound playing?
- Check: `settings.notifications.inApp.sound === true`
- Check: Browser allows audio (user interaction required)
- Try: Click something first (browsers block audio before interaction)

### Badge count wrong?
- The badge automatically updates based on `notifications.filter(n => !n.read).length`
- If wrong, check localStorage: `localStorage.getItem('leadcrm_notifications')`

### Notifications not persisting?
- Check: localStorage is enabled in browser
- Check: Not in incognito/private mode
- Check: localStorage size limit not exceeded

## Quick Test Commands (Browser Console)

```javascript
// Get current notifications
JSON.parse(localStorage.getItem('leadcrm_notifications'))

// Get settings
JSON.parse(localStorage.getItem('leadcrm_settings'))

// Clear all notifications
localStorage.removeItem('leadcrm_notifications')

// Reset settings to default
localStorage.removeItem('leadcrm_settings')

// Count unread
JSON.parse(localStorage.getItem('leadcrm_notifications')).filter(n => !n.read).length
```

## Performance Notes

- ✅ Notifications are stored in memory (fast)
- ✅ localStorage sync is async (non-blocking)
- ✅ Sound uses Web Audio API (efficient)
- ✅ Dropdown uses AnimatePresence (smooth)
- ✅ Auto-generation uses debouncing (500ms delay)

## Browser Compatibility

- ✅ Chrome/Edge (fully supported)
- ✅ Firefox (fully supported)
- ✅ Safari (fully supported)
- ✅ Mobile browsers (fully supported)
- ⚠️ Web Audio API may require user interaction on some browsers

---

Need more help? Check `/NOTIFICATION_SYSTEM.md` for complete documentation!
