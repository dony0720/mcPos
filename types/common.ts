// 공통으로 사용되는 기본 타입들
export interface BaseItem {
  id: string;
  name: string;
  price: number;
}

// 수량 관련 인터페이스
export interface Quantifiable {
  quantity: number;
}

// 옵션 관련 인터페이스
export interface Optionable {
  options: string[];
}

// 시간 관련 인터페이스
export interface Timestampable {
  timestamp: Date;
}

// 상태 관련 타입
export type Status = 'pending' | 'completed' | 'cancelled' | 'failed';

// 모달 관련 인터페이스
export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}
