import { useEffect, useState } from 'react';

function App() {
    const [storages, setStorages] = useState([]);
    const [isBackupMode, setIsBackupMode] = useState(false);

    useEffect(() => {
        // Statik yedek veri seti (Bulut sunucu kesintilerine karşı yedekleme katmanı)
        const backupData = [
            { id: 1, name: "🐟 Çipura Şoklama Odası - 1", temperature: -18.5 },
            { id: 2, name: "🐟 Levrek Muhafaza Deposu - 2", temperature: -4.2 },
            { id: 3, name: "📦 Donmuş Ürün Lojistik Palet Alanı", temperature: -22.0 },
            { id: 4, name: "🌊 Taze Hasat Ön Soğutma Tankı", temperature: 2.5 }
        ];

        fetch('https://localhost:7105/api/Storage')
            .then(response => {
                if (!response.ok) throw new Error('Sunucu yanıt vermedi.');
                return response.json();
            })
            .then(data => {
                setStorages(data);
                setIsBackupMode(false);
            })
            .catch(err => {
                console.log("Canlı API Hatası, Failover Güvenli Moda Geçiliyor:", err.message);
                // İnternet ortamında veritabanı bağlantısı kopsa bile tabloyu yedek veriyle besliyoruz
                setStorages(backupData);
                setIsBackupMode(true);
            });
    }, []);

    return (
        <div style={{ padding: '30px', fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto' }}>

            {/* Şirket Başlığı */}
            <h2 style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '10px' }}>
                🐟 Kılıç Deniz Lojistik - Soğuk Hava Deposu Yönetim Paneli
            </h2>

            {/* Dinamik Durum Bilgilendirme Kutusu */}
            {isBackupMode ? (
                <div style={{ padding: '10px', background: '#fef3c7', color: '#d97706', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>
                    ⚠️ Sistem Durumu: Cloud Failover Modu Aktif (Yedek Veri Sağlayıcı Devrede)
                </div>
            ) : (
                <div style={{ padding: '10px', background: '#dcfce7', color: '#15803d', borderRadius: '5px', marginBottom: '15px', fontWeight: 'bold' }}>
                    ✅ Sistem Durumu: Canlı API Entegrasyonu ve Veri Doğrulama Aktif (Port: 7105)
                </div>
            )}

            {/* Tablo Alanı */}
            <div style={{ marginTop: '20px' }}>
                <h3 style={{ color: '#374151' }}>❄️ Aktif Depo ve Oda Sıcaklık Listesi (Veritabanı Senkronize)</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#1e3a8a', color: 'white', textAlign: 'left' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Depo ID</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Oda Adı / Tanımı</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Anlık Sıcaklık</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd' }}>Durum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storages.map(storage => (
                            <tr key={storage.id} style={{ borderBottom: '1px solid #ddd', backgroundColor: storage.temperature > -5 ? '#fff5f5' : '#ffffff' }}>
                                <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>{storage.id}</td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>{storage.name}</td>
                                <td style={{
                                    padding: '12px',
                                    border: '1px solid #ddd',
                                    fontWeight: 'bold',
                                    color: storage.temperature > -5 ? '#b91c1c' : '#16a34a'
                                }}>
                                    {storage.temperature}°C
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                    {storage.temperature > -5 ? (
                                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>🚨 KRİTİK ALARM</span>
                                    ) : (
                                        <span style={{ background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '4px', fontSize: '13px', fontWeight: 'bold' }}>✅ STABİL</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
}

export default App;