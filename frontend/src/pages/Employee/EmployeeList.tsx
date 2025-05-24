import React, { useState, useEffect, useMemo } from "react"
import EmployeeCard from "./EmployeeCard"
import CustomPagination from "../../components/CustomPagination/CustomPagination"
import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchEmployees } from "../../redux/slices/employeeSlice"
import type { RootState } from "../../redux/store"
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select"
import { getAllBrands } from "../../services/brand.service"
import { getAllBranches } from "../../services/branch.service"
import type { Brand } from "../../services/brand.service"
import type { Branch } from "../../services/branch.service"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"

const EmployeeList: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const { items: rawEmployees, loading, error } = useAppSelector(
    (state: RootState) => state.employees
  )

  const [brands, setBrands] = useState<Brand[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [employeeBranch, setEmployeeBranch] = useState("all")
  const [employeeBrand, setEmployeeBrand] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const [brandData, branchData] = await Promise.all([
          getAllBrands(),
          getAllBranches(),
        ])
        setBrands(brandData)
        setBranches(branchData)
      } catch (error) {
        console.error("Failed to fetch brand or branch filters:", error)
      }
    }

    fetchFilters()
  }, [])

  useEffect(() => {
    dispatch(fetchEmployees())
  }, [dispatch])

  const employees = useMemo(
    () =>
      rawEmployees
        .filter(
          (e) =>
            (employeeBranch === "all" || e.branch_address === employeeBranch) &&
            (employeeBrand === "all" || e.brand_name === employeeBrand)
        )
        .map((e) => ({
          id: e.id,
          name: e.full_name,
          role: e.role,
          phone: e.phone,
          branch: e.branch_address,
          email: e.email,
          avatarUrl: e.avatar || null,
          brandLogo: e.logo_url || null,
        })),
    [rawEmployees, employeeBranch, employeeBrand]
  )

  const totalPages = Math.ceil(employees.length / itemsPerPage)
  const paginatedItems = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-4">
          {/* Header + Filter */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-800">
                {t("employee.title")}
              </h1>
              <button
                onClick={() => navigate("/employee/add")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm sm:text-base"
              >
                {t("employee.addEmployee")}
              </button>
            </div>

            <div className="flex flex-wrap gap-4">
              {/* BRAND Select */}
              <Select value={employeeBrand} onValueChange={setEmployeeBrand}>
                <SelectTrigger className="bg-white w-full sm:w-56 border border-neutral-300">
                  <SelectValue placeholder={t("employee.search.allBrands")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("employee.search.allBrands")}
                  </SelectItem>
                  {brands.map((b) => (
                    <SelectItem key={b.id} value={b.name}>
                      {b.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* BRANCH Select */}
              <Select value={employeeBranch} onValueChange={setEmployeeBranch}>
                <SelectTrigger className="bg-white w-full sm:w-56 border border-neutral-300">
                  <SelectValue placeholder={t("employee.search.allBranches")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    {t("employee.search.allBranches")}
                  </SelectItem>
                  {branches.map((br) => (
                    <SelectItem key={br.id} value={br.address}>
                      {br.address}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status */}
          {loading && <p className="text-sm">{t("common.loading")}</p>}
          {error && (
            <p className="text-sm text-red-500">{t("common.error")}</p>
          )}
          {!loading && employees.length === 0 && (
            <p className="text-sm text-gray-500">
              {t("employee.noEmployeesFound")}
            </p>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginatedItems.map((employee) => (
              <EmployeeCard key={employee.id} employee={employee} />
            ))}
          </div>

          {/* Pagination */}
          {employees.length > itemsPerPage && (
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={employees.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeList
