import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { fetchOrderById, editOrder } from "../../redux/slices/orderSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchBranches } from "../../redux/slices/branchSlice";
import { useLoading } from "../../contexts/LoadingContext";
import type { RootState } from "../../redux/store";
import type { OrderUpdateRequest } from "../../services/order.service";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../components/ui/select";
import { toast } from "react-toastify";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  total_price: number;
}

const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setLoading } = useLoading();
  const { t } = useTranslation();

  const { selectedOrder } = useAppSelector((state: RootState) => state.orders);
  const products = useAppSelector((state: RootState) => state.products.items);
  const branches = useAppSelector((state: RootState) => state.branches.items);

  const [branchId, setBranchId] = useState("");
  const [orderType, setOrderType] = useState("AT STORE");
  const [status, setStatus] = useState("Processing");
  const [preorderTime, setPreorderTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (id) dispatch(fetchOrderById(id));
    dispatch(fetchProducts());
    dispatch(fetchBranches());
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedOrder) {
      setBranchId(selectedOrder.branch_id || "");
      setOrderType(selectedOrder.orderType);
      setStatus(selectedOrder.status);
      setPreorderTime(
        selectedOrder.date ? new Date(selectedOrder.date).toISOString().slice(0, 16) : ""
      );
      setPaymentMethod(selectedOrder.payment_method || "Cash");
      setCartItems(
        selectedOrder.cart.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price || 0,
          total_price: item.total_price || 0,
        }))
      );
    }
  }, [selectedOrder]);

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!branchId) newErrors.branchId = "Required";
    if (cartItems.length === 0) newErrors.cart = "Cart cannot be empty";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddToCart = () => {
    if (!selectedProduct || quantity <= 0) return;
    const existingIndex = cartItems.findIndex((item) => item.id === selectedProduct);
    if (existingIndex !== -1) {
      const updated = [...cartItems];
      updated[existingIndex].quantity += quantity;
      updated[existingIndex].total_price = updated[existingIndex].quantity * updated[existingIndex].price;
      setCartItems(updated);
    } else {
      const product = products.find((p) => p.id === selectedProduct);
      if (product) {
        const price = product.price || 0;
        const newItem = {
          id: product.id,
          name: product.name,
          quantity,
          price,
          total_price: price * quantity,
        };
        setCartItems([...cartItems, newItem]);
      }
    }
    setSelectedProduct("");
    setQuantity(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !id) return;
    try {
      setLoading(true);
      const total_price = cartItems.reduce((sum, item) => sum + item.total_price, 0);
      const orderData: OrderUpdateRequest = {
        branch_id: branchId,
        status,
        type: orderType,
        preorder_time: preorderTime ? new Date(preorderTime).toISOString() : undefined,
        payment_method: paymentMethod,
        cart: {
          items: cartItems.map(({ id, name, quantity }) => ({ id, name, quantity })),
          total_price,
        },
      };

      await dispatch(editOrder({ id, order: orderData })).unwrap();
      toast.success(t("orders.editSuccess"));
      navigate("/order-list");
    } catch (error) {
      toast.error(t("orders.editError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto space-y-6">
      <div className="text-sm text-blue-600 cursor-pointer" onClick={() => navigate("/order-list")}>← {t("orders.orderList")}</div>
      <h1 className="text-3xl font-bold text-neutral-800">{t("orders.editOrder")}</h1>

      <div className="bg-white rounded-xl p-8 shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium block mb-1">{t("orders.branch")} <span className="text-red-500">*</span></label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-full border border-neutral-300">
                  <SelectValue placeholder={t("orders.selectBranch")} />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b.id} value={b.id}>{b.address}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.branchId && <p className="text-red-500 text-xs">{errors.branchId}</p>}
            </div>

            {/* <div>
              <label className="text-sm font-medium block mb-1">{t("orders.paymentMethod")}</label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="w-full border border-neutral-300">
                  <SelectValue placeholder={t("orders.paymentMethod")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Cash">{t("orders.cash")}</SelectItem>
                  <SelectItem value="Credit Card">{t("orders.creditCard")}</SelectItem>
                </SelectContent>
              </Select>
            </div> */}

            <div>
              <label className="text-sm font-medium block mb-1">{t("orders.preorderTime")}</label>
              <input
                type="datetime-local"
                value={preorderTime}
                onChange={(e) => setPreorderTime(e.target.value)}
                className="text-sm w-full border border-neutral-300 rounded-md px-4 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">{t("orders.type")}</label>
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger className="w-full border border-neutral-300">
                  <SelectValue placeholder={t("orders.type")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AT STORE">{t("orders.atStore")}</SelectItem>
                  <SelectItem value="ONLINE">{t("orders.online")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">{t("orders.status")}</label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full border border-neutral-300">
                  <SelectValue placeholder={t("orders.status")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Processing">{t("orders.processing")}</SelectItem>
                  <SelectItem value="Completed">{t("orders.completed")}</SelectItem>
                  <SelectItem value="Rejected">{t("orders.rejected")}</SelectItem>
                  <SelectItem value="On Hold">{t("orders.onHold")}</SelectItem>
                  <SelectItem value="In Transit">{t("orders.inTransit")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Cart Section */}
          <div className="space-y-3">
            <label className="text-base font-semibold mr-1">{t("orders.cart")}</label><span className="text-red-500">*</span>

            <div className="flex flex-col sm:flex-row sm:items-end gap-4 flex-wrap">
              <div className="flex-1 min-w-[200px]">
                <label className="text-sm font-medium block mb-1">{t("orders.product")}</label>
                <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                  <SelectTrigger className="w-full border border-neutral-300 h-10">
                    <SelectValue placeholder={t("products.selectProduct")} />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((p) => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="min-w-[120px]">
                <label className="text-sm font-medium block mb-1">{t("orders.quantity")}</label>
                <input
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full border border-neutral-300 rounded-md px-4 py-2 h-10"
                />
              </div>
              <div className="min-w-[120px]">
                <label className="invisible block mb-1">.</label>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md h-10"
                >
                  {t("orders.addProduct")}
                </button>
              </div>
            </div>

            {cartItems.length > 0 && (
              <div className="overflow-x-auto mt-4">
                <table className="w-full text-sm border border-gray-200 rounded-md min-w-[600px]">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="text-left px-3 py-2">{t("orders.product")}</th>
                      <th className="text-left px-3 py-2">{t("orders.price")}</th>
                      <th className="text-left px-3 py-2">{t("orders.quantity")}</th>
                      <th className="text-left px-3 py-2">{t("orders.total")}</th>
                      <th className="text-center px-3 py-2">{t("common.action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item, idx) => (
                      <tr key={idx} className="border-t border-gray-200">
                        <td className="px-3 py-2">{item.name}</td>
                        <td className="px-3 py-2">{item.price.toLocaleString()}₫</td>
                        <td className="px-3 py-2">{item.quantity}</td>
                        <td className="px-3 py-2">{item.total_price.toLocaleString()}₫</td>
                        <td className="text-center px-3 py-2">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...cartItems];
                              updated.splice(idx, 1);
                              setCartItems(updated);
                            }}
                            className="text-red-500 hover:underline"
                          >
                            {t("common.remove")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {errors.cart && <p className="text-red-500 text-xs">{errors.cart}</p>}
          </div>

          <div className="text-center pt-4">
            <button type="submit" className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-blue-600">
              {t("common.save")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditOrder;
