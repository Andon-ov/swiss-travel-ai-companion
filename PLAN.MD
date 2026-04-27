# Brienz AI Guide — Project Plan

> **Stack:** React Native (Expo) · Firebase · Groq API · Stripe  
> **MVP цел:** Работещ AI гид за Бриенц, Швейцария с QR кодове и freemium плащане  
> **Timeline:** 10 седмици

---

## Съдържание

1. [Продуктова визия](#1-продуктова-визия)
2. [Техническа архитектура](#2-техническа-архитектура)
3. [Структура на проекта](#3-структура-на-проекта)
4. [Firestore структура](#4-firestore-структура)
5. [Фаза 1 — Setup и статичен гид](#5-фаза-1--setup-и-статичен-гид-седмица-12)
6. [Фаза 2 — GPS, карта и QR](#6-фаза-2--gps-карта-и-qr-седмица-34)
7. [Фаза 3 — Groq AI интеграция](#7-фаза-3--groq-ai-интеграция-седмица-5)
8. [Фаза 4 — Stripe плащания](#8-фаза-4--stripe-плащания-седмица-67)
9. [Фаза 5 — Тест в реалния свят](#9-фаза-5--тест-в-реалния-свят-седмица-89)
10. [Фаза 6 — Анализ и разширение](#10-фаза-6--анализ-и-разширение-седмица-10)
11. [Бизнес модел](#11-бизнес-модел)
12. [Environment Variables](#12-environment-variables)
13. [Локации в Бриенц (MVP)](#13-локации-в-бриенц-mvp)

---

## 1. Продуктова визия

### Какво правим
AI-базиран местен гид за туристи в Бриенц, Швейцария. Туристът сканира QR код на интересно място → получава AI-генерирано описание на обекта на своя език + аудио четене.

### Потребителски flow
```
Турист вижда QR код на място
        ↓
Сканира с камера / QR apп
        ↓
Отваря се Deep Link: brienz-guide.com/spot/:spotId
        ↓
Апп се отваря (или браузър ако нямат апп)
        ↓
Показва се AI описание на обекта
        ↓
[Freemium] 2 места безплатно → останалите изискват плащане 1.99€
        ↓
Плащане → пълен достъп до всички места
```

### MVP обхват (v1.0)
- [x] Статичен списък от 10–15 локации в Бриенц
- [x] GPS засичане на близки обекти (радиус 50м)
- [x] QR скенер → директно отваряне на обект
- [x] AI описание на всеки обект (Groq · llama-3.1-8b-instant)
- [x] Аудио четене (TTS)
- [x] Freemium: 2 места безплатно, 1.99€ за всички
- [x] Stripe плащане
- [ ] Многоезичност (само English в MVP, после Chinese/Korean)

---

## 2. Техническа архитектура

```
┌─────────────────────────────────────────────┐
│           React Native (Expo)               │
│  GPS · QR Scanner · Maps · Audio · Stripe   │
└───────────────┬─────────────────────────────┘
                │ HTTPS
┌───────────────▼─────────────────────────────┐
│           Firebase Backend                  │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ │
│  │Firestore │ │Functions │ │    Auth     │ │
│  │spots     │ │getGuide  │ │  Anonymous  │ │
│  │users     │ │createPay │ │  + Google   │ │
│  │cache     │ │webhook   │ │             │ │
│  └──────────┘ └────┬─────┘ └─────────────┘ │
└───────────────────┼─────────────────────────┘
          ┌─────────┴──────────┐
          │                    │
┌─────────▼──────┐   ┌────────▼────────┐
│   Groq API     │   │   Stripe API    │
│ llama-3.1-8b   │   │ Payment Intents │
│ кеш: 24ч       │   │ Webhooks        │
└────────────────┘   └─────────────────┘
```

### Защо Firebase Functions (важно!)
API ключовете **никога** не трябва да са в мобилния апп — всеки може да ги извади от APK файла. Firebase Functions са сървърният слой, който пази тайните и проксира заявките.

---

## 3. Структура на проекта

```
BrienzGuide/
├── app/                          # Expo Router pages
│   ├── (tabs)/
│   │   ├── index.tsx             # Начален екран + карта
│   │   ├── explore.tsx           # Списък с обекти
│   │   └── profile.tsx           # Потребителски профил
│   ├── spot/
│   │   └── [id].tsx              # Детайлна страница на обект
│   └── _layout.tsx
├── components/
│   ├── SpotCard.tsx              # Карта за обект
│   ├── AudioPlayer.tsx           # TTS аудио плейър
│   ├── QRScanner.tsx             # QR скенер компонент
│   └── PaywallModal.tsx          # Freemium modal
├── hooks/
│   ├── useLocation.ts            # GPS локация
│   ├── useSpotGuide.ts           # Groq AI съдържание
│   ├── useNearbySpots.ts         # Близки обекти
│   └── usePremium.ts             # Premium статус
├── services/
│   ├── firebase.ts               # Firebase init
│   ├── firestore.ts              # Firestore заявки
│   └── stripe.ts                 # Stripe helper
├── constants/
│   ├── spots.ts                  # Статични данни за локациите
│   └── config.ts                 # App конфигурация
├── functions/                    # Firebase Cloud Functions
│   ├── src/
│   │   ├── index.ts              # Entry point
│   │   ├── groqProxy.ts          # Groq API proxy + кеш
│   │   ├── createPayment.ts      # Stripe Payment Intent
│   │   └── stripeWebhook.ts      # Stripe webhook handler
│   ├── package.json
│   └── tsconfig.json
├── assets/
├── app.json
├── package.json
└── .env                          # Никога не commit-вай!
```

---

## 4. Firestore структура

### Collection: `spots`
```typescript
// spots/{spotId}
interface Spot {
  id: string;                  // "brienz-lake", "holzschnitzerhaus"
  name: string;                // "Brienzersee Lake"
  nameDE: string;              // Немско название
  lat: number;                 // 46.7382
  lng: number;                 // 8.0342
  category: 'nature' | 'culture' | 'food' | 'viewpoint';
  shortDesc: string;           // 1–2 изречения за списъка
  imageUrl?: string;           // Firebase Storage URL
  isFree: boolean;             // true за 2-та безплатни обекта
  order: number;               // Наредба в списъка
}
```

### Collection: `users`
```typescript
// users/{userId}
interface User {
  isPremium: boolean;          // false по подразбиране
  unlockedAt?: number;         // timestamp на плащането
  language: string;            // "en", "zh", "ko"
  createdAt: number;
}
```

### Collection: `cache`
```typescript
// cache/{spotId}_{lang}
interface GuideCache {
  text: string;                // AI генериран текст
  lang: string;                // "en", "zh", "ko"
  createdAt: number;           // timestamp — изтича след 24ч
}
```

### Collection: `payments`
```typescript
// payments/{paymentIntentId}
interface Payment {
  userId: string;
  amount: number;              // 199 (центове)
  currency: string;            // "eur"
  status: string;              // "succeeded"
  createdAt: number;
}
```

---

## 5. Фаза 1 — Setup и статичен гид (Седмица 1–2)

### Задачи

#### 5.1 Expo проект
```bash
npx create-expo-app BrienzGuide --template expo-template-blank-typescript
cd BrienzGuide
npx expo install expo-location expo-camera expo-av expo-barcode-scanner
npm install react-native-maps @react-navigation/native
```

#### 5.2 Firebase setup
```bash
npm install firebase
firebase init          # избери: Firestore, Functions, Hosting
cd functions
npm install groq-sdk stripe
```

#### 5.3 Firebase конфигурация (`services/firebase.ts`)
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ... остнали config стойности
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

// Анонимен вход при стартиране
export const signInAnon = () => signInAnonymously(auth);
```

#### 5.4 Попълване на Firestore с данни за Бриенц
```bash
# Пусни скрипта за seed на данни
npx ts-node scripts/seedSpots.ts
```

Виж секция [13 — Локации в Бриенц](#13-локации-в-бриенц-mvp) за пълния списък с GPS координати.

#### 5.5 Статичен SpotCard компонент
Покажи списък с обекти от Firestore без AI все още. Цел: провери Firestore четене, навигация и базов UI.

### Критерий за готовност
- [ ] Expo апп се стартира без грешки
- [ ] Firebase се свързва успешно
- [ ] Списък с 10 локации се зарежда от Firestore
- [ ] Навигация към детайлна страница работи

---

## 6. Фаза 2 — GPS, карта и QR (Седмица 3–4)

### 6.1 GPS локация (`hooks/useLocation.ts`)
```typescript
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission denied');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return { location, error };
}
```

### 6.2 Близки обекти (`hooks/useNearbySpots.ts`)
```typescript
// Haversine формула за разстояние между две GPS точки
function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000; // метри
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

export function useNearbySpots(spots: Spot[], radiusMeters = 50) {
  const { location } = useLocation();
  if (!location) return [];
  
  return spots.filter(spot => 
    getDistance(
      location.coords.latitude, location.coords.longitude,
      spot.lat, spot.lng
    ) <= radiusMeters
  );
}
```

### 6.3 QR скенер (`components/QRScanner.tsx`)
```typescript
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const router = useRouter();

  const handleBarcode = ({ data }: { data: string }) => {
    // Очакван формат: https://brienz-guide.com/spot/brienz-lake
    const spotId = data.split('/spot/')[1];
    if (spotId) router.push(`/spot/${spotId}`);
  };

  if (!permission?.granted) {
    return <Button title="Allow Camera" onPress={requestPermission} />;
  }

  return (
    <CameraView
      style={{ flex: 1 }}
      onBarcodeScanned={handleBarcode}
      barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
    />
  );
}
```

### 6.4 Deep Linking (app.json)
```json
{
  "expo": {
    "scheme": "brienzguide",
    "web": { "bundler": "metro" },
    "plugins": [
      ["expo-router", {
        "origin": "https://brienz-guide.com"
      }]
    ]
  }
}
```

### Критерий за готовност
- [ ] GPS показва текущата локация на карта
- [ ] Маркери за всички обекти на картата
- [ ] QR скенер отваря правилния обект
- [ ] Deep link от браузър отваря апп-а

---

## 7. Фаза 3 — Groq AI интеграция (Седмица 5)

### 7.1 Groq proxy Function (`functions/src/groqProxy.ts`)
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import Groq from 'groq-sdk';

initializeApp();
const db = getFirestore();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 часа в ms

export const getSpotGuide = onRequest(
  { cors: true, secrets: ['GROQ_API_KEY'] },
  async (req, res) => {
    const { spotId, lang = 'en' } = req.body;

    if (!spotId) {
      res.status(400).json({ error: 'spotId is required' });
      return;
    }

    // 1. Провери кеша
    const cacheKey = `${spotId}_${lang}`;
    const cacheRef = db.doc(`cache/${cacheKey}`);
    const cached = await cacheRef.get();

    if (cached.exists) {
      const data = cached.data()!;
      const age = Date.now() - data.createdAt;
      if (age < CACHE_TTL) {
        res.json({ text: data.text, cached: true });
        return;
      }
    }

    // 2. Вземи данните за обекта
    const spotDoc = await db.doc(`spots/${spotId}`).get();
    if (!spotDoc.exists) {
      res.status(404).json({ error: 'Spot not found' });
      return;
    }
    const spot = spotDoc.data()!;

    // 3. Генерирай с Groq
    const langMap: Record<string, string> = {
      en: 'English',
      zh: 'Simplified Chinese',
      ko: 'Korean',
      ar: 'Arabic',
    };

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 350,
      messages: [{
        role: 'system',
        content: 'You are a friendly, knowledgeable tourist guide for Brienz, Switzerland. Be engaging, informative, and concise.'
      }, {
        role: 'user',
        content: `Write a tourist guide for "${spot.name}" in Brienz, Switzerland.
Language: ${langMap[lang] || 'English'}
Length: 150–180 words
Include: brief history, what to see/do, one interesting fact, practical tip.
Tone: warm and conversational.`
      }]
    });

    const text = completion.choices[0].message.content ?? '';

    // 4. Запази в кеша
    await cacheRef.set({ text, lang, createdAt: Date.now() });

    res.json({ text, cached: false });
  }
);
```

### 7.2 Hook в апп-а (`hooks/useSpotGuide.ts`)
```typescript
import { useState, useEffect } from 'react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

const getSpotGuide = httpsCallable(functions, 'getSpotGuide');

export function useSpotGuide(spotId: string, lang = 'en') {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spotId) return;
    setLoading(true);
    setError(null);

    getSpotGuide({ spotId, lang })
      .then(result => {
        const data = result.data as { text: string };
        setText(data.text);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [spotId, lang]);

  return { text, loading, error };
}
```

### 7.3 Deploy на Functions
```bash
# Задай env variables
firebase functions:secrets:set GROQ_API_KEY

# Deploy
firebase deploy --only functions

# Тест с curl
curl -X POST https://YOUR_REGION-YOUR_PROJECT.cloudfunctions.net/getSpotGuide \
  -H "Content-Type: application/json" \
  -d '{"spotId": "brienz-lake", "lang": "en"}'
```

### Критерий за готовност
- [ ] Function се deploy-ва без грешки
- [ ] AI текст се генерира за всеки обект
- [ ] Кешът работи (втора заявка е мигновена)
- [ ] Апп-ът показва AI текст на детайлната страница

---

## 8. Фаза 4 — Stripe плащания (Седмица 6–7)

### 8.1 createPayment Function (`functions/src/createPayment.ts`)
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

export const createPayment = onRequest(
  { cors: true, secrets: ['STRIPE_SECRET_KEY'] },
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({ error: 'userId is required' });
      return;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: 199,           // 1.99€ в центове
      currency: 'eur',
      automatic_payment_methods: { enabled: true },
      metadata: { userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  }
);
```

### 8.2 stripeWebhook Function (`functions/src/stripeWebhook.ts`)
```typescript
import { onRequest } from 'firebase-functions/v2/https';
import { getFirestore } from 'firebase-admin/firestore';
import Stripe from 'stripe';

export const stripeWebhook = onRequest(
  { cors: false, secrets: ['STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET'] },
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const sig = req.headers['stripe-signature'] as string;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      res.status(400).json({ error: 'Webhook signature failed' });
      return;
    }

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      const { userId } = paymentIntent.metadata;
      const db = getFirestore();

      // Отключи premium достъп
      await db.doc(`users/${userId}`).set({
        isPremium: true,
        unlockedAt: Date.now(),
      }, { merge: true });

      // Запази записа за плащането
      await db.collection('payments').add({
        userId,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        status: 'succeeded',
        createdAt: Date.now(),
      });
    }

    res.json({ received: true });
  }
);
```

### 8.3 Stripe в апп-а (`services/stripe.ts`)
```typescript
import { initStripe, useStripe } from '@stripe/stripe-react-native';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

const createPayment = httpsCallable(functions, 'createPayment');

export async function purchasePremium(userId: string) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  // 1. Вземи client secret от нашия backend
  const result = await createPayment({ userId });
  const { clientSecret } = result.data as { clientSecret: string };

  // 2. Инициализирай Stripe Payment Sheet
  const { error: initError } = await initPaymentSheet({
    paymentIntentClientSecret: clientSecret,
    merchantDisplayName: 'Brienz Guide',
  });
  if (initError) throw new Error(initError.message);

  // 3. Покажи Stripe UI
  const { error: payError } = await presentPaymentSheet();
  if (payError) throw new Error(payError.message);

  // Успех! Webhook ще обнови isPremium в Firestore
  return true;
}
```

### 8.4 usePremium hook (`hooks/usePremium.ts`)
```typescript
import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebase';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', user.uid),
      (doc) => {
        setIsPremium(doc.data()?.isPremium ?? false);
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  return { isPremium, loading };
}
```

### 8.5 Stripe setup стъпки
```bash
# 1. Инсталирай Stripe в апп-а
npm install @stripe/stripe-react-native

# 2. Задай env variables
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET

# 3. Тествай webhook локално
stripe login
stripe listen --forward-to http://127.0.0.1:5001/YOUR_PROJECT/us-central1/stripeWebhook

# 4. Deploy
firebase deploy --only functions
```

### Критерий за готовност
- [ ] Freemium: 2 обекта безплатно, останалите блокирани
- [ ] Stripe Payment Sheet се показва
- [ ] Тестово плащане с карта 4242 4242 4242 4242 работи
- [ ] isPremium се обновява в Firestore след плащане
- [ ] Потребителят вижда пълния достъп веднага

---

## 9. Фаза 5 — Тест в реалния свят (Седмица 8–9)

### 9.1 QR кодове за принтиране
```typescript
// scripts/generateQRCodes.ts
// Генерира PNG файлове за всеки обект

const spots = [
  { id: 'brienz-lake', name: 'Brienzersee Lake' },
  { id: 'wood-carving', name: 'Holzschnitzerei Museum' },
  // ... останалите
];

spots.forEach(spot => {
  const url = `https://brienz-guide.com/spot/${spot.id}`;
  // Използвай qrcode npm пакет
  // Запазва PNG файл с името на обекта
});
```

### 9.2 Изисквания за физическите QR стикери
- Материал: UV-resistant ламинат (weatherproof)
- Минимален размер: 8×8 cm за надеждно сканиране
- Формат: PNG с бяла рамка (quiet zone) минимум 4 модула
- Не поставяй директно на паметници — използвай информационни табели
- Поискай разрешение от Gemeinde Brienz преди поставяне

### 9.3 Метрики за следене
| Метрика | Как се измерва | Цел за MVP |
|---|---|---|
| QR сканирания | Firebase Analytics event | > 50 / седмица |
| Обекти разгледани | Firestore reads | > 3 на потребител |
| Conversion rate | Плащания / уникални потребители | > 5% |
| Най-популярен обект | Analytics pageview | Знаем кой работи |
| Грешки | Firebase Crashlytics | < 1% crash rate |

---

## 10. Фаза 6 — Анализ и разширение (Седмица 10)

### 10.1 Многоезичност (след MVP)
```typescript
// Добавяне на нов език е само промяна на prompt в Groq Function
const langMap: Record<string, string> = {
  en: 'English',
  zh: 'Simplified Chinese (Mandarin)',  // Приоритет 1
  ko: 'Korean',                          // Приоритет 2
  ar: 'Arabic',                          // Приоритет 3
};

// Автоматично засичане на езика на устройството
import * as Localization from 'expo-localization';
const deviceLang = Localization.getLocales()[0].languageCode;
```

### 10.2 Следваща итерация (v2.0)
- [ ] Китайски и корейски превод
- [ ] Affiliate интеграция (Booking.com, GetYourGuide)
- [ ] Разширение към Интерлакен и Грindelwald
- [ ] WeChat Mini Program за китайски пазар
- [ ] B2B предложение към Tourismus Brienz

---

## 11. Бизнес модел

### Tier 1 — MVP (Сега)
| | Безплатно | Premium (1.99€) |
|---|---|---|
| Обекти | 2 | Всички (10–15) |
| AI описания | ✓ | ✓ |
| Аудио | ✓ | ✓ |
| Езици | English | English |

### Tier 2 — Растеж (Фаза 2)
- Affiliate комисионни от хотели и турове (3–12%)
- B2B white-label за Tourismus Brienz

### Tier 3 — Мащаб (Фаза 3)
- Premium абонамент за цяла Швейцария (~9.99€/месец)
- Партньорства с туристически агенции от Азия

### Unit Economics (MVP оценка)
```
Ако 100 туристи сканират QR кодовете всяка седмица:
  Conversion 5% = 5 плащания × 1.99€ = ~9.95€/седмица
  Stripe такса (~0.30€ + 1.4%) ≈ -1.90€
  Groq API (некешируеми заявки) ≈ -0.50€
  Нетна печалба ≈ 7.55€/седмица

При 10% conversion и 500 посетители:
  = ~88€/седмица = ~380€/месец само от Бриенц
```
> **Цел:** Докажи модела в Бриенц, след което разшири към 10+ дестинации.

---

## 12. Environment Variables

### `.env` (никога не commit-вай в git!)
```env
# Firebase
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# Stripe (публичен ключ е ОК в апп-а)
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Firebase Secrets (за Functions — не в `.env`!)
```bash
firebase functions:secrets:set GROQ_API_KEY
firebase functions:secrets:set STRIPE_SECRET_KEY
firebase functions:secrets:set STRIPE_WEBHOOK_SECRET
```

### `.gitignore`
```
.env
.env.local
*.env
functions/.env
```

---

## 13. Локации в Бриенц (MVP)

| ID | Ime | Lat | Lng | Безплатно |
|---|---|---|---|---|
| `brienz-lake` | Brienzersee Lake | 46.7382 | 8.0342 | ✓ |
| `wood-carving-school` | Holzschnitzerschule Brienz | 46.7467 | 8.0380 | ✓ |
| `rothorn-railway` | Brienz Rothorn Bahn | 46.7453 | 8.0361 | — |
| `parish-church` | Reformed Parish Church | 46.7464 | 8.0356 | — |
| `boat-landing` | Brienz Boat Landing | 46.7378 | 8.0344 | — |
| `swiss-open-air-museum` | Ballenberg (near Brienz) | 46.7564 | 8.0619 | — |
| `brienz-waterfall` | Giessbachfälle | 46.7200 | 8.0100 | — |
| `main-street` | Hauptstrasse Holzschnitzerei | 46.7465 | 8.0358 | — |
| `train-station` | Brienz Bahnhof | 46.7459 | 8.0366 | — |
| `hotel-weisses-kreuz` | Historic Hotel Area | 46.7463 | 8.0352 | — |

> **Забележка:** GPS координатите са приблизителни — колегата в Бриенц трябва да ги потвърди на място преди поставяне на QR кодовете.

---

## Бързи команди (Reference)

```bash
# Стартирай апп-а
npx expo start

# Firebase emulators (локален тест)
firebase emulators:start

# Deploy само Functions
firebase deploy --only functions

# Deploy всичко
firebase deploy

# Stripe webhook тест (локален)
stripe listen --forward-to http://127.0.0.1:5001/PROJECT/us-central1/stripeWebhook

# Провери Firebase Functions logs
firebase functions:log
```

---

*Последна актуализация: Април 2026*  
*Версия: 1.0 MVP*