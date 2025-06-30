import React, { useState } from 'react';
import { View } from 'react-native';
import LedgerRegistrationModal from '../../components/LedgerRegistrationModal';
import ChargeModal from '../../components/ChargeModal';
import EditModal from '../../components/EditModal';
import HistoryModal from '../../components/HistoryModal';
import PageHeader from '../../components/ledger/PageHeader';
import LedgerHeader from '../../components/ledger/LedgerHeader';
import LedgerTable from '../../components/ledger/LedgerTable';
import { LedgerData } from '../../components/ledger/types';

export default function LedgerManagement() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<LedgerData | null>(
    null
  );

  // 샘플 장부 데이터
  const [ledgerData, setLedgerData] = useState<LedgerData[]>([
    {
      id: 1,
      memberNumber: 'M001',
      name: '김철수',
      phoneNumber: '010-1234-5678',
      receptionist: '홍길동',
      chargeAmount: '50,000원',
      paymentMethod: '현금',
    },
    {
      id: 2,
      memberNumber: 'M002',
      name: '이영희',
      phoneNumber: '010-2345-6789',
      receptionist: '김직원',
      chargeAmount: '30,000원',
      paymentMethod: '카드',
    },
    {
      id: 3,
      memberNumber: 'M003',
      name: '박민수',
      phoneNumber: '010-3456-7890',
      receptionist: '홍길동',
      chargeAmount: '100,000원',
      paymentMethod: '계좌이체',
    },
    {
      id: 4,
      memberNumber: 'M004',
      name: '최지영',
      phoneNumber: '010-4567-8901',
      receptionist: '이사장',
      chargeAmount: '25,000원',
      paymentMethod: '카드',
    },
    {
      id: 5,
      memberNumber: 'M005',
      name: '정대한',
      phoneNumber: '010-5678-9012',
      receptionist: '김직원',
      chargeAmount: '75,000원',
      paymentMethod: '현금',
    },
  ]);

  // 모달 핸들러 함수들
  const handleRegistrationConfirm = (data: any) => {
    // 새로운 회원번호 생성
    const newMemberNumber = `M${String(ledgerData.length + 1).padStart(3, '0')}`;

    // 새로운 장부 데이터 생성
    const newLedgerData: LedgerData = {
      id: ledgerData.length + 1,
      memberNumber: newMemberNumber,
      name: data.name,
      phoneNumber: data.phoneNumber,
      receptionist: data.receptionist,
      chargeAmount: `${data.initialAmount}원`,
      paymentMethod: data.paymentMethod,
    };

    // 장부 데이터에 추가
    setLedgerData(prev => [...prev, newLedgerData]);
    setShowRegistrationModal(false);

    console.log('새 장부 등록:', newLedgerData);
  };

  // 충전 모달 핸들러
  const handleChargeConfirm = (chargeData: any) => {
    if (selectedCustomer) {
      // 기존 충전 금액에서 숫자만 추출
      const currentAmount = parseInt(
        selectedCustomer.chargeAmount.replace(/[^\d]/g, '')
      );
      // 새로운 충전 금액 추출
      const newChargeAmount = parseInt(
        chargeData.chargeAmount.replace(/[^\d]/g, '')
      );
      // 총 금액 계산
      const totalAmount = currentAmount + newChargeAmount;

      // 장부 데이터 업데이트
      setLedgerData(prev =>
        prev.map(item =>
          item.id === selectedCustomer.id
            ? { ...item, chargeAmount: `${totalAmount.toLocaleString()}원` }
            : item
        )
      );

      console.log('충전 완료:', {
        customer: selectedCustomer.name,
        chargeAmount: chargeData.chargeAmount,
        receptionist: chargeData.receptionist,
        paymentMethod: chargeData.paymentMethod,
        totalAmount: `${totalAmount.toLocaleString()}원`,
      });
    }

    setShowChargeModal(false);
    setSelectedCustomer(null);
  };

  // 수정 모달 핸들러
  const handleEditConfirm = (editData: any) => {
    if (selectedCustomer) {
      // 새로운 금액으로 업데이트
      const newAmount = parseInt(editData.newAmount.replace(/[^\d]/g, ''));

      // 장부 데이터 업데이트
      setLedgerData(prev =>
        prev.map(item =>
          item.id === selectedCustomer.id
            ? { ...item, chargeAmount: `${newAmount.toLocaleString()}원` }
            : item
        )
      );

      console.log('수정 완료:', {
        customer: selectedCustomer.name,
        newAmount: editData.newAmount,
        receptionist: editData.receptionist,
        paymentMethod: editData.paymentMethod,
        totalAmount: `${newAmount.toLocaleString()}원`,
      });
    }

    setShowEditModal(false);
    setSelectedCustomer(null);
  };

  // 버튼 핸들러 함수들
  const handleCharge = (item: LedgerData) => {
    setSelectedCustomer(item);
    setShowChargeModal(true);
  };

  const handleHistory = (item: LedgerData) => {
    setSelectedCustomer(item);
    setShowHistoryModal(true);
  };

  const handleEdit = (item: LedgerData) => {
    setSelectedCustomer(item);
    setShowEditModal(true);
  };

  const handleDelete = (item: any) => {
    console.log('삭제:', item);
  };

  return (
    <View className='h-full w-full bg-white flex flex-col box-border px-[5%]'>
      <PageHeader />

      <LedgerHeader
        onShowRegistrationModal={() => setShowRegistrationModal(true)}
      />

      <LedgerTable
        ledgerData={ledgerData}
        onCharge={handleCharge}
        onHistory={handleHistory}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* 장부 등록 모달 */}
      <LedgerRegistrationModal
        visible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onConfirm={handleRegistrationConfirm}
      />

      {/* 장부 충전 모달 */}
      {selectedCustomer && showChargeModal && (
        <ChargeModal
          visible={showChargeModal}
          onClose={() => {
            setShowChargeModal(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleChargeConfirm}
          customerInfo={{
            name: selectedCustomer.name,
            memberNumber: selectedCustomer.memberNumber,
            phoneNumber: selectedCustomer.phoneNumber,
          }}
        />
      )}

      {/* 장부 수정 모달 */}
      {selectedCustomer && showEditModal && (
        <EditModal
          visible={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedCustomer(null);
          }}
          onConfirm={handleEditConfirm}
          customerInfo={{
            name: selectedCustomer.name,
            memberNumber: selectedCustomer.memberNumber,
            phoneNumber: selectedCustomer.phoneNumber,
            currentAmount: selectedCustomer.chargeAmount,
          }}
        />
      )}

      {/* 거래 내역 모달 */}
      {selectedCustomer && showHistoryModal && (
        <HistoryModal
          visible={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedCustomer(null);
          }}
          customerInfo={{
            name: selectedCustomer.name,
            memberNumber: selectedCustomer.memberNumber,
            phoneNumber: selectedCustomer.phoneNumber,
          }}
        />
      )}
    </View>
  );
}
