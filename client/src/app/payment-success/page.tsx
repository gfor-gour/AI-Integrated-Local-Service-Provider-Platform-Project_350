"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface Transaction {
  _id: string;
  price: number;
  userId: string;
  name: string;
  address: string;
  status: string;
}

const PaymentSuccess = () => {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const searchParams = useSearchParams();
  const tran_id = searchParams.get("tran_id");

  useEffect(() => {
    if (tran_id) {
      fetch(`${process.env.NEXT_PUBLIC_APP_BACKEND_URL}/api/transactions/${tran_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTransaction(data.transaction);
          }
        })
        .catch((err) => console.error("Fetch error:", err));
    }
  }, [tran_id]);

  const downloadPDF = () => {
    if (!transaction) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Payment Receipt", 80, 20);
    
    autoTable(doc, {
      startY: 30,
      head: [["Field", "Details"]],
      body: [
        ["Transaction ID", transaction._id],
        ["Name", transaction.name],
        ["Address", transaction.address],
        ["Amount", `BDT ${transaction.price}`],
        ["Status", transaction.status],
      ],
    });

    doc.save(`payment_receipt_${transaction._id}.pdf`);
  };

  if (!transaction) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-green-600">Payment Successful</h2>
        <p className="mt-2 text-gray-600">Thank you for your payment!</p>
        
        <div className="mt-4 border-t pt-4">
          <p><strong>Transaction ID:</strong> {transaction._id}</p>
          <p><strong>Name:</strong> {transaction.name}</p>
          <p><strong>Address:</strong> {transaction.address}</p>
          <p><strong>Amount:</strong> BDT {transaction.price}</p>
          <p><strong>Status:</strong> {transaction.status}</p>
        </div>

        <button
          onClick={downloadPDF}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
