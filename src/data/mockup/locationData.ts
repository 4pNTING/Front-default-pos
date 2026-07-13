// Static Location Data for Customer Module
// TODO: Replace with API when available

export interface LocationItem {
  _id: string;
  laName: string;

  isActive: string;
}

// ແຂວງ (Provinces)
export const MOCK_PROVINCES: LocationItem[] = [
  { _id: '1', laName: 'ນະຄອນຫຼວງວຽງຈັນ', isActive: 'active' },
  { _id: '2', laName: 'ຜົ້ງສາລີ', isActive: 'active' },
  { _id: '3', laName: 'ຫຼວງນ້ຳທາ', isActive: 'active' },
  { _id: '4', laName: 'ອຸດົມໄຊ', isActive: 'active' },
  { _id: '5', laName: 'ບໍ່ແກ້ວ', isActive: 'active' },
  { _id: '6', laName: 'ຫຼວງພະບາງ', isActive: 'active' },
  { _id: '7', laName: 'ຫົວພັນ', isActive: 'active' },
  { _id: '8', laName: 'ໄຊຍະບູລີ', isActive: 'active' },
  { _id: '9', laName: 'ຊຽງຂວາງ', isActive: 'active' },
  { _id: '10', laName: 'ວຽງຈັນ', isActive: 'active' },
  { _id: '11', laName: 'ບໍລິຄຳໄຊ', isActive: 'active' },
  { _id: '12', laName: 'ຄຳມ່ວນ', isActive: 'active' },
  { _id: '13', laName: 'ສະຫວັນນະເຂດ', isActive: 'active' },
  { _id: '14', laName: 'ສາລະວັນ', isActive: 'active' },
  { _id: '15', laName: 'ເຊກອງ', isActive: 'active' },
  { _id: '16', laName: 'ຈຳປາສັກ', isActive: 'active' },
  { _id: '17', laName: 'ອັດຕະປື', isActive: 'active' },
  { _id: '18', laName: 'ໄຊສົມບູນ', isActive: 'active' },
];

// ເມືອງ (Districts)
export const MOCK_DISTRICTS: LocationItem[] = [
  // Vientiane Capital Districts
  { _id: 'd1', laName: 'ຈັນທະບູລີ', isActive: 'active' },
  { _id: 'd2', laName: 'ໄຊເສດຖາ', isActive: 'active' },
  { _id: 'd3', laName: 'ສີໂຄດຕະບອງ', isActive: 'active' },
  { _id: 'd4', laName: 'ສີສັດຕະນາກ', isActive: 'active' },
  { _id: 'd5', laName: 'ນາຊາຍທອງ', isActive: 'active' },
  { _id: 'd6', laName: 'ໄຊທານີ', isActive: 'active' },
  { _id: 'd7', laName: 'ຫາດຊາຍຟອງ', isActive: 'active' },
  { _id: 'd8', laName: 'ສັງທອງ', isActive: 'active' },
  { _id: 'd9', laName: 'ປາກງື່ມ', isActive: 'active' },
  
  // Sample districts for other provinces
  { _id: 'd10', laName: 'ເມືອງໄກ', isActive: 'active' },
  { _id: 'd11', laName: 'ປາກແບ່ງ', isActive: 'active' },
  { _id: 'd12', laName: 'ພູຄູນ', isActive: 'active' },
];

// ບ້ານ (Villages)
export const MOCK_VILLAGES: LocationItem[] = [
  // Sample villages for Chanthabouly
  { _id: 'v1', laName: 'ບ້ານໂພນຕັນ', isActive: 'active' },
  { _id: 'v2', laName: 'ບ້ານໂພນສະຫວ່າງ', isActive: 'active' },
  { _id: 'v3', laName: 'ບ້ານວັດຈັນ', isActive: 'active' },
  
  // Sample villages for Xaysetha
  { _id: 'v4', laName: 'ບ້ານດອນກອຍ', isActive: 'active' },
  { _id: 'v5', laName: 'ບ້ານໂນນຄຳ', isActive: 'active' },
  { _id: 'v6', laName: 'ບ້ານດົງປາລານ', isActive: 'active' },
  
  // Sample villages for Sikhottabong
  { _id: 'v7', laName: 'ບ້ານໂພນໄຊ', isActive: 'active' },
  { _id: 'v8', laName: 'ບ້ານສີຄົດ', isActive: 'active' },
  { _id: 'v9', laName: 'ບ້ານວຽງຄຳ', isActive: 'active' },
  
  // Sample villages for Sisattanak
  { _id: 'v10', laName: 'ບ້ານໂນນສະຫວ່າງ', isActive: 'active' },
  { _id: 'v11', laName: 'ບ້ານດົງປານັນ', isActive: 'active' },
  { _id: 'v12', laName: 'ບ້ານທົ່ງສະພັງ', isActive: 'active' },
  
  // More sample villages
  { _id: 'v13', laName: 'ບ້ານນາໄຊ', isActive: 'active' },
  { _id: 'v14', laName: 'ບ້ານໂພນສີ', isActive: 'active' },
  { _id: 'v15', laName: 'ບ້ານວັດໃໝ່', isActive: 'active' },
  { _id: 'v16', laName: 'ບ້ານໂພນທັນ', isActive: 'active' },
  { _id: 'v17', laName: 'ບ້ານດົງນາທອງ', isActive: 'active' },
  { _id: 'v18', laName: 'ບ້ານສີມ່ວງ', isActive: 'active' },
  { _id: 'v19', laName: 'ບ້ານໂພນໃຫຍ່', isActive: 'active' },
  { _id: 'v20', laName: 'ບ້ານໃຫມ່', isActive: 'active' },
];

// Gender Options with Lao Labels
export const GENDER_OPTIONS = [
  { _id: 'male', name: 'ຊາຍ', code: 'male' },
  { _id: 'female', name: 'ຍິງ', code: 'female' },
];

// Nationality Options with Lao Labels
export const NATIONALITY_OPTIONS = [
  { _id: 'lao', name: 'ລາວ', code: 'lao' },
  { _id: 'chinese', name: 'ຈີນ', code: 'chinese' },
  { _id: 'thai', name: 'ໄທ', code: 'thai' },
  { _id: 'vietnamese', name: 'ຫວຽດນາມ', code: 'vietnamese' },
  { _id: 'thailao', name: 'ໄທ-ລາວ', code: 'thailao' },
  { _id: 'korea', name: 'ເກົາຫຼີ', code: 'korea' },
  { _id: 'none', name: 'ອື່ນໆ', code: 'none' },
];
