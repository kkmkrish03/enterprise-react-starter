import { useState } from 'react';
import {
  Button,
  Card,
  InputField,
  SelectField,
  Modal,
  DataTable,
  LoadingSpinner,
  ErrorBoundary
} from '@bare-bodhika/ui';
import { Box, Typography, Grid, Slider, FormControlLabel, Switch } from '@mui/material';
import { useNotificationStore } from '@bare-bodhika/core';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const CrashComponent = () => {
  throw new Error("Deliberate component failure triggered from components playground.");
};

export const ComponentsCatalog = () => {
  const addNotification = useNotificationStore(state => state.addNotification);

  // Button Playground State
  const [btnLoading, setBtnLoading] = useState(false);
  const [btnDisabled, setBtnDisabled] = useState(false);

  // Input Playground State
  const [textVal, setTextVal] = useState('');
  const [textError, setTextError] = useState('');
  const [pwdVal, setPwdVal] = useState('');
  const [selectVal, setSelectVal] = useState('react');

  // Card Playground State
  const [cardElevation, setCardElevation] = useState<number>(3); // md
  const [cardLoading, setCardLoading] = useState(false);

  // Modal Playground State
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');

  // Crash Simulation Playground State
  const [triggerCrash, setTriggerCrash] = useState(false);

  // DataTable State
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  const mockProducts = [
    { id: 1, name: 'Quantum CPU Core', category: 'Hardware', price: '$499', stock: 12 },
    { id: 2, name: 'OLED Wide Monitor', category: 'Display', price: '$899', stock: 5 },
    { id: 3, name: 'Mechanical Keyboard v2', category: 'Peripherals', price: '$150', stock: 45 },
    { id: 4, name: 'Wireless Gaming Mouse', category: 'Peripherals', price: '$99', stock: 80 },
    { id: 5, name: 'AI Acceleration Card', category: 'Hardware', price: '$1200', stock: 2 },
  ];

  interface Product {
    id: number;
    name: string;
    category: string;
    price: string;
    stock: number;
  }

  // Client side sorting and paging
  const sortedProducts = [...mockProducts].sort((a, b) => {
    const aVal = (a as Record<string, string | number>)[sortKey];
    const bVal = (b as Record<string, string | number>)[sortKey];
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  const columns = [
    { key: 'id', header: 'Product ID', sortable: true },
    { key: 'name', header: 'Product Name', sortable: true },
    { key: 'category', header: 'Category' },
    { key: 'price', header: 'Unit Price', sortable: true },
    {
      key: 'stock',
      header: 'Availability',
      render: (row: Product) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${
            row.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}
        >
          {row.stock} in stock
        </span>
      ),
    },
  ];

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  const triggerToast = (type: 'success' | 'error' | 'info' | 'warning', msg: string) => {
    addNotification({ type, message: msg });
  };

  const getElevationLabel = (val: number) => {
    if (val === 0) return 'none';
    if (val === 1) return 'sm';
    if (val === 3) return 'md';
    return 'lg';
  };

  return (
    <Box className="space-y-6 max-w-7xl mx-auto pb-12 animate-fade-in">
      <Box className="border-b border-slate-205 dark:border-slate-800 pb-5">
        <Typography variant="h3" className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50">
          UI Components Playground
        </Typography>
        <Typography variant="body2" color="text.secondary" className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
          Interactive sandboxes for visualizing, configuring, and testing properties across all refactored platform UI library components.
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Buttons Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Buttons Sandbox" subtitle="Visualise state overlays, loading indicators, and color variants.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Controls */}
              <Box sx={{ display: 'flex', gap: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                <FormControlLabel
                  control={<Switch checked={btnLoading} onChange={(e) => setBtnLoading(e.target.checked)} />}
                  label="Loading Spinner"
                />
                <FormControlLabel
                  control={<Switch checked={btnDisabled} onChange={(e) => setBtnDisabled(e.target.checked)} />}
                  label="Disabled State"
                />
              </Box>

              {/* Showcase */}
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Button Color Variants</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                <Button variant="primary" isLoading={btnLoading} disabled={btnDisabled}>Primary</Button>
                <Button variant="secondary" isLoading={btnLoading} disabled={btnDisabled}>Secondary</Button>
                <Button variant="success" isLoading={btnLoading} disabled={btnDisabled}>Success</Button>
                <Button variant="danger" isLoading={btnLoading} disabled={btnDisabled}>Danger</Button>
                <Button variant="outline" isLoading={btnLoading} disabled={btnDisabled}>Outline</Button>
                <Button variant="text" isLoading={btnLoading} disabled={btnDisabled}>Text Link</Button>
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Button Sizes</Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                <Button variant="primary" size="sm" isLoading={btnLoading} disabled={btnDisabled}>Small Size</Button>
                <Button variant="primary" size="md" isLoading={btnLoading} disabled={btnDisabled}>Medium Size</Button>
                <Button variant="primary" size="lg" isLoading={btnLoading} disabled={btnDisabled}>Large Size</Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Form Fields Section */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Forms & Inputs Sandbox" subtitle="Test labels, placeholders, dropdown items, error messages, and validation overlays.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Grid container spacing={2}>
                <Grid size={12}>
                  <InputField
                    label="Sample Interactive Input"
                    placeholder="Type anything to test validation..."
                    value={textVal}
                    onChange={(e) => {
                      const val = e.target.value;
                      setTextVal(val);
                      if (val.length < 3 && val.length > 0) {
                        setTextError('Input value must contain at least 3 characters.');
                      } else {
                        setTextError('');
                      }
                    }}
                    error={textError}
                    helperText={textError || 'Helper text guides users on valid content.'}
                  />
                </Grid>
                <Grid size={6}>
                  <InputField
                    label="Secure Password Input"
                    placeholder="Enter password..."
                    value={pwdVal}
                    onChange={(e) => setPwdVal(e.target.value)}
                    isPassword
                  />
                </Grid>
                <Grid size={6}>
                  <SelectField
                    label="Frontend Tech Stack"
                    value={selectVal}
                    onChange={(e) => setSelectVal(e.target.value)}
                    options={[
                      { value: 'react', label: 'React + TypeScript' },
                      { value: 'angular', label: 'Angular Signals' },
                      { value: 'vue', label: 'Vue 3 Composition' },
                      { value: 'svelte', label: 'Svelte 5 Runes' }
                    ]}
                  />
                </Grid>
              </Grid>
            </Box>
          </Card>
        </Grid>

        {/* Card Configurations */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Card Elevations & Loaders" subtitle="Verify card shadows and layout skeleton overlays.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Controls */}
              <Box sx={{ display: 'flex', gap: 3, borderBottom: '1px solid', borderColor: 'divider', pb: 2, alignItems: 'center' }}>
                <FormControlLabel
                  control={<Switch checked={cardLoading} onChange={(e) => setCardLoading(e.target.checked)} />}
                  label="Skeleton Loading"
                />
                <Box sx={{ flexGrow: 1, px: 2 }}>
                  <Typography id="elevation-slider" variant="caption" sx={{ fontWeight: 'bold' }}>Elevation Shadow Level</Typography>
                  <Slider
                    aria-labelledby="elevation-slider"
                    value={cardElevation}
                    step={null}
                    marks={[
                      { value: 0, label: 'none' },
                      { value: 1, label: 'sm' },
                      { value: 3, label: 'md' },
                      { value: 6, label: 'lg' }
                    ]}
                    min={0}
                    max={6}
                    onChange={(_, val) => setCardElevation(val as number)}
                  />
                </Box>
              </Box>

              {/* Showcase */}
              <Box sx={{ py: 1 }}>
                <Card
                  title={`Showcase Card (Elevation: ${getElevationLabel(cardElevation)})`}
                  subtitle="Dynamic sandbox container nested for shadow evaluation."
                  elevation={cardElevation === 0 ? 'none' : cardElevation === 1 ? 'sm' : cardElevation === 3 ? 'md' : 'lg'}
                  isLoading={cardLoading}
                  footer={
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button variant="outline" size="sm">Dismiss</Button>
                      <Button variant="primary" size="sm">Confirm Action</Button>
                    </Box>
                  }
                >
                  <Typography variant="body2">
                    Card layout elements wrap gracefully. This inner card inherits variables directly from the sandbox elevation slider configurations.
                  </Typography>
                </Card>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* Modals & Dialogs */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card title="Modal & Feedback Dialogs" subtitle="Launch modals at different dimensions to check focus locking and backdrop dismissals.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Typography variant="body2">
                Configure standard Dialog dimensions and click trigger button to test overlay rendering.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', borderBottom: '1px solid', borderColor: 'divider', pb: 2 }}>
                <Button variant={modalSize === 'sm' ? 'primary' : 'outline'} size="sm" onClick={() => setModalSize('sm')}>sm Size</Button>
                <Button variant={modalSize === 'md' ? 'primary' : 'outline'} size="sm" onClick={() => setModalSize('md')}>md Size</Button>
                <Button variant={modalSize === 'lg' ? 'primary' : 'outline'} size="sm" onClick={() => setModalSize('lg')}>lg Size</Button>
                <Button variant={modalSize === 'xl' ? 'primary' : 'outline'} size="sm" onClick={() => setModalSize('xl')}>xl Size</Button>
              </Box>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="primary" onClick={() => setModalOpen(true)}>
                  Launch {modalSize.toUpperCase()} Dialog Modal
                </Button>
                <Button variant="success" onClick={() => triggerToast('success', 'Triggered via page playground!')}>
                  Trigger Alert Toast
                </Button>
              </Box>
            </Box>
          </Card>
        </Grid>

        {/* System Feedback & Fault Isolation Sandbox */}
        <Grid size={12}>
          <Card title="System Feedback & Fault Isolation Playgrounds" subtitle="Test application notification toasts and isolated crash boundaries.">
            <Grid container spacing={3}>
              
              {/* Toasts section */}
              <Grid size={{ xs: 12, md: 6 }} className="space-y-4">
                <Typography className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">
                  GLOBAL NOTIFICATION TOASTS
                </Typography>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Trigger global sliding notification alert banners with color variants using the central Zustand notification store.
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => triggerToast('success', 'Operation completed successfully!')}
                    className="py-2 px-3 rounded-lg text-xs font-bold text-emerald-800 dark:text-emerald-350 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-150 dark:border-emerald-900/60 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 active:scale-95 transition-all cursor-pointer"
                  >
                    Trigger Success Toast
                  </button>
                  
                  <button 
                    onClick={() => triggerToast('error', 'Critical execution failure.')}
                    className="py-2 px-3 rounded-lg text-xs font-bold text-rose-800 dark:text-rose-355 bg-rose-50 dark:bg-rose-950/20 border border-rose-150 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-950/40 active:scale-95 transition-all cursor-pointer"
                  >
                    Trigger Error Toast
                  </button>

                  <button 
                    onClick={() => triggerToast('info', 'System configuration updated.')}
                    className="py-2 px-3 rounded-lg text-xs font-bold text-blue-800 dark:text-blue-355 bg-blue-500/10 border border-blue-150 dark:border-blue-900/60 hover:bg-blue-200/20 dark:hover:bg-blue-950/40 active:scale-95 transition-all cursor-pointer"
                  >
                    Trigger Info Toast
                  </button>

                  <button 
                    onClick={() => triggerToast('warning', 'Low storage allocation warning.')}
                    className="py-2 px-3 rounded-lg text-xs font-bold text-amber-800 dark:text-amber-350 bg-amber-50 dark:bg-amber-950/20 border border-amber-150 dark:border-amber-900/60 hover:bg-amber-100 dark:hover:bg-amber-950/40 active:scale-95 transition-all cursor-pointer"
                  >
                    Trigger Warning Toast
                  </button>
                </div>
              </Grid>

              {/* Crash component exception boundary */}
              <Grid size={{ xs: 12, md: 6 }} className="space-y-4">
                <Typography className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1 block">
                  FAULT ISOLATION (ERROR BOUNDARIES)
                </Typography>
                <div className="p-4 border border-rose-150 dark:border-rose-950/50 bg-rose-50/20 dark:bg-rose-950/5 rounded-xl">
                  <ErrorBoundary
                    fallback={(error, reset) => (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs">
                          <WarningAmberIcon className="w-4 h-4" /> Crash Intercepted Successfully
                        </div>
                        <div className="font-mono text-[10px] p-2.5 rounded bg-slate-900 dark:bg-black text-rose-450 border border-rose-900/40 max-h-[85px] overflow-auto select-all">
                          {error.message}
                        </div>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="w-full text-xs font-bold py-2 rounded-lg cursor-pointer"
                          onClick={() => {
                            setTriggerCrash(false);
                            reset();
                          }}
                        >
                          Recover Components Playground
                        </Button>
                      </div>
                    )}
                  >
                    {triggerCrash ? (
                      <CrashComponent />
                    ) : (
                      <div className="space-y-2">
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                          Force exception throwing inside this isolated card boundary. Test React's ability to isolate faults and recover safely.
                        </p>
                        <Button 
                          variant="danger" 
                          size="sm" 
                          className="w-full text-xs font-bold py-2 rounded-lg bg-rose-600 hover:bg-rose-700 cursor-pointer"
                          onClick={() => setTriggerCrash(true)}
                        >
                          Trigger Crash Exception
                        </Button>
                      </div>
                    )}
                  </ErrorBoundary>
                </div>
              </Grid>

            </Grid>
          </Card>
        </Grid>

        {/* DataTable Section */}
        <Grid size={12}>
          <Card title="Interactive DataTable Sandbox" subtitle="Verify data sorting algorithms, custom column widgets, and pagination navigation.">
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <DataTable
                columns={columns}
                data={sortedProducts}
                sort={{
                  key: sortKey,
                  direction: sortDir,
                  onSort: handleSort
                }}
                pagination={{
                  currentPage: currentPage,
                  totalPages: 3,
                  onPageChange: (page) => {
                    setCurrentPage(page);
                    triggerToast('info', `Switched view state to page ${page}`);
                  }
                }}
              />
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Modal Dialog */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`${modalSize.toUpperCase()} Dimension Sandbox Dialog`}
        size={modalSize}
        footerActions={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="primary" onClick={() => {
              triggerToast('success', 'Modal feedback captured.');
              setModalOpen(false);
            }}>Acknowledge</Button>
          </>
        }
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1">
            This dialog modal demonstrates responsive sizes and ensures that screen reader focal points are constrained correctly.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <LoadingSpinner />
            <Typography variant="caption" color="text.secondary">A loading spinner can render inline to signal active validation states.</Typography>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default ComponentsCatalog;
