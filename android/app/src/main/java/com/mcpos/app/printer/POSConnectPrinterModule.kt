package com.mcpos.app.printer

import android.os.Handler
import android.os.Looper
import android.util.Log
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import net.posprinter.IConnectListener
import net.posprinter.IDeviceConnection
import net.posprinter.POSConnect
import net.posprinter.POSPrinter

class POSConnectPrinterModule(reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var deviceConnection: IDeviceConnection? = null
    private var printer: POSPrinter? = null
    private var isInitialized = false

    override fun getName(): String {
        return "POSConnectPrinter"
    }

    /**
     * SDK 초기화
     */
    @ReactMethod
    fun initialize(promise: Promise) {
        try {
            if (!isInitialized) {
                POSConnect.init(reactApplicationContext)
                isInitialized = true
                Log.d(TAG, "POSConnect SDK 초기화 성공")
            }
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "SDK 초기화 성공")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "SDK 초기화 실패", e)
            val result = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", "SDK 초기화 실패: ${e.message}")
            }
            promise.resolve(result)
        }
    }

    /**
     * USB 장치 목록 가져오기
     */
    @ReactMethod
    fun getUsbDevices(promise: Promise) {
        try {
            if (!isInitialized) {
                POSConnect.init(reactApplicationContext)
                isInitialized = true
            }

            val usbDevices = POSConnect.getUsbDevices(reactApplicationContext)
            val deviceArray = Arguments.createArray()

            usbDevices?.forEachIndexed { index, devicePath ->
                val deviceMap = Arguments.createMap().apply {
                    putString("devicePath", devicePath)
                    putString("deviceName", "USB Printer $index")
                    putInt("vendorId", 0)
                    putInt("productId", 0)
                }
                deviceArray.pushMap(deviceMap)
            }

            Log.d(TAG, "USB 장치 ${usbDevices?.size ?: 0}개 발견")
            promise.resolve(deviceArray)
        } catch (e: Exception) {
            Log.e(TAG, "USB 장치 목록 가져오기 실패", e)
            promise.resolve(Arguments.createArray())
        }
    }

    /**
     * USB 프린터 연결
     */
    @ReactMethod
    fun connectUSB(devicePath: String, promise: Promise) {
        try {
            if (!isInitialized) {
                POSConnect.init(reactApplicationContext)
                isInitialized = true
            }

            // 이전 연결 해제
            disconnect(null)

            // 새로운 연결 생성
            deviceConnection = POSConnect.createDevice(POSConnect.DEVICE_TYPE_USB)
            
            val mainHandler = Handler(Looper.getMainLooper())
            
            deviceConnection?.connect(devicePath, object : IConnectListener {
                override fun onStatus(code: Int, deviceInfo: String?, msg: String?) {
                    mainHandler.post {
                        val result = Arguments.createMap()
                        
                        when (code) {
                            POSConnect.CONNECT_SUCCESS -> {
                                printer = POSPrinter(deviceConnection)
                                result.putBoolean("success", true)
                                result.putString("message", "프린터 연결 성공")
                                Log.d(TAG, "프린터 연결 성공: $devicePath")
                                promise.resolve(result)
                            }
                            POSConnect.CONNECT_FAIL -> {
                                result.putBoolean("success", false)
                                result.putString("message", "프린터 연결 실패: $msg")
                                result.putString("errorCode", "CONNECT_FAIL")
                                Log.e(TAG, "프린터 연결 실패: $msg")
                                promise.resolve(result)
                            }
                            POSConnect.CONNECT_INTERRUPT -> {
                                result.putBoolean("success", false)
                                result.putString("message", "프린터 연결 중단: $msg")
                                result.putString("errorCode", "CONNECT_INTERRUPT")
                                Log.e(TAG, "프린터 연결 중단: $msg")
                                promise.resolve(result)
                            }
                            else -> {
                                // 기타 상태 (연결 진행 중 등)
                                Log.d(TAG, "프린터 상태: code=$code, deviceInfo=$deviceInfo, msg=$msg")
                            }
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "USB 연결 실패", e)
            val result = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", "USB 연결 중 오류 발생: ${e.message}")
                putString("errorCode", "EXCEPTION")
            }
            promise.resolve(result)
        }
    }

    /**
     * 프린터 연결 해제
     */
    @ReactMethod
    fun disconnect(promise: Promise?) {
        try {
            printer = null
            deviceConnection?.close()
            deviceConnection = null
            
            Log.d(TAG, "프린터 연결 해제")
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "프린터 연결 해제 성공")
            }
            promise?.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "프린터 연결 해제 실패", e)
            val result = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", "프린터 연결 해제 중 오류 발생: ${e.message}")
                putString("errorCode", "EXCEPTION")
            }
            promise?.resolve(result)
        }
    }

    /**
     * 텍스트 출력 (한글 지원)
     */
    @ReactMethod
    fun printText(text: String, promise: Promise) {
        try {
            if (printer == null) {
                val result = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("message", "프린터가 연결되지 않았습니다")
                    putString("errorCode", "NOT_CONNECTED")
                }
                promise.resolve(result)
                return
            }

            // 한글 출력을 위한 코드셋 설정
            try {
                // 방법 1: KSC5601 (한국어 표준) 시도
                printer?.setCharSet("KSC5601")
                Log.d(TAG, "한글 코드셋 설정: KSC5601")
            } catch (e: Exception) {
                try {
                    // 방법 2: 코드페이지 선택 시도
                    printer?.selectCodePage(255)
                    Log.d(TAG, "한글 코드페이지 설정: 255")
                } catch (e2: Exception) {
                    Log.w(TAG, "코드셋 설정 실패, 기본 설정으로 출력 시도", e2)
                }
            }

            // 텍스트 출력
            printer?.printString(text)
            
            Log.d(TAG, "텍스트 출력 완료")
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "텍스트 출력 성공")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "텍스트 출력 실패", e)
            val result = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", "텍스트 출력 중 오류 발생: ${e.message}")
                putString("errorCode", "PRINT_ERROR")
            }
            promise.resolve(result)
        }
    }

    /**
     * 용지 커팅
     */
    @ReactMethod
    fun cutPaper(promise: Promise) {
        try {
            if (printer == null) {
                val result = Arguments.createMap().apply {
                    putBoolean("success", false)
                    putString("message", "프린터가 연결되지 않았습니다")
                    putString("errorCode", "NOT_CONNECTED")
                }
                promise.resolve(result)
                return
            }

            printer?.cutPaper()
            
            Log.d(TAG, "용지 커팅 완료")
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "용지 커팅 성공")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e(TAG, "용지 커팅 실패", e)
            val result = Arguments.createMap().apply {
                putBoolean("success", false)
                putString("message", "용지 커팅 중 오류 발생: ${e.message}")
                putString("errorCode", "CUT_ERROR")
            }
            promise.resolve(result)
        }
    }

    /**
     * 연결 상태 확인
     */
    @ReactMethod
    fun isConnected(promise: Promise) {
        try {
            val connected = printer != null && deviceConnection != null
            promise.resolve(connected)
        } catch (e: Exception) {
            Log.e(TAG, "연결 상태 확인 실패", e)
            promise.resolve(false)
        }
    }

    companion object {
        private const val TAG = "POSConnectPrinter"
    }
}

