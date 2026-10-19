import { useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import StatementImportDialog from "./components/transactions/StatementImportDialog";
import DeleteTransactionDialog from "./components/transactions/DeleteTransactionDialog";
import { useTransactionDelete } from "./hooks/useTransactionDelete";
import Sidebar from "./components/layout/Sidebar";
import Topbar from "./components/layout/Topbar";
import PageHeading from "./components/layout/PageHeading";
import Footer from "./components/layout/Footer";
import SummaryCards from "./components/SummaryCards";
import Toast from "./components/Toast";
import ConnectionBanner from "./components/ConnectionBanner";
import TransactionDrawer from "./components/transactions/TransactionDrawer";
import OverviewPage from "./pages/OverviewPage";
import TransactionsPage from "./pages/TransactionsPage";
import ReportsPage from "./pages/ReportsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { useExpenseData } from "./hooks/useExpenseData";
import { useTransactionForm } from "./hooks/useTransactionForm";
import { useNotification } from "./hooks/useNotification";
import { buildMonthlyReport } from "./utils/reports";
import { currentMonth } from "./utils/format";

const pages = {
  "/overview": "Overview",
  "/transactions": "Transactions",
  "/reports": "Reports",
  "/categories": "Categories",
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const page = pages[location.pathname];

  const setPage = (nextPage) => {
    const path = `/${nextPage.toLowerCase()}`;

    if (pages[path]) {
      navigate(path);
    } else {
      navigate("/404");
    }
  };

  const [month, setMonth] = useState(currentMonth);
  const [importOpen, setImportOpen] = useState(false);

  const data = useExpenseData();

  const { notice, notify } = useNotification();

  const editor = useTransactionForm({
    ...data,
    month,
    notify,
  });

  const report = buildMonthlyReport(
    data.transactions,
    data.categories,
    month
  );

  const deletion = useTransactionDelete({
    deleteTransaction: data.deleteTransaction,
    notify,
  });

  const screenProps = {
    report,
    categories: data.categories,
    month,
    onEdit: editor.openForm,
    onAdd: () => editor.openForm(),
    onDelete: deletion.requestDelete,
    onImport: () => setImportOpen(true),
    canImport: data.mode === "MySQL API",
  };

  // Redirect the homepage to Overview
  if (location.pathname === "/") {
    return <Navigate to="/overview" replace />;
  }

  // Show 404 for any invalid URL
  if (!page) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-4 text-center">
        <h1 className="text-7xl font-bold text-gray-800">
          404
        </h1>

        <h2 className="text-2xl font-semibold text-gray-700">
          Page Not Found
        </h2>

        <p className="max-w-md text-gray-500">
          Sorry, the page you are looking for does not exist
          or may have been moved.
        </p>

        <button
          type="button"
          onClick={() => navigate("/overview")}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Back to Overview
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen max-[780px]:block print:block print:bg-white">
      {/* Sidebar */}
      <Sidebar page={page} onNavigate={setPage} />

      {/* Main dashboard container */}
      <div className="ml-[235px] w-[calc(100%-235px)] max-[1100px]:ml-[195px] max-[1100px]:w-[calc(100%-195px)] max-[780px]:m-0 max-[780px]:w-full print:m-0 print:w-full">
        {/* Topbar */}
        <Topbar
          page={page}
          mode={data.mode}
          workspace={data.workspace}
          onWorkspaceChange={(next) => {
            editor.setForm(null);
            navigate("/overview");
            data.switchWorkspace(next);
          }}
        />

        {/* Main content */}
        <main className="mx-auto max-w-[1550px] px-[38px] pt-9 pb-5 min-[1500px]:pt-[45px] max-[1100px]:px-[22px] max-[1100px]:py-7 max-[780px]:px-[18px] max-[780px]:py-[25px] print:p-0">
          <PageHeading
            page={page}
            month={month}
            onMonthChange={setMonth}
            mode={data.mode}
            onAdd={screenProps.onAdd}
          />

          <ConnectionBanner
            mode={data.mode}
            error={data.connectionError}
            onRetry={data.retryConnection}
            onDemo={() => data.switchWorkspace("demo")}
          />

          {/* Summary cards */}
          {page !== "Categories" && (
            <SummaryCards {...report} month={month} />
          )}

          {/* Application routes */}
          <Routes>
            <Route
              path="/overview"
              element={
                <OverviewPage
                  {...screenProps}
                  onViewAll={() => navigate("/transactions")}
                />
              }
            />

            <Route
              path="/transactions"
              element={
                <TransactionsPage {...screenProps} />
              }
            />

            <Route
              path="/reports"
              element={
                <ReportsPage {...screenProps} />
              }
            />

            <Route
              path="/categories"
              element={
                <CategoriesPage
                  categories={data.categories}
                  monthly={report.monthly}
                  mode={data.mode}
                  onAddCategory={data.addCategory}
                  onDeleteCategory={data.deleteCategory}
                  transactions={data.transactions}
                  notify={notify}
                />
              }
            />
          </Routes>

          <Footer month={month} />
        </main>
      </div>

      {/* Toast notification */}
      <Toast message={notice} />

      {/* Statement import dialog */}
      {importOpen && (
        <StatementImportDialog
          categories={data.categories}
          onClose={() => setImportOpen(false)}
          onImported={async (rows) => {
            await data.refreshData();

            if (rows.length) {
              setMonth(
                rows
                  .map((row) =>
                    row.transaction_date.slice(0, 7)
                  )
                  .sort()
                  .at(-1)
              );
            }

            navigate("/transactions");
          }}
        />
      )}

      {/* Delete transaction dialog */}
      {deletion.transaction && (
        <DeleteTransactionDialog
          transaction={deletion.transaction}
          busy={deletion.busy}
          error={deletion.error}
          onCancel={deletion.cancel}
          onConfirm={deletion.confirm}
        />
      )}

      {/* Transaction editor drawer */}
      {editor.form && (
        <TransactionDrawer
          {...editor}
          categories={data.categories}
          onSave={editor.submit}
        />
      )}
    </div>
  );
}