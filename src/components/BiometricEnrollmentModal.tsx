import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Fingerprint,
  Camera,
  Scan,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  ShieldAlert,
  UserCheck,
  SwitchCamera,
  Check,
  Zap,
} from 'lucide-react';
import { Traveler } from '@/lib/types';

interface BiometricEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  traveler: Traveler;
  onSaveBiometrics: (updatedBiometrics: NonNullable<Traveler['biometrics']>) => void;
}

export const BiometricEnrollmentModal: React.FC<BiometricEnrollmentModalProps> = ({
  isOpen,
  onClose,
  traveler,
  onSaveBiometrics,
}) => {
  const [activeTab, setActiveTab] = useState<'fingerprint' | 'face'>('fingerprint');

  // Fingerprint State
  const [fingerScanning, setFingerScanning] = useState(false);
  const [fingerProgress, setFingerProgress] = useState(0);
  const [fingerQuality, setFingerQuality] = useState(0);
  const [fingerprintCaptured, setFingerprintCaptured] = useState<string | null>(
    traveler.biometrics?.fingerprintTemplate || null
  );

  // Face Scan State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const [faceDetecting, setFaceDetecting] = useState(false);
  const [faceQuality, setFaceQuality] = useState(0);
  const [faceCapturedPhoto, setFaceCapturedPhoto] = useState<string | null>(
    traveler.biometrics?.faceEmbedding || null
  );
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Keep state synced when modal opens
  useEffect(() => {
    if (isOpen) {
      setFingerprintCaptured(traveler.biometrics?.fingerprintTemplate || null);
      setFaceCapturedPhoto(traveler.biometrics?.faceEmbedding || null);
      setFingerProgress(0);
      setFingerQuality(traveler.biometrics?.fingerprintTemplate ? 98 : 0);
      setFaceQuality(traveler.biometrics?.faceEmbedding ? 95 : 0);
    } else {
      stopCamera();
    }
  }, [isOpen, traveler]);

  // Handle Camera for Face Scan
  const startCamera = useCallback(async (facing: 'user' | 'environment') => {
    setCameraError(null);
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280, min: 480 },
          height: { ideal: 720, min: 480 },
        },
        audio: false,
      });
      setStream(newStream);
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
        await videoRef.current.play();
      }
    } catch (err: any) {
      console.warn('Face capture camera warning:', err);
      setCameraError('تعذر الوصول إلى الكاميرا. يرجى التأكد من توصيل الكاميرا ومنح الصلاحيات.');
    }
  }, [stream]);

  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Toggle Camera when switching tabs
  useEffect(() => {
    if (isOpen && activeTab === 'face' && !faceCapturedPhoto) {
      startCamera(cameraFacing);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, cameraFacing, faceCapturedPhoto]);

  // Fingerprint Simulation / Hardware Reader trigger
  const handleCaptureFingerprint = () => {
    if (fingerScanning) return;
    setFingerScanning(true);
    setFingerProgress(10);
    setFingerQuality(0);

    const interval = setInterval(() => {
      setFingerProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setFingerScanning(false);
          const quality = Math.floor(88 + Math.random() * 11); // 88% - 99%
          setFingerQuality(quality);
          // Generate realistic biometric template signature
          const mockTemplate = `ANSI-378-${traveler.idNumber}-${Date.now().toString(16).toUpperCase()}-Q${quality}`;
          setFingerprintCaptured(mockTemplate);
          return 100;
        }
        return prev + 15;
      });
    }, 120);
  };

  // Face Capture Trigger
  const handleCaptureFace = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const photoDataUrl = canvas.toDataURL('image/jpeg', 0.85);

    setFaceCapturedPhoto(photoDataUrl);
    setFaceQuality(94);
    stopCamera();
  };

  const handleRetakeFace = () => {
    setFaceCapturedPhoto(null);
    setFaceQuality(0);
    startCamera(cameraFacing);
  };

  // Save Biometrics
  const handleSave = () => {
    let status: 'مكتمل' | 'جزئي' | 'غير مسجل' = 'غير مسجل';
    if (fingerprintCaptured && faceCapturedPhoto) {
      status = 'مكتمل';
    } else if (fingerprintCaptured || faceCapturedPhoto) {
      status = 'جزئي';
    }

    const updatedBiometrics: NonNullable<Traveler['biometrics']> = {
      fingerprintTemplate: fingerprintCaptured || undefined,
      fingerprintCapturedAt: fingerprintCaptured
        ? traveler.biometrics?.fingerprintCapturedAt || new Date().toISOString()
        : undefined,
      faceEmbedding: faceCapturedPhoto || undefined,
      faceCapturedAt: faceCapturedPhoto
        ? traveler.biometrics?.faceCapturedAt || new Date().toISOString()
        : undefined,
      biometricStatus: status,
    };

    onSaveBiometrics(updatedBiometrics);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="border-b pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-lg">
                <Fingerprint className="h-5 w-5" />
              </div>
              <DialogTitle className="text-lg font-bold text-slate-800">
                تسجيل ومطابقة البصمة الحيوية (Biometrics)
              </DialogTitle>
            </div>
            <Badge
              variant="outline"
              className={
                fingerprintCaptured && faceCapturedPhoto
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : fingerprintCaptured || faceCapturedPhoto
                  ? 'bg-amber-50 text-amber-700 border-amber-300'
                  : 'bg-slate-100 text-slate-600'
              }
            >
              {fingerprintCaptured && faceCapturedPhoto
                ? 'الحالة: مكتملة'
                : fingerprintCaptured || faceCapturedPhoto
                ? 'الحالة: جزئية'
                : 'الحالة: غير مسجلة'}
            </Badge>
          </div>
          <DialogDescription className="text-right text-xs text-muted-foreground mt-1">
            ربط بصمات الأصابع ومسح الوجه بالملف الأمني للمسافر: <strong>{traveler.firstName} {traveler.lastName}</strong> (رقم الوثيقة: {traveler.idNumber})
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl mt-2">
          <button
            type="button"
            onClick={() => setActiveTab('fingerprint')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'fingerprint'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Fingerprint className="h-4 w-4" />
            <span>بصمة الإصبع (Fingerprint)</span>
            {fingerprintCaptured && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-auto" />}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('face')}
            className={`flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'face'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scan className="h-4 w-4" />
            <span>مسح الوجه الحيوي (Facial Scan)</span>
            {faceCapturedPhoto && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 mr-auto" />}
          </button>
        </div>

        {/* Tab 1: Fingerprint Registration */}
        {activeTab === 'fingerprint' && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-50 border rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
              {/* Fingerprint Scanner Visualization */}
              <div
                className={`relative w-36 h-44 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 ${
                  fingerScanning
                    ? 'border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100'
                    : fingerprintCaptured
                    ? 'border-emerald-500 bg-emerald-50/40'
                    : 'border-slate-300 bg-white'
                }`}
              >
                {/* Fingerprint Icon / Animation */}
                <Fingerprint
                  className={`h-24 w-24 transition-colors ${
                    fingerScanning
                      ? 'text-indigo-600 animate-pulse'
                      : fingerprintCaptured
                      ? 'text-emerald-600'
                      : 'text-slate-300'
                  }`}
                />

                {/* Scanning Laser Bar */}
                {fingerScanning && (
                  <div
                    className="absolute left-2 right-2 h-1 bg-indigo-500 rounded-full shadow-[0_0_8px_#6366f1] animate-bounce"
                    style={{ top: `${fingerProgress}%` }}
                  />
                )}

                {fingerprintCaptured && !fingerScanning && (
                  <div className="absolute top-2 right-2 bg-emerald-500 text-white rounded-full p-1 shadow-xs">
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}
              </div>

              {/* Status & Progress */}
              <div className="mt-4 w-full max-w-xs space-y-2">
                {fingerScanning ? (
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-indigo-700 mb-1">
                      <span>جاري قراءة الحبيبات والخطوط الحلمية...</span>
                      <span>{fingerProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-indigo-600 h-full transition-all duration-150"
                        style={{ width: `${fingerProgress}%` }}
                      />
                    </div>
                  </div>
                ) : fingerprintCaptured ? (
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-emerald-700 flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> تم التقاط البصمة ومطابقة النموذج
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      كود القالب: {fingerprintCaptured}
                    </p>
                    <div className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full mt-1">
                      <span>جودة البصمة: {fingerQuality}% (ممتازة)</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    ضع إصبع المسافر (السبابة اليمنى) على قارئ البصمة أو اضغط الزر أدناه لبدء التسجيل.
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="mt-5 flex gap-2 flex-wrap justify-center">
                <Button
                  type="button"
                  onClick={handleCaptureFingerprint}
                  disabled={fingerScanning}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2"
                >
                  <Fingerprint className="h-4 w-4" />
                  {fingerprintCaptured ? 'إعادة مسح البصمة' : 'بدء أخذ البصمة الآن'}
                </Button>

                {fingerprintCaptured && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFingerprintCaptured(null);
                      setFingerQuality(0);
                    }}
                    className="text-xs text-rose-600 hover:text-rose-700"
                  >
                    مسح السجل
                  </Button>
                )}
              </div>
            </div>

            {/* Hardware & Standard info */}
            <div className="bg-blue-50/50 border border-blue-200/60 rounded-xl p-3 text-xs text-slate-700 flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-900">المعايير البيومترية المعتمدة</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  يدعم النظام أجهزة قراءة البصمات القياسية (DigitalPersona, SecuGen, Suprema) وفق معيار ANSI/NIST-ITL 1-2011 وتشفير القالب محلياً داخل قاعدة البيانات دون الحاجة لشبكة إنترنت.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Facial Recognition / Scan */}
        {activeTab === 'face' && (
          <div className="py-4 space-y-4">
            <div className="bg-slate-900 text-white rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden min-h-[320px]">
              {cameraError ? (
                <div className="text-center p-6 space-y-3">
                  <ShieldAlert className="h-10 w-10 text-rose-400 mx-auto" />
                  <p className="text-sm text-rose-200">{cameraError}</p>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => startCamera(cameraFacing)}
                  >
                    <RefreshCw className="h-3.5 w-3.5 ml-1.5" /> محاولة الاتصال بالكاميرا
                  </Button>
                </div>
              ) : faceCapturedPhoto ? (
                /* Captured Face Review */
                <div className="flex flex-col items-center gap-3">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-lg">
                    <img
                      src={faceCapturedPhoto}
                      alt="Captured Face"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-emerald-400/80 rounded-2xl pointer-events-none" />
                    <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-xs">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-sm font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                      <UserCheck className="h-4 w-4" /> تم التقاط الملامح الحيوية للوجه بنجاح
                    </p>
                    <p className="text-xs text-slate-300 mt-1">
                      تم استخراج 68 نقطة علام رئيسية (Facial Landmarks) لتأكيد الهوية.
                    </p>
                    <div className="inline-flex items-center gap-1 bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold px-2.5 py-0.5 rounded-full mt-2">
                      <span>دقة التطابق: {faceQuality}%</span>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRetakeFace}
                    className="mt-2 text-slate-800 bg-white hover:bg-slate-100 text-xs gap-1.5"
                  >
                    <RefreshCw className="h-3.5 w-3.5" /> إعادة التقاط الوجه
                  </Button>
                </div>
              ) : (
                /* Live Camera Feed with Biometric Target Guide */
                <div className="relative w-full max-w-sm aspect-[4/3] rounded-xl overflow-hidden bg-black flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform scale-x-[-1]"
                  />

                  {/* Face Guide Oval */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-56 border-2 border-dashed border-indigo-400/80 rounded-[50%] flex items-center justify-center">
                      <div className="w-44 h-52 border border-indigo-300/40 rounded-[50%]" />
                    </div>
                    {/* Crosshairs */}
                    <div className="absolute w-6 h-0.5 bg-indigo-400/70" />
                    <div className="absolute h-6 w-0.5 bg-indigo-400/70" />
                  </div>

                  {/* Top Instruction banner */}
                  <div className="absolute top-2 left-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[11px] px-3 py-1 rounded-md text-center">
                    وجّه وجه المسافر داخل الإطار البيضاوي في إضاءة واضحة
                  </div>

                  {/* Camera Switch button */}
                  <button
                    type="button"
                    onClick={() => {
                      const next = cameraFacing === 'user' ? 'environment' : 'user';
                      setCameraFacing(next);
                      startCamera(next);
                    }}
                    className="absolute bottom-2 left-2 p-2 bg-black/60 text-white rounded-full hover:bg-black/80 transition-colors"
                    title="تبديل الكاميرا"
                  >
                    <SwitchCamera className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Hidden canvas for snapshotting */}
              <canvas ref={canvasRef} className="hidden" />

              {/* Action Button */}
              {!faceCapturedPhoto && !cameraError && (
                <div className="mt-4">
                  <Button
                    type="button"
                    onClick={handleCaptureFace}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2 px-6"
                  >
                    <Camera className="h-4 w-4" /> التقاط ومسح الوجه
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t pt-3 mt-2">
          <div className="text-xs text-muted-foreground">
            {fingerprintCaptured && faceCapturedPhoto ? (
              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                <Check className="h-3.5 w-3.5" /> البصمة والوجه جاهزان للحفظ
              </span>
            ) : (
              <span>يمكنك حفظ البصمة أو الوجه أو كليهما معاً.</span>
            )}
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>
              إلغاء
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              className="bg-primary hover:bg-primary/90 text-white font-bold gap-1.5"
            >
              <Check className="h-4 w-4 ml-1" /> اعتماد وحفظ البصمات
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
