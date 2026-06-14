export const sections = [
  { id: 'FORMULAS_n_FRAMEWORKS', label: '📐 FORMULAS & FRAMEWORKS', color: '#C0392B', file: 'formulas-frameworks.html' },
  { id: 'FOUNDATION', label: '📗 FOUNDATION', color: '#1B2A4A', file: 'foundation.html' },
  { id: 'PRINCIPLES', label: '🔟 PRINCIPLES', color: '#1A6B2A', file: 'principles.html' },
  { id: 'BUSINESS_n_CHARTER', label: '📄 BUSINESS & CHARTER', color: '#1565C0', file: 'business-charter.html' },
  {
    id: 'PROCCESSES',
    label: '⚙️ PROCESSES',
    color: '#4A148C',
    parts: [
      'processes/overview.html',
      'processes/integration.html',
      'processes/scope.html',
      'processes/schedule.html',
      'processes/cost.html',
      'processes/quality.html',
      'processes/resources.html',
      'processes/communications.html',
      'processes/risk.html',
      'processes/procurement.html',
      'processes/stakeholder.html'
    ]
  },
  { id: 'AGILE', label: '🏃 AGILE', color: '#E65100', file: 'agile.html' },
  { id: 'HYBRID', label: '🔀 HYBRID', color: '#880E4F', file: 'hybrid.html' },
  { id: 'LEADERSHIP_n_SOFT_SKILLS', label: '🧠 LEADERSHIP & SOFT SKILLS', color: '#006064', file: 'leadership-soft-skills.html' },
  { id: 'AGILE_ADVANCED', label: '🚀 AGILE ADVANCED', color: '#BF360C', file: 'agile-advanced.html' },
  { id: 'STAKEHOLDER_n_PROCUREMENT', label: '👥 STAKEHOLDER & PROCUREMENT', color: '#1A237E', file: 'stakeholder-procurement.html' },
  { id: 'EXAM_MINDSET', label: '🎯 EXAM MINDSET', color: '#1B5E20', file: 'exam-mindset.html' },
  { id: 'MOTIVATION_THEORIES', label: '🧬 MOTIVATION THEORIES', color: '#6A1B9A', file: 'motivation-theories.html' },
  { id: 'ECO_DOMAINS', label: '📊 ECO & DOMAINS', color: '#00695C', file: 'eco-domains.html' },
  { id: 'ETHICS_GOVERNANCE', label: '⚖️ ETHICS & GOVERNANCE', color: '#B71C1C', file: 'ethics-governance.html' },
  { id: 'VALUE_AI_SUSTAINABILITY', label: '🌱 VALUE · AI · SUSTAINABILITY', color: '#005B4F', file: 'value-ai-sustainability.html' },
  { id: 'SCENARIO_BANK', label: '🎲 SCENARIO BANK', color: '#37474F', file: 'scenario-bank.html' },
  { id: 'STAKEHOLDER_DEEP', label: '🎯 STAKEHOLDER DEEP', color: '#1565C0', file: 'stakeholder-deep.html' },
  { id: 'PROCUREMENT_DEEP', label: '📋 PROCUREMENT DEEP', color: '#4E342E', file: 'procurement-deep.html' },
  { id: 'SCHEDULE_CPM', label: '📅 CPM & SCHEDULE', color: '#1B5E20', file: 'schedule-cpm.html' },
  { id: 'MUST_KNOW_EXTRAS', label: '🔥 MUST-KNOW EXTRAS', color: '#D84315', file: 'must-know-extras.html' },
  { id: 'STUDY_GUIDE', label: '📚 STUDY GUIDE', color: '#2E7D32', file: 'study-guide.html' }
];

export const defaultSectionId = sections[0].id;
