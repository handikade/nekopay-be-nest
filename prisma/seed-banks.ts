import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

// Create the connection pool
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Initialize Prisma with the adapter
const prisma = new PrismaClient({ adapter });

const banks: Prisma.BankCreateInput[] = [
  { code: 'BPD_ACEH', name: 'BPD Aceh' },
  { code: 'BPD_ACEH_UUS', name: 'BPD Aceh UUS' },
  { code: 'BANK_AGRIS', name: 'Bank Agris' },
  { code: 'BANK_RAYA_INDONESIA', name: 'Bank Raya Indonesia (formerly called Bank BRI Agroniaga)' },
  {
    code: 'BANK_ALADIN_SYARIAH',
    name: 'Bank Aladin Syariah (formerly Bank Maybank Syariah Indonesia)',
  },
  { code: 'ALLO_BANK_INDONESIA', name: 'Allo Bank Indonesia (formerly Bank Harda Internasional)' },
  {
    code: 'BANK_AMAR_INDONESIA',
    name: 'Bank Amar Indonesia (formerly called Anglomas International Bank)',
  },
  { code: 'ANGLOMAS_INTERNATIONAL_BANK', name: 'Anglomas International Bank' },
  { code: 'BANK_ANZ_INDONESIA', name: 'Bank ANZ Indonesia' },
  { code: 'BANK_ARTA_NIAGA_KENCANA', name: 'Bank Arta Niaga Kencana' },
  { code: 'BANK_ARTHA_GRAHA_INTERNATIONAL', name: 'Bank Artha Graha International' },
  { code: 'BANK_JAGO', name: 'Bank Jago (formerly called Bank Artos Indonesia)' },
  { code: 'BPD_BALI', name: 'BPD Bali' },
  { code: 'BANK_OF_AMERICA_MERILL_LYNCH', name: 'Bank of America Merill-Lynch' },
  { code: 'BPD_BANTEN', name: 'BPD Banten (formerly called Bank Pundi Indonesia)' },
  { code: 'BANK_CENTRAL_ASIA', name: 'Bank Central Asia (BCA)' },
  { code: 'BANK_CENTRAL_ASIA_DIGITAL', name: 'Bank Central Asia Digital (BluBCA)' },
  { code: 'BANK_CENTRAL_ASIA_SYARIAH', name: 'Bank Central Asia (BCA) Syariah' },
  { code: 'BPD_BENGKULU', name: 'BPD Bengkulu' },
  { code: 'BANK_BISNIS_INTERNASIONAL', name: 'Bank Bisnis Internasional' },
  { code: 'BANK_BJB', name: 'Bank BJB' },
  { code: 'BANK_BJB_SYARIAH', name: 'Bank BJB Syariah' },
  { code: 'BANK_NEO_COMMERCE', name: 'Bank Neo Commerce (formerly Bank Yudha Bhakti)' },
  { code: 'BANK_NEGARA_INDONESIA', name: 'Bank Negara Indonesia (BNI)' },
  { code: 'BANK_BNP_PARIBAS', name: 'Bank BNP Paribas' },
  { code: 'BANK_OF_CHINA', name: 'Bank of China (BOC)' },
  { code: 'BANK_RAKYAT_INDONESIA', name: 'Bank Rakyat Indonesia (BRI)' },
  { code: 'BANK_SYARIAH_INDONESIA', name: 'Bank Syariah Indonesia (BSI)' },
  { code: 'BANK_TABUNGAN_NEGARA', name: 'Bank Tabungan Negara (BTN)' },
  { code: 'BANK_TABUNGAN_NEGARA_UUS', name: 'Bank Tabungan Negara (BTN) UUS' },
  {
    code: 'BTPN_SYARIAH',
    name: 'BTPN Syariah (formerly called BTPN UUS and Bank Sahabat Purba Danarta)',
  },
  { code: 'BANK_BUKOPIN', name: 'Bank Bukopin' },
  { code: 'BANK_SYARIAH_BUKOPIN', name: 'Bank Syariah Bukopin' },
  { code: 'BANK_BUMI_ARTA', name: 'Bank Bumi Arta' },
  { code: 'BANK_CAPITAL_INDONESIA', name: 'Bank Capital Indonesia' },
  {
    code: 'CHINA_CONSTRUCTION_BANK_INDONESIA',
    name: 'China Construction Bank Indonesia (formerly called Bank Antar Daerah and Bank Windu Kentjana International)',
  },
  { code: 'BANK_CHINATRUST_INDONESIA', name: 'Bank Chinatrust Indonesia' },
  { code: 'BANK_CIMB_NIAGA', name: 'Bank CIMB Niaga' },
  { code: 'BANK_CIMB_NIAGA_UUS', name: 'Bank CIMB Niaga UUS' },
  { code: 'CITIBANK', name: 'Citibank' },
  { code: 'BANK_COMMONWEALTH', name: 'Bank Commonwealth' },
  { code: 'BPD_DAERAH_ISTIMEWA_YOGYAKARTA', name: 'BPD Daerah Istimewa Yogyakarta (DIY)' },
  { code: 'BPD_DAERAH_ISTIMEWA_YOGYAKARTA_UUS', name: 'BPD Daerah Istimewa Yogyakarta (DIY) UUS' },
  { code: 'DANA', name: 'DANA' },
  { code: 'BANK_DANAMON', name: 'Bank Danamon' },
  { code: 'BANK_DANAMON_UUS', name: 'Bank Danamon UUS' },
  { code: 'BANK_DBS_INDONESIA', name: 'Bank DBS Indonesia' },
  { code: 'DEUTSCHE_BANK', name: 'Deutsche Bank' },
  { code: 'BANK_DINAR_INDONESIA', name: 'Bank Dinar Indonesia' },
  { code: 'BANK_DKI', name: 'Bank DKI' },
  { code: 'BANK_DKI_UUS', name: 'Bank DKI UUS' },
  {
    code: 'INDONESIA_EXIMBANK',
    name: 'Indonesia Eximbank (formerly called Bank Ekspor Indonesia)',
  },
  { code: 'BANK_FAMA_INTERNATIONAL', name: 'Bank Fama International' },
  { code: 'BANK_GANESHA', name: 'Bank Ganesha' },
  { code: 'GOPAY', name: 'GoPay' },
  { code: 'BANK_HANA', name: 'Bank Hana' },
  { code: 'BANK_HIMPUNAN_SAUDARA_1906', name: 'Bank Himpunan Saudara 1906' },
  { code: 'HSBC_INDONESIA', name: 'HSBC Indonesia (formerly called Bank Ekonomi Raharja)' },
  {
    code: 'HONGKONG_AND_SHANGHAI_BANK_CORPORATION_UUS',
    name: 'Hongkong and Shanghai Bank Corporation (HSBC) UUS',
  },
  { code: 'BANK_IBK_INDONESIA', name: 'Bank IBK Indonesia (formerly Bank Agris)' },
  { code: 'BANK_ICBC_INDONESIA', name: 'Bank ICBC Indonesia' },
  { code: 'BANK_INA_PERDANIA', name: 'Bank Ina Perdania' },
  { code: 'BANK_INDEX_SELINDO', name: 'Bank Index Selindo' },
  { code: 'BANK_OF_INDIA_INDONESIA', name: 'Bank of India Indonesia' },
  { code: 'BPD_JAMBI', name: 'BPD Jambi' },
  { code: 'BPD_JAMBI_UUS', name: 'BPD Jambi UUS' },
  { code: 'BANK_JASA_JAKARTA', name: 'Bank Jasa Jakarta' },
  { code: 'BPD_JAWA_TENGAH', name: 'BPD Jawa Tengah' },
  { code: 'BPD_JAWA_TENGAH_UUS', name: 'BPD Jawa Tengah UUS' },
  { code: 'BPD_JAWA_TIMUR', name: 'BPD Jawa Timur' },
  { code: 'BPD_JAWA_TIMUR_UUS', name: 'BPD Jawa Timur UUS' },
  { code: 'JP_MORGAN_CHASE_BANK', name: 'JP Morgan Chase Bank' },
  { code: 'BANK_JTRUST_INDONESIA', name: 'Bank JTrust Indonesia (formerly called Bank Mutiara)' },
  { code: 'BPD_KALIMANTAN_BARAT', name: 'BPD Kalimantan Barat' },
  { code: 'BPD_KALIMANTAN_BARAT_UUS', name: 'BPD Kalimantan Barat UUS' },
  { code: 'BPD_KALIMANTAN_SELATAN', name: 'BPD Kalimantan Selatan' },
  { code: 'BPD_KALIMANTAN_SELATAN_UUS', name: 'BPD Kalimantan Selatan UUS' },
  { code: 'BPD_KALIMANTAN_TENGAH', name: 'BPD Kalimantan Tengah' },
  { code: 'BPD_KALIMANTAN_TIMUR', name: 'BPD Kalimantan Timur' },
  { code: 'BPD_KALIMANTAN_TIMUR_UUS', name: 'BPD Kalimantan Timur UUS' },
  {
    code: 'BANK_SEABANK_INDONESIA',
    name: 'Bank Seabank Indonesia (formerly called Bank Kesejahteraan Ekonomi)',
  },
  { code: 'BPD_LAMPUNG', name: 'BPD Lampung' },
  { code: 'LINKAJA', name: 'LinkAja' },
  { code: 'BPD_MALUKU', name: 'BPD Maluku' },
  { code: 'BANK_MANDIRI', name: 'Bank Mandiri' },
  {
    code: 'MANDIRI_TASPEN_POS',
    name: 'Mandiri Taspen Pos (formerly called Bank Sinar Harapan Bali)',
  },
  { code: 'BANK_MASPION_INDONESIA', name: 'Bank Maspion Indonesia' },
  { code: 'BANK_MAYAPADA_INTERNATIONAL', name: 'Bank Mayapada International' },
  { code: 'BANK_MAYBANK', name: 'Bank Maybank' },
  { code: 'BANK_MAYBANK_SYARIAH_INDONESIA', name: 'Bank Maybank Syariah Indonesia' },
  { code: 'BANK_MAYORA', name: 'Bank Mayora' },
  { code: 'BANK_MEGA', name: 'Bank Mega' },
  { code: 'BANK_SYARIAH_MEGA', name: 'Bank Syariah Mega' },
  { code: 'BANK_MESTIKA_DHARMA', name: 'Bank Mestika Dharma' },
  { code: 'BANK_MIZUHO_INDONESIA', name: 'Bank Mizuho Indonesia' },
  { code: 'BANK_MNC_INTERNASIONAL', name: 'Bank MNC Internasional' },
  { code: 'BANK_MUAMALAT_INDONESIA', name: 'Bank Muamalat Indonesia' },
  { code: 'BANK_MULTI_ARTA_SENTOSA', name: 'Bank Multi Arta Sentosa' },
  { code: 'BANK_NATIONALNOBU', name: 'Bank Nationalnobu' },
  { code: 'BPD_NUSA_TENGGARA_BARAT', name: 'BPD Nusa Tenggara Barat' },
  { code: 'BPD_NUSA_TENGGARA_BARAT_UUS', name: 'BPD Nusa Tenggara Barat UUS' },
  { code: 'BPD_NUSA_TENGGARA_TIMUR', name: 'BPD Nusa Tenggara Timur' },
  { code: 'BANK_OCBC_NISP', name: 'Bank OCBC NISP' },
  { code: 'BANK_OCBC_NISP_UUS', name: 'Bank OCBC NISP UUS' },
  { code: 'BANK_OKE_INDONESIA', name: 'Bank Oke Indonesia (formerly called Bank Andara)' },
  { code: 'OVO', name: 'OVO' },
  { code: 'BANK_PANIN', name: 'Bank Panin' },
  { code: 'BANK_PANIN_SYARIAH', name: 'Bank Panin Syariah' },
  { code: 'BPD_PAPUA', name: 'BPD Papua' },
  { code: 'BANK_PERMATA', name: 'Bank Permata' },
  { code: 'BANK_PERMATA_UUS', name: 'Bank Permata UUS' },
  { code: 'PRIMA_MASTER_BANK', name: 'Prima Master Bank' },
  { code: 'BANK_QNB_INDONESIA', name: 'Bank QNB Indonesia (formerly called Bank QNB Kesawan)' },
  { code: 'BANK_RABOBANK_INTERNATIONAL_INDONESIA', name: 'Bank Rabobank International Indonesia' },
  { code: 'BANK_RESONA_PERDANIA', name: 'Bank Resona Perdania' },
  { code: 'BPD_RIAU_DAN_KEPRI', name: 'BPD Riau Dan Kepri' },
  { code: 'BPD_RIAU_DAN_KEPRI_UUS', name: 'BPD Riau Dan Kepri UUS' },
  { code: 'BANK_ROYAL_INDONESIA', name: 'Bank Royal Indonesia' },
  { code: 'BANK_SAHABAT_SAMPOERNA', name: 'Bank Sahabat Sampoerna' },
  { code: 'BANK_SBI_INDONESIA', name: 'Bank SBI Indonesia' },
  {
    code: 'BANK_SHINHAN_INDONESIA',
    name: 'Bank Shinhan Indonesia (formerly called Bank Metro Express)',
  },
  { code: 'SHOPEEPAY', name: 'ShopeePay' },
  { code: 'BANK_SINARMAS', name: 'Bank Sinarmas' },
  { code: 'BANK_SINARMAS_UUS', name: 'Bank Sinarmas UUS' },
  { code: 'STANDARD_CHARTED_BANK', name: 'Standard Charted Bank' },
  { code: 'BPD_SULAWESI_TENGAH', name: 'BPD Sulawesi Tengah' },
  { code: 'BPD_SULAWESI_TENGGARA', name: 'BPD Sulawesi Tenggara' },
  { code: 'BPD_SULSELBAR', name: 'BPD Sulselbar' },
  { code: 'BPD_SULSELBAR_UUS', name: 'BPD Sulselbar UUS' },
  { code: 'BPD_SULUT', name: 'BPD Sulut' },
  { code: 'BPD_SUMATERA_BARAT', name: 'BPD Sumatera Barat' },
  { code: 'BPD_SUMATERA_BARAT_UUS', name: 'BPD Sumatera Barat UUS' },
  { code: 'BPD_SUMSEL_DAN_BABEL', name: 'BPD Sumsel Dan Babel' },
  { code: 'BPD_SUMSEL_DAN_BABEL_UUS', name: 'BPD Sumsel Dan Babel UUS' },
  { code: 'BPD_SUMUT', name: 'BPD Sumut' },
  { code: 'BPD_SUMUT_UUS', name: 'BPD Sumut UUS' },
  { code: 'BANK_TABUNGAN_PENSIUNAN_NASIONAL', name: 'Bank Tabungan Pensiunan Nasional (BTPN)' },
  { code: 'BANK_OF_TOKYO_MITSUBISHI_UFJ', name: 'Bank of Tokyo Mitsubishi UFJ (MUFJ)' },
  { code: 'BANK_UOB_INDONESIA', name: 'Bank UOB Indonesia' },
  { code: 'BANK_VICTORIA_INTERNASIONAL', name: 'Bank Victoria Internasional' },
  { code: 'BANK_VICTORIA_SYARIAH', name: 'Bank Victoria Syariah' },
  { code: 'BANK_WOORI_INDONESIA', name: 'Bank Woori Indonesia' },
  {
    code: 'BANK_WOORI_SAUDARA_INDONESIA_1906',
    name: 'Bank Woori Saudara Indonesia 1906 (formerly called Bank Himpunan Saudara and Bank Woori Indonesia)',
  },
];

async function main() {
  console.log('🚀 starting bank seed process...');

  for (const bank of banks) {
    try {
      await prisma.bank.upsert({
        where: { code: bank.code },
        update: {
          name: bank.name,
        },
        create: {
          code: bank.code,
          name: bank.name,
        },
      });
      console.log(`🏦 Seeded bank: ${bank.code}`);
    } catch (error) {
      console.error(`❌ Error seeding bank ${bank.code}:`, error);
    }
  }

  console.log('🏁 Bank seeding finished successfully.');
}

main()
  .catch((e: unknown) => {
    console.error('💥 Fatal error during bank seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
