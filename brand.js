// Every logo and avatar the Feed shows, in one place.
// To change the product mark, an agent's face or a connector logo: change the path here (or replace the file at that path).
// The product name is used in copy as well; see DESIGN.md → "Changing the name".
window.BRAND = {
  product: { name: 'ShopOS', mark: 'assets/brand/mark.svg' },
  client:  { name: 'Arata',  mark: 'assets/arata/mark.svg', logo: 'assets/arata/logo.svg' },
  agents: {
    creative:     'assets/brand/agent-creative.svg',
    performance:  'assets/brand/agent-performance.svg',
    storefront:   'assets/brand/agent-storefront.svg',
    visibility:   'assets/brand/agent-visibility.svg',
    crm:          'assets/brand/agent-crm.svg',
    orchestrator: 'assets/brand/agent-orchestrator.svg'
  },
  connectors: {
    shopify:  'assets/brand/logo-shopify.png',
    klaviyo:  'assets/brand/logo-klaviyo.png',
    whatsapp: 'assets/brand/logo-whatsapp.png',
    meta:     'assets/logos/meta.svg',
    gads:     'assets/logos/google-ads.svg',
    ga4:      'assets/logos/google-analytics.svg',
    slack:    'assets/logos/slack.svg'
  },
  // the model picker in Ask ShopOS. Auto is always the product mark.
  // Logos are the vendors' own marks (via the iconify "logos" set); check each vendor's brand rules before shipping.
  models: {
    Claude: 'assets/logos/claude.svg',
    GPT:    'assets/logos/openai.svg',
    Gemini: 'assets/logos/gemini.svg'
  },
  team: {
    riya:  { name: 'Riya',  role: 'Design',       c: '#f0a6c8' },
    kabir: { name: 'Kabir', role: 'Performance',  c: '#ef8b33' },
    meera: { name: 'Meera', role: 'Copy and CRM', c: '#5eead4' },
    dev:   { name: 'Dev',   role: 'Storefront',   c: '#e8c34a' }
  }
};
