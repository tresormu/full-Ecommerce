import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  FaBox, FaDollarSign, FaShoppingCart, FaPlus, FaBars,
  FaTachometerAlt, FaSignOutAlt, FaEdit, FaTrash, FaHome, FaImage,
  FaExclamationTriangle, FaChevronRight, FaCreditCard, FaLock,
} from "react-icons/fa";
import { vendorAPI } from "../shared/services/vendorAPI";

const COLORS = ["Red","Blue","Green","Black","White","Yellow","Pink","Purple","Orange","Brown","Gray"];
const SIZES  = ["S","M","L","XL","XXL"];
const API    = import.meta.env.VITE_APP_API_URL || "https://e-commerce-api-2bvq.onrender.com/api";

const inputCls = "w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all bg-white";
const labelCls = "block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5";

const ProductForm = ({ data, setData, onSubmit, isEdit, categories, handleImageChange, saving, setPage }: any) => (
  <form onSubmit={onSubmit} className="space-y-5">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <div>
        <label className={labelCls}>Product Name *</label>
        <input required type="text" placeholder="e.g. Classic Blue Jeans" value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Category *</label>
        <select required value={data.category} onChange={e => setData({ ...data, category: e.target.value })} className={inputCls}>
          <option value="">Select category</option>
          {categories.map((c: any) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
        </select>
      </div>
    </div>

    <div>
      <label className={labelCls}>Description *</label>
      <textarea required rows={3} placeholder="Describe your product..." value={data.description}
        onChange={e => setData({ ...data, description: e.target.value })}
        className={inputCls + " resize-none"} />
    </div>

    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <label className={labelCls}>Price ($) *</label>
        <input required type="number" step="0.01" min="0" placeholder="0.00" value={data.price}
          onChange={e => setData({ ...data, price: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Stock *</label>
        <input required type="number" min="0" placeholder="0" value={data.stock}
          onChange={e => setData({ ...data, stock: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Size</label>
        <select value={data.size} onChange={e => setData({ ...data, size: e.target.value })} className={inputCls}>
          <option value="">Any</option>
          {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div>
        <label className={labelCls}>Rating (1–5)</label>
        <input type="number" min="1" max="5" step="0.1" placeholder="4.5" value={data.rating}
          onChange={e => setData({ ...data, rating: e.target.value })} className={inputCls} />
      </div>
    </div>

    <div>
      <label className={labelCls}>Color</label>
      <div className="flex flex-wrap gap-2">
        {COLORS.map(c => (
          <button key={c} type="button"
            onClick={() => setData({ ...data, color: data.color === c ? "" : c })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border-2 transition-all ${
              data.color === c ? "border-blue-600 bg-blue-50 text-blue-700" : "border-gray-200 text-gray-600 hover:border-gray-300"
            }`}>{c}
          </button>
        ))}
      </div>
    </div>

    {!isEdit && (
      <div>
        <label className={labelCls}>Product Images (4 required) *</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0,1,2,3].map(i => (
            <label key={i} htmlFor={`img-${i}`}
              className={`relative flex flex-col items-center justify-center h-28 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
                data.images[i] ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 bg-gray-50"
              }`}>
              <input id={`img-${i}`} type="file" accept="image/*" className="hidden"
                onChange={e => handleImageChange(i, e.target.files?.[0] || null)} />
              {data.images[i] ? (
                <img src={URL.createObjectURL(data.images[i]!)} className="w-full h-full object-cover rounded-xl" />
              ) : (
                <>
                  <FaImage className="text-gray-300 text-2xl mb-1" />
                  <span className="text-xs text-gray-400">Image {i + 1}</span>
                </>
              )}
            </label>
          ))}
        </div>
      </div>
    )}

    <div className="flex gap-3 pt-2">
      <button type="button" onClick={() => setPage("products")}
        className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
        Cancel
      </button>
      <button type="submit" disabled={saving}
        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-md shadow-blue-200">
        {saving ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
      </button>
    </div>
  </form>
);

const emptyProduct = {
  name:"", description:"", price:"", stock:"", category:"",
  size:"", color:"", rating:"", images:[null,null,null,null] as (File|null)[],
};

const emptyPayment = { momoNumber:"", momoName:"", bankAccount:"", bankName:"" };

type Page = "overview" | "products" | "add" | "edit" | "payment";

export default function VendorDashboard() {
  const { t } = useTranslation();
  const navigate  = useNavigate();
  const [page, setPage]               = useState<Page>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser]               = useState<any>(null);
  const [stats, setStats]             = useState({ totalProducts:0, totalSales:0, totalRevenue:0, lowStockProducts:0 });
  const [products, setProducts]       = useState<any[]>([]);
  const [categories, setCategories]   = useState<any[]>([]);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [toast, setToast]             = useState<{msg:string; ok:boolean}|null>(null);
  const [confirmId, setConfirmId]     = useState<string|null>(null);
  const [newProduct, setNewProduct]   = useState(emptyProduct);
  const [editProduct, setEditProduct] = useState<any>(null);
  const [payment, setPayment]         = useState(emptyPayment);
  const [paymentSaved, setPaymentSaved] = useState(false);
  const [savingPayment, setSavingPayment] = useState(false);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { navigate("/"); return; }
    const u = JSON.parse(stored);
    if (u.role !== "vendor" && u.UserType !== "vendor") { navigate("/"); return; }
    setUser(u);
    const saved = vendorAPI.getPaymentCredentials();
    if (saved) { setPayment(saved); setPaymentSaved(true); }
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, productsData, catsData] = await Promise.all([
        vendorAPI.getVendorStats(),
        vendorAPI.getVendorProducts(),
        fetch(`${API}/categories`).then(r => r.json()),
      ]);
      setStats(statsData);
      setProducts(Array.isArray(productsData) ? productsData : productsData.products || []);
      setCategories(catsData || []);
    } catch {
      setCategories([
        {name:"men"},{name:"women"},{name:"shoes"},{name:"bags"},{name:"watches"},
        {name:"jewelleries"},{name:"Accessories"},{name:"dresses"},{name:"tops"},
        {name:"jeans"},{name:"nightwear"},{name:"trousers"},
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (i: number, file: File | null) => {
    const imgs = [...newProduct.images];
    imgs[i] = file;
    setNewProduct({ ...newProduct, images: imgs });
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProduct.images.some(img => !img)) { showToast("Please select all 4 images", false); return; }
    setSaving(true);
    try {
      const fd = new FormData();
      (["name","description","price","stock","category","size","color","rating"] as const)
        .forEach(k => { if (newProduct[k]) fd.append(k, newProduct[k] as string); });
      newProduct.images.forEach(img => { if (img) fd.append("images", img); });
      const res = await fetch(`${API}/vendor/products`, {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: fd,
      });
      if (!res.ok) throw new Error();
      setNewProduct(emptyProduct);
      await fetchData();
      showToast("Product added successfully!");
      setPage("products");
    } catch {
      showToast("Failed to add product", false);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await vendorAPI.updateProduct(editProduct._id, {
        name: editProduct.name, description: editProduct.description,
        price: parseFloat(editProduct.price), stock: parseInt(editProduct.stock),
        category: editProduct.category, size: editProduct.size,
        color: editProduct.color,
        rating: editProduct.rating ? parseFloat(editProduct.rating) : undefined,
      });
      await fetchData();
      showToast("Product updated!");
      setPage("products");
    } catch {
      showToast("Failed to update product", false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await vendorAPI.deleteProduct(id);
      await fetchData();
      showToast("Product deleted");
    } catch {
      showToast("Failed to delete", false);
    }
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingPayment(true);
    setTimeout(() => {
      vendorAPI.savePaymentCredentials(payment);
      setPaymentSaved(true);
      setSavingPayment(false);
      showToast("Payment credentials saved!");
    }, 600);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
    { id: "overview",  label: "Overview",         icon: <FaTachometerAlt /> },
    { id: "products",  label: "My Products",       icon: <FaBox /> },
    { id: "add",       label: "Add Product",       icon: <FaPlus /> },
    { id: "payment",   label: "Payment Settings",  icon: <FaCreditCard /> },
  ];



  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-50">

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-40 flex flex-col transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:static lg:z-auto`}>

        {/* Brand */}
        <div className="px-6 py-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-blue-600 font-bold text-lg">
            B-DIFFERENT
          </Link>
          <p className="text-xs text-gray-400 mt-0.5">Vendor Portal</p>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user?.username?.charAt(0)?.toUpperCase() || "V"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user?.username || "Vendor"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <span className="mt-2 inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-semibold rounded-full">Vendor</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => { setPage(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                page === item.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "text-gray-600 hover:bg-gray-100"
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
              {page === item.id && <FaChevronRight className="ml-auto text-xs opacity-70" />}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-gray-100 space-y-1">
          <Link to="/" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 transition-all">
            <FaHome /> Back to Store
          </Link>
          <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600">
              <FaBars />
            </button>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-gray-900 capitalize">
                {page === "overview" ? "Dashboard Overview" : page === "products" ? "My Products" : page === "add" ? "Add New Product" : page === "payment" ? "Payment Settings" : "Edit Product"}
              </h1>
              <p className="text-xs text-gray-400 hidden sm:block">
                Welcome back, {user?.username}
              </p>
            </div>
          </div>
          <button onClick={() => setPage("add")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-blue-200">
            <FaPlus className="text-xs" /> Add Product
          </button>
        </header>

        {/* Delete Confirm Modal */}
        {confirmId && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <FaTrash className="text-red-500 text-sm" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Delete Product</p>
                  <p className="text-xs text-gray-400">This action cannot be undone</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete this product?</p>
              <div className="flex gap-3">
                <button onClick={() => setConfirmId(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={() => { handleDelete(confirmId); setConfirmId(null); }}
                  className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold transition-colors">
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className={`fixed top-5 right-5 z-50 px-5 py-3 rounded-xl shadow-lg text-sm font-medium text-white transition-all ${toast.ok ? "bg-green-500" : "bg-red-500"}`}>
            {toast.msg}
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 overflow-auto">

          {/* ── OVERVIEW ── */}
          {page === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:"Total Products", value: stats.totalProducts, icon:<FaBox />, color:"blue" },
                  { label:"Total Sales",    value: stats.totalSales,    icon:<FaShoppingCart />, color:"green" },
                  { label:"Revenue",        value:`$${stats.totalRevenue}`, icon:<FaDollarSign />, color:"purple" },
                  { label:"Low Stock",      value: stats.lowStockProducts, icon:<FaExclamationTriangle />, color:"red" },
                ].map(s => (
                  <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{s.label}</p>
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm
                        ${s.color==="blue"?"bg-blue-50 text-blue-600":s.color==="green"?"bg-green-50 text-green-600":s.color==="purple"?"bg-purple-50 text-purple-600":"bg-red-50 text-red-500"}`}>
                        {s.icon}
                      </div>
                    </div>
                    <p className={`text-2xl font-bold ${s.color==="red"?"text-red-600":"text-gray-900"}`}>{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Recent products */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="font-semibold text-gray-900">Recent Products</h2>
                  <button onClick={() => setPage("products")} className="text-xs text-blue-600 font-medium hover:underline">{t('common.viewAll')}</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {products.slice(0, 5).map((p: any) => (
                    <div key={p._id || p.id} className="flex items-center gap-4 px-6 py-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                        {p.Images?.[0] && <img src={p.Images[0]} className="w-full h-full object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-400">${p.price}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        p.stock === 0 ? "bg-red-50 text-red-600" : p.stock < 10 ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                      }`}>{p.stock} units</span>
                    </div>
                  ))}
                  {products.length === 0 && (
                    <p className="px-6 py-8 text-center text-sm text-gray-400">No products yet. <button onClick={() => setPage("add")} className="text-blue-600 font-medium">Add your first one</button></p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {page === "products" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">All Products ({products.length})</h2>
              </div>
              {products.length === 0 ? (
                <div className="py-20 text-center">
                  <FaBox className="text-gray-200 text-5xl mx-auto mb-4" />
                  <p className="text-gray-400 text-sm mb-4">You haven't added any products yet</p>
                  <button onClick={() => setPage("add")} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors">
                    Add First Product
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <tr>
                        <th className="px-6 py-3 text-left">Product</th>
                        <th className="px-6 py-3 text-left">Category</th>
                        <th className="px-6 py-3 text-left">Price</th>
                        <th className="px-6 py-3 text-left">Stock</th>
                        <th className="px-6 py-3 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {products.map((p: any) => (
                        <tr key={p._id || p.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                {p.Images?.[0]
                                  ? <img src={p.Images[0]} className="w-full h-full object-cover" />
                                  : <FaImage className="text-gray-300 m-auto mt-2.5" />}
                              </div>
                              <span className="font-medium text-gray-900 truncate max-w-[160px]">{p.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-500 capitalize">{p.category?.name || p.category}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">${p.price}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              p.stock === 0 ? "bg-red-50 text-red-600" : p.stock < 10 ? "bg-yellow-50 text-yellow-600" : "bg-green-50 text-green-600"
                            }`}>{p.stock} units</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <button onClick={() => { setEditProduct({ ...p, category: p.category?.name || p.category }); setPage("edit"); }}
                                className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors">
                                <FaEdit />
                              </button>
                              <button onClick={() => setConfirmId(p._id || p.id)}
                                className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors">
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ── ADD PRODUCT ── */}
          {page === "add" && (
            <div className="max-w-3xl space-y-4">
              {!paymentSaved && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                    <FaLock className="text-amber-600 text-sm" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-800">Payment credentials required</p>
                    <p className="text-xs text-amber-600 mt-0.5">You must set up your payment details before listing products. This ensures you can receive payments from customers.</p>
                    <button onClick={() => setPage("payment")}
                      className="mt-3 px-4 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg transition-colors">
                      Set up payment →
                    </button>
                  </div>
                </div>
              )}
              <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 ${!paymentSaved ? "opacity-50 pointer-events-none select-none" : ""}`}>
                <h2 className="text-lg font-bold text-gray-900 mb-6">New Product</h2>
                <ProductForm data={newProduct} setData={setNewProduct} onSubmit={handleAdd} isEdit={false} categories={categories} handleImageChange={handleImageChange} saving={saving} setPage={setPage} />
              </div>
            </div>
          )}

          {/* ── PAYMENT SETTINGS ── */}
          {page === "payment" && (
            <div className="max-w-xl">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                    <FaCreditCard className="text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Payment Settings</h2>
                    <p className="text-xs text-gray-400">Required before you can list products</p>
                  </div>
                  {paymentSaved && (
                    <span className="ml-auto px-2.5 py-1 bg-green-50 text-green-600 text-xs font-semibold rounded-full">✓ Saved</span>
                  )}
                </div>

                <form onSubmit={handleSavePayment} className="space-y-5">
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Mobile Money (MoMo)</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className={labelCls}>MoMo Number *</label>
                        <input required type="tel" placeholder="e.g. 0781234567"
                          value={payment.momoNumber}
                          onChange={e => setPayment({ ...payment, momoNumber: e.target.value })}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Account Name *</label>
                        <input required type="text" placeholder="Full name on account"
                          value={payment.momoName}
                          onChange={e => setPayment({ ...payment, momoName: e.target.value })}
                          className={inputCls} />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-5">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Card Details (Optional)</p>
                    <div className="space-y-4">
                      <div>
                        <label className={labelCls}>Card Number</label>
                        <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                          value={payment.bankAccount}
                          onChange={e => {
                            const digits = e.target.value.replace(/\D/g, "").slice(0, 16);
                            const formatted = digits.match(/.{1,4}/g)?.join(" ") || digits;
                            setPayment({ ...payment, bankAccount: formatted });
                          }}
                          className={inputCls} />
                      </div>
                      <div>
                        <label className={labelCls}>Cardholder Name</label>
                        <input type="text" placeholder="Name on card"
                          value={payment.bankName}
                          onChange={e => setPayment({ ...payment, bankName: e.target.value })}
                          className={inputCls} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className={labelCls}>Expiry</label>
                          <input type="text" placeholder="MM/YY" maxLength={5}
                            value={(payment as any).cardExpiry || ""}
                            onChange={e => {
                              const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                              const formatted = digits.length > 2 ? digits.slice(0,2) + "/" + digits.slice(2) : digits;
                              setPayment({ ...payment, cardExpiry: formatted } as any);
                            }}
                            className={inputCls} />
                        </div>
                        <div>
                          <label className={labelCls}>CVV</label>
                          <input type="password" placeholder="•••" maxLength={3}
                            value={(payment as any).cardCvv || ""}
                            onChange={e => setPayment({ ...payment, cardCvv: e.target.value.replace(/\D/g, "").slice(0, 3) } as any)}
                            className={inputCls} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700">
                    <strong>Note:</strong> Your payment credentials are stored securely and used only to process payouts for your sales.
                  </div>

                  <button type="submit" disabled={savingPayment}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 shadow-md shadow-blue-200">
                    {savingPayment ? "Saving..." : paymentSaved ? "Update Credentials" : "Save & Activate"}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ── EDIT PRODUCT ── */}
          {page === "edit" && editProduct && (
            <div className="max-w-3xl">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Edit Product</h2>
                <ProductForm data={editProduct} setData={setEditProduct} onSubmit={handleUpdate} isEdit={true} categories={categories} handleImageChange={handleImageChange} saving={saving} setPage={setPage} />
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
