/**
 * صيدلية الشفاء الذكية - منطق التطبيق التفاعلي (Pharmacy Application Logic)
 */

// Application State
const AppState = {
    medicines: [...MEDICINES_DATABASE],
    filteredMedicines: [...MEDICINES_DATABASE],
    currentCategory: 'all',
    activeQuickFilter: 'all',
    searchQuery: '',
    sortBy: 'popular',
    cart: JSON.parse(localStorage.getItem('shefaa_cart') || '[]'),
    activeDiscount: 0,
    appliedCoupon: ''
};

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    updateCategoryCounts();
    renderCategories();
    renderMedicines();
    updateCartUI();
    setupEventListeners();
    setupPharmacistChat();
    populateDrugInteractionSelects();
});

// ================= Theme Switcher =================
function initTheme() {
    const savedTheme = localStorage.getItem('shefaa_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-mode');
        updateThemeToggleIcon(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeToggleIcon(false);
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('shefaa_theme', isDark ? 'dark' : 'light');
    updateThemeToggleIcon(isDark);
}

function updateThemeToggleIcon(isDark) {
    const btn = document.getElementById('themeToggleBtn');
    if (!btn) return;
    btn.innerHTML = isDark ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
}

// ================= Category & Filter Management =================
function updateCategoryCounts() {
    MEDICINES_CATEGORIES.forEach(cat => {
        if (cat.id === 'all') {
            cat.count = MEDICINES_DATABASE.length;
        } else {
            cat.count = MEDICINES_DATABASE.filter(m => m.category === cat.id).length;
        }
    });
}

function renderCategories() {
    const container = document.getElementById('categoriesList');
    if (!container) return;

    container.innerHTML = MEDICINES_CATEGORIES.map(cat => `
        <button class="category-tab-btn ${AppState.currentCategory === cat.id ? 'active' : ''}" 
                onclick="selectCategory('${cat.id}')">
            <i class="${cat.icon}"></i>
            <span>${cat.name}</span>
            <small style="opacity: 0.75; font-size: 0.75rem">(${cat.count})</small>
        </button>
    `).join('');
}

function selectCategory(catId) {
    AppState.currentCategory = catId;
    renderCategories();
    applyFilters();
}

function selectQuickFilter(filterKey) {
    AppState.activeQuickFilter = filterKey;
    document.querySelectorAll('.quick-tag-pill').forEach(pill => {
        pill.classList.toggle('active', pill.dataset.filter === filterKey);
    });
    applyFilters();
}

// ================= Search & Filter Pipeline =================
function applyFilters() {
    let list = [...MEDICINES_DATABASE];

    // 1. Category Filter
    if (AppState.currentCategory !== 'all') {
        list = list.filter(m => m.category === AppState.currentCategory);
    }

    // 2. Search Query (Arabic, English, Active Ingredient, Indications)
    if (AppState.searchQuery.trim() !== '') {
        const q = AppState.searchQuery.trim().toLowerCase();
        list = list.filter(m => 
            m.name.toLowerCase().includes(q) ||
            m.nameEn.toLowerCase().includes(q) ||
            m.activeIngredient.toLowerCase().includes(q) ||
            m.indications.toLowerCase().includes(q) ||
            m.categoryName.toLowerCase().includes(q)
        );
    }

    // 3. Quick Tag Filter
    if (AppState.activeQuickFilter === 'otc') {
        list = list.filter(m => !m.prescription);
    } else if (AppState.activeQuickFilter === 'deals') {
        list = list.filter(m => m.oldPrice && m.oldPrice > m.price);
    } else if (AppState.activeQuickFilter === 'top') {
        list = list.filter(m => m.rating >= 4.9);
    } else if (AppState.activeQuickFilter === 'rx') {
        list = list.filter(m => m.prescription);
    }

    // 4. Sorting
    if (AppState.sortBy === 'price-low') {
        list.sort((a, b) => a.price - b.price);
    } else if (AppState.sortBy === 'price-high') {
        list.sort((a, b) => b.price - a.price);
    } else if (AppState.sortBy === 'name') {
        list.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
    } else if (AppState.sortBy === 'popular') {
        list.sort((a, b) => b.reviewsCount - a.reviewsCount);
    }

    AppState.filteredMedicines = list;
    renderMedicines();
}

// ================= Render Medicines Grid =================
function renderMedicines() {
    const grid = document.getElementById('medicinesGrid');
    const resultCount = document.getElementById('resultsCount');
    if (!grid) return;

    if (resultCount) {
        resultCount.textContent = `عرض ${AppState.filteredMedicines.length} من إجمالي ${MEDICINES_DATABASE.length} صنف متاح`;
    }

    if (AppState.filteredMedicines.length === 0) {
        grid.innerHTML = `
            <div class="no-results-box">
                <i class="fa-solid fa-magnifying-glass no-results-icon"></i>
                <h3>لم نتمكن من العثور على أدوية مطابقة لبحثك</h3>
                <p>تأكد من كتابة الاسم بشكل صحيح أو جرب البحث بالمادة الفعالة أو اسم العَرَض (مثل: صداع، مغص، حرارة).</p>
                <button class="action-btn btn-primary" onclick="resetAllFilters()">
                    <i class="fa-solid fa-rotate-left"></i> إعادة تعيين الفلاتر
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = AppState.filteredMedicines.map(med => {
        const badgeHtml = med.badge ? `<span class="med-badge badge-${med.badgeType}">${med.badge}</span>` : '<span></span>';
        const rxHtml = med.prescription 
            ? `<span class="rx-status-tag rx-needed"><i class="fa-solid fa-file-prescription"></i> يلزم وصفة طبية (Rx)</span>`
            : `<span class="rx-status-tag otc"><i class="fa-solid fa-check-circle"></i> بدون وصفة (OTC)</span>`;

        return `
            <div class="medicine-card" data-id="${med.id}">
                <div>
                    <div class="med-card-top">
                        ${badgeHtml}
                        ${rxHtml}
                    </div>

                    <div class="med-card-visual" onclick="openMedicineModal('${med.id}')" style="cursor: pointer" title="انقر لعرض تفاصيل الدواء والبدائل">
                        <i class="${med.icon || 'fa-solid fa-capsules'} med-card-icon"></i>
                        <span class="med-form-pill">${med.form.split('(')[0].trim()}</span>
                    </div>

                    <div class="med-category-label">${med.categoryName}</div>
                    <h3 class="med-name-ar" onclick="openMedicineModal('${med.id}')" style="cursor: pointer">${med.name}</h3>
                    <div class="med-name-en">${med.nameEn}</div>

                    <div class="med-active-substance">
                        <strong>المادة الفعالة:</strong> ${med.activeIngredient}
                    </div>

                    <p class="med-indications" title="${med.indications}">
                        ${med.indications}
                    </p>
                </div>

                <div class="med-card-footer">
                    <div class="med-price-wrap">
                        <div>
                            <span class="current-price">${med.price}</span>
                            <span class="currency">ج.م</span>
                        </div>
                        ${med.oldPrice ? `<span class="old-price">${med.oldPrice} ج.م</span>` : ''}
                    </div>

                    <div class="card-actions-group">
                        <button class="btn-details" onclick="openMedicineModal('${med.id}')" title="عرض التفاصيل والبدائل المتاحة">
                            <i class="fa-solid fa-circle-info"></i>
                        </button>
                        <button class="btn-add-cart" onclick="addToCart('${med.id}')">
                            <i class="fa-solid fa-cart-plus"></i>
                            <span>أضف للسلة</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function resetAllFilters() {
    AppState.searchQuery = '';
    AppState.currentCategory = 'all';
    AppState.activeQuickFilter = 'all';
    AppState.sortBy = 'popular';
    
    const searchInput = document.getElementById('smartSearchInput');
    if (searchInput) searchInput.value = '';
    
    const clearBtn = document.getElementById('clearSearchBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    renderCategories();
    selectQuickFilter('all');
    applyFilters();
}

// ================= Medicine Details & Alternatives Modal =================
function openMedicineModal(medId) {
    const med = MEDICINES_DATABASE.find(m => m.id === medId);
    if (!med) return;

    const modal = document.getElementById('medicineDetailsModal');
    const content = document.getElementById('medicineModalContent');
    if (!modal || !content) return;

    const alternativesHtml = med.alternatives && med.alternatives.length > 0 
        ? `
            <div class="alternatives-container">
                <div class="detail-section-title">
                    <i class="fa-solid fa-repeat" style="color: var(--secondary)"></i>
                    <span>البدائل والمثائل المتاحة بنفس المادة الفعالة أو التأثير:</span>
                </div>
                <div class="alt-chips-list">
                    ${med.alternatives.map(alt => `
                        <div class="alt-chip" onclick="searchAlternative('${alt}')" title="ابحث عن هذا البديل">
                            <i class="fa-solid fa-check"></i> ${alt}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` 
        : '';

    content.innerHTML = `
        <div class="med-detail-hero">
            <div class="med-detail-icon">
                <i class="${med.icon || 'fa-solid fa-capsules'}"></i>
            </div>
            <div>
                <span class="med-badge badge-${med.badgeType}" style="margin-bottom: 6px; display: inline-block;">${med.categoryName}</span>
                <h2 style="font-size: 1.45rem; font-weight: 800; color: var(--text-primary); margin-bottom: 4px;">${med.name}</h2>
                <div style="color: var(--text-muted); font-size: 0.95rem;">${med.nameEn}</div>
                <div style="margin-top: 8px; font-weight: 800; font-size: 1.25rem; color: var(--primary);">
                    ${med.price} ج.م ${med.oldPrice ? `<small style="text-decoration: line-through; color: var(--text-muted); font-size: 0.85rem; margin-right: 6px;">${med.oldPrice} ج.م</small>` : ''}
                </div>
            </div>
        </div>

        <div class="detail-info-block" style="border-right: 4px solid var(--primary);">
            <div class="detail-section-title">
                <i class="fa-solid fa-flask" style="color: var(--primary);"></i>
                <span>المادة الفعالة والشكل الدوائي</span>
            </div>
            <p><strong>المادة الفعالة:</strong> ${med.activeIngredient}</p>
            <p><strong>الشكل والعبوة:</strong> ${med.form}</p>
            <p><strong>حالة الصرف:</strong> ${med.prescription ? 'يلزم إرفاق وصفة طبية عند الاستلام' : 'صرف آمن بدون وصفة طبية (OTC)'}</p>
        </div>

        <div class="detail-info-block">
            <div class="detail-section-title">
                <i class="fa-solid fa-heart-circle-check" style="color: var(--success);"></i>
                <span>دواعي الاستعمال</span>
            </div>
            <p>${med.indications}</p>
        </div>

        <div class="detail-info-block">
            <div class="detail-section-title">
                <i class="fa-solid fa-clock" style="color: var(--accent);"></i>
                <span>الجرعة المعتادة وطريقة الاستخدام</span>
            </div>
            <p>${med.dosage}</p>
        </div>

        <div class="detail-info-block" style="background: var(--danger-light); border-color: #fca5a5;">
            <div class="detail-section-title" style="color: var(--danger);">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <span>التحذيرات وموانع الاستعمال</span>
            </div>
            <p style="color: #991b1b;">${med.warnings}</p>
        </div>

        ${alternativesHtml}

        <div style="display: flex; gap: 12px; margin-top: 24px;">
            <button class="checkout-btn" style="margin-top: 0; flex: 1;" onclick="addToCart('${med.id}'); closeModal('medicineDetailsModal');">
                <i class="fa-solid fa-cart-plus"></i> إضافة هذا الدواء إلى السلة (${med.price} ج.م)
            </button>
            <button class="action-btn" onclick="closeModal('medicineDetailsModal')">
                إغلاق
            </button>
        </div>
    `;

    modal.classList.add('active');
}

function searchAlternative(altName) {
    closeModal('medicineDetailsModal');
    const cleaned = altName.replace(/[0-9]+.*$/, '').trim();
    const searchInput = document.getElementById('smartSearchInput');
    if (searchInput) {
        searchInput.value = cleaned;
        AppState.searchQuery = cleaned;
        applyFilters();
        scrollToSection('catalogSection');
    }
}

// ================= Shopping Cart Logic =================
function addToCart(medId) {
    const med = MEDICINES_DATABASE.find(m => m.id === medId);
    if (!med) return;

    const existingIndex = AppState.cart.findIndex(item => item.id === medId);
    if (existingIndex > -1) {
        AppState.cart[existingIndex].quantity += 1;
    } else {
        AppState.cart.push({
            id: med.id,
            name: med.name,
            price: med.price,
            prescription: med.prescription,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showToast(`تمت إضافة "${med.name}" إلى السلة بنجاح`);
}

function updateCartQty(medId, delta) {
    const item = AppState.cart.find(i => i.id === medId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
        removeFromCart(medId);
        return;
    }

    saveCart();
    updateCartUI();
}

function removeFromCart(medId) {
    AppState.cart = AppState.cart.filter(i => i.id !== medId);
    saveCart();
    updateCartUI();
    showToast('تم حذف الدواء من السلة');
}

function clearCart() {
    AppState.cart = [];
    AppState.appliedCoupon = '';
    AppState.activeDiscount = 0;
    saveCart();
    updateCartUI();
}

function saveCart() {
    localStorage.setItem('shefaa_cart', JSON.stringify(AppState.cart));
}

function updateCartUI() {
    const countBadge = document.getElementById('cartCountBadge');
    const itemsList = document.getElementById('cartItemsList');
    const subtotalEl = document.getElementById('cartSubtotal');
    const shippingEl = document.getElementById('cartShipping');
    const discountEl = document.getElementById('cartDiscount');
    const totalEl = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('cartCheckoutBtn');

    const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
    if (countBadge) {
        countBadge.textContent = totalCount;
        countBadge.style.transform = 'scale(1.3)';
        setTimeout(() => countBadge.style.transform = 'scale(1)', 200);
    }

    if (!itemsList) return;

    if (AppState.cart.length === 0) {
        itemsList.innerHTML = `
            <div style="text-align: center; padding: 40px 10px; color: var(--text-muted);">
                <i class="fa-solid fa-cart-shopping" style="font-size: 3rem; margin-bottom: 12px; opacity: 0.5;"></i>
                <h4 style="color: var(--text-primary); margin-bottom: 6px;">سلة المشتريات فارغة</h4>
                <p style="font-size: 0.88rem;">تصفح الكتالوج وأضف الأدوية والمستلزمات التي تحتاجها</p>
            </div>
        `;
        if (subtotalEl) subtotalEl.textContent = '0 ج.م';
        if (shippingEl) shippingEl.textContent = '0 ج.م';
        if (discountEl) discountEl.textContent = '0 ج.م';
        if (totalEl) totalEl.textContent = '0 ج.م';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }

    if (checkoutBtn) checkoutBtn.disabled = false;

    itemsList.innerHTML = AppState.cart.map(item => `
        <div class="cart-item-card">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <div class="cart-item-price">${item.price * item.quantity} ج.م (${item.price} ج.م للوحدة)</div>
                ${item.prescription ? `<small style="color: #f97316; font-size: 0.75rem;"><i class="fa-solid fa-receipt"></i> يحتاج روشتة</small>` : ''}
            </div>
            <div class="cart-item-controls">
                <button class="qty-btn" onclick="updateCartQty('${item.id}', -1)">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="updateCartQty('${item.id}', 1)">+</button>
                <button class="remove-item-btn" onclick="removeFromCart('${item.id}')" title="حذف">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        </div>
    `).join('');

    // Totals Calculation
    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 25;
    const discountAmount = Math.round(subtotal * AppState.activeDiscount);
    const finalTotal = subtotal + shipping - discountAmount;

    if (subtotalEl) subtotalEl.textContent = `${subtotal} ج.م`;
    if (shippingEl) {
        shippingEl.innerHTML = shipping === 0 
            ? `<span style="color: var(--success); font-weight: 700;"><i class="fa-solid fa-gift"></i> مجاني</span>` 
            : `${shipping} ج.م`;
    }
    if (discountEl) discountEl.textContent = discountAmount > 0 ? `-${discountAmount} ج.م (${AppState.appliedCoupon})` : '0 ج.م';
    if (totalEl) totalEl.textContent = `${finalTotal} ج.م`;
}

function applyCouponCode() {
    const couponInput = document.getElementById('couponCodeInput');
    if (!couponInput) return;
    const code = couponInput.value.trim().toUpperCase();

    if (code === 'SHIFAA' || code === 'HEALTH10' || code === 'WELCOME') {
        AppState.activeDiscount = 0.10; // 10%
        AppState.appliedCoupon = code;
        showToast(`تم تطبيق كود الخصم "${code}" بنجاح! خصم 10%`);
        updateCartUI();
    } else {
        showToast('كود الخصم غير صالح أو منتهي الصلاحية');
    }
}

function toggleCartDrawer(open) {
    const overlay = document.getElementById('cartDrawerOverlay');
    if (!overlay) return;
    if (open !== undefined) {
        overlay.classList.toggle('active', open);
    } else {
        overlay.classList.toggle('active');
    }
}

// ================= Checkout & Order Placement =================
function openCheckoutModal() {
    if (AppState.cart.length === 0) {
        showToast('سلة المشتريات فارغة');
        return;
    }
    toggleCartDrawer(false);
    const modal = document.getElementById('checkoutModal');
    if (modal) modal.classList.add('active');
}

function processOrder(event) {
    event.preventDefault();
    const name = document.getElementById('customerName')?.value || 'عميل كريم';
    const phone = document.getElementById('customerPhone')?.value || '';
    const address = document.getElementById('customerAddress')?.value || '';
    const notes = document.getElementById('customerNotes')?.value || '';
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value || 'الدفع عند الاستلام';

    const orderNumber = 'SHF-' + Math.floor(100000 + Math.random() * 900000);
    const orderDate = new Date().toLocaleDateString('ar-EG', { dateStyle: 'full' });

    const subtotal = AppState.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal >= 150 ? 0 : 25;
    const discount = Math.round(subtotal * AppState.activeDiscount);
    const finalTotal = subtotal + shipping - discount;

    const invoiceArea = document.getElementById('invoicePrintArea');
    if (invoiceArea) {
        invoiceArea.innerHTML = `
            <div style="background: white; color: #1e293b; padding: 30px; border-radius: 12px; font-family: Cairo, sans-serif; direction: rtl;">
                <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
                    <div>
                        <h2 style="color: #059669; font-size: 1.6rem; font-weight: 800; margin: 0;">صيدلية الشفاء الذكية</h2>
                        <p style="margin: 4px 0 0; color: #64748b; font-size: 0.85rem;">ترخيص وزارة الصحة رقم: 84920/2026 - خدمة 24 ساعة</p>
                    </div>
                    <div style="text-align: left;">
                        <span style="background: #d1fae5; color: #065f46; padding: 4px 12px; border-radius: 20px; font-weight: 700; font-size: 0.85rem;">فاتورة رقمية مؤكدة</span>
                        <div style="margin-top: 6px; font-weight: 800;">رقم الطلب: ${orderNumber}</div>
                        <div style="font-size: 0.8rem; color: #64748b;">${orderDate}</div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; background: #f8fafc; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div>
                        <strong style="color: #0f172a;">بيانات العميل والتوصيل:</strong>
                        <div style="margin-top: 4px; font-size: 0.9rem;">الاسم: ${name}</div>
                        <div style="font-size: 0.9rem;">الهاتف: ${phone}</div>
                        <div style="font-size: 0.9rem;">العنوان: ${address}</div>
                    </div>
                    <div>
                        <strong style="color: #0f172a;">تفاصيل الدفع:</strong>
                        <div style="margin-top: 4px; font-size: 0.9rem;">طريقة الدفع: ${paymentMethod}</div>
                        <div style="font-size: 0.9rem;">حالة الطلب: قيد التجهيز والتوصيل فوراً</div>
                        ${notes ? `<div style="font-size: 0.85rem; color: #64748b;">ملاحظات: ${notes}</div>` : ''}
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 0.92rem;">
                    <thead>
                        <tr style="background: #059669; color: white; text-align: right;">
                            <th style="padding: 10px;">الصنف الدوائي</th>
                            <th style="padding: 10px; text-align: center;">الكمية</th>
                            <th style="padding: 10px; text-align: left;">سعر الوحدة</th>
                            <th style="padding: 10px; text-align: left;">الإجمالي</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${AppState.cart.map(item => `
                            <tr style="border-bottom: 1px solid #e2e8f0;">
                                <td style="padding: 10px;">
                                    <strong>${item.name}</strong>
                                    ${item.prescription ? '<span style="color: #ea580c; font-size: 0.75rem;"> (روشتة)</span>' : ''}
                                </td>
                                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                                <td style="padding: 10px; text-align: left;">${item.price} ج.م</td>
                                <td style="padding: 10px; text-align: left;">${item.price * item.quantity} ج.م</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                <div style="display: flex; justify-content: flex-end; margin-bottom: 20px;">
                    <div style="width: 280px; font-size: 0.92rem;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>المجموع الفرعي:</span>
                            <strong>${subtotal} ج.م</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>رسوم التوصيل السريع:</span>
                            <strong>${shipping === 0 ? 'مجاني' : shipping + ' ج.م'}</strong>
                        </div>
                        ${discount > 0 ? `
                            <div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #059669;">
                                <span>الخصم المطبق (${AppState.appliedCoupon}):</span>
                                <strong>-${discount} ج.م</strong>
                            </div>
                        ` : ''}
                        <div style="display: flex; justify-content: space-between; border-top: 2px solid #0f172a; padding-top: 8px; font-size: 1.2rem; font-weight: 800; color: #059669;">
                            <span>الإجمالي النهائي:</span>
                            <span>${finalTotal} ج.م</span>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; border-top: 1px dashed #cbd5e1; padding-top: 14px; font-size: 0.85rem; color: #64748b;">
                    شكراً لاختياركم صيدلية الشفاء. نتمنى لكم دوام الصحة والعافية! - للاستفسار أو المتابعة اتصل على 19999
                </div>
            </div>
        `;
    }

    closeModal('checkoutModal');
    clearCart();
    
    // Open Confirmation Dialog
    const confirmModal = document.getElementById('orderSuccessModal');
    if (confirmModal) {
        document.getElementById('confirmedOrderNumber').textContent = orderNumber;
        document.getElementById('confirmedCustomerName').textContent = name;
        confirmModal.classList.add('active');
    }
}

function printInvoice() {
    window.print();
}

// ================= Drug Interaction Checker =================
function populateDrugInteractionSelects() {
    const selA = document.getElementById('interactionDrugA');
    const selB = document.getElementById('interactionDrugB');
    if (!selA || !selB) return;

    const options = MEDICINES_DATABASE.map(m => `<option value="${m.name}">${m.name} (${m.activeIngredient.split('(')[0].trim()})</option>`).join('');
    selA.innerHTML = '<option value="">-- اختر الدواء الأول --</option>' + options;
    selB.innerHTML = '<option value="">-- اختر الدواء الثاني --</option>' + options;
}

function checkDrugInteraction() {
    const drugA = document.getElementById('interactionDrugA')?.value;
    const drugB = document.getElementById('interactionDrugB')?.value;
    const resultBox = document.getElementById('interactionResultBox');
    if (!resultBox) return;

    if (!drugA || !drugB) {
        resultBox.innerHTML = `
            <div style="color: var(--danger); padding: 12px; background: var(--danger-light); border-radius: 8px;">
                <i class="fa-solid fa-circle-exclamation"></i> يرجى اختيار الدواءين معاً للتحقق من التفاعل.
            </div>
        `;
        return;
    }

    if (drugA === drugB) {
        resultBox.innerHTML = `
            <div style="color: var(--warning); padding: 12px; background: var(--warning-light); border-radius: 8px;">
                <i class="fa-solid fa-triangle-exclamation"></i> لقد اخترت نفس الدواء مرتين. يرجى اختيار دواءين مختلفين.
            </div>
        `;
        return;
    }

    // Match in knowledge base
    const matched = DRUG_INTERACTIONS.find(item => 
        (drugA.includes(item.drugA) && drugB.includes(item.drugB)) ||
        (drugA.includes(item.drugB) && drugB.includes(item.drugA))
    );

    if (matched) {
        let badgeColor = '#ef4444';
        let bg = 'var(--danger-light)';
        if (matched.level === 'warning') { badgeColor = '#f59e0b'; bg = 'var(--warning-light)'; }
        if (matched.level === 'safe') { badgeColor = '#10b981'; bg = 'var(--primary-light)'; }

        resultBox.innerHTML = `
            <div style="background: ${bg}; border-right: 4px solid ${badgeColor}; padding: 16px; border-radius: 8px; margin-top: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: ${badgeColor}; font-size: 1.05rem; margin-bottom: 6px;">
                    <i class="fa-solid fa-shield-virus"></i> ${matched.title}
                </div>
                <p style="font-size: 0.92rem; color: var(--text-primary); margin: 0; line-height: 1.5;">${matched.description}</p>
            </div>
        `;
    } else {
        resultBox.innerHTML = `
            <div style="background: var(--primary-light); border-right: 4px solid var(--primary); padding: 16px; border-radius: 8px; margin-top: 14px;">
                <div style="display: flex; align-items: center; gap: 8px; font-weight: 800; color: var(--primary); font-size: 1.05rem; margin-bottom: 6px;">
                    <i class="fa-solid fa-circle-check"></i> لا يوجد تعارض مباشر معروف
                </div>
                <p style="font-size: 0.92rem; color: var(--text-primary); margin: 0; line-height: 1.5;">
                    لم يتم تسجيل تعارض رئيسي معروف بين هذين المستحضرين. يُنصح دائماً بالفصل بين تناول الأدوية بساعة إلى ساعتين واستشارة الصيدلي.
                </p>
            </div>
        `;
    }
}

// ================= Children Fever Dose Calculator =================
function calculateFeverDose() {
    const weightInput = document.getElementById('childWeightInput');
    const ageSelect = document.getElementById('childAgeSelect');
    const resultBox = document.getElementById('calcResultBox');
    if (!resultBox) return;

    let weight = parseFloat(weightInput?.value);
    
    // If weight not entered, estimate from age
    if (!weight || weight <= 0) {
        const age = parseFloat(ageSelect?.value || '0');
        if (age > 0) {
            // Formula approx: weight = (age * 2) + 8
            weight = (age * 2) + 8;
        } else {
            resultBox.innerHTML = `
                <div style="color: var(--danger); padding: 12px; background: var(--danger-light); border-radius: 8px;">
                    <i class="fa-solid fa-circle-exclamation"></i> يرجى إدخال وزن الطفل بالكيلوجرام أو اختيار العمر التقريبي.
                </div>
            `;
            return;
        }
    }

    // Paracetamol pediatric dosage: 15 mg/kg per dose
    const doseMg = Math.round(weight * 15);
    // Cetal Syrup concentration: 250 mg in 5 ml => 50 mg/ml
    const doseMl = (doseMg / 50).toFixed(1);

    resultBox.innerHTML = `
        <div style="background: var(--primary-light); border: 1px solid var(--primary); padding: 16px; border-radius: 12px; margin-top: 14px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-weight: 800; color: var(--primary); font-size: 1.1rem;">
                    <i class="fa-solid fa-calculator"></i> الجرعة الموصى بها للجرعة الواحدة:
                </span>
                <span style="background: var(--primary); color: white; padding: 4px 12px; border-radius: 20px; font-weight: 800; font-size: 1rem;">
                    ${doseMl} مل (${doseMg} ملغ)
                </span>
            </div>
            <ul style="font-size: 0.88rem; color: var(--text-primary); line-height: 1.7; padding-right: 18px; margin: 0;">
                <li>تحسب على أساس شراب الباراسيتامول (مثل سيتال أو بنادول أطفال 250 ملغ/5 مل).</li>
                <li>تُكرر الجرعة كل <strong>4 إلى 6 ساعات</strong> عند استمرار ارتفاع الحرارة.</li>
                <li><strong>الحد الأقصى:</strong> لا تتجاوز 4 جرعات خلال 24 ساعة.</li>
                <li>ينصح بعمل كمادات ماء فاتر (غير مثلج) على الرقبة وتحت الإبطين.</li>
            </ul>
        </div>
    `;
}

// ================= Prescription Upload Simulator =================
function handlePrescriptionFile(event) {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('prescriptionPreview');
    const dropzoneText = document.getElementById('dropzoneText');

    const reader = new FileReader();
    reader.onload = function(e) {
        if (preview) {
            preview.src = e.target.result;
            preview.style.display = 'block';
        }
        if (dropzoneText) {
            dropzoneText.textContent = `تم اختيار الملف: ${file.name} (${(file.size / 1024).toFixed(0)} KB)`;
        }
    };
    reader.readAsDataURL(file);
}

function submitPrescriptionForm(event) {
    event.preventDefault();
    const phone = document.getElementById('rxPhone')?.value || '';
    const address = document.getElementById('rxAddress')?.value || '';
    const rxNumber = 'RX-' + Math.floor(100000 + Math.random() * 900000);

    closeModal('prescriptionUploadModal');
    
    // Reset form
    const form = document.getElementById('prescriptionForm');
    if (form) form.reset();
    const preview = document.getElementById('prescriptionPreview');
    if (preview) preview.style.display = 'none';

    // Show simulated confirmation
    const confirmModal = document.getElementById('orderSuccessModal');
    if (confirmModal) {
        document.getElementById('confirmedOrderNumber').textContent = rxNumber;
        document.getElementById('confirmedCustomerName').textContent = 'عميلنا العزيز';
        document.getElementById('successModalTitle').textContent = 'تم استلام صورة الروشتة الطبية بنجاح!';
        document.getElementById('successModalDesc').textContent = `سيقوم الصيدلي المناوب بمراجعة الروشتة والتواصل معك هاتفياً على الرقم (${phone}) لتأكيد الأصناف وتوصيلها لعنوانك في غضون 30 دقيقة.`;
        confirmModal.classList.add('active');
    }
}

// ================= 24/7 AI Pharmacist Chat Widget =================
function setupPharmacistChat() {
    const input = document.getElementById('pharmacistChatInput');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendPharmacistMessage();
        });
    }
}

function togglePharmacistChat() {
    const chatWin = document.getElementById('pharmacistChatWindow');
    if (!chatWin) return;
    chatWin.classList.toggle('active');
    if (chatWin.classList.contains('active')) {
        document.getElementById('pharmacistChatInput')?.focus();
    }
}

function sendQuickChatMessage(question) {
    const input = document.getElementById('pharmacistChatInput');
    if (input) {
        input.value = question;
        sendPharmacistMessage();
    }
}

function sendPharmacistMessage() {
    const input = document.getElementById('pharmacistChatInput');
    const container = document.getElementById('chatMessagesContainer');
    if (!input || !container) return;

    const text = input.value.trim();
    if (!text) return;

    // Append user message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.textContent = text;
    container.appendChild(userMsg);
    input.value = '';
    container.scrollTop = container.scrollHeight;

    // Simulate Pharmacist Thinking & Reply
    setTimeout(() => {
        let reply = generatePharmacistReply(text);
        const botMsg = document.createElement('div');
        botMsg.className = 'chat-msg bot';
        botMsg.innerHTML = reply;
        container.appendChild(botMsg);
        container.scrollTop = container.scrollHeight;
    }, 600);
}

function generatePharmacistReply(query) {
    const q = query.toLowerCase();

    // 1. Check FAQ Keywords
    for (const faq of PHARMACIST_FAQ) {
        if (faq.keywords.some(k => q.includes(k))) {
            return `<strong>د. الصيدلي:</strong><br>${faq.response.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}`;
        }
    }

    // 2. Search database for direct medicine inquiry
    const matchedMed = MEDICINES_DATABASE.find(m => 
        q.includes(m.name.toLowerCase()) || 
        q.includes(m.nameEn.toLowerCase()) ||
        q.includes(m.activeIngredient.toLowerCase())
    );

    if (matchedMed) {
        return `
            <strong>د. الصيدلي بخصوص "${matchedMed.name}":</strong><br>
            • <strong>المادة الفعالة:</strong> ${matchedMed.activeIngredient}<br>
            • <strong>دواعي الاستعمال:</strong> ${matchedMed.indications}<br>
            • <strong>الجرعة:</strong> ${matchedMed.dosage}<br>
            • <strong>السعر:</strong> ${matchedMed.price} ج.م (متوفر بالمخزون).<br>
            <button class="btn-add-cart" style="margin-top: 8px; font-size: 0.8rem; padding: 4px 10px;" onclick="addToCart('${matchedMed.id}')">
                <i class="fa-solid fa-cart-plus"></i> إضافة للسلة
            </button>
        `;
    }

    // Default intelligent guidance
    return `
        <strong>د. الصيدلي:</strong> أهلاً بك! لقد تم تسجيل استفسارك: "${query}". 
        نحن هنا لخدمتك دائماً. يمكنك البحث باسم الدواء أو العَرَض في شريط البحث العلوي، أو التواصل مباشرة مع الصيدلي المناوب هاتفياً على <strong>19999</strong> لأي حالة طارئة.
    `;
}

// ================= General Event Listeners =================
function setupEventListeners() {
    // Smart Search Input live filtering
    const searchInput = document.getElementById('smartSearchInput');
    const clearBtn = document.getElementById('clearSearchBtn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            AppState.searchQuery = e.target.value;
            if (clearBtn) {
                clearBtn.style.display = e.target.value.length > 0 ? 'block' : 'none';
            }
            applyFilters();
        });
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            clearBtn.style.display = 'none';
            AppState.searchQuery = '';
            applyFilters();
            searchInput.focus();
        });
    }

    // Sort select
    const sortSelect = document.getElementById('catalogSortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            AppState.sortBy = e.target.value;
            applyFilters();
        });
    }

    // Quick tag pills
    document.querySelectorAll('.quick-tag-pill').forEach(pill => {
        pill.addEventListener('click', () => {
            selectQuickFilter(pill.dataset.filter);
        });
    });

    // Close modals on outside click or ESC key
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-backdrop')) {
            e.target.classList.remove('active');
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.modal-backdrop.active').forEach(m => m.classList.remove('active'));
            toggleCartDrawer(false);
            const chatWin = document.getElementById('pharmacistChatWindow');
            if (chatWin) chatWin.classList.remove('active');
        }
    });
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
}

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
}

function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
    }
}

// Toast Notification
function showToast(message) {
    let toast = document.getElementById('globalToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'globalToast';
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%) translateY(100px);
            background: #0f172a;
            color: #ffffff;
            padding: 12px 24px;
            border-radius: 9999px;
            font-size: 0.92rem;
            font-weight: 700;
            font-family: Cairo, sans-serif;
            z-index: 2000;
            box-shadow: 0 10px 25px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.15);
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            gap: 8px;
            direction: rtl;
        `;
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color: #10b981;"></i> ${message}`;
    toast.style.transform = 'translateX(-50%) translateY(0)';

    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
        toast.style.transform = 'translateX(-50%) translateY(100px)';
    }, 2800);
}
