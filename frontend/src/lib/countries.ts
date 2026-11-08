export type CountryData = {
  name: string;
  code: string;
  dialCode: string;
};

export function normalizeDialCode(dialCode: string) {
  const digits = (dialCode || "").replace(/\D/g, "");
  return digits ? `+${digits}` : "+";
}

export function getDialCodeNumber(dialCode: string) {
  return Number(normalizeDialCode(dialCode).replace(/\D/g, "")) || 0;
}

export function getCountryFlag(code: string) {
  if (!code || code.length !== 2) return "🌍";

  return Array.from(code)
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

function groupDigits(digits: string, groups: number[]) {
  const result: string[] = [];
  let cursor = 0;

  for (const groupSize of groups) {
    if (cursor >= digits.length) break;
    result.push(digits.slice(cursor, cursor + groupSize));
    cursor += groupSize;
  }

  if (cursor < digits.length) {
    result.push(digits.slice(cursor));
  }

  return result.filter(Boolean).join(" ");
}

export function formatPhoneForDialCode(input: string, dialCode: string) {
  const normalizedDialCode = normalizeDialCode(dialCode);
  const digits = input.replace(/\D/g, "");

  if (!digits) return "";

  const maxLengthByCountry: Record<string, number> = {
    "+1": 10,
    "+7": 10,
    "+20": 10,
    "+27": 9,
    "+30": 10,
    "+31": 9,
    "+32": 9,
    "+33": 9,
    "+34": 9,
    "+39": 10,
    "+41": 9,
    "+44": 10,
    "+45": 8,
    "+46": 9,
    "+47": 8,
    "+48": 9,
    "+49": 11,
    "+51": 9,
    "+52": 10,
    "+55": 11,
    "+61": 9,
    "+62": 9,
    "+65": 8,
    "+81": 10,
    "+82": 10,
    "+84": 9,
    "+90": 10,
    "+91": 10,
    "+92": 10,
    "+98": 10,
    "+212": 9,
    "+216": 8,
    "+221": 9,
    "+234": 10,
    "+244": 9,
    "+351": 9,
    "+352": 9,
    "+353": 9,
    "+355": 9,
    "+356": 8,
    "+358": 9,
    "+359": 9,
    "+972": 9,
  };

  const maxLength = maxLengthByCountry[normalizedDialCode] ?? 12;
  const trimmedDigits = digits.slice(0, maxLength);

  switch (normalizedDialCode) {
    case "+1":
      return groupDigits(trimmedDigits, [3, 3, 4]);
    case "+33":
    case "+31":
    case "+32":
    case "+41":
    case "+44":
    case "+49":
    case "+61":
    case "+81":
    case "+91":
    case "+212":
    case "+221":
      return groupDigits(trimmedDigits, [2, 2, 2, 2, 1]);
    case "+7":
    case "+20":
    case "+27":
    case "+30":
    case "+34":
    case "+39":
    case "+45":
    case "+46":
    case "+47":
    case "+48":
    case "+51":
    case "+52":
    case "+54":
    case "+55":
    case "+62":
    case "+65":
    case "+82":
    case "+84":
    case "+90":
    case "+92":
    case "+98":
    case "+216":
    case "+221":
    case "+234":
    case "+244":
    case "+351":
    case "+352":
    case "+353":
    case "+355":
    case "+356":
    case "+358":
    case "+359":
    case "+972":
      return groupDigits(trimmedDigits, [2, 2, 2, 2, 2]);
    default:
      return groupDigits(trimmedDigits, [3, 3, 3, 3]);
  }
}

export const countries: CountryData[] = [
  { name: "Afghanistan", code: "AF", dialCode: "+93" },
  { name: "Albanie", code: "AL", dialCode: "+355" },
  { name: "Algérie", code: "DZ", dialCode: "+213" },
  { name: "Andorre", code: "AD", dialCode: "+376" },
  { name: "Angola", code: "AO", dialCode: "+244" },
  { name: "Antigua-et-Barbuda", code: "AG", dialCode: "+1-268" },
  { name: "Argentine", code: "AR", dialCode: "+54" },
  { name: "Arménie", code: "AM", dialCode: "+374" },
  { name: "Australie", code: "AU", dialCode: "+61" },
  { name: "Autriche", code: "AT", dialCode: "+43" },
  { name: "Azerbaïdjan", code: "AZ", dialCode: "+994" },
  { name: "Bahamas", code: "BS", dialCode: "+1-242" },
  { name: "Bahreïn", code: "BH", dialCode: "+973" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Barbade", code: "BB", dialCode: "+1-246" },
  { name: "Biélorussie", code: "BY", dialCode: "+375" },
  { name: "Belgique", code: "BE", dialCode: "+32" },
  { name: "Belize", code: "BZ", dialCode: "+501" },
  { name: "Bénin", code: "BJ", dialCode: "+229" },
  { name: "Bhoutan", code: "BT", dialCode: "+975" },
  { name: "Bolivie", code: "BO", dialCode: "+591" },
  { name: "Bosnie-Herzégovine", code: "BA", dialCode: "+387" },
  { name: "Botswana", code: "BW", dialCode: "+267" },
  { name: "Brésil", code: "BR", dialCode: "+55" },
  { name: "Brunei", code: "BN", dialCode: "+673" },
  { name: "Bulgarie", code: "BG", dialCode: "+359" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226" },
  { name: "Burundi", code: "BI", dialCode: "+257" },
  { name: "Cabo Verde", code: "CV", dialCode: "+238" },
  { name: "Cambodge", code: "KH", dialCode: "+855" },
  { name: "Cameroun", code: "CM", dialCode: "+237" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Chili", code: "CL", dialCode: "+56" },
  { name: "Chine", code: "CN", dialCode: "+86" },
  { name: "Chypre", code: "CY", dialCode: "+357" },
  { name: "Colombie", code: "CO", dialCode: "+57" },
  { name: "Comores", code: "KM", dialCode: "+269" },
  { name: "Congo", code: "CG", dialCode: "+242" },
  { name: "Corée du Sud", code: "KR", dialCode: "+82" },
  { name: "Corée du Nord", code: "KP", dialCode: "+850" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Côte d'Ivoire", code: "CI", dialCode: "+225" },
  { name: "Croatie", code: "HR", dialCode: "+385" },
  { name: "Cuba", code: "CU", dialCode: "+53" },
  { name: "Danemark", code: "DK", dialCode: "+45" },
  { name: "Djibouti", code: "DJ", dialCode: "+253" },
  { name: "Dominique", code: "DM", dialCode: "+1-767" },
  { name: "Égypte", code: "EG", dialCode: "+20" },
  { name: "Émirats arabes unis", code: "AE", dialCode: "+971" },
  { name: "Équateur", code: "EC", dialCode: "+593" },
  { name: "Érythrée", code: "ER", dialCode: "+291" },
  { name: "Espagne", code: "ES", dialCode: "+34" },
  { name: "Estonie", code: "EE", dialCode: "+372" },
  { name: "États-Unis", code: "US", dialCode: "+1" },
  { name: "Éthiopie", code: "ET", dialCode: "+251" },
  { name: "Fidji", code: "FJ", dialCode: "+679" },
  { name: "Finlande", code: "FI", dialCode: "+358" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Gabon", code: "GA", dialCode: "+241" },
  { name: "Gambie", code: "GM", dialCode: "+220" },
  { name: "Géorgie", code: "GE", dialCode: "+995" },
  { name: "Ghana", code: "GH", dialCode: "+233" },
  { name: "Grèce", code: "GR", dialCode: "+30" },
  { name: "Grenade", code: "GD", dialCode: "+1-473" },
  { name: "Guatemala", code: "GT", dialCode: "+502" },
  { name: "Guinée", code: "GN", dialCode: "+224" },
  { name: "Guinée-Bissau", code: "GW", dialCode: "+245" },
  { name: "Guyana", code: "GY", dialCode: "+592" },
  { name: "Haïti", code: "HT", dialCode: "+509" },
  { name: "Honduras", code: "HN", dialCode: "+504" },
  { name: "Hongrie", code: "HU", dialCode: "+36" },
  { name: "Inde", code: "IN", dialCode: "+91" },
  { name: "Indonésie", code: "ID", dialCode: "+62" },
  { name: "Irak", code: "IQ", dialCode: "+964" },
  { name: "Iran", code: "IR", dialCode: "+98" },
  { name: "Irlande", code: "IE", dialCode: "+353" },
  { name: "Islande", code: "IS", dialCode: "+354" },
  { name: "Israël", code: "IL", dialCode: "+972" },
  { name: "Italie", code: "IT", dialCode: "+39" },
  { name: "Jamaïque", code: "JM", dialCode: "+1-876" },
  { name: "Japon", code: "JP", dialCode: "+81" },
  { name: "Jordanie", code: "JO", dialCode: "+962" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7" },
  { name: "Kenya", code: "KE", dialCode: "+254" },
  { name: "Kirghizistan", code: "KG", dialCode: "+996" },
  { name: "Kiribati", code: "KI", dialCode: "+686" },
  { name: "Koweït", code: "KW", dialCode: "+965" },
  { name: "Laos", code: "LA", dialCode: "+856" },
  { name: "Lesotho", code: "LS", dialCode: "+266" },
  { name: "Lettonie", code: "LV", dialCode: "+371" },
  { name: "Liban", code: "LB", dialCode: "+961" },
  { name: "Liberia", code: "LR", dialCode: "+231" },
  { name: "Libye", code: "LY", dialCode: "+218" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423" },
  { name: "Lituanie", code: "LT", dialCode: "+370" },
  { name: "Luxembourg", code: "LU", dialCode: "+352" },
  { name: "Madagascar", code: "MG", dialCode: "+261" },
  { name: "Malaisie", code: "MY", dialCode: "+60" },
  { name: "Malawi", code: "MW", dialCode: "+265" },
  { name: "Maldives", code: "MV", dialCode: "+960" },
  { name: "Mali", code: "ML", dialCode: "+223" },
  { name: "Malte", code: "MT", dialCode: "+356" },
  { name: "Maroc", code: "MA", dialCode: "+212" },
  { name: "Marshall", code: "MH", dialCode: "+692" },
  { name: "Maurice", code: "MU", dialCode: "+230" },
  { name: "Mauritanie", code: "MR", dialCode: "+222" },
  { name: "Mexique", code: "MX", dialCode: "+52" },
  { name: "Micronésie", code: "FM", dialCode: "+691" },
  { name: "Moldavie", code: "MD", dialCode: "+373" },
  { name: "Monaco", code: "MC", dialCode: "+377" },
  { name: "Mongolie", code: "MN", dialCode: "+976" },
  { name: "Monténégro", code: "ME", dialCode: "+382" },
  { name: "Mozambique", code: "MZ", dialCode: "+258" },
  { name: "Myanmar", code: "MM", dialCode: "+95" },
  { name: "Namibie", code: "NA", dialCode: "+264" },
  { name: "Nauru", code: "NR", dialCode: "+674" },
  { name: "Népal", code: "NP", dialCode: "+977" },
  { name: "Nicaragua", code: "NI", dialCode: "+505" },
  { name: "Niger", code: "NE", dialCode: "+227" },
  { name: "Nigéria", code: "NG", dialCode: "+234" },
  { name: "Norvège", code: "NO", dialCode: "+47" },
  { name: "Nouvelle-Zélande", code: "NZ", dialCode: "+64" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Ouganda", code: "UG", dialCode: "+256" },
  { name: "Ouzbékistan", code: "UZ", dialCode: "+998" },
  { name: "Pakistan", code: "PK", dialCode: "+92" },
  { name: "Palaos", code: "PW", dialCode: "+680" },
  { name: "Panama", code: "PA", dialCode: "+507" },
  { name: "Papouasie-Nouvelle-Guinée", code: "PG", dialCode: "+675" },
  { name: "Paraguay", code: "PY", dialCode: "+595" },
  { name: "Pays-Bas", code: "NL", dialCode: "+31" },
  { name: "Pérou", code: "PE", dialCode: "+51" },
  { name: "Philippines", code: "PH", dialCode: "+63" },
  { name: "Pologne", code: "PL", dialCode: "+48" },
  { name: "Portugal", code: "PT", dialCode: "+351" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "République centrafricaine", code: "CF", dialCode: "+236" },
  { name: "République dominicaine", code: "DO", dialCode: "+1-809" },
  { name: "République tchèque", code: "CZ", dialCode: "+420" },
  { name: "Roumanie", code: "RO", dialCode: "+40" },
  { name: "Royaume-Uni", code: "GB", dialCode: "+44" },
  { name: "Russie", code: "RU", dialCode: "+7" },
  { name: "Rwanda", code: "RW", dialCode: "+250" },
  { name: "Saint-Kitts-et-Nevis", code: "KN", dialCode: "+1-869" },
  { name: "Saint-Marin", code: "SM", dialCode: "+378" },
  { name: "Saint-Vincent-et-les-Grenadines", code: "VC", dialCode: "+1-784" },
  { name: "Sainte-Lucie", code: "LC", dialCode: "+1-758" },
  { name: "Salvador", code: "SV", dialCode: "+503" },
  { name: "Samoa", code: "WS", dialCode: "+685" },
  { name: "São Tomé-et-Principe", code: "ST", dialCode: "+239" },
  { name: "Sénégal", code: "SN", dialCode: "+221" },
  { name: "Serbie", code: "RS", dialCode: "+381" },
  { name: "Seychelles", code: "SC", dialCode: "+248" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232" },
  { name: "Singapour", code: "SG", dialCode: "+65" },
  { name: "Slovaquie", code: "SK", dialCode: "+421" },
  { name: "Slovénie", code: "SI", dialCode: "+386" },
  { name: "Somalie", code: "SO", dialCode: "+252" },
  { name: "Soudan", code: "SD", dialCode: "+249" },
  { name: "Soudan du Sud", code: "SS", dialCode: "+211" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
  { name: "Suède", code: "SE", dialCode: "+46" },
  { name: "Suisse", code: "CH", dialCode: "+41" },
  { name: "Suriname", code: "SR", dialCode: "+597" },
  { name: "Syrie", code: "SY", dialCode: "+963" },
  { name: "Tadjikistan", code: "TJ", dialCode: "+992" },
  { name: "Tanzanie", code: "TZ", dialCode: "+255" },
  { name: "Tchad", code: "TD", dialCode: "+235" },
  { name: "Thaïlande", code: "TH", dialCode: "+66" },
  { name: "Timor oriental", code: "TL", dialCode: "+670" },
  { name: "Togo", code: "TG", dialCode: "+228" },
  { name: "Tonga", code: "TO", dialCode: "+676" },
  { name: "Trinité-et-Tobago", code: "TT", dialCode: "+1-868" },
  { name: "Tunisie", code: "TN", dialCode: "+216" },
  { name: "Turquie", code: "TR", dialCode: "+90" },
  { name: "Turkménistan", code: "TM", dialCode: "+993" },
  { name: "Tuvalu", code: "TV", dialCode: "+688" },
  { name: "Ukraine", code: "UA", dialCode: "+380" },
  { name: "Uruguay", code: "UY", dialCode: "+598" },
  { name: "Vanuatu", code: "VU", dialCode: "+678" },
  { name: "Vatican", code: "VA", dialCode: "+379" },
  { name: "Venezuela", code: "VE", dialCode: "+58" },
  { name: "Vietnam", code: "VN", dialCode: "+84" },
  { name: "Yémen", code: "YE", dialCode: "+967" },
  { name: "Zambie", code: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263" },
].map((country) => ({
  ...country,
  dialCode: normalizeDialCode(country.dialCode),
})).sort((a, b) => getDialCodeNumber(a.dialCode) - getDialCodeNumber(b.dialCode));

export function getCountryByName(name: string) {
  return countries.find((country) => country.name === name);
}

export function getDialCodeFromPhone(phone: string) {
  const cleaned = phone.trim();
  const match = cleaned.match(/^\+(\d{1,4})(?:[\s.-]+)?/);
  return match ? normalizeDialCode(`+${match[1]}`) : "";
}

export function stripDialCode(phone: string) {
  const cleaned = phone.trim();
  const match = cleaned.match(/^(\+\d{1,4})(?:[\s.-]+)?(.+)$/);
  return match ? match[2].trim() : cleaned;
}

export function normalizePhone(phone: string, prefix: string) {
  const cleaned = phone.trim();
  if (!cleaned) return "";
  if (cleaned.startsWith("+")) return cleaned;
  return `${prefix} ${cleaned}`.trim();
}
