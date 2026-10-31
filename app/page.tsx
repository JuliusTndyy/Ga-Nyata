"use client";

import { useRef, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Dashboard() {
  const pieData = [
    { name: 'Normal', value: 132, color: '#22c55e' },
    { name: 'Abnormal', value: 42, color: '#f97316' },
    { name: 'Referral', value: 19, color: '#ef4444' },
  ];

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasil, setHasil] = useState<string | null>("NORMAL"); 
  const [kepercayaan, setKepercayaan] = useState<number>(0); 

  // --- 3. Fungsi Logika Kamera & AI ---
  const handleKamera = async () => {
    if (!isCameraOn && !imageSrc) {
      // Nyalakan Kamera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
          setImageSrc(null);
        }
      } catch (err) {
        alert("Izinkan akses kamera di browser.");
      }
    } else if (isCameraOn) {
      if (videoRef.current && canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, 640, 480);
          const base64Image = canvasRef.current.toDataURL('image/jpeg');
          setImageSrc(base64Image);
          
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(track => track.stop());
          setIsCameraOn(false);

          setIsAnalyzing(true);
          try {
            const response = await fetch('http://127.0.0.1:5000/predict', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image_data: base64Image })
            });

            if (!response.ok) throw new Error("Gagal terhubung ke ML");

            const data = await response.json();

            setHasil(data.hasil_prediksi.toUpperCase());
            setKepercayaan(data.kepercayaan); 
            
          } catch (error) {
            console.error("API Error:", error);
            alert("Gagal menghubungi AI. Pastikan server Flask menyala.");
            setHasil("ERROR");
          } finally {
            setIsAnalyzing(false);
          }
        }
      }
    } else if (imageSrc) {
      setImageSrc(null);
      setHasil("NORMAL");
      setKepercayaan(0);
      
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraOn(true);
        }
      } catch (err) {
        alert("Izinkan akses kamera di browser.");
      }
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900">Dashboard Skrining</h2>
          <p className="text-slate-600 text-xs md:text-sm mt-1">Sistem deteksi dini kelainan refraksi dan patologi mata</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-700 bg-white px-4 py-2 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-1.5"><span className="w-2 h-2 bg-green-500 rounded-full"></span> Edge AI</div>
            <div className="flex items-center gap-1">🔋 88%</div>
            <div className="flex items-center gap-1">🛜 48 Mbps</div>
          </div>
          <span className="cursor-pointer text-xl relative hidden md:block">🔔<span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-50"></span></span>
        </div>
      </div>

      {/* STATISTIK ATAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="text-blue-600 text-xl bg-blue-50 p-2 rounded-lg font-bold">📈</div>
          <div><p className="text-xs text-slate-600 font-medium">Total Skrining</p><p className="font-bold text-xl leading-tight text-slate-900">174</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="text-green-600 text-xl bg-green-50 p-2 rounded-lg font-bold">✅</div>
          <div><p className="text-xs text-slate-600 font-medium">Normal</p><p className="font-bold text-xl leading-tight text-slate-900">132</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="text-orange-600 text-xl bg-orange-50 p-2 rounded-lg font-bold">👁️</div>
          <div><p className="text-xs text-slate-600 font-medium">Abnormal</p><p className="font-bold text-xl leading-tight text-slate-900">42</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
          <div className="text-red-600 text-xl bg-red-50 p-2 rounded-lg font-bold">🩺</div>
          <div><p className="text-xs text-slate-600 font-medium">Butuh Rujukan</p><p className="font-bold text-xl leading-tight text-slate-900">19</p></div>
        </div>
      </div>

      {/* AREA LIVE SCREENING & HASIL DIAGNOSIS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* PANEL LIVE SCREENING */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-bold text-base text-slate-900">Live Screening</h3>
            <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded font-bold">LIVE CAMERA</span>
          </div>
          <div className="p-4 md:p-6 flex flex-col md:flex-row flex-1 gap-6">
            
            {/* Tampilan Video / Canvas */}
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="bg-slate-200 w-full h-48 md:h-full min-h-[200px] rounded-xl flex items-center justify-center relative overflow-hidden">
                <canvas ref={canvasRef} width="640" height="480" className="hidden" />
                
                {!imageSrc && (
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    className={`w-full h-full object-cover ${isCameraOn ? 'block' : 'hidden'}`} 
                  />
                )}
                
                {imageSrc && (
                  <img src={imageSrc} alt="Hasil" className="w-full h-full object-cover" />
                )}

                {!isCameraOn && !imageSrc && (
                  <>
                    <div className="absolute inset-0 border-2 border-green-400/50 rounded-full scale-75 border-dashed"></div>
                    <div className="absolute w-full h-px bg-green-400/50"></div>
                    <div className="absolute h-full w-px bg-green-400/50"></div>
                  </>
                )}
              </div>
            </div>

            {/* Indikator & Tombol Jepret */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-sm mb-3 text-slate-900">Indikator Kualitas Gambar</h4>
                <div className="flex flex-col gap-3 text-sm">
                  <div className="flex justify-between items-center"><span className="text-slate-600">Jarak Mata</span><span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded">Optimal</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">Pencahayaan</span><span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded">Terang</span></div>
                  <div className="flex justify-between items-center"><span className="text-slate-600">Fokus Lensa</span><span className="text-green-700 font-bold bg-green-50 px-2 py-1 rounded">Terkunci</span></div>
                </div>
              </div>
              <button 
                onClick={handleKamera}
                className={`w-full text-white font-bold py-3 rounded-xl mt-4 flex items-center justify-center gap-2 shadow-md transition-colors ${imageSrc ? 'bg-slate-600 hover:bg-slate-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {!isCameraOn && !imageSrc && "📷 Nyalakan Kamera"}
                {isCameraOn && "📸 Ambil Citra Mata"}
                {imageSrc && "🔄 Ulangi Skrining"}
              </button>
            </div>
          </div>
        </div>

        {/* PANEL HASIL DIAGNOSIS */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col">
          <div className="p-4 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">Hasil Diagnosis AI</h3>
          </div>
          <div className="p-5 flex-1 flex flex-col">
            
            {isAnalyzing ? (
              <div className="animate-pulse flex flex-col gap-3 h-full justify-center">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                <p className="text-slate-400 text-sm mt-4 text-center">AI sedang menganalisis gambar...</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${hasil === 'NORMAL' ? 'bg-green-100' : 'bg-red-100'}`}>
                    {hasil === 'NORMAL' ? '🛡️' : '⚠️'}
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Prediksi Sistem</p>
                    <h4 className={`text-xl font-bold ${hasil === 'NORMAL' ? 'text-green-600' : 'text-red-600'}`}>
                      {hasil}
                    </h4>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate-700">Tingkat Kepercayaan</span>
                    <span className={`font-bold ${hasil === 'NORMAL' ? 'text-green-600' : 'text-red-600'}`}>
                      {kepercayaan > 0 ? `${kepercayaan.toFixed(1)}%` : '0%'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className={`h-2 rounded-full ${hasil === 'NORMAL' ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${kepercayaan}%` }}></div>
                  </div>
                </div>
                
                <div className={`border rounded-xl p-4 mb-6 mt-auto ${hasil === 'NORMAL' ? 'bg-slate-50 border-slate-200' : 'bg-red-50 border-red-200'}`}>
                  <p className="text-xs font-bold mb-1 text-slate-800">Tindakan Klinis:</p>
                  <p className="text-xs text-slate-700">
                    {hasil === 'NORMAL' 
                      ? 'Tidak ditemukan indikasi penyakit. Sarankan pasien untuk pemeriksaan rutin 1 tahun sekali.'
                      : 'Segera rujuk pasien ke dokter spesialis mata (Ophthalmologist) untuk pemeriksaan lanjutan.'}
                  </p>
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-3 mt-auto">
              <button className="border-2 border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-bold py-2 rounded-xl" disabled={isAnalyzing}>Cetak</button>
              <button className="bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold py-2 rounded-xl" disabled={isAnalyzing}>Simpan Medis</button>
            </div>
          </div>
        </div>
      </div>

      {/* STATISTIK BAWAH */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4">
          <h3 className="font-bold text-base text-slate-900 mb-4">Statistik AI Harian</h3>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={50} outerRadius={75} dataKey="value" stroke="none">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{fontSize: '12px', borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-slate-700 font-medium"><span className="w-3 h-3 bg-green-500 rounded-full"></span>Normal</div>
            <div className="flex items-center gap-1 text-xs text-slate-700 font-medium"><span className="w-3 h-3 bg-orange-500 rounded-full"></span>Abnormal</div>
            <div className="flex items-center gap-1 text-xs text-slate-700 font-medium"><span className="w-3 h-3 bg-red-500 rounded-full"></span>Referral</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4">
          <h3 className="font-bold text-base text-slate-900 mb-4">Antrean Pasien</h3>
          <div className="flex-1 flex flex-col gap-2">
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div><p className="text-sm font-bold text-slate-900">Budi Santoso</p><p className="text-xs text-slate-600">P-2025-1087 • 09:51 WIB</p></div>
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">Katarak (89%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div><p className="text-sm font-bold text-slate-900">Dewi Lestari</p><p className="text-xs text-slate-600">P-2025-1086 • 09:12 WIB</p></div>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">Pterigium (91%)</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
              <div><p className="text-sm font-bold text-slate-900">Siti Aisyah</p><p className="text-xs text-slate-600">P-2025-1088 • 10:24 WIB</p></div>
              <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">Normal (96%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-4">Performa Model AI</h3>
            <div className="bg-slate-50 rounded-xl p-4 mb-4">
              <p className="text-sm font-bold text-blue-600 mb-1">TinyML v1.2 (Local Edge)</p>
              <div className="flex justify-between text-xs text-slate-700 mb-1"><span>Akurasi Validasi</span><span className="font-bold text-slate-900">95.3%</span></div>
              <div className="flex justify-between text-xs text-slate-700"><span>Rata-rata Latensi</span><span className="font-bold text-slate-900">0.82 dtk</span></div>
            </div>
            <div className="bg-slate-50 rounded-xl p-4">
              <p className="text-sm font-bold text-indigo-600 mb-1">Cloud AI v2.1 (Hybrid Server)</p>
              <div className="flex justify-between text-xs text-slate-700 mb-1"><span>Akurasi Validasi</span><span className="font-bold text-slate-900">97.6%</span></div>
              <div className="flex justify-between text-xs text-slate-700"><span>Rata-rata Latensi</span><span className="font-bold text-slate-900">2.31 dtk</span></div>
            </div>
          </div>
          <button className="w-full text-xs font-bold text-slate-600 hover:text-blue-600 mt-4 text-left">Jalankan Diagnostik Sistem ➔</button>
        </div>
      </div>
    </div>
  );
}