import React, { useState } from 'react';
import {
  SOVEREIGN_PORTS,
  SLA_SERVICES_CATALOG,
  MONITORED_COMPANY_TYPES,
  SOVEREIGN_ROLES,
  SovereignPort
} from '@/lib/constants';
import {
  getSeizures,
  saveSeizures,
  getMigrants,
  saveMigrants,
  getRefugees,
  saveRefugees,
  getForeigners,
  saveForeigners,
  getMovementPermits,
  saveMovementPermits,
  getCitizenshipCases,
  saveCitizenshipCases,
  getMonitoredCompanies,
  saveMonitoredCompanies,
  getCorrespondence,
  saveCorrespondence,
  getAuditLogs,
  addAuditLog,
  getDeveloperSettings,
  saveDeveloperSettings,
  generateId,
  getCurrentUser
} from '@/lib/storage';
import {
  PassportSeizure,
  UndocumentedMigrant,
  RefugeeRecord,
  ForeignerResident,
  InternalMovementPermit,
  CitizenshipAndLegalCase,
  MonitoredCompany,
  OfficialCorrespondence,
  AuditLogEntity,
  DeveloperSystemSettings,
  PassportTimelineStatus
} from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { exportToExcel, exportToPDF, handlePrint } from '@/lib/exportUtils';
import {
  ShieldCheck,
  Plane,
  Truck,
  Anchor,
  FileText,
  AlertTriangle,
  UserX,
  Users,
  Compass,
  Building,
  Mail,
  Sliders,
  CheckCircle,
  Clock,
  Search,
  Plus,
  Printer,
  Download,
  Eye,
  FileSpreadsheet,
  Stamp,
  UserCheck,
  ChevronRight,
  Sparkles,
  MapPin,
  Lock,
  ArrowRightLeft
} from 'lucide-react';

export const SovereignModulesHub: React.FC = () => {
  const { toast } = useToast();
  const currentUser = getCurrentUser();

  // Active module tab
  const [activeModule, setActiveModule] = useState<
    'ports' | 'seizures' | 'migrants' | 'refugees' | 'foreigners' | 'permits' | 'citizenship' | 'companies' | 'correspondence' | 'audit' | 'developer' | 'intelligence'
  >('ports');

  // Datasets state
  const [seizures, setSeizures] = useState<PassportSeizure[]>(getSeizures);
  const [migrants, setMigrants] = useState<UndocumentedMigrant[]>(getMigrants);
  const [refugees, setRefugees] = useState<RefugeeRecord[]>(getRefugees);
  const [foreigners, setForeigners] = useState<ForeignerResident[]>(getForeigners);
  const [permits, setPermits] = useState<InternalMovementPermit[]>(getMovementPermits);
  const [citizenshipCases, setCitizenshipCases] = useState<CitizenshipAndLegalCase[]>(getCitizenshipCases);
  const [companies, setCompanies] = useState<MonitoredCompany[]>(getMonitoredCompanies);
  const [correspondences, setCorrespondences] = useState<OfficialCorrespondence[]>(getCorrespondence);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntity[]>(getAuditLogs);
  const [devSettings, setDevSettings] = useState<DeveloperSystemSettings>(getDeveloperSettings);

  // Search filter
  const [search, setSearch] = useState('');

  // Modals
  const [newSeizureOpen, setNewSeizureOpen] = useState(false);
  const [newMigrantOpen, setNewMigrantOpen] = useState(false);
  const [newPermitOpen, setNewPermitOpen] = useState(false);
  const [newCorrespondenceOpen, setNewCorrespondenceOpen] = useState(false);
  const [viewPermitItem, setViewPermitItem] = useState<InternalMovementPermit | null>(null);

  // Forms
  const [seizureForm, setSeizureForm] = useState<Partial<PassportSeizure>>({
    travelerName: '',
    passportNumber: '',
    nationality: 'اليمن',
    seizurePort: 'منفذ الوديعة البري',
    reason: '',
    status: 'جديد',
    referredTo: 'فرع استخبارات الشرطة'
  });

  const [migrantForm, setMigrantForm] = useState<Partial<UndocumentedMigrant>>({
    fullName: '',
    nationality: 'إثيوبيا',
    countryOfOrigin: 'إثيوبيا',
    infiltrationPoint: 'ساحل ذباب - باب المندب',
    gender: 'ذكر',
    approximateAge: 25,
    medicalCheckStatus: 'سليم',
    shelterCenter: 'مركز إيواء عمران'
  });

  const [permitForm, setPermitForm] = useState<Partial<InternalMovementPermit>>({
    delegationName: '',
    organizationType: 'منظمة أمم متحدة (UN)',
    authorizedRoute: 'صنعاء -> ذمار -> إب -> تعز',
    delegationHead: '',
    passportNumber: '',
    passengersCount: 4,
    securityEscortNeeded: true
  });

  const [corrForm, setCorrForm] = useState<Partial<OfficialCorrespondence>>({
    letterType: 'طلب تحري أمني',
    recipientEntity: 'الأخ/ مدير فرع استخبارات الشرطة المحترم',
    referenceText: 'عطفاً على مذكرة المنفذ بتاريخ اليوم',
    subject: '',
    introClause: 'نفيدكم علماً بأنه تم ضبط حالة اشتباه تتطلب المباينة الجنائية.',
    actionRequired: 'وعليه نرجو التكرم بالتوجيه بالتحري وموافاتنا برأيكم الأمني.',
    signatoryTitle: 'مدير عام المنافذ والرقابة الحدودية',
    signatoryName: currentUser?.name || 'العميد الركن/ عبد الله مسعد الصرابي'
  });

  // Action handlers
  const handleSaveSeizure = () => {
    if (!seizureForm.travelerName || !seizureForm.passportNumber) {
      toast({ title: 'خطأ', description: 'اسم المسافر ورقم الجواز مطلوبان', variant: 'destructive' });
      return;
    }
    const newRecord: PassportSeizure = {
      id: generateId(),
      recordNumber: `محضر-2026-00${seizures.length + 15}`,
      travelerName: seizureForm.travelerName || '',
      passportNumber: seizureForm.passportNumber || '',
      nationality: seizureForm.nationality || 'اليمن',
      seizurePort: seizureForm.seizurePort || 'منفذ الوديعة البري',
      seizureDate: new Date().toISOString().split('T')[0],
      officerInCharge: currentUser?.name || 'الضابط المناوب',
      reason: seizureForm.reason || 'اشتباه تزوير أو مخالفة شروط العبور',
      status: seizureForm.status as PassportTimelineStatus || 'جديد',
      referredTo: seizureForm.referredTo as any,
      referralDate: new Date().toISOString().split('T')[0],
      referralNotes: 'رقم القيد الأمني: 001 / ملف التحقيق المركزي: 001',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...seizures];
    setSeizures(updated);
    saveSeizures(updated);
    addAuditLog('إنشاء', 'المضبوطات والجوازات', `قيد محضر ضبط جواز رقم ${newRecord.passportNumber} بالمنفذ`, newRecord.id);
    setNewSeizureOpen(false);
    toast({ title: 'تم حفظ محضر الضبط', description: `تم إصدار الرقم: ${newRecord.recordNumber}` });
  };

  const handleUpdateSeizureStatus = (id: string, newStatus: PassportTimelineStatus) => {
    const updated = seizures.map(s => (s.id === id ? { ...s, status: newStatus, updatedAt: new Date().toISOString() } : s));
    setSeizures(updated);
    saveSeizures(updated);
    addAuditLog('تعديل', 'المضبوطات والجوازات', `تحديث الخط الزمني للمحضر إلى: ${newStatus}`, id);
    toast({ title: 'تم تحديث الخط الزمني للمضبوطات' });
  };

  const handleSaveMigrant = () => {
    if (!migrantForm.fullName) {
      toast({ title: 'خطأ', description: 'الاسم الكامل مطلوب', variant: 'destructive' });
      return;
    }
    const newRecord: UndocumentedMigrant = {
      id: generateId(),
      fileNumber: `هجرة-2026-00${migrants.length + 91}`,
      fullName: migrantForm.fullName || '',
      nationality: migrantForm.nationality || 'إثيوبيا',
      countryOfOrigin: migrantForm.countryOfOrigin || 'إثيوبيا',
      infiltrationPoint: migrantForm.infiltrationPoint || 'ساحل ذباب',
      apprehensionDate: new Date().toISOString().split('T')[0],
      apprehensionPlace: 'القطاع الساحلي الغربي',
      gender: (migrantForm.gender as any) || 'ذكر',
      approximateAge: Number(migrantForm.approximateAge) || 25,
      medicalCheckStatus: (migrantForm.medicalCheckStatus as any) || 'سليم',
      fingerprintRegistered: true,
      shelterCenter: migrantForm.shelterCenter || 'مركز إيواء عمران',
      deportationStatus: 'قيد الإيواء والتحقيق',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...migrants];
    setMigrants(updated);
    saveMigrants(updated);
    addAuditLog('إنشاء', 'المهاجرون غير الشرعيين', `قيد وضبط مهاجر غير نظامي: ${newRecord.fullName}`, newRecord.id);
    setNewMigrantOpen(false);
    toast({ title: 'تم قيد المهاجر بنجاح', description: `رقم الملف: ${newRecord.fileNumber}` });
  };

  const handleSavePermit = () => {
    if (!permitForm.delegationName || !permitForm.delegationHead) {
      toast({ title: 'خطأ', description: 'اسم الوفد ورئيس الوفد مطلوبان', variant: 'destructive' });
      return;
    }
    const code = `تصريح-أمني-2026-00${permits.length + 46}`;
    const newRecord: InternalMovementPermit = {
      id: generateId(),
      permitCode: code,
      delegationName: permitForm.delegationName || '',
      organizationType: (permitForm.organizationType as any) || 'منظمة أمم متحدة (UN)',
      authorizedRoute: permitForm.authorizedRoute || 'صنعاء -> ذمار -> إب -> تعز',
      allowedCheckpoints: ['نقطة يسلح', 'نقطة نجد الأحمر', 'نقطة مفرق ذمار'],
      vehicleDetails: [{ plate: 'أمم متحدة 105', model: 'Toyota Prado', color: 'أبيض' }],
      delegationHead: permitForm.delegationHead || '',
      passportNumber: permitForm.passportNumber || 'UN-PASSPORT',
      passengersCount: Number(permitForm.passengersCount) || 4,
      securityEscortNeeded: Boolean(permitForm.securityEscortNeeded),
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      accommodationPlace: 'مقر المنظمة الرسمي بالمحافظة',
      qrVerificationCode: `PERMIT:${code}:${permitForm.delegationHead}`,
      approvalStatus: 'معتمد رسمياً',
      approvedBy: currentUser?.name || 'مدير عام العمليات',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...permits];
    setPermits(updated);
    saveMovementPermits(updated);
    addAuditLog('إنشاء', 'تصاريح التنقل', `إصدار تصريح أمني للوفد: ${newRecord.delegationName}`, newRecord.id);
    setNewPermitOpen(false);
    setViewPermitItem(newRecord);
    toast({ title: 'تم إصدار التصريح الأمني بنجاح', description: code });
  };

  const handleSaveCorrespondence = () => {
    if (!corrForm.subject) {
      toast({ title: 'خطأ', description: 'موضوع البرقية/المذكرة مطلوب', variant: 'destructive' });
      return;
    }
    const inOut = `ص-2026-00${correspondences.length + 43}`;
    const newRecord: OfficialCorrespondence = {
      id: generateId(),
      incomingOutgoingNumber: inOut,
      letterType: (corrForm.letterType as any) || 'طلب تحري أمني',
      gregorianDate: new Date().toISOString().split('T')[0],
      hijriDate: '26 جمادى الأولى 1448هـ',
      senderEntity: 'مصلحة الهجرة والجوازات والجنسية - الإدارة العامة للمنافذ والرقابة الحدودية',
      recipientEntity: corrForm.recipientEntity || 'الأخ/ مدير فرع استخبارات الشرطة المحترم',
      referenceText: corrForm.referenceText || 'بشأن مباينة أمنية عاجلة',
      subject: corrForm.subject || '',
      introClause: corrForm.introClause || 'نفيدكم علماً بأنه تم ضبط حالة اشتباه.',
      actionRequired: corrForm.actionRequired || 'يرجى التكرم بالاطلاع والتوجيه بالتحري.',
      closingClause: 'وتقبلوا خالص التحية والتقدير،،،',
      signatoryTitle: corrForm.signatoryTitle || 'مدير عام المنافذ والرقابة الحدودية',
      signatoryName: corrForm.signatoryName || currentUser?.name || 'العميد الركن/ عبد الله مسعد الصرابي',
      isUrgent: true,
      status: 'معتمد ومرسل',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const updated = [newRecord, ...correspondences];
    setCorrespondences(updated);
    saveCorrespondence(updated);
    addAuditLog('إنشاء', 'المكاتبات والبرقيات', `توليد برقية رسمية رقم ${inOut} بشأن ${newRecord.subject}`, newRecord.id);
    setNewCorrespondenceOpen(false);
    toast({ title: 'تم تصدير المكاتبة الرسمية', description: inOut });
  };

  return (
    <div className="space-y-6">
      {/* Sovereign Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-primary to-slate-900 text-white p-5 rounded-2xl shadow-md border border-white/10">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-white/10 rounded-2xl border border-white/20 shrink-0">
            <img src="/assets/aistudio/ic_launcher_e65b28d6.png" alt="الشعار السيادي" className="h-10 w-auto object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">منظومة الوحدات السيادية الـ 14</h1>
              <Badge className="bg-amber-400 text-slate-950 font-bold hover:bg-amber-300 text-xs">
                Sovereign Central
              </Badge>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              الرقابة المركزية على المنافذ الـ 13، استخبارات الشرطة، قضايا الجنسية والزواج، والمضبوطات والتصاريح الأمنية.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-stretch lg:self-auto flex-wrap">
          <div className="bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-xs">
            <span className="text-slate-400 block text-[10px]">المستخدم الحالي:</span>
            <span className="font-bold text-amber-300">{currentUser?.name}</span>
            <span className="text-[10px] text-white/80 block">({currentUser?.role || 'مدير عام'})</span>
          </div>
        </div>
      </div>

      {/* 14 Sovereign Modules Nav Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b scrollbar-thin">
        {[
          { id: 'ports', label: 'المنافذ الـ 13 السيادية', icon: Plane, count: SOVEREIGN_PORTS.length },
          { id: 'seizures', label: 'محاضر الجوازات المضبوطة', icon: Stamp, count: seizures.length },
          { id: 'migrants', label: 'المهاجرون غير الشرعيين', icon: UserX, count: migrants.length },
          { id: 'refugees', label: 'اللاجئون و UNHCR', icon: Users, count: refugees.length },
          { id: 'foreigners', label: 'الوافدون الأجانب', icon: UserCheck, count: foreigners.length },
          { id: 'permits', label: 'تصاريح التحرك الداخلي', icon: Compass, count: permits.length },
          { id: 'citizenship', label: 'الجنسية والزواج المختلط', icon: FileText, count: citizenshipCases.length },
          { id: 'companies', label: 'الرقابة على الشركات الـ 5', icon: Building, count: companies.length },
          { id: 'intelligence', label: 'فرع استخبارات الشرطة', icon: ShieldCheck, count: 'مركزي 001' },
          { id: 'correspondence', label: 'البرقيات والمكاتبات', icon: Mail, count: correspondences.length },
          { id: 'audit', label: 'سجل العمليات الرقابي', icon: Clock, count: auditLogs.length },
          { id: 'developer', label: 'وحدة المطور وتخصيص EAV', icon: Sliders, count: 'Super' },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                setActiveModule(item.id as any);
                setSearch('');
              }}
              className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-sm ring-2 ring-primary/20'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Module 1 & 4: 13 Sovereign Ports Dashboard */}
      {activeModule === 'ports' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">حالة المنافذ السيادية الـ 13 الرسمية</h2>
              <p className="text-xs text-muted-foreground">7 منافذ جوية · 5 منافذ برية · 6 موانئ بحرية رئيسية مع مراقبة الكثافة اللحظية وضباط المناوبة.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => exportToExcel(SOVEREIGN_PORTS, 'المنافذ_السيادية_الـ13')}>
                <Download className="h-3.5 w-3.5 ml-1" /> تصدير الكشف
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SOVEREIGN_PORTS.map((port) => (
              <Card key={port.id} className="border shadow-2xs hover:shadow-md transition-all rounded-2xl overflow-hidden">
                <CardHeader className="p-4 pb-2 bg-slate-50/70 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-xl bg-primary/10 text-primary">
                        {port.category === 'جوي' ? <Plane className="h-4 w-4" /> : port.category === 'بري' ? <Truck className="h-4 w-4" /> : <Anchor className="h-4 w-4" />}
                      </div>
                      <div>
                        <CardTitle className="text-sm font-bold text-slate-900">{port.name}</CardTitle>
                        <span className="text-[10px] text-muted-foreground">{port.governorate} · كود: {port.code}</span>
                      </div>
                    </div>
                    <Badge variant={port.status === 'يعمل بكفاءة' ? 'default' : 'destructive'} className="text-[10px]">
                      {port.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الكثافة اللحظية:</span>
                    <span className={`px-2 py-0.5 rounded font-bold ${port.currentTraffic === 'مزدحم جداً' ? 'bg-rose-100 text-rose-800' : port.currentTraffic === 'مرتفع' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {port.currentTraffic}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">الضباط المناوبون:</span>
                    <span className="font-bold text-slate-800">{port.activeOfficersCount} ضابط</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">مشرف النوبة:</span>
                    <span className="font-semibold text-slate-800 text-[11px]">{port.shiftSupervisor}</span>
                  </div>
                  <div className="pt-2 border-t flex justify-between items-center text-[11px]">
                    <span className="text-muted-foreground">الطاقة الاستيعابية:</span>
                    <span className="font-mono font-bold text-primary">{port.capacityPerDay.toLocaleString()} مسافر/يوم</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 2: Seizures & Confiscated Passports with Timeline */}
      {activeModule === 'seizures' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">محاضر الضبط والجوازات المحتجزة (Seizures & Passports)</h2>
              <p className="text-xs text-muted-foreground">خط زمني إجرائي لتتبع حالة الجواز المضبوط من لحظة الاحتجاز حتى الفحص والإحالة أو التسليم.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => setNewSeizureOpen(true)} className="gap-1.5 font-bold">
                <Plus className="h-4 w-4" /> إنشاء محضر ضبط جديد
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {seizures.map((sz) => (
              <Card key={sz.id} className="p-4 rounded-2xl border shadow-xs hover:border-primary/40 transition-all">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b pb-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-rose-50 text-rose-700 rounded-xl">
                      <Stamp className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{sz.travelerName}</span>
                        <Badge variant="outline" className="font-mono text-xs">{sz.recordNumber}</Badge>
                        <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200 border-none text-[10px]">
                          {sz.seizurePort}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        جواز سفر رقم: <strong className="font-mono text-slate-800">{sz.passportNumber}</strong> ({sz.nationality}) · الضابط: {sz.officerInCharge}
                      </p>
                    </div>
                  </div>

                  {/* Status Timeline Selector */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">المرحلة الإجرائية:</span>
                    <Select value={sz.status} onValueChange={(val: any) => handleUpdateSeizureStatus(sz.id, val)}>
                      <SelectTrigger className="h-8 text-xs font-bold w-36">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent dir="rtl">
                        <SelectItem value="جديد">1. جديد</SelectItem>
                        <SelectItem value="بانتظار الفحص">2. بانتظار الفحص</SelectItem>
                        <SelectItem value="تم الفحص">3. تم الفحص</SelectItem>
                        <SelectItem value="سليم">4. سليم</SelectItem>
                        <SelectItem value="مزور">5. مزور</SelectItem>
                        <SelectItem value="محال">6. محال للتحقيق</SelectItem>
                        <SelectItem value="جاهز للتسليم">7. جاهز للتسليم</SelectItem>
                        <SelectItem value="تم التسليم">8. تم التسليم</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Passport Timeline Visualizer */}
                <div className="bg-slate-50 p-3 rounded-xl border text-xs space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
                    <span>سبب الضبط: <strong className="text-slate-800">{sz.reason}</strong></span>
                    {sz.referredTo && (
                      <span className="text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        محال إلى: {sz.referredTo} ({sz.referralNotes})
                      </span>
                    )}
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-indigo-600 h-full transition-all duration-300"
                      style={{
                        width:
                          sz.status === 'جديد' ? '15%' :
                          sz.status === 'بانتظار الفحص' ? '30%' :
                          sz.status === 'تم الفحص' ? '50%' :
                          sz.status === 'مزور' || sz.status === 'سليم' ? '70%' :
                          sz.status === 'محال' ? '85%' : '100%'
                      }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 3: Undocumented Migrants */}
      {activeModule === 'migrants' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">المهاجرون غير الشرعيين وضبط التسلل</h2>
              <p className="text-xs text-muted-foreground">قيد المضبوطين، الفحص الطبي الإلزامي، البصمات العشرية، ومراكز الإيواء والترحيل.</p>
            </div>
            <Button onClick={() => setNewMigrantOpen(true)} className="gap-1.5 font-bold">
              <Plus className="h-4 w-4" /> قيد مهاجر غير شرعي جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {migrants.map((m) => (
              <Card key={m.id} className="p-4 rounded-2xl border shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">{m.fullName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">{m.fileNumber} · {m.nationality}</p>
                  </div>
                  <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 text-xs">
                    {m.deportationStatus}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs bg-muted/30 p-2.5 rounded-xl">
                  <div><span className="text-muted-foreground block text-[10px]">نقطة التسلل:</span> {m.infiltrationPoint}</div>
                  <div><span className="text-muted-foreground block text-[10px]">مكان الضبط:</span> {m.apprehensionPlace}</div>
                  <div><span className="text-muted-foreground block text-[10px]">الفحص الطبي:</span> <strong className="text-emerald-700">{m.medicalCheckStatus}</strong></div>
                  <div><span className="text-muted-foreground block text-[10px]">مركز الإيواء:</span> {m.shelterCenter}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 5: Refugees & UNHCR */}
      {activeModule === 'refugees' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">إدارة شؤون اللاجئين وتصاريح الحماية المؤقتة</h2>
              <p className="text-xs text-muted-foreground">ربط ملفات المفوضية السامية (UNHCR) والتحقق الأمني وإصدار بطاقات مشفرة بـ QR.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {refugees.map((ref) => (
              <Card key={ref.id} className="p-4 rounded-2xl border shadow-xs flex gap-4 items-center">
                <div className="p-2 bg-white rounded-xl border shrink-0">
                  <QRCodeCanvas value={ref.qrVerificationCode} size={90} />
                </div>
                <div className="space-y-1 text-xs flex-1">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-sm text-slate-900">{ref.fullName}</h4>
                    <Badge className="bg-emerald-100 text-emerald-800 border-none text-[10px]">{ref.permitStatus}</Badge>
                  </div>
                  <p className="text-muted-foreground font-mono">{ref.unhcrNumber} · {ref.nationality}</p>
                  <p className="text-slate-700 text-[11px]">تصريح رقم: <strong className="font-mono">{ref.temporaryPermitNumber}</strong></p>
                  <p className="text-slate-500 text-[10px]">ساري حتى: {ref.permitExpiryDate} · الضابط: {ref.vettingOfficer}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 6: Foreigner Residents */}
      {activeModule === 'foreigners' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">شؤون الوافدين الأجانب والإقامات</h2>
              <p className="text-xs text-muted-foreground">متابعة إقامات الأجانب، جهات العمل، الفحص الطبي الإلزامي، وتأشيرات الخروج والعودة.</p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full text-xs text-right">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-3">رقم الإقامة</th>
                  <th className="p-3">الاسم الكامل</th>
                  <th className="p-3">الجنسية والجواز</th>
                  <th className="p-3">جهة العمل / الكفيل</th>
                  <th className="p-3">المهنة</th>
                  <th className="p-3">انتهاء الإقامة</th>
                  <th className="p-3">الفحص الطبي</th>
                  <th className="p-3">الحالة الأمنية</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {foreigners.map((f) => (
                  <tr key={f.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono font-bold text-primary">{f.residenceNumber}</td>
                    <td className="p-3 font-bold text-slate-800">{f.fullName}</td>
                    <td className="p-3 font-mono">{f.nationality} ({f.passportNumber})</td>
                    <td className="p-3">{f.employer}</td>
                    <td className="p-3">{f.profession}</td>
                    <td className="p-3">{f.residenceExpiryDate}</td>
                    <td className="p-3 text-emerald-700 font-bold">{f.medicalExamResult}</td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{f.securityClearanceStatus}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 7: Internal Movement Permits */}
      {activeModule === 'permits' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">تصاريح التنقل والتحرك الداخلي للوفود الأجنبية والدبلوماسية</h2>
              <p className="text-xs text-muted-foreground">إصدار تصاريح خط السير الإلزامي، بيانات المرافقين، وطباعة التصريح الأمني بالختم الرسمي وكود QR.</p>
            </div>
            <Button onClick={() => setNewPermitOpen(true)} className="gap-1.5 font-bold">
              <Plus className="h-4 w-4" /> إصدار تصريح أمني جديد
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {permits.map((p) => (
              <Card key={p.id} className="p-5 rounded-2xl border shadow-xs space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-1 text-[10px] bg-primary/10 text-primary border-primary/20">{p.organizationType}</Badge>
                    <h3 className="font-bold text-base text-slate-900">{p.delegationName}</h3>
                    <p className="text-xs text-slate-500 font-mono">{p.permitCode}</p>
                  </div>
                  <QRCodeCanvas value={p.qrVerificationCode} size={65} className="p-1 border rounded-lg bg-white" />
                </div>
                <div className="text-xs space-y-1.5 bg-slate-50 p-3 rounded-xl border">
                  <div><span className="text-muted-foreground">خط السير المصرح:</span> <strong className="text-slate-800">{p.authorizedRoute}</strong></div>
                  <div><span className="text-muted-foreground">رئيس الوفد:</span> {p.delegationHead} ({p.passengersCount} ركاب)</div>
                  <div><span className="text-muted-foreground">فترة السريان:</span> من {p.validFrom} إلى {p.validTo}</div>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs text-emerald-700 font-bold">✓ {p.approvalStatus}</span>
                  <Button size="sm" variant="outline" onClick={() => { setViewPermitItem(p); setTimeout(() => handlePrint(), 300); }}>
                    <Printer className="h-3.5 w-3.5 ml-1" /> طباعة التصريح
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 8, 9 & 10: Visas, Citizenship & Special Travel Documents */}
      {activeModule === 'citizenship' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">الجنسية، الزواج المختلط، ووثائق السفر الخاصة</h2>
              <p className="text-xs text-muted-foreground">كتالوج الخدمات الـ 15 ومتابعة مدد الاستجابة القانونية (SLA: 20 يوماً للزواج، 3 أيام للجوازات، 30 يوماً للأمر الجمهوري).</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Catalog Services (15 Services) */}
            <Card className="lg:col-span-1 p-4 rounded-2xl border shadow-xs space-y-3">
              <CardTitle className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary" /> كتالوج خدمات المصلحة الـ 15 (SLA)
              </CardTitle>
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {SLA_SERVICES_CATALOG.map((srv) => (
                  <div key={srv.id} className="p-2.5 rounded-xl border bg-slate-50 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-slate-900">
                      <span>{srv.name}</span>
                      <span className="text-primary font-mono">{srv.targetDays} يوم</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{srv.department}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Active Citizenship & Marriage Cases */}
            <Card className="lg:col-span-2 p-4 rounded-2xl border shadow-xs space-y-3">
              <CardTitle className="text-sm font-bold text-slate-800">معاملات الجنسية والزواج الجارية</CardTitle>
              <div className="space-y-3">
                {citizenshipCases.map((c) => (
                  <div key={c.id} className="p-3.5 rounded-xl border bg-card hover:bg-slate-50/80 transition-colors text-xs space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-sm text-slate-900">{c.serviceType}</span>
                        <p className="text-muted-foreground font-mono text-[11px]">{c.caseNumber} · صاحب الطلب: {c.applicantName}</p>
                      </div>
                      <Badge variant="outline" className="text-primary font-bold">
                        الهدف: {c.targetDaysSla} يوماً (SLA)
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-[11px] bg-slate-100 p-2 rounded-lg">
                      <span>الطرف الآخر/المستفيد: <strong>{c.spouseOrBeneficiaryName || '-'}</strong></span>
                      <span>الحالة: <strong className="text-indigo-700">{c.status}</strong></span>
                      <span>المحقق: {c.investigatingOfficer}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Module 11: Monitored Companies */}
      {activeModule === 'companies' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">الرقابة على الشركات والوكالات الخمس (Monitored Companies)</h2>
              <p className="text-xs text-muted-foreground">شركات الحج والعمرة، الصرافة، السفر والسياحة، التوظيف، والتأمين مع تقييد المخالفات وأوامر الإيقاف.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {companies.map((comp) => (
              <Card key={comp.id} className="p-4 rounded-2xl border shadow-xs space-y-2.5">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="outline" className="text-[10px] mb-1">{comp.type}</Badge>
                    <h3 className="font-bold text-sm text-slate-900">{comp.companyName}</h3>
                    <p className="text-xs text-muted-foreground font-mono">سجل: {comp.commercialRecord} · ترخيص: {comp.licenseNumber}</p>
                  </div>
                  <Badge variant={comp.securityClearanceStatus === 'معتمد وساري' ? 'default' : 'destructive'} className="text-[10px]">
                    {comp.securityClearanceStatus}
                  </Badge>
                </div>
                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border space-y-1">
                  <div><span className="text-muted-foreground">المالك:</span> {comp.ownerName} · المشرف: {comp.supervisorName}</div>
                  <div><span className="text-muted-foreground">العنوان:</span> {comp.governorate} - {comp.address}</div>
                  <div><span className="text-muted-foreground">المخالفات المرصودة:</span> <strong className="text-rose-600 font-bold">{comp.violationsCount} مخالفات</strong></div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 12: Official Correspondence */}
      {activeModule === 'correspondence' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">المكاتبات والبرقيات الرسمية المؤتمتة</h2>
              <p className="text-xs text-muted-foreground">توليد برقيات ومذكرات رسمية قانونية بالصياغة المعتمدة (من/إلى/الإشارة/الموضوع/المتضمن/وعليه/التوقيع).</p>
            </div>
            <Button onClick={() => setNewCorrespondenceOpen(true)} className="gap-1.5 font-bold">
              <Plus className="h-4 w-4" /> إنشاء برقية/مذكرة جديدة
            </Button>
          </div>

          <div className="space-y-3">
            {correspondences.map((cr) => (
              <Card key={cr.id} className="p-4 rounded-2xl border shadow-xs space-y-3">
                <div className="flex justify-between items-start border-b pb-2">
                  <div>
                    <span className="font-mono text-xs font-bold text-primary">{cr.incomingOutgoingNumber}</span>
                    <h3 className="font-bold text-sm text-slate-900">{cr.subject}</h3>
                    <p className="text-xs text-muted-foreground">{cr.letterType} · التاريخ: {cr.gregorianDate}م ({cr.hijriDate})</p>
                  </div>
                  <Badge className="bg-indigo-100 text-indigo-800 border-none text-[10px]">{cr.status}</Badge>
                </div>
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border space-y-1 font-serif leading-relaxed">
                  <p><strong>من:</strong> {cr.senderEntity}</p>
                  <p><strong>إلى:</strong> {cr.recipientEntity}</p>
                  <p><strong>الإشارة:</strong> {cr.referenceText}</p>
                  <p><strong>المتضمن:</strong> {cr.introClause}</p>
                  <p><strong>وعليه:</strong> {cr.actionRequired}</p>
                  <div className="text-left font-bold text-slate-900 pt-2 border-t mt-2">
                    {cr.signatoryTitle}<br />
                    {cr.signatoryName}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Module 13: Audit Log */}
      {activeModule === 'audit' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">سجل العمليات الرقابي السيادي (Audit Log Entity)</h2>
              <p className="text-xs text-muted-foreground">سجل غير قابل للتعديل يوثق كافة حركات الإنشاء والتعديل والحذف وتصدير الكشوفات مع هوية الضابط وعنوان الجهاز.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => exportToExcel(auditLogs, 'سجل_العمليات_الرقابي')}>
              <Download className="h-3.5 w-3.5 ml-1" /> تصدير السجل الرقابي
            </Button>
          </div>

          <div className="overflow-x-auto rounded-2xl border bg-card">
            <table className="w-full text-xs text-right">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="p-3">الوقت والتاريخ</th>
                  <th className="p-3">الضابط / المستخدم</th>
                  <th className="p-3">الرتبة والدور</th>
                  <th className="p-3">المنفذ / الإدارة</th>
                  <th className="p-3">نوع الحركة</th>
                  <th className="p-3">الوحدة المستهدفة</th>
                  <th className="p-3">تفاصيل العملية</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-[11px]">{new Date(log.timestamp).toLocaleString('ar-YE')}</td>
                    <td className="p-3 font-bold text-slate-800">{log.officerName}</td>
                    <td className="p-3"><Badge variant="outline" className="text-[10px]">{log.officerRole}</Badge></td>
                    <td className="p-3">{log.portOrDepartment}</td>
                    <td className="p-3 font-bold text-primary">{log.action}</td>
                    <td className="p-3">{log.targetModule}</td>
                    <td className="p-3 max-w-xs truncate text-slate-600">{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Module 14: Developer Module (EAV & System Customization) */}
      {activeModule === 'developer' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-4 rounded-xl border">
            <div>
              <h2 className="text-lg font-bold text-slate-800">وحدة المطور وتخصيص المنظومة (Developer Module - Super Admin)</h2>
              <p className="text-xs text-muted-foreground">إدارة الحقول الديناميكية (EAV)، أنماط الترقيم التلقائي، وتعديل ترويسات التقارير الرسمية محلياً.</p>
            </div>
            <Badge className="bg-purple-100 text-purple-800 border-none font-bold">صلاحيات المدير العام (Super Admin)</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-5 rounded-2xl border shadow-xs space-y-4">
              <CardTitle className="text-base font-bold text-slate-800">أنماط الترقيم التلقائي (AutoField Rules)</CardTitle>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">نمط ترقيم محاضر الضبط:</label>
                  <Input value={devSettings.autoFieldRules.seizurePrefix} onChange={(e) => setDevSettings({ ...devSettings, autoFieldRules: { ...devSettings.autoFieldRules, seizurePrefix: e.target.value } })} />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">نمط ملفات المهاجرين:</label>
                  <Input value={devSettings.autoFieldRules.migrantPrefix} onChange={(e) => setDevSettings({ ...devSettings, autoFieldRules: { ...devSettings.autoFieldRules, migrantPrefix: e.target.value } })} />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">نمط التصاريح الأمنية:</label>
                  <Input value={devSettings.autoFieldRules.permitPrefix} onChange={(e) => setDevSettings({ ...devSettings, autoFieldRules: { ...devSettings.autoFieldRules, permitPrefix: e.target.value } })} />
                </div>
                <Button size="sm" onClick={() => { saveDeveloperSettings(devSettings); toast({ title: 'تم حفظ أنماط الترقيم' }); }}>حفظ الأنماط</Button>
              </div>
            </Card>

            <Card className="p-5 rounded-2xl border shadow-xs space-y-4">
              <CardTitle className="text-base font-bold text-slate-800">ترويسات المخرجات الرسمية (Official Headers)</CardTitle>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-muted-foreground block mb-1">الدولة:</label>
                  <Input value={devSettings.printHeaders.republicTitle} onChange={(e) => setDevSettings({ ...devSettings, printHeaders: { ...devSettings.printHeaders, republicTitle: e.target.value } })} />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">الوزارة:</label>
                  <Input value={devSettings.printHeaders.ministryTitle} onChange={(e) => setDevSettings({ ...devSettings, printHeaders: { ...devSettings.printHeaders, ministryTitle: e.target.value } })} />
                </div>
                <div>
                  <label className="text-muted-foreground block mb-1">المصلحة:</label>
                  <Input value={devSettings.printHeaders.departmentTitle} onChange={(e) => setDevSettings({ ...devSettings, printHeaders: { ...devSettings.printHeaders, departmentTitle: e.target.value } })} />
                </div>
                <Button size="sm" onClick={() => { saveDeveloperSettings(devSettings); toast({ title: 'تم تحديث ترويسات الطباعة' }); }}>حفظ الترويسات</Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Police Intelligence Branch (فرع استخبارات الشرطة) */}
      {activeModule === 'intelligence' && (
        <Card className="p-6 rounded-2xl border shadow-xs space-y-4 bg-slate-900 text-white">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-xl font-bold">فرع استخبارات الشرطة المركزي</h2>
              <p className="text-xs text-slate-400">
                رقم القيد الأمني: <strong className="text-amber-300 font-mono">001/ المرجع السنوي</strong> · رقم ملف التحقيق المركزي: <strong className="text-amber-300 font-mono">001</strong>
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <h3 className="font-bold text-amber-300">المهام الاستخباراتية السيادية:</h3>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>فحص خلفيات المسافرين والمشتبه بهم ومقارنتهم بالقوائم السوداء.</li>
                <li>التحري عن الشركات والوكالات المشبوهة ووكالات السفر غير المرخصة.</li>
                <li>إصدار قرارات الإدراج في قوائم المنع أو رفع القيود الأمنية.</li>
                <li><strong>SLA الاستخباراتي الميداني:</strong> مدة أقصاها 3 أيام للرد على استفسارات المنافذ.</li>
              </ul>
            </div>
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <h3 className="font-bold text-amber-300">مصفوفة الصلاحيات والأدوار السبعة (RBAC):</h3>
              <div className="space-y-1 text-[11px] text-slate-300">
                {SOVEREIGN_ROLES.map((r, i) => (
                  <div key={i} className="flex justify-between border-b border-white/5 py-1">
                    <span>{i + 1}. {r}</span>
                    <span className="text-slate-400">صلاحيات سيادية محددة</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Modal: New Seizure */}
      <Dialog open={newSeizureOpen} onOpenChange={setNewSeizureOpen}>
        <DialogContent className="max-w-xl text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>إنشاء محضر ضبط جواز سفر</DialogTitle>
            <DialogDescription>توثيق واقعة احتجاز جواز السفر وإحالته للمباينة والفحص الفني أو استخبارات الشرطة.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div><label className="text-muted-foreground block mb-1">اسم المسافر الكامل:</label><Input value={seizureForm.travelerName} onChange={(e) => setSeizureForm({ ...seizureForm, travelerName: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-muted-foreground block mb-1">رقم الجواز:</label><Input value={seizureForm.passportNumber} onChange={(e) => setSeizureForm({ ...seizureForm, passportNumber: e.target.value })} /></div>
              <div><label className="text-muted-foreground block mb-1">الجنسية:</label><Input value={seizureForm.nationality} onChange={(e) => setSeizureForm({ ...seizureForm, nationality: e.target.value })} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground block mb-1">منفذ الضبط:</label>
                <Select value={seizureForm.seizurePort} onValueChange={(v) => setSeizureForm({ ...seizureForm, seizurePort: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    {SOVEREIGN_PORTS.map((p) => <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-muted-foreground block mb-1">جهة الإحالة:</label>
                <Select value={seizureForm.referredTo} onValueChange={(v) => setSeizureForm({ ...seizureForm, referredTo: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="فرع استخبارات الشرطة">فرع استخبارات الشرطة</SelectItem>
                    <SelectItem value="المباحث الجنائية">المباحث الجنائية</SelectItem>
                    <SelectItem value="النيابة العامة">النيابة العامة</SelectItem>
                    <SelectItem value="مصلحة الجوازات">مصلحة الجوازات</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div><label className="text-muted-foreground block mb-1">سبب الضبط والملاحظات:</label><Input value={seizureForm.reason} onChange={(e) => setSeizureForm({ ...seizureForm, reason: e.target.value })} placeholder="اشتباه تزوير، تعديل صور، بلاغ ضبط سابق..." /></div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="ghost" onClick={() => setNewSeizureOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveSeizure}>اعتماد المحضر</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: New Migrant */}
      <Dialog open={newMigrantOpen} onOpenChange={setNewMigrantOpen}>
        <DialogContent className="max-w-xl text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>تسجيل وضبط مهاجر غير نظامي</DialogTitle>
            <DialogDescription>قيد بيانات المهاجر، نقطة التسلل، وإجراءات الإيواء والترحيل.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div><label className="text-muted-foreground block mb-1">الاسم الكامل:</label><Input value={migrantForm.fullName} onChange={(e) => setMigrantForm({ ...migrantForm, fullName: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-muted-foreground block mb-1">الجنسية:</label><Input value={migrantForm.nationality} onChange={(e) => setMigrantForm({ ...migrantForm, nationality: e.target.value })} /></div>
              <div><label className="text-muted-foreground block mb-1">العمر التقريبي:</label><Input type="number" value={migrantForm.approximateAge} onChange={(e) => setMigrantForm({ ...migrantForm, approximateAge: Number(e.target.value) })} /></div>
            </div>
            <div><label className="text-muted-foreground block mb-1">نقطة التسلل أو الساحل:</label><Input value={migrantForm.infiltrationPoint} onChange={(e) => setMigrantForm({ ...migrantForm, infiltrationPoint: e.target.value })} /></div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-muted-foreground block mb-1">الفحص الطبي الأولي:</label>
                <Select value={migrantForm.medicalCheckStatus} onValueChange={(v) => setMigrantForm({ ...migrantForm, medicalCheckStatus: v as any })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent dir="rtl">
                    <SelectItem value="سليم">سليم ولائق</SelectItem>
                    <SelectItem value="اشتباه مرضي">اشتباه مرضي</SelectItem>
                    <SelectItem value="بحاجة عزل">بحاجة عزل صحي</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><label className="text-muted-foreground block mb-1">مركز الإيواء:</label><Input value={migrantForm.shelterCenter} onChange={(e) => setMigrantForm({ ...migrantForm, shelterCenter: e.target.value })} /></div>
            </div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="ghost" onClick={() => setNewMigrantOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveMigrant}>حفظ وقيد المهاجر</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: New Permit */}
      <Dialog open={newPermitOpen} onOpenChange={setNewPermitOpen}>
        <DialogContent className="max-w-xl text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>إصدار تصريح أمني للتحرك الداخلي</DialogTitle>
            <DialogDescription>تصريح خط السير للوفود الدبلوماسية والمنظمات الدولية ونقاط التفتيش المسموحة.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div><label className="text-muted-foreground block mb-1">اسم الوفد أو المنظمة:</label><Input value={permitForm.delegationName} onChange={(e) => setPermitForm({ ...permitForm, delegationName: e.target.value })} placeholder="مثال: بعثة اللجنة الدولية للصليب الأحمر" /></div>
            <div className="grid grid-cols-2 gap-2">
              <div><label className="text-muted-foreground block mb-1">رئيس الوفد:</label><Input value={permitForm.delegationHead} onChange={(e) => setPermitForm({ ...permitForm, delegationHead: e.target.value })} /></div>
              <div><label className="text-muted-foreground block mb-1">رقم الجواز:</label><Input value={permitForm.passportNumber} onChange={(e) => setPermitForm({ ...permitForm, passportNumber: e.target.value })} /></div>
            </div>
            <div><label className="text-muted-foreground block mb-1">خط السير الإلزامي المصرح به:</label><Input value={permitForm.authorizedRoute} onChange={(e) => setPermitForm({ ...permitForm, authorizedRoute: e.target.value })} placeholder="صنعاء -> ذمار -> إب -> تعز" /></div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="ghost" onClick={() => setNewPermitOpen(false)}>إلغاء</Button>
              <Button onClick={handleSavePermit}>إصدار التصريح فوراً</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: New Correspondence */}
      <Dialog open={newCorrespondenceOpen} onOpenChange={setNewCorrespondenceOpen}>
        <DialogContent className="max-w-xl text-right" dir="rtl">
          <DialogHeader>
            <DialogTitle>صياغة برقية أو مذكرة رسمية</DialogTitle>
            <DialogDescription>وفق النماذج القانونية لوزارة الداخلية ومصلحة الجوازات.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-xs">
            <div>
              <label className="text-muted-foreground block mb-1">نوع المكاتبة:</label>
              <Select value={corrForm.letterType} onValueChange={(v) => setCorrForm({ ...corrForm, letterType: v as any })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent dir="rtl">
                  <SelectItem value="طلب تحري أمني">طلب تحري أمني عاجل</SelectItem>
                  <SelectItem value="برقية داخلية عاجلة">برقية داخلية عاجلة</SelectItem>
                  <SelectItem value="مذكرة رسمية">مذكرة رسمية</SelectItem>
                  <SelectItem value="رد على مذكرة">رد على مذكرة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div><label className="text-muted-foreground block mb-1">الجهة المرسل إليها:</label><Input value={corrForm.recipientEntity} onChange={(e) => setCorrForm({ ...corrForm, recipientEntity: e.target.value })} /></div>
            <div><label className="text-muted-foreground block mb-1">الموضوع:</label><Input value={corrForm.subject} onChange={(e) => setCorrForm({ ...corrForm, subject: e.target.value })} placeholder="شأن المسافر / القضية..." /></div>
            <div><label className="text-muted-foreground block mb-1">المتضمن:</label><Input value={corrForm.introClause} onChange={(e) => setCorrForm({ ...corrForm, introClause: e.target.value })} /></div>
            <div><label className="text-muted-foreground block mb-1">وعليه:</label><Input value={corrForm.actionRequired} onChange={(e) => setCorrForm({ ...corrForm, actionRequired: e.target.value })} /></div>
            <div className="flex justify-end gap-2 pt-3 border-t">
              <Button variant="ghost" onClick={() => setNewCorrespondenceOpen(false)}>إلغاء</Button>
              <Button onClick={handleSaveCorrespondence}>اعتماد وإرسال البرقية</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
