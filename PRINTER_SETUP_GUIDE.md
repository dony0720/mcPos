# Sewoo SLK-TS100 프린터 설정 가이드

## 📋 개요

이 가이드는 Sewoo SLK-TS100 열전사 프린터를 React Native (Expo) 앱에서 USB OTG로 연결하여 사용하는 방법을 설명합니다.

## 🔧 하드웨어 요구사항

- **프린터**: Sewoo SLK-TS100 (3인치 열전사 프린터)
- **연결 방식**: USB B타입 → USB-A 또는 USB-C (기기에 따라)
- **Android 기기**: USB OTG 지원 필수
- **케이블**: USB OTG 어댑터 + USB-A to USB-B 케이블

## 📱 소프트웨어 구조

### 생성된 파일들

```
📁 types/
  └── printer.ts              # 프린터 관련 타입 정의

📁 utils/
  ├── printerService.ts       # 프린터 서비스 팩토리 함수
  └── SewooThermalPrinter.ts  # Sewoo 프린터 구현체

📁 hooks/
  └── usePrinter.ts          # 프린터 커스텀 훅

📁 app/(tabs)/
  └── history.tsx            # 업데이트된 거래내역 페이지 (프린터 기능 포함)

📁 설정 파일들/
  ├── app.json               # Expo 설정 (USB 권한 포함)
  └── android_usb_device_filter.xml  # USB 디바이스 필터 (참고용)
```

## 🚀 설치 및 설정

### 1. 필요한 라이브러리 설치

현재 구현된 프린터 서비스는 실제 USB 통신 라이브러리 없이 인터페이스만 구현되어 있습니다. 
실제 USB 통신을 위해서는 다음 중 하나의 라이브러리를 설치해야 합니다:

**옵션 A: React Native USB Serial (권장)**
```bash
npm install react-native-usb-serialport
# Expo managed workflow인 경우
expo install expo-dev-client
expo run:android  # development build 필요
```

**옵션 B: React Native Thermal Printer**
```bash
npm install react-native-thermal-receipt-printer
```

**옵션 C: 커스텀 네이티브 모듈 (고급)**
- Android Native Module을 직접 작성
- Java/Kotlin으로 USB Host API 사용

### 2. Expo 설정 확인

`app.json` 파일에 USB 권한이 추가되었는지 확인:

```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.USB_PERMISSION",
        "android.hardware.usb.host"
      ],
      "intentFilters": [
        {
          "action": "android.hardware.usb.action.USB_DEVICE_ATTACHED"
        }
      ]
    }
  }
}
```

### 3. 프린터 정보 확인

실제 프린터 연결 전에 다음 정보를 확인해야 합니다:

```bash
# Android 기기에 프린터 연결 후
adb shell
lsusb
# 또는
cat /proc/bus/usb/devices
```

확인해야 할 정보:
- **Vendor ID**: Sewoo Technology의 USB Vendor ID
- **Product ID**: SLK-TS100의 Product ID

확인된 정보로 다음 파일들을 업데이트:
- `utils/SewooThermalPrinter.ts` (생성자의 vendorId, productId)
- `utils/printerService.ts` (DEFAULT_PRINTER_CONFIG)

### 4. 실제 USB 통신 구현

현재 `SewooThermalPrinter.ts`에서 다음 메서드들은 실제 구현이 필요합니다:

```typescript
// TODO: 실제 구현 필요한 메서드들
private async requestUSBPermission(): Promise<boolean>
private async findPrinterDevice(): Promise<any>
private async sendRawData(data: string): Promise<void>
```

선택한 USB 라이브러리에 맞게 이 메서드들을 구현해야 합니다.

## 🔌 사용법

### 기본 사용법

```typescript
import { usePrinter } from '../hooks';

export default function MyComponent() {
  const {
    connectPrinter,
    printOrderReceipt,
    printCashInspection,
    isPrinterConnected,
    isPrinting,
    lastError,
  } = usePrinter();

  const handlePrint = async () => {
    if (!isPrinterConnected) {
      await connectPrinter();
    }
    
    const receiptData = {
      header: {
        storeName: 'MC POS',
        title: '테스트 영수증',
        dateTime: new Date().toLocaleString('ko-KR'),
      },
      orderItems: [
        {
          name: '아메리카노',
          quantity: 1,
          unitPrice: 3000,
          totalPrice: 3000,
        },
      ],
      summary: {
        totalAmount: 3000,
        subtotal: 3000,
        discountAmount: 0,
        finalAmount: 3000,
      },
    };

    await printOrderReceipt(receiptData);
  };

  return (
    <View>
      <Text>프린터 상태: {isPrinterConnected ? '연결됨' : '연결 안됨'}</Text>
      {isPrinting && <Text>출력 중...</Text>}
      {lastError && <Text>오류: {lastError}</Text>}
      <Button title="테스트 출력" onPress={handlePrint} />
    </View>
  );
}
```

### 거래내역에서 사용 (이미 구현됨)

`app/(tabs)/history.tsx`에서 영수증 출력 기능이 구현되어 있습니다:
- 주문 거래: 주문 영수증 출력
- 입출금 거래: 현금 점검 영수증 출력

## 🧪 테스트 방법

### 1. 연결 테스트

```typescript
import { createPrinterService, PrinterUtils } from '../utils';

const testConnection = async () => {
  const printer = createPrinterService();
  const isWorking = await PrinterUtils.testConnection(printer);
  console.log('프린터 연결 테스트:', isWorking);
};
```

### 2. 단계별 테스트

1. **USB OTG 연결 확인**: 프린터가 Android 기기에서 인식되는지
2. **권한 확인**: USB 권한이 정상적으로 요청되는지
3. **기기 찾기**: 프린터 기기를 코드에서 찾을 수 있는지
4. **명령어 전송**: ESC/POS 명령어가 정상 전송되는지
5. **실제 출력**: 프린터에서 영수증이 출력되는지

## ⚠️ 주의사항

### Expo Managed vs Bare Workflow

현재 프로젝트는 Expo Managed workflow를 사용 중입니다. USB 라이브러리 사용을 위해서는:

1. **Expo Dev Client 사용**: Custom native code 지원
2. **Bare Workflow로 전환**: `expo eject` 또는 `expo prebuild`
3. **EAS Build 사용**: 클라우드에서 custom native code 빌드

### 프린터 호환성

- Sewoo SLK-TS100은 ESC/POS 명령어를 지원합니다
- 다른 ESC/POS 프린터도 대부분 호환됩니다
- Vendor ID/Product ID만 변경하면 다른 모델도 사용 가능

### 성능 고려사항

- 큰 영수증 출력 시 메모리 사용량 주의
- 연속 출력 시 프린터 과열 방지를 위한 딜레이 필요
- 용지 부족, 프린터 오프라인 등의 상태 처리 필요

## 📞 문제 해결

### 자주 발생하는 문제

1. **"프린터가 연결되지 않았습니다"**
   - USB OTG 케이블 확인
   - 프린터 전원 확인
   - Android 기기의 USB OTG 지원 확인

2. **"USB 권한이 거부되었습니다"**
   - app.json의 권한 설정 확인
   - 앱 재설치 후 권한 재요청

3. **"프린터를 찾을 수 없습니다"**
   - Vendor ID, Product ID 확인
   - lsusb 명령어로 실제 값 확인

4. **"출력되지 않습니다"**
   - ESC/POS 명령어 형식 확인
   - 프린터 용지 및 상태 확인
   - 프린터 드라이버 이슈 확인

### 디버깅 방법

```typescript
// 프린터 상태 확인
const { getPrinterStatus } = usePrinter();
const status = await getPrinterStatus();
console.log('프린터 상태:', status);

// 원시 명령어 로그 확인
console.log('전송할 ESC/POS 명령어:', commands);
```

## 🔄 다음 단계

구현이 완료되면:

1. **실제 USB 라이브러리 연동**
2. **Vendor ID/Product ID 확인 및 수정**
3. **실제 프린터로 테스트**
4. **에러 처리 개선**
5. **다른 프린터 모델 지원 추가**

---

**📝 참고**: 이 구현은 SOLID 원칙을 준수하여 설계되었습니다. 새로운 프린터 모델 추가나 기능 확장이 용이합니다.