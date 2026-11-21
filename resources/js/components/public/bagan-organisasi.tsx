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
                fill="#1d2b2d"
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
        stroke: '#334155',
        strokeWidth: 1.75,
        fill: 'none',
        strokeLinecap: 'round' as const,
        strokeLinejoin: 'round' as const,
    };

    const bidangGroups = [
        {
            cx: 182,
            leftCx: 96,
            rightCx: 268,
            ketuaX: 87,
            ketuaW: 190,
            leftX: 18,
            rightX: 190,
            fill: '#f3e8ff',
            stroke: '#c084fc',
            roleColor: '#581c87',
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
            ketuaX: 439,
            ketuaW: 190,
            leftX: 370,
            rightX: 542,
            fill: '#ffedd5',
            stroke: '#fb923c',
            roleColor: '#7c2d12',
            ketuaRole: [t('Ketua Bidang Keagamaan', 'Head of Religious Affairs')],
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
            ketuaX: 791,
            ketuaW: 190,
            leftX: 722,
            rightX: 894,
            fill: '#ffe4e6',
            stroke: '#fb7185',
            roleColor: '#881337',
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
            ketuaX: 1133,
            ketuaW: 210,
            leftX: 1074,
            rightX: 1246,
            fill: '#cffafe',
            stroke: '#22d3ee',
            roleColor: '#164e63',
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
                    viewBox="0 0 1420 556"
                    className="h-auto w-full select-text"
                    role="img"
                    aria-label={t(
                        'Bagan Struktur Organisasi Yayasan Geliyat Mahdiesa Nahate',
                        'Organizational Structure Chart of Yayasan Geliyat Mahdiesa Nahate',
                    )}
                >
                    {/* --- CONNECTOR LINES --- */}
                    {/* Pembina to Ketua Yayasan */}
                    <path
                        d="M 635 84 L 635 126 L 710 126 L 710 168"
                        {...lineProps}
                    />

                    {/* Anggota Pembina to Ketua Pengawas (Dashed - Hubungan Pengawasan) */}
                    <line
                        x1={983}
                        y1={52}
                        x2={1045}
                        y2={52}
                        stroke="#334155"
                        strokeWidth={1.75}
                        strokeDasharray="6 5"
                        strokeLinecap="round"
                    />

                    {/* Ketua Pengawas to Anggota Pengawas 1 (down) */}
                    <line x1={1135} y1={84} x2={1135} y2={112} {...lineProps} />

                    {/* Ketua Pengawas to Anggota Pengawas 2 (right then down) */}
                    <path
                        d="M 1225 52 L 1319.5 52 L 1319.5 112"
                        {...lineProps}
                    />

                    {/* Sekretaris Yayasan <-> Ketua Yayasan <-> Bendahara Yayasan */}
                    <line x1={570} y1={200} x2={602} y2={200} {...lineProps} />
                    <line x1={818} y1={200} x2={850} y2={200} {...lineProps} />

                    {/* Ketua Yayasan down to horizontal spine for 4 Bidang */}
                    <line x1={710} y1={232} x2={710} y2={286} {...lineProps} />
                    <line x1={182} y1={286} x2={1238} y2={286} {...lineProps} />

                    {/* Drops to each Ketua Bidang & splits to Bendahara/Sekretaris */}
                    {bidangGroups.map((group) => (
                        <g key={group.cx}>
                            <line
                                x1={group.cx}
                                y1={286}
                                x2={group.cx}
                                y2={334}
                                {...lineProps}
                            />
                            <line
                                x1={group.cx}
                                y1={402}
                                x2={group.cx}
                                y2={434}
                                {...lineProps}
                            />
                            <line
                                x1={group.leftCx}
                                y1={434}
                                x2={group.rightCx}
                                y2={434}
                                {...lineProps}
                            />
                            <line
                                x1={group.leftCx}
                                y1={434}
                                x2={group.leftCx}
                                y2={464}
                                {...lineProps}
                            />
                            <line
                                x1={group.rightCx}
                                y1={434}
                                x2={group.rightCx}
                                y2={464}
                                {...lineProps}
                            />
                        </g>
                    ))}

                    {/* --- ROW 1: PEMBINA & PENGAWAS --- */}
                    <OrgNode
                        x={530}
                        y={20}
                        w={210}
                        h={64}
                        roleLines={[t('Ketua Pembina', 'Chair of Trustees')]}
                        name="Bahrul Hayat, S.Ag., M.Sos."
                        fill="#dbeafe"
                        stroke="#60a5fa"
                        roleColor="#1e3a8a"
                    />
                    <OrgNode
                        x={758}
                        y={20}
                        w={225}
                        h={64}
                        roleLines={[t('Anggota Pembina', 'Board of Trustees Member')]}
                        name="Fahmi Ayatullah Assidqie, M.Sos."
                        fill="#dbeafe"
                        stroke="#60a5fa"
                        roleColor="#1e3a8a"
                    />
                    <OrgNode
                        x={1045}
                        y={20}
                        w={180}
                        h={64}
                        roleLines={[t('Ketua Pengawas', 'Chief Supervisor')]}
                        name="Ali Nurdin"
                        fill="#fef3c7"
                        stroke="#f59e0b"
                        roleColor="#78350f"
                    />

                    {/* --- ROW 1B: ANGGOTA PENGAWAS --- */}
                    <OrgNode
                        x={1045}
                        y={112}
                        w={180}
                        h={60}
                        roleLines={[t('Anggota Pengawas', 'Supervisor Member')]}
                        name="Cucum Sumiati, S.P."
                        fill="#fef3c7"
                        stroke="#f59e0b"
                        roleColor="#78350f"
                    />
                    <OrgNode
                        x={1237}
                        y={112}
                        w={165}
                        h={60}
                        roleLines={[t('Anggota Pengawas', 'Supervisor Member')]}
                        name="Moh Latip"
                        fill="#fef3c7"
                        stroke="#f59e0b"
                        roleColor="#78350f"
                    />

                    {/* --- ROW 2: PENGURUS INTI --- */}
                    <OrgNode
                        x={394}
                        y={168}
                        w={176}
                        h={64}
                        roleLines={[t('Sekretaris Yayasan', 'Foundation Secretary')]}
                        name="Juaningsih"
                        fill="#dcfce7"
                        stroke="#4ade80"
                        roleColor="#14532d"
                    />
                    <OrgNode
                        x={602}
                        y={168}
                        w={216}
                        h={64}
                        roleLines={[t('Ketua Yayasan', 'Foundation Chair')]}
                        name="Nina Mahdiah, S.Ag., M.Sos."
                        fill="#dcfce7"
                        stroke="#4ade80"
                        roleColor="#14532d"
                    />
                    <OrgNode
                        x={850}
                        y={168}
                        w={176}
                        h={64}
                        roleLines={[t('Bendahara Yayasan', 'Foundation Treasurer')]}
                        name="Dewi Yulia"
                        fill="#dcfce7"
                        stroke="#4ade80"
                        roleColor="#14532d"
                    />

                    {/* Legend: Garis putus-putus */}
                    <g transform="translate(1045, 212)">
                        <line
                            x1={0}
                            y1={-4}
                            x2={28}
                            y2={-4}
                            stroke="#475569"
                            strokeWidth={1.75}
                            strokeDasharray="5 4"
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

                    {/* --- ROW 3 & 4: 4 BIDANG --- */}
                    {bidangGroups.map((group) => (
                        <g key={group.ketuaName}>
                            <OrgNode
                                x={group.ketuaX}
                                y={334}
                                w={group.ketuaW}
                                h={68}
                                roleLines={group.ketuaRole}
                                name={group.ketuaName}
                                fill={group.fill}
                                stroke={group.stroke}
                                roleColor={group.roleColor}
                            />
                            <OrgNode
                                x={group.leftX}
                                y={464}
                                w={156}
                                h={72}
                                roleLines={group.bendaharaRole}
                                name={group.bendaharaName}
                                fill={group.fill}
                                stroke={group.stroke}
                                roleColor={group.roleColor}
                            />
                            <OrgNode
                                x={group.rightX}
                                y={464}
                                w={156}
                                h={72}
                                roleLines={group.sekretarisRole}
                                name={group.sekretarisName}
                                fill={group.fill}
                                stroke={group.stroke}
                                roleColor={group.roleColor}
                            />
                        </g>
                    ))}
                </svg>
            </div>
        </div>
    );
}
