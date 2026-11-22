import { useLanguage } from '@/hooks/use-language';

interface OrgNodeProps {
    x: number;
    y: number;
    w: number;
    h: number;
    roleLines: string[];
    name: string;
    fill: string;
    stroke: string;
    roleColor: string;
    nameColor?: string;
}

function OrgNode({
    x,
    y,
    w,
    h,
    roleLines,
    name,
    fill,
    stroke,
    roleColor,
    nameColor = '#1d2b2d',
}: OrgNodeProps) {
    const cx = x + w / 2;
    const isTwoLineRole = roleLines.length > 1;
    const roleStartY = isTwoLineRole ? y + h / 2 - 14 : y + h / 2 - 7;
    const nameY = isTwoLineRole ? y + h / 2 + 19 : y + h / 2 + 13;

    return (
        <g>
            <rect
                x={x}
                y={y}
                width={w}
                height={h}
                rx={10}
                ry={10}
                fill={fill}
                stroke={stroke}
                strokeWidth={1.5}
            />
            {roleLines.map((line, index) => (
                <text
                    key={index}
                    x={cx}
                    y={roleStartY + index * 14}
                    textAnchor="middle"
                    fill={roleColor}
                    fontSize={11.5}
                    fontWeight={700}
                    fontFamily="Poppins, Inter, system-ui, sans-serif"
                >
                    {line}
                </text>
            ))}
            <text
                x={cx}
                y={nameY}
                textAnchor="middle"
                fill={nameColor}
                fontSize={11.5}
                fontWeight={500}
                fontFamily="Inter, system-ui, sans-serif"
            >
                {name}
            </text>
        </g>
    );
}

export default function BaganOrganisasi() {
    const { t } = useLanguage();

    const lineProps = {
        stroke: '#718083',
        strokeWidth: 1.6,
        fill: 'none',
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    const palette = {
        ketuaPembina: {
            fill: '#1d2b2d',
            stroke: '#1d2b2d',
            roleColor: '#9decf4',
            nameColor: '#ffffff',
        },
        anggotaPembina: {
            fill: '#f1f7f8',
            stroke: '#718083',
            roleColor: '#1d2b2d',
            nameColor: '#1d2b2d',
        },
        ketuaPengawas: {
            fill: '#f7fcfd',
            stroke: '#718083',
            roleColor: '#186972',
            nameColor: '#1d2b2d',
        },
        anggotaPengawas: {
            fill: '#ffffff',
            stroke: '#cbd5e1',
            roleColor: '#475569',
            nameColor: '#1d2b2d',
        },
        ketuaYayasan: {
            fill: '#087f8c',
            stroke: '#087f8c',
            roleColor: '#d1f6fa',
            nameColor: '#ffffff',
        },
        pengurusIntiSub: {
            fill: '#e8f8fa',
            stroke: '#14bace',
            roleColor: '#087f8c',
            nameColor: '#1d2b2d',
        },
        ketuaBidang: {
            fill: '#e8f8fa',
            stroke: '#14bace',
            roleColor: '#087f8c',
            nameColor: '#1d2b2d',
        },
        pengurusBidang: {
            fill: '#ffffff',
            stroke: '#cde3e6',
            roleColor: '#186972',
            nameColor: '#1d2b2d',
        },
    };

    const bidangGroups = [
        {
            cx: 182,
            leftCx: 96,
            rightCx: 268,
            ketuaX: 77,
            ketuaW: 210,
            leftX: 18,
            rightX: 190,
            ketuaRole: [t('Ketua Bidang Pendidikan', 'Head of Education')],
            ketuaName: 'Hindun Purnama',
            bendaharaRole: [
                t('Bendahara Bidang', 'Treasurer of'),
                t('Pendidikan', 'Education'),
            ],
            bendaharaName: 'Sukmayani',
            sekretarisRole: [
                t('Sekretaris Bidang', 'Secretary of'),
                t('Pendidikan', 'Education'),
            ],
            sekretarisName: 'Tanti Susana',
        },
        {
            cx: 534,
            leftCx: 448,
            rightCx: 620,
            ketuaX: 429,
            ketuaW: 210,
            leftX: 370,
            rightX: 542,
            ketuaRole: [
                t('Ketua Bidang Keagamaan', 'Head of Religious Affairs'),
            ],
            ketuaName: 'Siti Solihah',
            bendaharaRole: [
                t('Bendahara Bidang', 'Treasurer of'),
                t('Keagamaan', 'Religious Affairs'),
            ],
            bendaharaName: 'Nani Suharni',
            sekretarisRole: [
                t('Sekretaris Bidang', 'Secretary of'),
                t('Keagamaan', 'Religious Affairs'),
            ],
            sekretarisName: 'Rosmiati',
        },
        {
            cx: 886,
            leftCx: 800,
            rightCx: 972,
            ketuaX: 781,
            ketuaW: 210,
            leftX: 722,
            rightX: 894,
            ketuaRole: [t('Ketua Bidang Kemanusiaan', 'Head of Humanity')],
            ketuaName: 'Vivi Ratnawati',
            bendaharaRole: [
                t('Bendahara Bidang', 'Treasurer of'),
                t('Kemanusiaan', 'Humanity'),
            ],
            bendaharaName: 'Kiki Sukiah',
            sekretarisRole: [
                t('Sekretaris Bidang', 'Secretary of'),
                t('Kemanusiaan', 'Humanity'),
            ],
            sekretarisName: 'Erlyn Permanasari',
        },
        {
            cx: 1238,
            leftCx: 1152,
            rightCx: 1324,
            ketuaX: 1128,
            ketuaW: 220,
            leftX: 1074,
            rightX: 1246,
            ketuaRole: [
                t('Ketua Bidang Pengembangan', 'Head of Economic'),
                t('Ekonomi', 'Development'),
            ],
            ketuaName: 'Sri Amelia Rahayu',
            bendaharaRole: [
                t('Bendahara Bidang', 'Treasurer of Economic'),
                t('Pengembangan Ekonomi', 'Development'),
            ],
            bendaharaName: 'Marwiyah',
            sekretarisRole: [
                t('Sekretaris Bidang', 'Secretary of Economic'),
                t('Pengembangan Ekonomi', 'Development'),
            ],
            sekretarisName: 'Farida',
        },
    ];

    return (
        <div className="w-full overflow-x-auto pb-2">
            <div className="min-w-[1000px]">
                <svg
                    viewBox="0 0 1420 612"
                    className="h-auto w-full select-text"
                    role="img"
                    aria-label={t(
                        'Bagan Struktur Organisasi Yayasan Geliyat Mahdiesa Nahate',
                        'Organizational Structure Chart of Yayasan Geliyat Mahdiesa Nahate',
                    )}
                >
                    {/* --- CONNECTOR LINES (ALL STRICTLY ORTHOGONAL) --- */}
                    {/* Anggota Pembina <-> Ketua Pembina */}
                    <line x1={555} y1={57} x2={595} y2={57} {...lineProps} />

                    {/* Ketua Pembina - - - Ketua Pengawas (Dashed - Hubungan Pengawasan) */}
                    <line
                        x1={825}
                        y1={57}
                        x2={1111}
                        y2={57}
                        stroke="#186972"
                        strokeWidth={1.6}
                        strokeDasharray="6 5"
                        strokeLinecap="round"
                    />

                    {/* Ketua Pengawas -> Symmetric T-fork to 2 Anggota Pengawas */}
                    <line x1={1206} y1={90} x2={1206} y2={110} {...lineProps} />
                    <line
                        x1={1106}
                        y1={110}
                        x2={1306}
                        y2={110}
                        {...lineProps}
                    />
                    <line
                        x1={1106}
                        y1={110}
                        x2={1106}
                        y2={128}
                        {...lineProps}
                    />
                    <line
                        x1={1306}
                        y1={110}
                        x2={1306}
                        y2={128}
                        {...lineProps}
                    />

                    {/* Ketua Pembina -> Ketua Yayasan (Straight central vertical axis x=710) */}
                    <line x1={710} y1={90} x2={710} y2={136} {...lineProps} />

                    {/* Ketua Yayasan down central spine to 4 Bidang crossbar */}
                    <line x1={710} y1={202} x2={710} y2={356} {...lineProps} />

                    {/* Symmetric T-fork below Ketua Yayasan to Sekretaris Yayasan & Bendahara Yayasan */}
                    <line x1={550} y1={226} x2={870} y2={226} {...lineProps} />
                    <line x1={550} y1={226} x2={550} y2={250} {...lineProps} />
                    <line x1={870} y1={226} x2={870} y2={250} {...lineProps} />

                    {/* Horizontal spine for 4 Bidang */}
                    <line x1={182} y1={356} x2={1238} y2={356} {...lineProps} />

                    {/* Drops to each Ketua Bidang & splits to Bendahara/Sekretaris */}
                    {bidangGroups.map((group) => (
                        <g key={group.cx}>
                            <line
                                x1={group.cx}
                                y1={356}
                                x2={group.cx}
                                y2={396}
                                {...lineProps}
                            />
                            <line
                                x1={group.cx}
                                y1={464}
                                x2={group.cx}
                                y2={490}
                                {...lineProps}
                            />
                            <line
                                x1={group.leftCx}
                                y1={490}
                                x2={group.rightCx}
                                y2={490}
                                {...lineProps}
                            />
                            <line
                                x1={group.leftCx}
                                y1={490}
                                x2={group.leftCx}
                                y2={516}
                                {...lineProps}
                            />
                            <line
                                x1={group.rightCx}
                                y1={490}
                                x2={group.rightCx}
                                y2={516}
                                {...lineProps}
                            />
                        </g>
                    ))}

                    {/* --- ROW 1: PEMBINA & KETUA PENGAWAS --- */}
                    <OrgNode
                        x={309}
                        y={24}
                        w={246}
                        h={66}
                        roleLines={[
                            t('Anggota Pembina', 'Board of Trustees Member'),
                        ]}
                        name="Fahmi Ayatullah Assidqie, M.Sos."
                        {...palette.anggotaPembina}
                    />
                    <OrgNode
                        x={595}
                        y={24}
                        w={230}
                        h={66}
                        roleLines={[t('Ketua Pembina', 'Chair of Trustees')]}
                        name="Bahrul Hayat, S.Ag., M.Sos."
                        {...palette.ketuaPembina}
                    />
                    <OrgNode
                        x={1111}
                        y={24}
                        w={190}
                        h={66}
                        roleLines={[t('Ketua Pengawas', 'Chief Supervisor')]}
                        name="Ali Nurdin"
                        {...palette.ketuaPengawas}
                    />

                    {/* --- ROW 1B: ANGGOTA PENGAWAS --- */}
                    <OrgNode
                        x={1018}
                        y={128}
                        w={176}
                        h={62}
                        roleLines={[t('Anggota Pengawas', 'Supervisor Member')]}
                        name="Cucum Sumiati, S.P."
                        {...palette.anggotaPengawas}
                    />
                    <OrgNode
                        x={1218}
                        y={128}
                        w={176}
                        h={62}
                        roleLines={[t('Anggota Pengawas', 'Supervisor Member')]}
                        name="Moh Latip"
                        {...palette.anggotaPengawas}
                    />

                    {/* Legend: Garis putus-putus */}
                    <g transform="translate(1018, 222)">
                        <line
                            x1={0}
                            y1={-4}
                            x2={28}
                            y2={-4}
                            stroke="#186972"
                            strokeWidth={1.6}
                            strokeDasharray="6 5"
                            strokeLinecap="round"
                        />
                        <text
                            x={36}
                            y={0}
                            fill="#475569"
                            fontSize={12}
                            fontStyle="italic"
                            fontFamily="Inter, system-ui, sans-serif"
                        >
                            {t(
                                'Garis putus-putus: hubungan pengawasan',
                                'Dashed line: supervisory relationship',
                            )}
                        </text>
                    </g>

                    {/* --- ROW 2: KETUA YAYASAN --- */}
                    <OrgNode
                        x={595}
                        y={136}
                        w={230}
                        h={66}
                        roleLines={[t('Ketua Yayasan', 'Foundation Chair')]}
                        name="Nina Mahdiah, S.Ag., M.Sos."
                        {...palette.ketuaYayasan}
                    />

                    {/* --- ROW 3: SEKRETARIS & BENDAHARA YAYASAN (BELOW KETUA YAYASAN) --- */}
                    <OrgNode
                        x={452}
                        y={250}
                        w={196}
                        h={64}
                        roleLines={[
                            t('Sekretaris Yayasan', 'Foundation Secretary'),
                        ]}
                        name="Juaningsih"
                        {...palette.pengurusIntiSub}
                    />
                    <OrgNode
                        x={772}
                        y={250}
                        w={196}
                        h={64}
                        roleLines={[
                            t('Bendahara Yayasan', 'Foundation Treasurer'),
                        ]}
                        name="Dewi Yulia"
                        {...palette.pengurusIntiSub}
                    />

                    {/* --- ROW 4 & 5: 4 BIDANG --- */}
                    {bidangGroups.map((group) => (
                        <g key={group.ketuaName}>
                            <OrgNode
                                x={group.ketuaX}
                                y={396}
                                w={group.ketuaW}
                                h={68}
                                roleLines={group.ketuaRole}
                                name={group.ketuaName}
                                {...palette.ketuaBidang}
                            />
                            <OrgNode
                                x={group.leftX}
                                y={516}
                                w={156}
                                h={72}
                                roleLines={group.bendaharaRole}
                                name={group.bendaharaName}
                                {...palette.pengurusBidang}
                            />
                            <OrgNode
                                x={group.rightX}
                                y={516}
                                w={156}
                                h={72}
                                roleLines={group.sekretarisRole}
                                name={group.sekretarisName}
                                {...palette.pengurusBidang}
                            />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
