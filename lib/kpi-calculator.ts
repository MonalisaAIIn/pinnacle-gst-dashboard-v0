/**
 * KPI Calculator - Pure GST Data Derivation
 * NO prediction, NO scoring, NO ML
 * All KPIs are computed from GST API responses only
 */

export interface ReturnStatus {
  returnType: string
  returnPeriod: string
  status: "Filed" | "Pending" | "Not Due"
  filingDate?: string
  dueDate?: string
}

export interface GSTR1Data {
  b2b?: Array<{ inv: Array<{ txval: number; igst: number; cgst: number; sgst: number; cess: number }> }>
  b2c?: Array<{ txval: number; igst: number; cgst: number; sgst: number; cess: number }>
  exp?: Array<{ txval: number }>
}

export interface GSTR2BData {
  docdata?: {
    b2b?: Array<{ inv: Array<{ itc: { igst: number; cgst: number; sgst: number; cess: number } }> }>
  }
}

export interface GSTR3BData {
  inter_sup?: { txval: number }
  intra_sup?: { txval: number }
  itc_elg?: { itc_avl: { cgst: number; sgst: number; igst: number; cess: number } }
  intr_ltfee?: { intr: number; fee: number }
  tax_pay?: { cgst: number; sgst: number; igst: number; cess: number }
}

export interface CashLedger {
  bal_cgst?: number
  bal_sgst?: number
  bal_igst?: number
  bal_cess?: number
}

export interface CreditLedger {
  bal_cgst_itc?: number
  bal_sgst_itc?: number
  bal_igst_itc?: number
  bal_cess_itc?: number
}

export interface LiabilityLedger {
  liability_cgst?: number
  liability_sgst?: number
  liability_igst?: number
  liability_cess?: number
  paid_cgst?: number
  paid_sgst?: number
  paid_igst?: number
  paid_cess?: number
  interest?: number
  late_fee?: number
  penalty?: number
}

/**
 * =========================
 * DASHBOARD KPIs
 * =========================
 */

/**
 * Calculate Total Sales from GSTR-1
 */
export function calculateTotalSales(gstr1Data: GSTR1Data): {
  b2bSales: number
  b2cSales: number
  exportSales: number
  totalSales: number
  gstCollected: { cgst: number; sgst: number; igst: number; cess: number; total: number }
} {
  let b2bSales = 0
  let b2cSales = 0
  let exportSales = 0
  const gstCollected = { cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 }

  // B2B Sales
  if (gstr1Data.b2b) {
    for (const record of gstr1Data.b2b) {
      if (record.inv) {
        for (const invoice of record.inv) {
          b2bSales += invoice.txval || 0
          gstCollected.cgst += invoice.cgst || 0
          gstCollected.sgst += invoice.sgst || 0
          gstCollected.igst += invoice.igst || 0
          gstCollected.cess += invoice.cess || 0
        }
      }
    }
  }

  // B2C Sales
  if (gstr1Data.b2c) {
    for (const record of gstr1Data.b2c) {
      b2cSales += record.txval || 0
      gstCollected.cgst += record.cgst || 0
      gstCollected.sgst += record.sgst || 0
      gstCollected.igst += record.igst || 0
      gstCollected.cess += record.cess || 0
    }
  }

  // Export Sales
  if (gstr1Data.exp) {
    for (const record of gstr1Data.exp) {
      exportSales += record.txval || 0
    }
  }

  gstCollected.total = gstCollected.cgst + gstCollected.sgst + gstCollected.igst + gstCollected.cess

  return {
    b2bSales,
    b2cSales,
    exportSales,
    totalSales: b2bSales + b2cSales + exportSales,
    gstCollected,
  }
}

/**
 * Calculate ITC Available from GSTR-2B
 */
export function calculateITCAvailable(gstr2bData: GSTR2BData): {
  cgst: number
  sgst: number
  igst: number
  cess: number
  total: number
} {
  const itc = { cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 }

  if (gstr2bData.docdata?.b2b) {
    for (const record of gstr2bData.docdata.b2b) {
      if (record.inv) {
        for (const invoice of record.inv) {
          if (invoice.itc) {
            itc.cgst += invoice.itc.cgst || 0
            itc.sgst += invoice.itc.sgst || 0
            itc.igst += invoice.itc.igst || 0
            itc.cess += invoice.itc.cess || 0
          }
        }
      }
    }
  }

  itc.total = itc.cgst + itc.sgst + itc.igst + itc.cess

  return itc
}

/**
 * Calculate ITC Claimed from GSTR-3B
 */
export function calculateITCClaimed(gstr3bData: GSTR3BData): {
  cgst: number
  sgst: number
  igst: number
  cess: number
  total: number
} {
  const claimed = { cgst: 0, sgst: 0, igst: 0, cess: 0, total: 0 }

  if (gstr3bData.itc_elg?.itc_avl) {
    claimed.cgst = gstr3bData.itc_elg.itc_avl.cgst || 0
    claimed.sgst = gstr3bData.itc_elg.itc_avl.sgst || 0
    claimed.igst = gstr3bData.itc_elg.itc_avl.igst || 0
    claimed.cess = gstr3bData.itc_elg.itc_avl.cess || 0
    claimed.total = claimed.cgst + claimed.sgst + claimed.igst + claimed.cess
  }

  return claimed
}

/**
 * Calculate ITC Mismatch (2B vs 3B)
 */
export function calculateITCMismatch(
  gstr2bData: GSTR2BData,
  gstr3bData: GSTR3BData,
): {
  cgst: number
  sgst: number
  igst: number
  cess: number
  total: number
  percentageDiff: number
} {
  const available = calculateITCAvailable(gstr2bData)
  const claimed = calculateITCClaimed(gstr3bData)

  const mismatch = {
    cgst: available.cgst - claimed.cgst,
    sgst: available.sgst - claimed.sgst,
    igst: available.igst - claimed.igst,
    cess: available.cess - claimed.cess,
    total: available.total - claimed.total,
    percentageDiff: available.total > 0 ? ((available.total - claimed.total) / available.total) * 100 : 0,
  }

  return mismatch
}

/**
 * Calculate Cash Ledger Balance
 */
export function calculateCashBalance(cashLedger: CashLedger): {
  cgst: number
  sgst: number
  igst: number
  cess: number
  total: number
} {
  return {
    cgst: cashLedger.bal_cgst || 0,
    sgst: cashLedger.bal_sgst || 0,
    igst: cashLedger.bal_igst || 0,
    cess: cashLedger.bal_cess || 0,
    total:
      (cashLedger.bal_cgst || 0) + (cashLedger.bal_sgst || 0) + (cashLedger.bal_igst || 0) + (cashLedger.bal_cess || 0),
  }
}

/**
 * Calculate Credit Ledger Balance (ITC)
 */
export function calculateCreditBalance(creditLedger: CreditLedger): {
  cgst: number
  sgst: number
  igst: number
  cess: number
  total: number
} {
  return {
    cgst: creditLedger.bal_cgst_itc || 0,
    sgst: creditLedger.bal_sgst_itc || 0,
    igst: creditLedger.bal_igst_itc || 0,
    cess: creditLedger.bal_cess_itc || 0,
    total:
      (creditLedger.bal_cgst_itc || 0) +
      (creditLedger.bal_sgst_itc || 0) +
      (creditLedger.bal_igst_itc || 0) +
      (creditLedger.bal_cess_itc || 0),
  }
}

/**
 * Calculate Tax Liability & Outstanding
 */
export function calculateLiability(liabilityLedger: LiabilityLedger): {
  liability: { cgst: number; sgst: number; igst: number; cess: number; total: number }
  paid: { cgst: number; sgst: number; igst: number; cess: number; total: number }
  outstanding: { cgst: number; sgst: number; igst: number; cess: number; total: number }
  interest: number
  lateFee: number
  penalty: number
  totalOutstanding: number
} {
  const liability = {
    cgst: liabilityLedger.liability_cgst || 0,
    sgst: liabilityLedger.liability_sgst || 0,
    igst: liabilityLedger.liability_igst || 0,
    cess: liabilityLedger.liability_cess || 0,
    total: 0,
  }
  liability.total = liability.cgst + liability.sgst + liability.igst + liability.cess

  const paid = {
    cgst: liabilityLedger.paid_cgst || 0,
    sgst: liabilityLedger.paid_sgst || 0,
    igst: liabilityLedger.paid_igst || 0,
    cess: liabilityLedger.paid_cess || 0,
    total: 0,
  }
  paid.total = paid.cgst + paid.sgst + paid.igst + paid.cess

  const outstanding = {
    cgst: liability.cgst - paid.cgst,
    sgst: liability.sgst - paid.sgst,
    igst: liability.igst - paid.igst,
    cess: liability.cess - paid.cess,
    total: liability.total - paid.total,
  }

  const interest = liabilityLedger.interest || 0
  const lateFee = liabilityLedger.late_fee || 0
  const penalty = liabilityLedger.penalty || 0

  return {
    liability,
    paid,
    outstanding,
    interest,
    lateFee,
    penalty,
    totalOutstanding: outstanding.total + interest + lateFee + penalty,
  }
}

/**
 * Calculate Returns Filed vs Pending
 */
export function calculateReturnsStatus(returnStatuses: ReturnStatus[]): {
  filed: number
  pending: number
  notDue: number
  total: number
  filingRate: number
} {
  const filed = returnStatuses.filter((r) => r.status === "Filed").length
  const pending = returnStatuses.filter((r) => r.status === "Pending").length
  const notDue = returnStatuses.filter((r) => r.status === "Not Due").length
  const total = returnStatuses.length

  return {
    filed,
    pending,
    notDue,
    total,
    filingRate: total > 0 ? (filed / total) * 100 : 0,
  }
}

/**
 * =========================
 * TIME-SERIES KPIs
 * =========================
 */

export interface PeriodKPI {
  period: string // MMYYYY format
  value: number
}

/**
 * Generate month-wise sales trend
 */
export function generateSalesTrend(gstr1DataByPeriod: Record<string, GSTR1Data>): PeriodKPI[] {
  const trend: PeriodKPI[] = []

  for (const period in gstr1DataByPeriod) {
    const sales = calculateTotalSales(gstr1DataByPeriod[period])
    trend.push({
      period,
      value: sales.totalSales,
    })
  }

  return trend.sort((a, b) => a.period.localeCompare(b.period))
}

/**
 * Generate month-wise ITC trend
 */
export function generateITCTrend(gstr2bDataByPeriod: Record<string, GSTR2BData>): PeriodKPI[] {
  const trend: PeriodKPI[] = []

  for (const period in gstr2bDataByPeriod) {
    const itc = calculateITCAvailable(gstr2bDataByPeriod[period])
    trend.push({
      period,
      value: itc.total,
    })
  }

  return trend.sort((a, b) => a.period.localeCompare(b.period))
}

/**
 * =========================
 * DASHBOARD OVERVIEW KPIs
 * =========================
 */

export interface DashboardKPIs {
  sales: {
    total: number
    b2b: number
    b2c: number
    export: number
  }
  itc: {
    available: number
    claimed: number
    mismatch: number
    mismatchPercentage: number
  }
  liability: {
    total: number
    paid: number
    outstanding: number
    interest: number
    lateFee: number
    penalty: number
  }
  cashBalance: number
  creditBalance: number
  returns: {
    filed: number
    pending: number
    filingRate: number
  }
}

/**
 * Calculate comprehensive dashboard KPIs
 */
export function calculateDashboardKPIs(
  gstr1Data: GSTR1Data,
  gstr2bData: GSTR2BData,
  gstr3bData: GSTR3BData,
  cashLedger: CashLedger,
  creditLedger: CreditLedger,
  liabilityLedger: LiabilityLedger,
  returnStatuses: ReturnStatus[],
): DashboardKPIs {
  const sales = calculateTotalSales(gstr1Data)
  const itcAvailable = calculateITCAvailable(gstr2bData)
  const itcClaimed = calculateITCClaimed(gstr3bData)
  const itcMismatch = calculateITCMismatch(gstr2bData, gstr3bData)
  const liability = calculateLiability(liabilityLedger)
  const cash = calculateCashBalance(cashLedger)
  const credit = calculateCreditBalance(creditLedger)
  const returns = calculateReturnsStatus(returnStatuses)

  return {
    sales: {
      total: sales.totalSales,
      b2b: sales.b2bSales,
      b2c: sales.b2cSales,
      export: sales.exportSales,
    },
    itc: {
      available: itcAvailable.total,
      claimed: itcClaimed.total,
      mismatch: itcMismatch.total,
      mismatchPercentage: itcMismatch.percentageDiff,
    },
    liability: {
      total: liability.liability.total,
      paid: liability.paid.total,
      outstanding: liability.outstanding.total,
      interest: liability.interest,
      lateFee: liability.lateFee,
      penalty: liability.penalty,
    },
    cashBalance: cash.total,
    creditBalance: credit.total,
    returns: {
      filed: returns.filed,
      pending: returns.pending,
      filingRate: returns.filingRate,
    },
  }
}
