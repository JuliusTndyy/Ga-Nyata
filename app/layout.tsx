import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-50 text-slate-800 font-sans text-sm antialiased">
        <div className="flex h-screen overflow-hidden bg-slate-50">
          
          <div className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col justify-between h-full flex-shrink-0">
            <div className="p-4">
              <div className="flex items-center gap-3 mb-8 px-2 mt-2">
                <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">👁️</div>
                <div>
                  <h1 className="text-lg font-bold leading-tight text-slate-900">VisionOne</h1>
                  <p className="text-[10px] text-slate-500 font-medium">AI Vision Screening</p>
                </div>
              </div>
              <nav className="flex flex-col gap-1">
                <div className="bg-blue-600 text-white px-4 py-3 rounded-xl font-medium flex items-center gap-3"><span>🏠</span> Dashboard</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>👤</span> Pasien</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>🎯</span> Skrining</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>📋</span> Riwayat Skrining</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>🖨️</span> Perangkat</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>📊</span> Analitik</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>🧠</span> AI Model</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>☁️</span> Cloud Sync</div>
                <div className="text-slate-600 hover:bg-slate-100 px-4 py-3 rounded-xl cursor-pointer flex items-center gap-3 font-medium"><span>⚙️</span> Pengaturan</div>
              </nav>
            </div>
            <div className="p-4 border-t border-slate-200">
              <div className="flex items-center justify-between hover:bg-slate-100 p-2 rounded-xl cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-300 rounded-full flex items-center justify-center text-lg">👨‍⚕️</div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">Dr. Andi Pratama</p>
                    <p className="text-xs text-slate-500">Tenaga Kesehatan</p>
                  </div>
                </div>
                <span className="text-slate-400">▼</span>
              </div>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto bg-slate-50">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
