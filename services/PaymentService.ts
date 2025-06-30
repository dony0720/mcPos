// PaymentService.ts - SOLID 원칙을 적용한 결제 서비스

// 공통 타입 정의
export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  message?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface OrderDetails {
  items: OrderItem[];
  paymentMethod: string;
  orderMethod: string;
  uniqueNumber?: string;
  pickupNumber?: string;
  totalAmount: number;
}

export interface OrderItem {
  id: string;
  name: string;
  options: string;
  price: number;
  quantity: number;
}

// DIP: 추상화 정의 - 결제 서비스 인터페이스
export interface PaymentService {
  processPayment(orderDetails: OrderDetails): Promise<PaymentResult>;
  validatePaymentMethod(methodId: string): boolean;
  calculateTotal(items: OrderItem[]): number;
  requiresUniqueNumber(): boolean;
}

// DIP: 추상화 정의 - 주문 서비스 인터페이스
export interface OrderService {
  createOrder(orderDetails: OrderDetails): Promise<PaymentResult>;
  getOrderMethods(): Promise<PaymentMethod[]>;
}

// DIP: 추상화 정의 - 할인 서비스 인터페이스
export interface DiscountService {
  applyDiscount(amount: number, discountCode?: string): Promise<number>;
  validateDiscount(discountCode: string): Promise<boolean>;
}

// LSP: 모든 결제 서비스가 동일한 인터페이스 구현
export class CashPaymentService implements PaymentService {
  async processPayment(orderDetails: OrderDetails): Promise<PaymentResult> {
    console.log("현금 결제 처리:", orderDetails);
    return {
      success: true,
      transactionId: "CASH_" + Date.now(),
      message: "현금 결제가 완료되었습니다.",
    };
  }

  validatePaymentMethod(methodId: string): boolean {
    return ["cash", "transfer", "coupon"].includes(methodId);
  }

  calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  requiresUniqueNumber(): boolean {
    return false;
  }
}

export class LedgerPaymentService implements PaymentService {
  async processPayment(orderDetails: OrderDetails): Promise<PaymentResult> {
    if (!orderDetails.uniqueNumber) {
      return {
        success: false,
        message: "장부 결제를 위해 고유번호가 필요합니다.",
      };
    }

    console.log("장부 결제 처리:", orderDetails);
    return {
      success: true,
      transactionId: "LEDGER_" + Date.now(),
      message: "장부 결제가 완료되었습니다.",
    };
  }

  validatePaymentMethod(methodId: string): boolean {
    return methodId === "ledger";
  }

  calculateTotal(items: OrderItem[]): number {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  requiresUniqueNumber(): boolean {
    return true;
  }
}

export class DefaultOrderService implements OrderService {
  async createOrder(orderDetails: OrderDetails): Promise<PaymentResult> {
    console.log("주문 생성:", orderDetails);
    return {
      success: true,
      transactionId: "ORDER_" + Date.now(),
      message: "주문이 성공적으로 생성되었습니다.",
    };
  }

  async getOrderMethods(): Promise<PaymentMethod[]> {
    return [
      { id: "store", name: "매장", icon: "storefront-outline" },
      { id: "takeout", name: "포장", icon: "bag-outline" },
      { id: "delivery", name: "배달", icon: "bicycle-outline" },
    ];
  }
}

export class DefaultDiscountService implements DiscountService {
  async applyDiscount(amount: number, discountCode?: string): Promise<number> {
    if (discountCode === "DISCOUNT10") {
      return amount * 0.9; // 10% 할인
    }
    return amount;
  }

  async validateDiscount(discountCode: string): Promise<boolean> {
    return discountCode === "DISCOUNT10";
  }
}

// OCP: 결제 서비스 팩토리 (새 결제방법 추가 시 확장만 하면 됨)
export class PaymentServiceFactory {
  static create(paymentMethod: string): PaymentService {
    switch (paymentMethod) {
      case "ledger":
        return new LedgerPaymentService();
      case "cash":
      case "transfer":
      case "coupon":
      default:
        return new CashPaymentService();
    }
  }

  static getPaymentMethods(): PaymentMethod[] {
    return [
      { id: "cash", name: "현금", icon: "cash-outline" },
      { id: "transfer", name: "이체", icon: "card-outline" },
      { id: "coupon", name: "쿠폰", icon: "ticket-outline" },
      { id: "ledger", name: "장부", icon: "book-outline" },
    ];
  }
}
