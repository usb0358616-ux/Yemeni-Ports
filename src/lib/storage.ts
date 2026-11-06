import {
  Traveler,
  Report,
  Movement,
  User,
  PassportSeizure,
  UndocumentedMigrant,
  RefugeeRecord,
  ForeignerResident,
  InternalMovementPermit,
  CitizenshipAndLegalCase,
  MonitoredCompany,
  OfficialCorrespondence,
  AuditLogEntity,
  DeveloperSystemSettings
} from './types';
import { SOVEREIGN_PORTS, SovereignUserRole } from './constants';

export const generateId = () => Math.random().toString(36).substr(2, 9);

export const normalizeArabic = (text: string) => {
  if (!text) return '';
  return text
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .trim();
};

// 1. Travelers
export const getTravelers = (): Traveler[] => {
  const data = localStorage.getItem('travelers');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

export const saveTravelers = (travelers: Traveler[]) => {
  localStorage.setItem('travelers', JSON.stringify(travelers));
};

// 2. Seizures & Confiscated Passports (الوحدة 2)
export const getSeizures = (): PassportSeizure[] => {
  const data = localStorage.getItem('sovereign_seizures');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  // Initial seed
  const initial: PassportSeizure[] = [
    {
      id: 'sz-001',
      recordNumber: 'محضر-2026-0014',
      travelerName: 'طارق عبد الله محمد الشامي',
      passportNumber: '08492015',
      nationality: 'اليمن',
      seizurePort: 'منفذ الوديعة البري',
      seizureDate: '2026-11-01',
      officerInCharge: 'الرائد/ فهد التميمي',
      reason: 'اشتباه تزوير في صفحة البيانات البيومترية وتبديل الصورة الشخصية',
      status: 'محال',
      referredTo: 'فرع استخبارات الشرطة',
      referralDate: '2026-11-02',
      referralNotes: 'رقم قيد أمني: 001/2026 - ملف تحقيق مركزي رقم 001',
      examinationResult: 'تزوير جزئي',
      notes: 'تم التحفظ على الوثيقة في الخزينة المركزية بالمنفذ.',
      createdAt: '2026-11-01T10:30:00.000Z',
      updatedAt: '2026-11-02T12:00:00.000Z'
    },
    {
      id: 'sz-002',
      recordNumber: 'محضر-2026-0015',
      travelerName: 'جون ديفيد كوبر',
      passportNumber: 'USA-4910284',
      nationality: 'الولايات المتحدة',
      seizurePort: 'مطار صنعاء الدولي',
      seizureDate: '2026-11-03',
      officerInCharge: 'العقيد/ أحمد السالمي',
      reason: 'انتهاء صلاحية التأشيرة والاشتباه في تزوير ختم الدخول',
      status: 'تم الفحص',
      examinationResult: 'سليم ومبرأ',
      notes: 'تمت مطابقة الختم مع سجل المنافذ وتبين صحته بعد التحري.',
      createdAt: '2026-11-03T08:15:00.000Z',
      updatedAt: '2026-11-04T14:20:00.000Z'
    }
  ];
  saveSeizures(initial);
  return initial;
};

export const saveSeizures = (seizures: PassportSeizure[]) => {
  localStorage.setItem('sovereign_seizures', JSON.stringify(seizures));
};

// 3. Undocumented Migrants (الوحدة 3)
export const getMigrants = (): UndocumentedMigrant[] => {
  const data = localStorage.getItem('sovereign_migrants');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: UndocumentedMigrant[] = [
    {
      id: 'mig-001',
      fileNumber: 'هجرة-2026-0089',
      fullName: 'أبيبي تيسفاي جبري',
      nationality: 'إثيوبيا',
      countryOfOrigin: 'إثيوبيا',
      infiltrationPoint: 'ساحل ذباب - باب المندب',
      apprehensionDate: '2026-11-02',
      apprehensionPlace: 'نقطة رأس العارة الساحلية',
      gender: 'ذكر',
      approximateAge: 24,
      medicalCheckStatus: 'سليم',
      medicalNotes: 'تم إعطاء اللقاحات الوقائية الأولية',
      fingerprintRegistered: true,
      shelterCenter: 'مركز إيواء المهاجرين - عمران',
      deportationStatus: 'جاهز للترحيل',
      createdAt: '2026-11-02T16:00:00.000Z',
      updatedAt: '2026-11-04T10:00:00.000Z'
    },
    {
      id: 'mig-002',
      fileNumber: 'هجرة-2026-0090',
      fullName: 'فاطمة محمد جامع',
      nationality: 'الصومال',
      countryOfOrigin: 'الصومال',
      infiltrationPoint: 'ساحل أحور - أبين',
      apprehensionDate: '2026-11-04',
      apprehensionPlace: 'الخط الساحلي أحور',
      gender: 'أنثى',
      approximateAge: 21,
      medicalCheckStatus: 'اشتباه مرضي',
      medicalNotes: 'تحت العناية والعزل المؤقت في المستشفى الميداني',
      fingerprintRegistered: true,
      shelterCenter: 'مركز إيواء المهاجرين - عدن',
      deportationStatus: 'قيد الإيواء والتحقيق',
      createdAt: '2026-11-04T11:30:00.000Z',
      updatedAt: '2026-11-05T09:00:00.000Z'
    }
  ];
  saveMigrants(initial);
  return initial;
};

export const saveMigrants = (migrants: UndocumentedMigrant[]) => {
  localStorage.setItem('sovereign_migrants', JSON.stringify(migrants));
};

// 5. Refugees & UNHCR Affairs (الوحدة 5)
export const getRefugees = (): RefugeeRecord[] => {
  const data = localStorage.getItem('sovereign_refugees');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: RefugeeRecord[] = [
    {
      id: 'ref-001',
      unhcrNumber: 'UNHCR-YEM-892014',
      temporaryPermitNumber: 'تصريح-لجوء-2026-012',
      fullName: 'محمود أحمد خليل رضوان',
      nationality: 'فلسطيني',
      arrivalDate: '2024-03-15',
      familyMembersCount: 4,
      securityVettingStatus: 'مبرأ ومطابق',
      vettingOfficer: 'المقدم/ صالح اليافعي',
      permitStatus: 'ساري',
      permitExpiryDate: '2027-03-15',
      qrVerificationCode: 'REF:UNHCR-YEM-892014:MAHMOUD',
      residentialAddress: 'أمانة العاصمة - حي النهضة',
      phone: '771234567',
      createdAt: '2026-10-10T09:00:00.000Z',
      updatedAt: '2026-10-10T09:00:00.000Z'
    }
  ];
  saveRefugees(initial);
  return initial;
};

export const saveRefugees = (records: RefugeeRecord[]) => {
  localStorage.setItem('sovereign_refugees', JSON.stringify(records));
};

// 6. Foreigner Residents (الوحدة 6)
export const getForeigners = (): ForeignerResident[] => {
  const data = localStorage.getItem('sovereign_foreigners');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: ForeignerResident[] = [
    {
      id: 'for-001',
      residenceNumber: 'إقامة-2026-0341',
      fullName: 'راجيف كومار شارما',
      passportNumber: 'Z8941029',
      nationality: 'الهند',
      employer: 'المستشفى السعودي الألماني - صنعاء',
      profession: 'أخصائي تخدير ورعاية مركزة',
      entryDate: '2025-01-12',
      entryPort: 'مطار صنعاء الدولي',
      residenceExpiryDate: '2027-01-12',
      medicalExamResult: 'لائق طبياً',
      reEntryVisaStatus: 'سارية',
      securityClearanceStatus: 'معتمد',
      createdAt: '2026-09-01T10:00:00.000Z',
      updatedAt: '2026-09-01T10:00:00.000Z'
    }
  ];
  saveForeigners(initial);
  return initial;
};

export const saveForeigners = (foreigners: ForeignerResident[]) => {
  localStorage.setItem('sovereign_foreigners', JSON.stringify(foreigners));
};

// 7. Internal Movement Permits (الوحدة 7)
export const getMovementPermits = (): InternalMovementPermit[] => {
  const data = localStorage.getItem('sovereign_permits');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: InternalMovementPermit[] = [
    {
      id: 'pm-001',
      permitCode: 'تصريح-أمني-2026-0045',
      delegationName: 'بعثة منظمة الصحة العالمية (WHO)',
      organizationType: 'منظمة أمم متحدة (UN)',
      authorizedRoute: 'صنعاء -> ذمار -> إب -> تعز',
      allowedCheckpoints: ['نقطة يسلح', 'نقطة مفرق ذمار', 'نقطة نجد الأحمر', 'نقطة الحوبان'],
      vehicleDetails: [
        { plate: 'أمم متحدة 104', model: 'Toyota Land Cruiser', color: 'أبيض' },
        { plate: 'أمم متحدة 108', model: 'Toyota Hilux', color: 'أبيض' }
      ],
      delegationHead: 'د. بيتر فان هوف',
      passportNumber: 'NLD-7782103',
      passengersCount: 6,
      securityEscortNeeded: true,
      escortTeamLeader: 'الملازم/ مجلي الصباحي',
      validFrom: '2026-11-06',
      validTo: '2026-11-12',
      accommodationPlace: 'فندق تاج سبأ - صنعاء / مقر البعثة إب',
      qrVerificationCode: 'PERMIT:2026-0045:WHO:PASS-VALID',
      approvalStatus: 'معتمد رسمياً',
      approvedBy: 'العميد/ عبد الكريم المروني (مدير العمليات)',
      createdAt: '2026-11-05T14:00:00.000Z',
      updatedAt: '2026-11-05T14:00:00.000Z'
    }
  ];
  saveMovementPermits(initial);
  return initial;
};

export const saveMovementPermits = (permits: InternalMovementPermit[]) => {
  localStorage.setItem('sovereign_permits', JSON.stringify(permits));
};

// 9 & 10. Citizenship & Special Travel Documents (الوحدة 9 & 10)
export const getCitizenshipCases = (): CitizenshipAndLegalCase[] => {
  const data = localStorage.getItem('sovereign_citizenship_cases');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: CitizenshipAndLegalCase[] = [
    {
      id: 'cit-001',
      caseNumber: 'معاملة-2026-0104',
      serviceType: 'زواج يمني من أجنبية',
      applicantName: 'هشام عبد الجبار القاضي',
      applicantIdOrPassport: '0102049182',
      applicantNationality: 'اليمن',
      spouseOrBeneficiaryName: 'نادية يوسف المنصوري',
      spouseNationality: 'المغرب',
      submissionDate: '2026-10-25',
      targetCompletionDate: '2026-11-14',
      targetDaysSla: 20,
      status: 'قيد التحري والاستخبارات',
      investigatingOfficer: 'العقيد/ ناصر الوادعي',
      intelligenceRefNumber: '001/استخبارات/2026',
      notes: 'تمت إحالة الطلب لفرع استخبارات الشرطة لإبداء الرأي الأمني خلال 3 أيام.',
      createdAt: '2026-10-25T09:00:00.000Z',
      updatedAt: '2026-10-28T11:00:00.000Z'
    },
    {
      id: 'cit-002',
      caseNumber: 'معاملة-2026-0105',
      serviceType: 'جوازات سفر أبناء اليمنيات',
      applicantName: 'مريم سعيد عبده مصلح (الأم اليمنية)',
      applicantIdOrPassport: '0201948271',
      applicantNationality: 'اليمن',
      spouseOrBeneficiaryName: 'خالد عمر فاروق (الابن المستفيد)',
      spouseNationality: 'السودان',
      submissionDate: '2026-11-04',
      targetCompletionDate: '2026-11-07',
      targetDaysSla: 3,
      status: 'معتمد ومصدر',
      investigatingOfficer: 'المقدم/ عدنان الشريف',
      notes: 'تم استيفاء الشروط القانونية وإصدار جواز السفر وفق دليل الـ 3 أيام.',
      createdAt: '2026-11-04T10:00:00.000Z',
      updatedAt: '2026-11-06T08:30:00.000Z'
    }
  ];
  saveCitizenshipCases(initial);
  return initial;
};

export const saveCitizenshipCases = (cases: CitizenshipAndLegalCase[]) => {
  localStorage.setItem('sovereign_citizenship_cases', JSON.stringify(cases));
};

// 11. Monitored Companies (الوحدة 11)
export const getMonitoredCompanies = (): MonitoredCompany[] => {
  const data = localStorage.getItem('sovereign_companies');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: MonitoredCompany[] = [
    {
      id: 'comp-001',
      licenseNumber: 'ترخيص-أمني-2026-021',
      companyName: 'شركة البراق لتفويج الحج والعمرة والرحلات الدولية',
      commercialRecord: 'CR-1049281',
      type: 'شركات الحج والعمرة',
      ownerName: 'الحاج/ عبد السلام الوجيه',
      supervisorName: 'فؤاد عبد السلام الوجيه',
      securityClearanceStatus: 'معتمد وساري',
      lastInspectionDate: '2026-10-20',
      violationsCount: 0,
      violationsLog: [],
      governorate: 'صنعاء',
      address: 'شارع الزبيري - برج النور',
      phone: '01234567',
      createdAt: '2026-01-15T08:00:00.000Z',
      updatedAt: '2026-10-20T10:00:00.000Z'
    },
    {
      id: 'comp-002',
      licenseNumber: 'ترخيص-أمني-2026-088',
      companyName: 'منشأة النجم الصاعد للصرافة والتحويلات المالية',
      commercialRecord: 'CR-8920145',
      type: 'شركات ومحلات الصرافة والتحويلات',
      ownerName: 'محسن قاسم الذيباني',
      supervisorName: 'أكرم محسن الذيباني',
      securityClearanceStatus: 'إيقاف مؤقت',
      lastInspectionDate: '2026-11-01',
      violationsCount: 2,
      violationsLog: [
        {
          date: '2026-11-01',
          description: 'تنفيذ حوالات خارجية لمشتبهين دون إشعار المباينة الأمنية',
          penalty: 'إيقاف النشاط مؤقتاً لمدة 15 يوماً وإحالة لفرع الاستخبارات',
          officer: 'المقدم/ فارس الريمي'
        }
      ],
      governorate: 'عدن',
      address: 'الشيخ عثمان - شارع السلفي',
      phone: '02891234',
      createdAt: '2026-03-10T09:00:00.000Z',
      updatedAt: '2026-11-01T15:00:00.000Z'
    }
  ];
  saveMonitoredCompanies(initial);
  return initial;
};

export const saveMonitoredCompanies = (companies: MonitoredCompany[]) => {
  localStorage.setItem('sovereign_companies', JSON.stringify(companies));
};

// 12. Official Correspondence (الوحدة 12)
export const getCorrespondence = (): OfficialCorrespondence[] => {
  const data = localStorage.getItem('sovereign_correspondence');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: OfficialCorrespondence[] = [
    {
      id: 'corr-001',
      incomingOutgoingNumber: 'ص-2026-0042',
      letterType: 'طلب تحري أمني',
      gregorianDate: '2026-11-06',
      hijriDate: '26 جمادى الأولى 1448هـ',
      senderEntity: 'مصلحة الهجرة والجوازات والجنسية - إدارة المنافذ والرقابة الحدودية',
      recipientEntity: 'الأخ/ مدير فرع استخبارات الشرطة المحترم',
      referenceText: 'عطفاً على مذكرة منفذ الوديعة البري رقم (109) بتاريخ 2026/11/01م',
      subject: 'طلب التحري الأمني الجنائي بشأن المشتبه به (طارق عبد الله محمد الشامي)',
      introClause: 'نفيدكم علماً بأنه تم ضبط المسافر الموضح بياناته بعاليه أثناء محاولته العبور بجواز سفر يحمل اشتباه تزوير في بيانات الصفحة المقروءة آلياً.',
      actionRequired: 'وعليه: نرجو التكرم بالتوجيه بالتحري الجنائي العاجل وموافاتنا برأيكم الأمني وفق خطة الاستجابة (SLA الاستخباراتي المحدد بـ 3 أيام) للإحالة إلى النيابة العامة.',
      closingClause: 'وتقبلوا خالص التحية والتقدير،،،',
      signatoryTitle: 'مدير عام المنافذ والرقابة الحدودية',
      signatoryName: 'العميد الركن/ عبد الله مسعد الصرابي',
      isUrgent: true,
      status: 'معتمد ومرسل',
      createdAt: '2026-11-06T09:30:00.000Z',
      updatedAt: '2026-11-06T09:30:00.000Z'
    }
  ];
  saveCorrespondence(initial);
  return initial;
};

export const saveCorrespondence = (letters: OfficialCorrespondence[]) => {
  localStorage.setItem('sovereign_correspondence', JSON.stringify(letters));
};

// 13. Audit Log (الوحدة 13 - سجل العمليات الرقابي السيادي)
export const getAuditLogs = (): AuditLogEntity[] => {
  const data = localStorage.getItem('sovereign_audit_logs');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: AuditLogEntity[] = [
    {
      id: 'log-001',
      timestamp: new Date().toISOString(),
      officerUsername: 'admin',
      officerName: 'العميد/ عبد الله مسعد الصرابي',
      officerRole: 'مدير عام',
      portOrDepartment: 'غرفة العمليات المركزية',
      action: 'إنشاء',
      targetModule: 'المضبوطات والجوازات',
      targetRecordId: 'sz-001',
      details: 'قيد محضر ضبط جواز مشتبه تزوير رقم 08492015 في منفذ الوديعة البري',
      ipAddress: '127.0.0.1 (محلي)',
      deviceInfo: 'محطة العمل السيادية - ويندوز'
    }
  ];
  saveAuditLogs(initial);
  return initial;
};

export const saveAuditLogs = (logs: AuditLogEntity[]) => {
  localStorage.setItem('sovereign_audit_logs', JSON.stringify(logs));
};

export const addAuditLog = (
  action: AuditLogEntity['action'],
  targetModule: AuditLogEntity['targetModule'],
  details: string,
  targetRecordId?: string
) => {
  const user = getCurrentUser();
  const currentLogs = getAuditLogs();
  const newEntry: AuditLogEntity = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    officerUsername: user?.username || 'system',
    officerName: user?.name || 'مستخدم النظام',
    officerRole: user?.role || 'مدير عام',
    portOrDepartment: user?.portOrDepartment || 'المنفذ المركزي',
    action,
    targetModule,
    targetRecordId,
    details,
    ipAddress: '127.0.0.1 (محلي)',
    deviceInfo: navigator.userAgent.slice(0, 45)
  };
  saveAuditLogs([newEntry, ...currentLogs].slice(0, 500)); // retain last 500
};

// 14. Developer System Settings (الوحدة 14)
export const getDeveloperSettings = (): DeveloperSystemSettings => {
  const data = localStorage.getItem('sovereign_dev_settings');
  if (data) {
    try { return JSON.parse(data); } catch { /* ignore */ }
  }
  const initial: DeveloperSystemSettings = {
    autoFieldRules: {
      seizurePrefix: 'محضر-YYYY-NNNN',
      migrantPrefix: 'هجرة-YYYY-NNNN',
      permitPrefix: 'تصريح-أمني-YYYY-NNNN',
      correspondencePrefix: 'ص-YYYY-NNNN'
    },
    customFields: [],
    customDropdownOptions: {},
    printHeaders: {
      republicTitle: 'الجمهورية اليمنية',
      ministryTitle: 'وزارة الداخلية',
      departmentTitle: 'مصلحة الهجرة والجوازات والجنسية'
    }
  };
  saveDeveloperSettings(initial);
  return initial;
};

export const saveDeveloperSettings = (settings: DeveloperSystemSettings) => {
  localStorage.setItem('sovereign_dev_settings', JSON.stringify(settings));
};

// Existing core storage items
export const getReports = (): Report[] => {
  const data = localStorage.getItem('reports');
  return data ? JSON.parse(data) : [];
};

export const saveReports = (reports: Report[]) => {
  localStorage.setItem('reports', JSON.stringify(reports));
};

export const getMovements = (): Movement[] => {
  const data = localStorage.getItem('movements');
  return data ? JSON.parse(data) : [];
};

export const saveMovements = (movements: Movement[]) => {
  localStorage.setItem('movements', JSON.stringify(movements));
};

export const getCurrentUser = (): User | null => {
  const data = localStorage.getItem('currentUser');
  if (!data) {
    // Default logged in user with Super Admin role
    const defaultUser: User = {
      id: 'usr-1',
      username: 'admin',
      role: 'مدير عام',
      name: 'العميد الركن/ عبد الله مسعد الصرابي',
      portOrDepartment: 'غرفة العمليات المركزية والسيطرة'
    };
    localStorage.setItem('currentUser', JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  } else {
    localStorage.removeItem('currentUser');
  }
};
