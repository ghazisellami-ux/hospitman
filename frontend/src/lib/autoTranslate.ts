// Auto-translation dictionary for construction domain (FR → EN)
// Used when user inputs data in French and switches to English

const dictionary: Record<string, string> = {
  // ── Lots / Trades ───────────────────────────────────────
  'gros œuvre': 'Structural Work',
  'gros oeuvre': 'Structural Work',
  'structure': 'Structure',
  'fondations': 'Foundations',
  'fondation': 'Foundation',
  'vrd': 'Roads & Utilities',
  'voirie et réseaux divers': 'Roads & Utilities',
  'voirie et réseaux': 'Roads & Utilities',
  'voirie': 'Roads',
  'électricité': 'Electrical',
  'electricité': 'Electrical',
  'électricité courant fort': 'High Voltage Electrical',
  'électricité courant faible': 'Low Voltage Electrical',
  'courant fort': 'High Voltage',
  'courant faible': 'Low Voltage',
  'plomberie': 'Plumbing',
  'plomberie sanitaire': 'Plumbing',
  'sanitaire': 'Sanitary',
  'cvc': 'HVAC',
  'climatisation': 'Air Conditioning',
  'chauffage': 'Heating',
  'ventilation': 'Ventilation',
  'menuiserie': 'Joinery',
  'menuiserie aluminium': 'Aluminum Joinery',
  'menuiserie bois': 'Wood Joinery',
  'étanchéité': 'Waterproofing',
  'etanchéité': 'Waterproofing',
  'peinture': 'Painting',
  'revêtement': 'Coating',
  'carrelage': 'Tiling',
  'faux plafond': 'False Ceiling',
  'ascenseur': 'Elevator',
  'ascenseurs': 'Elevators',
  'sécurité incendie': 'Fire Safety',
  'protection incendie': 'Fire Protection',
  'gaz médicaux': 'Medical Gases',
  'fluides médicaux': 'Medical Fluids',
  'réseau informatique': 'IT Network',
  'vidéosurveillance': 'CCTV',
  'contrôle d\'accès': 'Access Control',
  'aménagement extérieur': 'Landscaping',
  'espaces verts': 'Green Spaces',
  'terrassement': 'Earthworks',
  'démolition': 'Demolition',
  'charpente': 'Framework',
  'charpente métallique': 'Steel Framework',
  'toiture': 'Roofing',
  'isolation': 'Insulation',
  'isolation thermique': 'Thermal Insulation',
  'isolation phonique': 'Soundproofing',
  'cloison': 'Partition',
  'cloisons': 'Partitions',
  'dalle': 'Slab',
  'béton': 'Concrete',
  'béton armé': 'Reinforced Concrete',
  'acier': 'Steel',
  'ferraillage': 'Reinforcement',
  'coffrage': 'Formwork',

  // ── Descriptions ────────────────────────────────────────
  'structure béton armé': 'Reinforced concrete structure',
  'distribution électrique': 'Electrical distribution',
  'alimentation eau': 'Water supply',
  'évacuation': 'Drainage',
  'réseau assainissement': 'Drainage Network',
  'portes': 'Doors',
  'fenêtres': 'Windows',
  'mur rideau': 'Curtain Wall',
  'toiture et sous-sol': 'Roof and Basement',
  'bloc opératoire': 'Operating Theater',
  'urgences': 'Emergency',
  'radiologie': 'Radiology',
  'laboratoire': 'Laboratory',
  'pharmacie': 'Pharmacy',
  'stérilisation': 'Sterilization',
  'buanderie': 'Laundry',
  'cuisine': 'Kitchen',
  'parking': 'Parking',
  'parking souterrain': 'Underground Parking',
  'hall principal': 'Main Hall',
  'salle d\'attente': 'Waiting Room',

  // ── Specialities ────────────────────────────────────────
  'gros œuvre / structure': 'Structural Work',
  'cvc / climatisation': 'HVAC',

  // ── Common construction terms ───────────────────────────
  'travaux': 'Works',
  'installation': 'Installation',
  'mise en service': 'Commissioning',
  'réception': 'Acceptance',
  'finitions': 'Finishing',
  'aménagement': 'Fitting Out',
  'équipement': 'Equipment',
  'fourniture': 'Supply',
  'fourniture et pose': 'Supply & Installation',
  'maintenance': 'Maintenance',
  'réparation': 'Repair',
  'modification': 'Modification',
  'extension': 'Extension',
  'ajout': 'Addition',
  'remplacement': 'Replacement',
  'renforcement': 'Reinforcement',
  'mise à niveau': 'Upgrade',
  'conformité': 'Compliance',
};

/**
 * Auto-translate a French text to English using the construction dictionary.
 * Tries exact match first, then partial word replacements.
 */
export function autoTranslate(frenchText: string): string {
  if (!frenchText.trim()) return '';

  const lower = frenchText.toLowerCase().trim();

  // 1. Exact match
  if (dictionary[lower]) {
    return dictionary[lower];
  }

  // 2. Try progressive partial matching (longest match first)
  let result = frenchText;
  const sortedKeys = Object.keys(dictionary).sort((a, b) => b.length - a.length);

  for (const key of sortedKeys) {
    const regex = new RegExp(key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
    if (regex.test(result)) {
      result = result.replace(regex, dictionary[key]);
    }
  }

  // 3. If nothing changed, return original (proper nouns, company names, etc.)
  return result;
}
