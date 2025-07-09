import React, { useState } from 'react';
import { View } from 'react-native';

import ChargeModal from '../../components/ChargeModal';
import HistoryModal from '../../components/HistoryModal';
import LedgerHeader from '../../components/ledger/LedgerHeader';
import LedgerTable from '../../components/ledger/LedgerTable';
import PageHeader from '../../components/ledger/PageHeader';
import { LedgerData } from '../../components/ledger/types';
import LedgerRegistrationModal from '../../components/LedgerRegistrationModal';

export default function LedgerManagement() {
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [showChargeModal, setShowChargeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<LedgerData | null>(
    null
  );

  // 샘플 장부 데이터 (퍼블리싱용 정적 데이터)
  const ledgerData: LedgerData[] = [
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
  ];

  // 단순화된 핸들러 함수들 (퍼블리싱용)
  const handleRegistrationConfirm = (data: any) => {
    console.log('장부 등록:', data);
    setShowRegistrationModal(false);
  };

  const handleChargeConfirm = (chargeData: any) => {
    console.log('충전:', chargeData);
    setShowChargeModal(false);
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

  const handleDelete = (item: LedgerData) => {
    console.log('삭제:', item);
  };

  const handleDeleteTransaction = (transactionId: string) => {
    console.log('거래 내역 삭제:', transactionId);
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
        onDelete={handleDelete}
      />

      {/* 장부 등록 모달 */}
      <LedgerRegistrationModal
        visible={showRegistrationModal}
        onClose={() => setShowRegistrationModal(false)}
        onConfirm={handleRegistrationConfirm}
      />

      {/* 장부 충전 모달 */}
      {selectedCustomer && (
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

      {/* 거래 내역 모달 */}
      {selectedCustomer && (
        <HistoryModal
          visible={showHistoryModal}
          onClose={() => {
            setShowHistoryModal(false);
            setSelectedCustomer(null);
          }}
          onDeleteTransaction={handleDeleteTransaction}
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
