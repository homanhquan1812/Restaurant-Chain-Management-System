import React, { useState } from "react"
import { Button } from "../../../components/ui/button"
import { CustomDatePicker } from "../../../components/CustomDatePicker/CustomDatePicker"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../components/ui/select"
import { ComboboxCustom } from "../../../components/Combobox/Combobox"

const FilterBarBlog: React.FC = () => {
  const [selectedKeyword, setSelectedKeyword] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [status, setStatus] = useState("")

  const keywordOptions = [
    { value: "coffee", label: "Coffee" },
    { value: "espresso", label: "Espresso" },
    { value: "latte", label: "Latte" },
    { value: "story", label: "Story" },
  ]

  const statusOptions = [
    { value: "all", label: "--- All Status ---" },
    { value: "Completed", label: "Completed" },
    { value: "Processing", label: "Processing" },
    { value: "Rejected", label: "Rejected" },
    { value: "On Hold", label: "On Hold" },
    { value: "In Transit", label: "In Transit" },
  ]

  return (
    <div className=" p-4 rounded-lg flex flex-col sm:flex-row flex-wrap gap-4">
      {/* Keyword Combobox */}
      <ComboboxCustom
        data={keywordOptions}
        value={selectedKeyword}
        onChange={setSelectedKeyword}
        placeholder="Search blog..."
        className="w-full sm:flex-1 border border-neutral-300 focus-visible:ring-1 focus-visible:ring-blue-500"
      />

      {/* Status Select */}
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="bg-white w-full sm:flex-1 border border-neutral-300 focus:ring-blue-500">
          <SelectValue placeholder="Select status..." />
        </SelectTrigger>
        <SelectContent>
          {statusOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value}>
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Date Picker */}
      <CustomDatePicker
        value={selectedDate}
        onChange={setSelectedDate}
        placeholder="Select post date"
      />

      {/* Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant="outline"
          className="bg-blue-500 text-white hover:bg-blue-600"
          onClick={() => {
            console.log({ selectedKeyword, status, selectedDate })
          }}
        >
          Search
        </Button>
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => {
            setSelectedKeyword("")
            setStatus("")
            setSelectedDate(undefined)
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

export default FilterBarBlog
