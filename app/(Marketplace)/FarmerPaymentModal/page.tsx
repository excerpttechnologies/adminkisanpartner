"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FaRupeeSign, 
  FaCheckCircle, 
  FaUser, 
  FaCreditCard, 
  FaMoneyBillWave,
  FaMobileAlt,
  FaFileInvoice,
  FaInfoCircle,
  FaTimes,
  FaReceipt,
  FaCalculator,
  FaPercentage
} from 'react-icons/fa';
import { 
  MdOutlineAttachMoney,
  MdOutlineAccountBalance,
  MdOutlinePayment,
  MdOutlineDescription 
} from 'react-icons/md';
import { AiOutlineTransaction } from 'react-icons/ai';
import { BiMoney } from 'react-icons/bi';
import { FarmerPaymentModalData } from '../orders/page';
import toast from 'react-hot-toast';


interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
}

// Don't redeclare FarmerPaymentModalData here - import it from the main component

const AdminFarmerPaymentModal: React.FC = () => {
  const [modalData, setModalData] = useState<FarmerPaymentModalData | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('cash');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // const API_BASE = 'http://localhost:8080/api/admin';

  const API_BASE = 'https://kisan.etpl.ai/api/admin';

  const paymentMethods: PaymentMethod[] = [
    { 
      id: 'cash', 
      name: 'Cash', 
      icon: FaMoneyBillWave, 
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    { 
      id: 'bank_transfer', 
      name: 'Bank Transfer', 
      icon: MdOutlineAccountBalance, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    { 
      id: 'upi', 
      name: 'UPI', 
      icon: FaMobileAlt, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    { 
      id: 'cheque', 
      name: 'Cheque', 
      icon: FaFileInvoice, 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    },
    { 
      id: 'other', 
      name: 'Other', 
      icon: FaInfoCircle, 
      color: 'text-gray-600',
      bgColor: 'bg-gray-50 border-gray-200 hover:bg-gray-100'
    },
  ];

  useEffect(() => {
    window.openFarmerPaymentModal = (data: FarmerPaymentModalData) => {
      setModalData(data);
      setPaymentAmount(data.remainingAmount.toString());
      setPaymentMethod('cash');
      setPaymentReference('');
      setPaymentNotes('');
      setIsOpen(true);
    };

    return () => {
      delete window.openFarmerPaymentModal;
    };
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (!submitting) {
      setIsOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!modalData) return;

    const amount = parseFloat(paymentAmount);
    
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid payment amount');
      return;
    }

    if (amount > modalData.remainingAmount) {
      alert(`Payment amount cannot exceed remaining amount of ₹${modalData.remainingAmount.toLocaleString('en-IN')}`);
      return;
    }

    setSubmitting(true);

    try {
      const adminId = localStorage.getItem('adminId') || 'admin-001';
      const adminName = localStorage.getItem('userName') || 'Admin';

      const response = await fetch(
        `${API_BASE}/orders/${modalData.orderId}/farmer-payment`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount,
            paymentMethod,
            paymentReference,
            paymentNotes,
            paidBy: adminId,
            paidByName: adminName,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        // Show success notification
        toast.success('Payment recorded successfully!');
        
        // Close modal
        setIsOpen(false);

        // Reset form
        setPaymentAmount('');
        setPaymentMethod('cash');
        setPaymentReference('');
        setPaymentNotes('');

        // Callback to refresh order list
        if (modalData.onPaymentSuccess) {
          modalData.onPaymentSuccess();
        }
      } else {
        toast.error('Failed to record payment: ' + result.message);
      }
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const handleQuickAmount = (percentage: number) => {
    if (!modalData) return;
    const amount = (modalData.remainingAmount * percentage) / 100;
    setPaymentAmount(amount.toFixed(2));
  };

  if (!isOpen || !modalData) return null;

  const selectedMethod = paymentMethods.find(method => method.id === paymentMethod);
  const paymentAmountNum = parseFloat(paymentAmount) || 0;
  const newTotalPaid = modalData.paidAmount + paymentAmountNum;
  const newRemaining = modalData.remainingAmount - paymentAmountNum;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity duration-300" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="relative w-full max-w-2xl transform rounded-2xl bg-white shadow-2xl transition-all duration-300"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 rounded-t-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white/20 p-3 backdrop-blur-sm">
                    <FaReceipt className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Record Farmer Payment</h2>
                    <p className="text-emerald-100 text-sm mt-1">
                      Complete payment for order settlement
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="rounded-full p-2 hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  <FaTimes className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Order & Farmer Info Card */}
                <div className="rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <FaUser className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Order & Farmer Details</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Order ID</p>
                        <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg">
                          #{modalData.orderId}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Farmer Name</p>
                        <p className="font-medium text-gray-900 bg-gray-50 px-3 py-2 rounded-lg flex items-center gap-2">
                          <FaUser className="h-4 w-4 text-gray-400" />
                          {modalData.farmerName}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-blue-50 rounded-lg p-3">
                          <p className="text-xs text-blue-600 mb-1">Total Amount</p>
                          <p className="font-bold text-blue-700 flex items-center gap-1">
                            <FaRupeeSign className="h-4 w-4" />
                            {formatCurrency(modalData.totalAmount)}
                          </p>
                        </div>
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-xs text-green-600 mb-1">Already Paid</p>
                          <p className="font-bold text-green-700 flex items-center gap-1">
                            <FaRupeeSign className="h-4 w-4" />
                            {formatCurrency(modalData.paidAmount)}
                          </p>
                        </div>
                        <div className="bg-red-50 rounded-lg p-3 col-span-2">
                          <p className="text-xs text-red-600 mb-1">Remaining Balance</p>
                          <p className="font-bold text-red-700 flex items-center gap-1">
                            <FaRupeeSign className="h-4 w-4" />
                            {formatCurrency(modalData.remainingAmount)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Details Card */}
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="rounded-lg bg-blue-100 p-2">
                      <MdOutlinePayment className="h-5 w-5 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Payment Details</h3>
                  </div>

                  <div className="space-y-5">
                    {/* Payment Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Amount <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaRupeeSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          min="0.01"
                          step="0.01"
                          max={modalData.remainingAmount}
                          placeholder="Enter payment amount"
                          required
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Maximum: <span className="font-medium text-red-600">{formatCurrency(modalData.remainingAmount)}</span>
                      </p>

                      {/* Quick Amount Buttons */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 mb-2">Quick Amount:</p>
                        <div className="flex flex-wrap gap-2">
                          {[25, 50, 75, 100].map((percentage) => (
                            <button
                              key={percentage}
                              type="button"
                              onClick={() => handleQuickAmount(percentage)}
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                              <FaPercentage className="h-3 w-3" />
                              {percentage}%
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => setPaymentAmount(modalData.remainingAmount.toString())}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors"
                          >
                            <BiMoney className="h-3 w-3" />
                            Full Amount
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Payment Method <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentMethod(method.id)}
                            className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
                              paymentMethod === method.id
                                ? `${method.bgColor} border-${method.color.split('-')[1]}-500 ring-2 ring-${method.color.split('-')[1]}-500 ring-opacity-20`
                                : `${method.bgColor} border-transparent`
                            }`}
                          >
                            <method.icon className={`h-6 w-6 mb-2 ${method.color}`} />
                            <span className="text-xs font-medium text-gray-700">{method.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Payment Reference */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <AiOutlineTransaction className="h-4 w-4 text-gray-400" />
                          Payment Reference / Transaction ID
                        </div>
                      </label>
                      <input
                        type="text"
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        value={paymentReference}
                        onChange={(e) => setPaymentReference(e.target.value)}
                        placeholder="e.g., Cheque No., UPI Ref No., Transaction ID"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        Optional: Enter reference number for tracking purposes
                      </p>
                    </div>

                    {/* Payment Notes */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <div className="flex items-center gap-2">
                          <MdOutlineDescription className="h-4 w-4 text-gray-400" />
                          Payment Notes
                        </div>
                      </label>
                      <textarea
                        className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        rows={3}
                        value={paymentNotes}
                        onChange={(e) => setPaymentNotes(e.target.value)}
                        placeholder="Additional notes about this payment..."
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Summary Card */}
                <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="rounded-lg bg-emerald-100 p-2">
                      <FaCalculator className="h-5 w-5 text-emerald-600" />
                    </div>
                    <h3 className="font-semibold text-gray-800">Payment Summary</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">Current Paid Amount</p>
                        <p className="text-lg font-bold text-gray-800 flex items-center gap-2">
                          <FaRupeeSign className="h-4 w-4 text-gray-500" />
                          {formatCurrency(modalData.paidAmount)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 border border-gray-200">
                        <p className="text-sm text-gray-500 mb-2">This Payment</p>
                        <p className="text-lg font-bold text-emerald-700 flex items-center gap-2">
                          <FaRupeeSign className="h-4 w-4 text-emerald-500" />
                          + {formatCurrency(paymentAmountNum)}
                        </p>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-5 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-5 w-5" />
                          <span className="font-semibold">New Total Paid</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {formatCurrency(newTotalPaid)}
                        </p>
                      </div>
                      <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${(newTotalPaid / modalData.totalAmount) * 100}%` }}
                        />
                      </div>
                      <p className="text-sm text-emerald-100 mt-2 text-right">
                        {((newTotalPaid / modalData.totalAmount) * 100).toFixed(1)}% of total amount paid
                      </p>
                    </div>

                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">Remaining Balance</p>
                          <p className="text-lg font-bold text-red-600 flex items-center gap-2 mt-1">
                            <FaRupeeSign className="h-4 w-4" />
                            {formatCurrency(newRemaining)}
                          </p>
                        </div>
                        <div className={`px-4 py-2 rounded-lg ${
                          newRemaining === 0 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <p className="text-sm font-semibold">
                            {newRemaining === 0 ? 'Fully Paid' : 'Balance Due'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 rounded-b-2xl bg-gray-50 px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Payment will be recorded under your admin account
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      disabled={submitting}
                      className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting || paymentAmountNum <= 0}
                      className="px-6 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl hover:from-emerald-700 hover:to-green-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Recording Payment...
                        </>
                      ) : (
                        <>
                          <FaCheckCircle className="h-4 w-4" />
                          Record Payment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminFarmerPaymentModal;