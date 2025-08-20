import React, { useEffect } from 'react';
import { View } from 'react-native';

import {
  AdminProtectedRoute,
  ChargeModal,
  DeleteConfirmModal,
  HistoryModal,
  LedgerHeader,
  LedgerRegistrationModal,
  LedgerTable,
  PageHeader,
  TransactionDeleteConfirmModal,
} from '../../components';
import { useLedgerStore } from '../../stores';
import { LedgerData } from '../../types';

/**
 * 장부 관리 페이지
 * - Zustand store를 사용한 상태 관리
 * - 장부 등록, 충전, 내역 조회, 삭제 기능
 */
export default function LedgerManagement() {
  // Zustand store에서 상태와 액션 가져오기
  const {
    // 상태
    ledgerData,
    isRegistrationModalVisible,
    isChargeModalVisible,
    isHistoryModalVisible,
    isDeleteConfirmModalVisible,
    isTransactionDeleteConfirmModalVisible,
    selectedCustomer,
    selectedLedgerForDelete,
    selectedTransactionForDelete,

    // 액션
    registerLedger,
    chargeLedger,
    deleteTransaction,
    deleteLedger,
    openRegistrationModal,
    closeRegistrationModal,
    openChargeModal,
    closeChargeModal,
    openHistoryModal,
    closeHistoryModal,
    openDeleteConfirmModal,
    closeDeleteConfirmModal,
    closeTransactionDeleteConfirmModal,
  } = useLedgerStore();

  // 장부 등록 핸들러
  const handleRegistrationConfirm = (data: any) => {
    registerLedger(data);
    closeRegistrationModal();
  };

  // 장부 충전 핸들러
  const handleChargeConfirm = (chargeData: any) => {
    if (selectedCustomer) {
      chargeLedger(selectedCustomer.memberNumber, chargeData);
      closeChargeModal();
    }
  };

  // 버튼 핸들러 함수들
  const handleCharge = (item: LedgerData) => {
    openChargeModal({
      name: item.name,
      memberNumber: item.memberNumber,
      phoneNumber: item.phoneNumber,
    });
  };

  const handleHistory = (item: LedgerData) => {
    openHistoryModal({
      name: item.name,
      memberNumber: item.memberNumber,
      phoneNumber: item.phoneNumber,
    });
  };

  const handleDelete = (item: LedgerData) => {
    openDeleteConfirmModal(item);
  };

  const handleConfirmDelete = () => {
    if (selectedLedgerForDelete) {
      deleteLedger(selectedLedgerForDelete.memberNumber);
    }
  };

  // 강제 리렌더링을 위한 상태
  const [forceUpdate, setForceUpdate] = React.useState(0);

  // ledgerData가 변경될 때마다 강제 리렌더링
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [ledgerData]);

  // Zustand store 구독
  useEffect(() => {
    const unsubscribe = useLedgerStore.subscribe(state => {
      setForceUpdate(prev => prev + 1);
    });

    return unsubscribe;
  }, []);

  const handleDeleteTransaction = (transactionId: string) => {
    if (selectedCustomer) {
      deleteTransaction(selectedCustomer.memberNumber, transactionId);
    }
  };

  const handleConfirmDeleteTransaction = () => {
    if (selectedCustomer && selectedTransactionForDelete) {
      deleteTransaction(
        selectedCustomer.memberNumber,
        selectedTransactionForDelete.id
      );
      closeTransactionDeleteConfirmModal();
    }
  };

  return (
    <AdminProtectedRoute>
      <View className='h-full w-full bg-white flex flex-col'>
        <View className='flex-1 max-w-7xl mx-auto w-full box-border px-[5%]'>
          <PageHeader />

          <LedgerHeader onShowRegistrationModal={openRegistrationModal} />

          <LedgerTable
            key={forceUpdate} // 강제 리렌더링을 위한 key
            ledgerData={ledgerData}
            onCharge={handleCharge}
            onHistory={handleHistory}
            onDelete={handleDelete}
          />

          {/* 장부 등록 모달 */}
          <LedgerRegistrationModal
            visible={isRegistrationModalVisible}
            onClose={closeRegistrationModal}
            onConfirm={handleRegistrationConfirm}
          />

          {/* 장부 충전 모달 */}
          {selectedCustomer && (
            <ChargeModal
              visible={isChargeModalVisible}
              onClose={closeChargeModal}
              onConfirm={handleChargeConfirm}
              customerInfo={selectedCustomer}
            />
          )}

          {/* 거래 내역 모달 */}
          {selectedCustomer && (
            <HistoryModal
              visible={isHistoryModalVisible}
              onClose={closeHistoryModal}
              onDeleteTransaction={handleDeleteTransaction}
              customerInfo={selectedCustomer}
            />
          )}

          {/* 삭제 확인 모달 */}
          <DeleteConfirmModal
            visible={isDeleteConfirmModalVisible}
            onClose={closeDeleteConfirmModal}
            onConfirm={handleConfirmDelete}
            item={selectedLedgerForDelete}
          />

          {/* 거래 내역 삭제 확인 모달 */}
          <TransactionDeleteConfirmModal
            visible={isTransactionDeleteConfirmModalVisible}
            onClose={closeTransactionDeleteConfirmModal}
            onConfirm={handleConfirmDeleteTransaction}
            transaction={selectedTransactionForDelete}
          />
        </View>
      </View>
    </AdminProtectedRoute>
  );
}
