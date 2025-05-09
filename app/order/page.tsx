'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ServiceOrderPage() {
  const [formData, setFormData] = useState({
    customerId: '',
    itemName: '',
    itemCondition: '',
    repairDetails: '',
    serviceDate: '',
    paymentMethodId: '',
    couponId: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Form berhasil disubmit! Lihat console untuk detail data.');
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Form Order Perbaikan Jasa</h1>
        <Link 
          href="/dashboard" 
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Kembali ke Dashboard
        </Link>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="mb-4">
            <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Barang
            </label>
            <input
              type="text"
              id="itemName"
              name="itemName"
              value={formData.itemName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan nama barang yang akan diperbaiki"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="itemCondition" className="block text-sm font-medium text-gray-700 mb-1">
              Kondisi Barang
            </label>
            <textarea
              id="itemCondition"
              name="itemCondition"
              value={formData.itemCondition}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Deskripsikan kondisi barang saat ini secara detail"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Jelaskan kerusakan atau masalah pada barang Anda</p>
          </div>

          <div className="mb-4">
            <label htmlFor="repairDetails" className="block text-sm font-medium text-gray-700 mb-1">
              Detail Perbaikan
            </label>
            <textarea
              id="repairDetails"
              name="repairDetails"
              value={formData.repairDetails}
              onChange={handleChange}
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Jelaskan layanan perbaikan yang Anda inginkan"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Sebutkan bagian apa yang perlu diperbaiki dan hasil yang diharapkan</p>
          </div>

          <div className="mb-4">
            <label htmlFor="serviceDate" className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Layanan
            </label>
            <input
              type="date"
              id="serviceDate"
              name="serviceDate"
              value={formData.serviceDate}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Pilih tanggal yang Anda inginkan untuk layanan perbaikan</p>
          </div>

          <div className="mb-4">
            <label htmlFor="paymentMethodId" className="block text-sm font-medium text-gray-700 mb-1">
              Metode Pembayaran
            </label>
            <select
              id="paymentMethodId"
              name="paymentMethodId"
              value={formData.paymentMethodId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Pilih Metode Pembayaran</option>
              <option value="123e4567-e89b-12d3-a456-426614174001">Transfer Bank</option>
              <option value="123e4567-e89b-12d3-a456-426614174002">Kartu Kredit/Debit</option>
              <option value="123e4567-e89b-12d3-a456-426614174003">E-Wallet</option>
              <option value="123e4567-e89b-12d3-a456-426614174004">Bayar di Tempat</option>
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="couponId" className="block text-sm font-medium text-gray-700 mb-1">
              Kode Kupon (Opsional)
            </label>
            <input
              type="text"
              id="couponId"
              name="couponId"
              value={formData.couponId}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Masukkan kode kupon jika ada"
            />
          </div>

          <div className="mb-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                  required
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="terms" className="font-medium text-gray-700">
                  Saya setuju dengan syarat dan ketentuan layanan
                </label>
                <p className="text-gray-500">Dengan mencentang kotak ini, Anda menyetujui syarat dan ketentuan kami.</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
              onClick={() => setFormData({
                customerId: '',
                itemName: '',
                itemCondition: '',
                repairDetails: '',
                serviceDate: '',
                paymentMethodId: '',
                couponId: '',
              })}
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Kirim Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}