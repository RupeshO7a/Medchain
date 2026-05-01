const axios = require('axios');

const BASE_URL = 'https://medchain-backend-3om9.onrender.com';

// ── Hospital credentials ────────────────────────
const HOSPITAL_A = { 
  email: 'apollo@hospital.com',
  password: 'Test@1234',
  name: 'Apollo Hospital'
};
const HOSPITAL_B = { 
  email: 'rupeshbethapudi@gmail.com',
  password: 'Ruga@1302',
  name: 'Rupesh Hospital'
};

// ──  names for patients ──────────────────
const indianNames = {
  male: ['Rajesh Kumar', 'Amit Sharma', 'Suresh Patel', 'Vijay Singh', 'Arun Verma', 
         'Ravi Gupta', 'Ramesh Reddy', 'Krishna Rao', 'Manoj Joshi', 'Sanjay Desai'],
  female: ['Priya Sharma', 'Anita Patel', 'Sunita Verma', 'Kavita Singh', 'Meera Gupta',
           'Lakshmi Reddy', 'Deepa Rao', 'Pooja Desai', 'Ritu Kumar', 'Asha Joshi']
};

// ── Blood groups ────────────────────────────────
const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

// ── Common allergies ────────────────────────────
const allergies = [
  'None reported',
  'Penicillin',
  'Sulfa drugs',
  'Peanuts, Tree nuts',
  'Aspirin',
  'Dust, Pollen',
  'Shellfish',
  'Latex'
];

// ── Realistic data per department ──────────────
const departmentData = {
  Neurology: {
    diagnosis: 'Migraine with aura, chronic headache disorder',
    medicines: 'Sumatriptan 50mg, Topiramate 25mg, Paracetamol 500mg',
    testResults: 'MRI Brain: No acute infarct. EEG: Normal',
    notes: 'Patient advised to maintain headache diary and avoid triggers. Follow-up in 4 weeks.',
    vitalSigns: { bloodPressure: '128/82', temperature: '98.2', heartRate: '76', oxygenLevel: '98' }
  },
  Cardiology: {
    diagnosis: 'Hypertensive heart disease, stable angina',
    medicines: 'Amlodipine 5mg, Atorvastatin 20mg, Aspirin 75mg',
    testResults: 'ECG: Normal sinus rhythm. Echo: EF 58%. Lipids: LDL 142 mg/dL',
    notes: 'Patient advised low-sodium diet and moderate exercise. Cardiac rehab recommended.',
    vitalSigns: { bloodPressure: '142/88', temperature: '98.6', heartRate: '84', oxygenLevel: '97' }
  },
  Oncology: {
    diagnosis: 'Benign neoplasm under observation, follow-up visit',
    medicines: 'Ondansetron 4mg, Multivitamin, Iron supplement',
    testResults: 'CBC: WBC 7.2, Hb 11.8 g/dL. CT Chest: No new lesions',
    notes: 'Next follow-up in 3 months. Monitor CBC monthly. Patient tolerating treatment well.',
    vitalSigns: { bloodPressure: '118/76', temperature: '98.4', heartRate: '72', oxygenLevel: '99' }
  },
  ER: {
    diagnosis: 'Acute gastroenteritis with mild dehydration',
    medicines: 'ORS solution, Metronidazole 400mg, Domperidone 10mg',
    testResults: 'Stool culture: Pending. Electrolytes: Na 138, K 3.6 mEq/L',
    notes: 'Patient discharged stable. Advised clear fluids and rest. Return if symptoms worsen.',
    vitalSigns: { bloodPressure: '110/70', temperature: '99.2', heartRate: '88', oxygenLevel: '98' }
  },
  Orthopedics: {
    diagnosis: 'Lumbar spondylosis with mild disc degeneration',
    medicines: 'Ibuprofen 400mg TDS, Thiocolchicoside 4mg, Calcium supplements',
    testResults: 'X-ray Lumbar Spine: Mild osteophytes L4-L5. No fracture',
    notes: 'Physiotherapy recommended 3x/week. Avoid heavy lifting. Hot compress for pain relief.',
    vitalSigns: { bloodPressure: '132/84', temperature: '98.6', heartRate: '74', oxygenLevel: '98' }
  },
  default: {
    diagnosis: 'Upper respiratory tract infection, viral fever',
    medicines: 'Paracetamol 500mg, Vitamin C, Antihistamine, ORS',
    testResults: 'CBC: Normal. Blood Sugar: 96 mg/dL. Throat swab: Viral infection',
    notes: 'Patient stable. Adequate rest and hydration advised. Follow up in 1 week if fever persists.',
    vitalSigns: { bloodPressure: '120/80', temperature: '101.2', heartRate: '92', oxygenLevel: '97' }
  }
};

// ── Generate fake 12-digit Aadhaar ─────────────
function generateAadhaar(patientId) {
  const num = patientId.replace('pat-', '').padStart(12, '7');
  return num.substring(0, 12);
}

// ── Generate phone number ───────────────────────
function generatePhone(index) {
  const prefixes = ['98', '99', '97', '96', '95', '94', '93', '92', '91', '90'];
  return prefixes[index % 10] + (10000000 + index * 12345).toString().slice(0, 8);
}

// ── Generate email ──────────────────────────────
function generateEmail(name, index) {
  const cleanName = name.toLowerCase().replace(/ /g, '.');
  return `${cleanName}${index}@gmail.com`;
}

// ── Generate address ────────────────────────────
const addresses = [
  '12/A MG Road, Bangalore, Karnataka',
  '45 Anna Nagar, Chennai, Tamil Nadu',
  '23 Park Street, Kolkata, West Bengal',
  '78 Andheri West, Mumbai, Maharashtra',
  '56 Connaught Place, New Delhi',
  '34 Banjara Hills, Hyderabad, Telangana',
  '89 Salt Lake, Kolkata, West Bengal',
  '67 Koramangala, Bangalore, Karnataka',
  '21 T Nagar, Chennai, Tamil Nadu',
  '90 Malad East, Mumbai, Maharashtra'
];

// ── Calculate age from birthdate ───────────────
function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// ── Login and get token ─────────────────────────
async function loginHospital(creds) {
  const res = await axios.post(`${BASE_URL}/api/auth/login`, creds);
  return res.data.token;
}

// ── Add one record with full patient details ────
async function addRecord(token, patient, encounter, doctorName, index) {
  const dept = encounter?.serviceType?.coding?.[0]?.display || 'default';
  const data = departmentData[dept] || departmentData.default;
  const aadhaar = generateAadhaar(patient.id);
  
  const gender = patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1);
  const age = calculateAge(patient.birthDate);
  const patientName = gender === 'Male' 
    ? indianNames.male[index % indianNames.male.length]
    : indianNames.female[index % indianNames.female.length];
  
  const bloodGroup = bloodGroups[index % bloodGroups.length];
  const phone = generatePhone(index);
  const email = generateEmail(patientName, index);
  const address = addresses[index % addresses.length];
  const allergy = allergies[index % allergies.length];

  // Build enhanced notes with all patient details
  const enhancedNotes = `
Patient: ${patientName}
Age: ${age} years
Gender: ${gender}
Blood Group: ${bloodGroup}
Phone: ${phone}
Email: ${email}
Address: ${address}
Department: ${dept}
Date of Birth: ${patient.birthDate}
Allergies: ${allergy}
Vital Signs: BP: ${data.vitalSigns.bloodPressure}, Temp: ${data.vitalSigns.temperature}°F, HR: ${data.vitalSigns.heartRate} bpm, SpO2: ${data.vitalSigns.oxygenLevel}%
---
Clinical Notes: ${data.notes}
  `.trim();

  const payload = {
    aadhaarNumber: aadhaar,
    doctorName,
    diagnosis: data.diagnosis,
    medicines: data.medicines,
    testResults: data.testResults,
    notes: enhancedNotes
  };

  const res = await axios.post(`${BASE_URL}/api/records/add`, payload, {
    headers: { Authorization: `Bearer ${token}` }
  });

  return { 
    aadhaar, 
    patientName,
    age,
    gender,
    dept,
    txHash: res.data.transactionHash 
  };
}

// ── Main ────────────────────────────────────────
async function main() {
  const fs = require('fs');
  const raw = JSON.parse(fs.readFileSync('./patient_data_fhir.json'));

  // Separate patients and encounters
  const patients   = raw.entry.filter(e => e.resource.resourceType === 'Patient').map(e => e.resource);
  const encounters = raw.entry.filter(e => e.resource.resourceType === 'Encounter').map(e => e.resource);

  // Match encounters to patients
  const encounterMap = {};
  encounters.forEach(enc => {
    const patId = enc.subject?.reference?.replace('Patient/', '');
    if (patId) encounterMap[patId] = enc;
  });

  // Pick first 10 patients
  const selected = patients.slice(0, 10);

  console.log('🔐 Logging into Hospital A...');
  const tokenA = await loginHospital(HOSPITAL_A);
  console.log('✅ Hospital A logged in');

  console.log('🔐 Logging into Hospital B...');
  const tokenB = await loginHospital(HOSPITAL_B);
  console.log('✅ Hospital B logged in\n');

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Adding 5 patients to Hospital A (Apollo Hospital)...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (let i = 0; i < 5; i++) {
    const patient = selected[i];
    const encounter = encounterMap[patient.id];
    const dept = encounter?.serviceType?.coding?.[0]?.display || 'General Medicine';
    try {
      const result = await addRecord(tokenA, patient, encounter, `Dr. Ramesh Kumar`, i);
      console.log(`✅ Patient ${i+1}: ${result.patientName} (${result.age}y ${result.gender})`);
      console.log(`   Aadhaar: ${result.aadhaar} | Dept: ${result.dept}`);
      console.log(`   TX: ${result.txHash}\n`);
    } catch (err) {
      console.error(`❌ Patient ${i+1} failed:`, err.response?.data?.error || err.message);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📋 Adding 5 patients to Hospital B (Rupesh Hospital)...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  for (let i = 5; i < 10; i++) {
    const patient = selected[i];
    const encounter = encounterMap[patient.id];
    const dept = encounter?.serviceType?.coding?.[0]?.display || 'General Medicine';
    try {
      const result = await addRecord(tokenB, patient, encounter, `Dr. Priya Nair`, i);
      console.log(`✅ Patient ${i+1}: ${result.patientName} (${result.age}y ${result.gender})`);
      console.log(`   Aadhaar: ${result.aadhaar} | Dept: ${result.dept}`);
      console.log(`   TX: ${result.txHash}\n`);
    } catch (err) {
      console.error(`❌ Patient ${i+1} failed:`, err.response?.data?.error || err.message);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Done! 10 patient records seeded successfully.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  
  console.log('📋 Use these Aadhaar numbers to test search:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  selected.forEach((p, i) => {
    const hospital = i < 5 ? 'Hospital A (Apollo)' : 'Hospital B (Rupesh)';
    console.log(`   ${generateAadhaar(p.id)} → ${hospital}`);
  });
}

main().catch(console.error);
