# Прогрес на проекта: Brienz AI Guide

## ✅ Фаза 1: Setup и статичен гид (Завършена)
- [x] Инициализация на Monorepo структура (`apps/mobile`, `apps/functions`).
- [x] Настройка на **Expo Router** в мобилното приложение.
- [x] Инсталиране на основни библиотеки: `expo-location`, `expo-camera`, `expo-av`, `react-native-maps`, `@stripe/stripe-react-native`, `lucide-react-native`, `firebase`.
- [x] Създаване на таб навигация:
    - **Map** (placeholder за картата).
    - **Explore** (списък с обекти).
    - **Profile** (информация за потребителя).
- [x] Детайлна страница за обект (`app/spot/[id]`).
- [x] Статични данни за 10 локации в Бриенц (`constants/spots.ts`).
- [x] Setup на **Firebase Cloud Functions** (TypeScript).
- [x] Конфигурация на Firebase (`firebase.json`, `firestore.rules`).
- [x] Скрипт за първоначално попълване на данни (`scripts/seedSpots.ts`).
- [x] Добавяне на `.env.example` за лесна настройка на ключовете.

## 🚀 Предстоящи стъпки

### Фаза 2: GPS, карта и QR
- [ ] Имплементация на `useLocation` hook за GPS проследяване.
- [ ] Интеграция на `react-native-maps` с маркери за всички обекти.
- [ ] Създаване на `QRScanner` компонент.
- [ ] Логика за "Близки обекти" (Nearby spots).
- [ ] Настройка на Deep Linking.

### Фаза 3: Groq AI интеграция
- [ ] Разработка на Cloud Function `getSpotGuide` (Groq API + Firestore Cache).
- [ ] Hook `useSpotGuide` в приложението.
- [ ] TTS (Text-to-Speech) за аудио четене.

### Фаза 4: Stripe плащания
- [ ] Cloud Functions за Stripe (`createPayment`, `webhook`).
- [ ] Интеграция на Stripe Payment Sheet в приложението.
- [ ] Paywall логика (2 безплатни обекта, останалите платени).

---
*Последна актуализация: Април 2026*
