import React from 'react';
import { View } from 'react-native';

import {
  ChargeModal,
  DeleteConfirmModal,
  HistoryModal,
  LedgerHeader,
  LedgerRegistrationModal,
  LedgerTable,
  PageHeader,
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
    selectedCustomer,
    selectedLedgerForDelete,

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

  const handleDeleteTransaction = (transactionId: string) => {
    if (selectedCustomer) {
      deleteTransaction(selectedCustomer.memberNumber, transactionId);
    }
  };

  return (
    <View className='h-full w-full bg-white flex flex-col box-border px-[5%]'>
      <PageHeader />

      <LedgerHeader onShowRegistrationModal={openRegistrationModal} />

      <LedgerTable
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
    </View>
  );
}
