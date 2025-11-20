# Release Guide

This guide will help you build and release the Unfollower app.

## Prerequisites

1. **Install EAS CLI** (if not already installed):
   ```bash
   npm install -g eas-cli
   ```

2. **Login to Expo**:
   ```bash
   eas login
   ```

3. **Configure your project** (first time only):
   ```bash
   eas build:configure
   ```

## Building the App

### For Android (APK - for testing/sharing)

Build a preview APK that can be installed directly:
```bash
npm run build:preview
```

Or use EAS directly:
```bash
eas build --profile preview --platform android
```

### For Android (AAB - for Google Play Store)

Build a production AAB for Google Play Store:
```bash
npm run build:android
```

Or use EAS directly:
```bash
eas build --platform android --profile production
```

### For iOS (for App Store)

Build for iOS:
```bash
npm run build:ios
```

Or use EAS directly:
```bash
eas build --platform ios --profile production
```

### Build for Both Platforms

```bash
npm run build:all
```

## Submitting to Stores

### Google Play Store

1. Build the production AAB:
   ```bash
   npm run build:android
   ```

2. Submit to Google Play:
   ```bash
   npm run submit:android
   ```

   Or manually upload the AAB file from the build output.

### Apple App Store

1. Build the production iOS app:
   ```bash
   npm run build:ios
   ```

2. Submit to App Store:
   ```bash
   npm run submit:ios
   ```

## Build Profiles

- **preview**: Creates an APK for testing/sharing (Android only)
- **production**: Creates production builds for store submission

## Updating Version

Before building a new release:

1. Update version in `app.json`:
   ```json
   "version": "1.0.1"
   ```

2. For Android, increment `versionCode` in `app.json`:
   ```json
   "android": {
     "versionCode": 2
   }
   ```

3. For iOS, the version is automatically managed.

## Build Status

Check your build status at: https://expo.dev/accounts/[your-account]/projects/Unfollower/builds

## Troubleshooting

- If you get authentication errors, run `eas login` again
- If builds fail, check the build logs on expo.dev
- For Android keystore issues, EAS will automatically manage keys
- For iOS, you may need to set up certificates in Apple Developer account

## Local Development Build

To test the app locally:
```bash
npm start
```

Then scan the QR code with Expo Go app or run on emulator/simulator.

