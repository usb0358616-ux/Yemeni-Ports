export const YEMEN_GOVERNORATES = [
  'صنعاء', 'عدن', 'تعز', 'الحديدة', 'إب', 'حضرموت', 'ذمار', 'حجة', 'صعدة', 'البيضاء', 'عمران', 'لحج', 'الضالع', 'أبين', 'الجوف', 'المهرة', 'شبوة', 'مأرب', 'ريمة', 'المحويت', 'سقطرى'
];

export const COUNTRIES = [
  'اليمن', 'السعودية', 'الإمارات', 'مصر', 'الأردن', 'تركيا', 'عمان', 'قطر', 'الكويت', 'البحرين', 'السودان', 'جيبوتي', 'إثيوبيا', 'الهند', 'الصين', 'ماليزيا', 'العراق', 'سوريا', 'لبنان', 'بريطانيا', 'الولايات المتحدة'
];

export const ID_TYPES = [
  'شخصية', 'جواز', 'عائلية', 'عسكرية', 'تصريح لجوء', 'إقامة أجنبي', 'أخرى'
];

// 1. المنافذ السيادية الـ 13 الرسمية
export interface SovereignPort {
  id: string;
  name: string;
  category: 'جوي' | 'بري' | 'بحري';
  governorate: string;
  code: string;
  activeOfficersCount: number;
  currentTraffic: 'طبيعي' | 'متوسط' | 'مرتفع' | 'مزدحم جداً';
  status: 'يعمل بكفاءة' | 'مغلق مؤقتاً' | 'حالة طوارئ';
  shiftSupervisor: string;
  capacityPerDay: number;
  coordinates?: string;
}

export const SOVEREIGN_PORTS: SovereignPort[] = [
  // المنافذ الجوية (7)
  { id: 'port-air-1', name: 'مطار صنعاء الدولي', category: 'جوي', governorate: 'صنعاء', code: 'SAH', activeOfficersCount: 18, currentTraffic: 'مرتفع', status: 'يعمل بكفاءة', shiftSupervisor: 'العقيد/ أحمد السالمي', capacityPerDay: 5000 },
  { id: 'port-air-2', name: 'مطار عدن الدولي', category: 'جوي', governorate: 'عدن', code: 'ADE', activeOfficersCount: 22, currentTraffic: 'مرتفع', status: 'يعمل بكفاءة', shiftSupervisor: 'المقدم/ صالح اليافعي', capacityPerDay: 6000 },
  { id: 'port-air-3', name: 'مطار الريان الدولي', category: 'جوي', governorate: 'حضرموت', code: 'RIY', activeOfficersCount: 12, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ سالم الكثيري', capacityPerDay: 2500 },
  { id: 'port-air-4', name: 'مطار سيئون الدولي', category: 'جوي', governorate: 'حضرموت', code: 'GXF', activeOfficersCount: 14, currentTraffic: 'متوسط', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ فهد التميمي', capacityPerDay: 3000 },
  { id: 'port-air-5', name: 'مطار الغيضة الدولي', category: 'جوي', governorate: 'المهرة', code: 'AAY', activeOfficersCount: 8, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'النقيب/ مبارك المهري', capacityPerDay: 1500 },
  { id: 'port-air-6', name: 'مطار سقطرى الدولي', category: 'جوي', governorate: 'سقطرى', code: 'SCT', activeOfficersCount: 10, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'النقيب/ عيسى السقطري', capacityPerDay: 1200 },
  { id: 'port-air-7', name: 'مطار الحديدة الدولي', category: 'جوي', governorate: 'الحديدة', code: 'HOD', activeOfficersCount: 6, currentTraffic: 'طبيعي', status: 'مغلق مؤقتاً', shiftSupervisor: 'الرائد/ وليد الأهدل', capacityPerDay: 2000 },

  // المنافذ البرية (5)
  { id: 'port-land-1', name: 'منفذ الوديعة البري', category: 'بري', governorate: 'حضرموت', code: 'WAD', activeOfficersCount: 35, currentTraffic: 'مزدحم جداً', status: 'يعمل بكفاءة', shiftSupervisor: 'العميد/ عبد ربه النهدي', capacityPerDay: 15000 },
  { id: 'port-land-2', name: 'منفذ شحن البري', category: 'بري', governorate: 'المهرة', code: 'SHN', activeOfficersCount: 20, currentTraffic: 'مرتفع', status: 'يعمل بكفاءة', shiftSupervisor: 'المقدم/ سعيد الحريزي', capacityPerDay: 7000 },
  { id: 'port-land-3', name: 'منفذ صرفيت البري', category: 'بري', governorate: 'المهرة', code: 'SRF', activeOfficersCount: 15, currentTraffic: 'متوسط', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ أحمد كلشات', capacityPerDay: 4000 },
  { id: 'port-land-4', name: 'منفذ علب البري', category: 'بري', governorate: 'صعدة', code: 'ALB', activeOfficersCount: 10, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ يحيى المقراني', capacityPerDay: 3000 },
  { id: 'port-land-5', name: 'منفذ الطوال البري', category: 'بري', governorate: 'حجة', code: 'TWL', activeOfficersCount: 8, currentTraffic: 'طبيعي', status: 'مغلق مؤقتاً', shiftSupervisor: 'النقيب/ ناصر الشمري', capacityPerDay: 2500 },

  // المنافذ البحرية (6)
  { id: 'port-sea-1', name: 'ميناء عدن البحري', category: 'بحري', governorate: 'عدن', code: 'ADN-PORT', activeOfficersCount: 26, currentTraffic: 'مرتفع', status: 'يعمل بكفاءة', shiftSupervisor: 'المقدم/ مازن الشعيبي', capacityPerDay: 8000 },
  { id: 'port-sea-2', name: 'ميناء الحديدة البحري', category: 'بحري', governorate: 'الحديدة', code: 'HOD-PORT', activeOfficersCount: 18, currentTraffic: 'متوسط', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ نبيل مروان', capacityPerDay: 6000 },
  { id: 'port-sea-3', name: 'ميناء المكلا البحري', category: 'بحري', governorate: 'حضرموت', code: 'MKL-PORT', activeOfficersCount: 14, currentTraffic: 'متوسط', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ عمر باحميد', capacityPerDay: 4000 },
  { id: 'port-sea-4', name: 'ميناء نشطون البحري', category: 'بحري', governorate: 'المهرة', code: 'NSH-PORT', activeOfficersCount: 10, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'النقيب/ راشد القميري', capacityPerDay: 2500 },
  { id: 'port-sea-5', name: 'ميناء الصليف البحري', category: 'بحري', governorate: 'الحديدة', code: 'SLF-PORT', activeOfficersCount: 8, currentTraffic: 'طبيعي', status: 'يعمل بكفاءة', shiftSupervisor: 'النقيب/ إبراهيم حكمي', capacityPerDay: 2000 },
  { id: 'port-sea-6', name: 'ميناء المخا البحري', category: 'بحري', governorate: 'تعز', code: 'MKH-PORT', activeOfficersCount: 12, currentTraffic: 'متوسط', status: 'يعمل بكفاءة', shiftSupervisor: 'الرائد/ فهمي الصبيحي', capacityPerDay: 3000 },
];

// الأدوار السيادية السبعة
export type SovereignUserRole =
  | 'مدير عام' // Super Admin
  | 'نائب مدير عام' // Deputy Admin
  | 'مدير إدارة' // Department Manager
  | 'رئيس قسم' // Section Head
  | 'محقق أول' // Senior Investigator
  | 'محقق ميداني' // Investigator
  | 'موظف إدخال بيانات'; // Data Entry

export const SOVEREIGN_ROLES: SovereignUserRole[] = [
  'مدير عام',
  'نائب مدير عام',
  'مدير إدارة',
  'رئيس قسم',
  'محقق أول',
  'محقق ميداني',
  'موظف إدخال بيانات',
];

// كتالوج خدمات المصلحة الـ 15 (Service SLA Catalog)
export interface ServiceSlaItem {
  id: string;
  name: string;
  category: 'جنسية وزواج' | 'تأشيرات وإقامات' | 'وثائق سفر' | 'تصاريح أمنية' | 'رقابة وتراخيص';
  targetDays: number;
  targetHours: number;
  requiredDocuments: string[];
  department: string;
  description: string;
}

export const SLA_SERVICES_CATALOG: ServiceSlaItem[] = [
  { id: 'sla-1', name: 'زواج يمني من أجنبية', category: 'جنسية وزواج', targetDays: 20, targetHours: 0, requiredDocuments: ['موافقة أمنية', 'فحص طبي', 'إثبات سكن', 'شهادة حسن سيرة'], department: 'إدارة الجنسية والزواج', description: 'إجراءات طلب ترخيص زواج مواطن يمني من امرأة أجنبية وموافقة وزارة الداخلية.' },
  { id: 'sla-2', name: 'زواج أجنبي من يمنية', category: 'جنسية وزواج', targetDays: 20, targetHours: 0, requiredDocuments: ['موافقة ولي الأمر', 'شهادة ديانة', 'سجل جنائي دولي', 'فحص أمني'], department: 'إدارة الجنسية والزواج', description: 'دراسة ومباينة أمنية دقيقة لطلب زواج مقيم أجنبي من مواطنة يمنية.' },
  { id: 'sla-3', name: 'اكتساب الجنسية لزوجة يمني', category: 'جنسية وزواج', targetDays: 20, targetHours: 0, requiredDocuments: ['عقد زواج رسمي معمد', 'إقامة سارية 5 سنوات', 'تنازل عن الجنسية الأصلية إن لزم'], department: 'إدارة الجنسية والزواج', description: 'منح الجنسية اليمنية لزوجة المواطن بعد استيفاء مدة الإقامة القانونية.' },
  { id: 'sla-4', name: 'طلب الجنسية بأمر جمهوري', category: 'جنسية وزواج', targetDays: 30, targetHours: 0, requiredDocuments: ['مذكرة رئاسية / مجلس وزراء', 'تحرٍّ استخباراتي مركزي شامل'], department: 'إدارة الجنسية والزواج', description: 'معاملات التجنيس الخاصة للأفراد المتميزين بموجب مرسوم جمهوري.' },
  { id: 'sla-5', name: 'طلب إذن اكتساب جنسية أجنبية', category: 'جنسية وزواج', targetDays: 20, targetHours: 0, requiredDocuments: ['إشعار دولة التجنيس', 'إبراء ذمة أمنية وعسكرية'], department: 'إدارة الجنسية والزواج', description: 'إذن رسمي من مصلحة الهجرة يسمح للمواطن بحمل جنسية أخرى وفق القانون.' },
  { id: 'sla-6', name: 'إصدار/تجديد وثائق سفر اللاجئين الفلسطينيين والأفارقة', category: 'وثائق سفر', targetDays: 3, targetHours: 0, requiredDocuments: ['بطاقة لجوء معتمدة', 'شهادة إثبات هوية', 'محضر فحص أمني'], department: 'إدارة وثائق السفر الخاصة', description: 'وثيقة مرور وسفر رسمية صادرة من الجمهورية اليمنية للاجئين.' },
  { id: 'sla-7', name: 'منح وتجديد جوازات سفر أبناء اليمنيات', category: 'وثائق سفر', targetDays: 3, targetHours: 0, requiredDocuments: ['شهادة ميلاد معتمدة', 'جواز أو بطاقة الأم', 'موافقة أمنية'], department: 'إدارة وثائق السفر الخاصة', description: 'إصدار جواز سفر نظامي لأبناء الأم اليمنية المتزوجة من أجنبي.' },
  { id: 'sla-8', name: 'تأشيرة دخول عمل / مستثمر', category: 'تأشيرات وإقامات', targetDays: 7, targetHours: 0, requiredDocuments: ['سجل تجاري للشركة', 'موافقة وزارة الشؤون الاجتماعية'], department: 'إدارة التأشيرات والإقامة', description: 'استقدام خبراء وعمالة أجنبية مرخصة للمشاريع المعتمدة.' },
  { id: 'sla-9', name: 'تأشيرة زيارة عائلية', category: 'تأشيرات وإقامات', targetDays: 5, targetHours: 0, requiredDocuments: ['إثبات صلة قرابة', 'كفالة مقيم/مواطن'], department: 'إدارة التأشيرات والإقامة', description: 'منح إذن زيارة مؤقتة للأقارب من الدرجة الأولى.' },
  { id: 'sla-10', name: 'تجديد الإقامة السنوية للأجانب', category: 'تأشيرات وإقامات', targetDays: 4, targetHours: 0, requiredDocuments: ['فحص طبي خلو من الأمراض', 'تجديد عقد العمل أو القيد الجامعي'], department: 'إدارة الأجانب والإقامات', description: 'تثبيت ملصق الإقامة السنوي بعد المباينة الأمنية.' },
  { id: 'sla-11', name: 'تصريح تنقل دبلوماسي / وفد منظمة دولية', category: 'تصاريح أمنية', targetDays: 1, targetHours: 24, requiredDocuments: ['مذكرة وزارة الخارجية', 'خط السير الإلزامي وبيانات المركبات'], department: 'إدارة التصاريح الأمنية وغرفة العمليات', description: 'تصريح أمني مؤتمت مع رمز QR للتحرك بين المحافظات ونقاط التفتيش.' },
  { id: 'sla-12', name: 'بطاقة تسجيل لجوء مؤقتة (UNHCR)', category: 'وثائق سفر', targetDays: 2, targetHours: 48, requiredDocuments: ['ملف مفوضية اللاجئين', 'الفحص الجنائي وقيد البصمات العشرية'], department: 'إدارة شؤون اللاجئين', description: 'تسجيل رسمي وحماية مؤقتة مع تصريح إقامة مشفر.' },
  { id: 'sla-13', name: 'اعتماد وترخيص شركة حج وعمرة / سفر', category: 'رقابة وتراخيص', targetDays: 15, targetHours: 0, requiredDocuments: ['ضمان بنكي', 'سجل أمني للمشرفين', 'عقد النقل المعتمد'], department: 'إدارة الرقابة على الشركات', description: 'التصريح الأمني الموسمي لتفويج المعتمرين عبر المنافذ.' },
  { id: 'sla-14', name: 'التحري الأمني من فرع استخبارات الشرطة', category: 'تصاريح أمنية', targetDays: 3, targetHours: 72, requiredDocuments: ['طلب تحري رسمي برقم قيد مركزي', 'بصمات أو بيانات المشتبه به'], department: 'فرع استخبارات الشرطة المركزي', description: 'رد استخباراتي جنائي ملزم قبل البت في إدراج أو شطب أو إفراج.' },
  { id: 'sla-15', name: 'تسجيل واحتجاز المهاجر غير الشرعي والترحيل', category: 'تأشيرات وإقامات', targetDays: 5, targetHours: 0, requiredDocuments: ['محضر ضبط التسلل', 'تقرير الفحص الطبي', 'تأكيد سفارة دولة القدوم'], department: 'إدارة مكافحة التسلل والهجرة غير النظامية', description: 'إيواء، فحص طبي، قيد بيومتري، وإصدار أمر الترحيل الجبري أو الطوعي.' }
];

// تصنيفات الشركات الخمس الخاضعة للرقابة الأمنية
export const MONITORED_COMPANY_TYPES = [
  'شركات الحج والعمرة',
  'شركات ومحلات الصرافة والتحويلات',
  'شركات ووكالات السفر والسياحة',
  'وكالات التوظيف وتشغيل الأيدي العاملة',
  'شركات التأمين الصحي والتجاري'
];
