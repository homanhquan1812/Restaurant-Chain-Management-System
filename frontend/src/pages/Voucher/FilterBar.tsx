"use client"

import React, { useState } from "react"
import { Button } from "../../components/ui/button"
import { CustomDatePicker } from "../../components/CustomDatePicker/CustomDatePicker"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select"
import { ComboboxCustom } from "../../components/Combobox/Combobox"

const FilterBar: React.FC = () => {
  const [keyword, setKeyword] = useState("all")
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [status, setStatus] = useState("all")
  const [customerType, setCustomerType] = useState("all")
  const [customerEmployee, setCustomerEmployee] = useState("all")
  const [customerBranch, setCustomerBranch] = useState("all")

  return (
    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col sm:flex-row flex-wrap gap-4">
      {/* Keyword input */}
      <ComboboxCustom
        data={[]} // TODO: populate with keyword suggestions if needed
        value={keyword}
        onChange={setKeyword}
        placeholder="Search voucher..."
        className="w-full sm:flex-1 border border-neutral-300"
      />

      {/* Date picker */}
      <CustomDatePicker
        value={date}
        onChange={setDate}
        placeholder="Select created date"
      />

      {/* Responsible Branch */}
      <Select value={customerBranch} onValueChange={setCustomerBranch}>
        <SelectTrigger className="bg-white w-full sm:flex-1 border border-neutral-300">
          <SelectValue placeholder="--- All Brands ---" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">--- All Brands ---</SelectItem>
          {/* Dynamically populate branches here if needed */}
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="bg-white w-full sm:flex-1 border border-neutral-300">
          <SelectValue placeholder="--- All Status ---" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">--- All Status ---</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Expired">Expired</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
          <SelectItem value="Verify">Verify</SelectItem>
        </SelectContent>
      </Select>

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() =>
            console.log({
              keyword,
              date,
              status,
              customerType,
              customerEmployee,
              customerBranch,
            })
          }
        >
          Search
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => {
            setKeyword("all")
            setDate(undefined)
            setStatus("all")
            setCustomerType("all")
            setCustomerEmployee("all")
            setCustomerBranch("all")
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default FilterBar
// import React, { useState } from 'react';

// const FilterBar: React.FC = () => {
//   const [keyword, setKeyword] = useState('');
//   const [date, setDate] = useState('');
//   const [status, setStatus] = useState('');
//   const [voucherType, setVoucherType] = useState('');
//   const [discountType, setDiscountType] = useState('');
//   const [brand, setBrand] = useState('');

//   return (
//     <div className="bg-white p-4 rounded-lg shadow-md flex flex-wrap gap-x-4 gap-y-3">
//       {/* Keyword Input */}
//       <input
//         type="text"
//         placeholder="Keyword"
//         value={keyword}
//         onChange={(e) => setKeyword(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       />

//       {/* Date Picker */}
//       <input
//         type="date"
//         value={date}
//         onChange={(e) => setDate(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       />

//       {/* Voucher Type Dropdown */}
//       <select
//         value={voucherType}
//         onChange={(e) => setVoucherType(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       >
//         <option value="">--- All Voucher Types ---</option>
//         <option value="PROMOTION">PROMOTION</option>
//         <option value="COUPON">COUPON</option>
//       </select>

//       {/* Discount Type Dropdown */}
//       <select
//         value={discountType}
//         onChange={(e) => setDiscountType(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       >
//         <option value="">--- All Discount Types ---</option>
//         <option value="Percentage">Percentage</option>
//         <option value="Free Shipping">Free Shipping</option>
//         <option value="Fixed Amount">Fixed Amount</option>
//       </select>

//       {/* Brand Dropdown */}
//       <select
//         value={brand}
//         onChange={(e) => setBrand(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       >
//         <option value="">--- All Brands ---</option>
//       </select>

//       {/* Status Dropdown */}
//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//         className="border border-neutral-300 rounded-md px-3 py-2"
//       >
//         <option value="">--- All Status ---</option>
//         <option value="Active">Active</option>
//         <option value="Expire">Expire</option>
//         <option value="Inactive">Inactive</option>
//         <option value="Verify">Verify</option>
//       </select>

//       {/* Search & Reset Buttons */}
//       <div className="flex gap-2">
//         <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Search</button>
//         <button
//           className="border border-red-500 text-red-500 px-4 py-2 rounded-md"
//           onClick={() => {
//             setKeyword('');
//             setDate('');
//             setStatus('');
//             setVoucherType('');
//             setDiscountType('');
//             setBrand('');
//           }}
//         >
//           Reset
//         </button>
//       </div>
//     </div>
//   );
// };

// export default FilterBar;
