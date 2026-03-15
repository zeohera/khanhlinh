interface StatsProps {
  data?: {
    items?: Array<{ value: string; suffix: string; label: string }>;
  };
}

export default function Stats({ data }: StatsProps) {
  const displayStats = data?.items || [
    { value: '20', suffix: '+', label: 'Năm Thương Hiệu' },
    { value: '2000', suffix: '+', label: 'Điểm Bán Toàn Quốc' },
    { value: '10', suffix: '+', label: 'Quốc Gia Xuất Khẩu' },
    { value: '150K', suffix: '', label: 'Sản Phẩm / Tháng' },
  ];

  return (
    <section className="stats-band">
      <div className="container">
        <div className="stats-grid">
          {displayStats.map((s) => (
            <div className="stat-item" key={s.label}>
              <div className="stat-value">
                {s.value}<span>{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
