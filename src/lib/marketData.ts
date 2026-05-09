export const siteUrl = 'https://github.com/Firash735/muftahx';

export type Product = {
  slug: string;
  name: string;
  category: string;
  title: string;
  description: string;
  image: string;
  regions: string[];
  markets: string[];
  certifications: string[];
  buyerIntent: string;
  proof: string[];
};

export const products: Product[] = [
  {
    slug: 'coffee',
    name: 'Kenyan AA Coffee',
    category: 'Coffee',
    title: 'Verified Kenyan AA coffee exporters for global buyers',
    description: 'Source Kenyan AA and AB coffee from verified exporters with KEPHIS, NCE, FDA, and GlobalGAP documentation guidance.',
    image: 'https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=1200&q=85',
    regions: ['Kirinyaga', 'Nyeri', 'Muranga', 'Embu'],
    markets: ['Netherlands', 'United States', 'Germany', 'Japan', 'UAE'],
    certifications: ['KEPHIS', 'NCE registration', 'FDA registration', 'GlobalGAP preferred'],
    buyerIntent: 'Reliable Kenyan AA coffee supplier with traceable origin and export documentation.',
    proof: ['Cup-score grade language', 'Origin-region detail', 'Export compliance checklist', 'Buyer-market matching'],
  },
  {
    slug: 'tea',
    name: 'Kenyan Premium Tea',
    category: 'Tea',
    title: 'Kenyan tea exporters for CTC, orthodox, green, and purple tea',
    description: 'Find verified Kenyan tea suppliers for Pakistan, UK, Egypt, UAE, and specialty buyers with EATTA, KEPHIS, FDA, and Rainforest Alliance guidance.',
    image: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=1200&q=85',
    regions: ['Kericho', 'Nandi', 'Bomet', 'Meru'],
    markets: ['Pakistan', 'United Kingdom', 'Egypt', 'UAE', 'Japan'],
    certifications: ['KEPHIS', 'EATTA registration', 'FDA registration', 'Rainforest Alliance'],
    buyerIntent: 'High-volume Kenyan tea supplier with export-ready documentation and consistent year-round supply.',
    proof: ['Auction/export route clarity', 'Grade explanation', 'Market-specific buyer demand', 'Year-round availability'],
  },
  {
    slug: 'flowers',
    name: 'Kenyan Cut Flowers',
    category: 'Cut Flowers',
    title: 'Verified Kenyan rose and cut flower exporters',
    description: 'Source Kenyan roses and cut flowers from verified Naivasha and Rift Valley exporters with KEPHIS, AFA/HCD, MPS, and IATA compliance guidance.',
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&q=85',
    regions: ['Naivasha', 'Nakuru', 'Thika', 'Nanyuki'],
    markets: ['Netherlands', 'United Kingdom', 'UAE', 'Germany', 'Japan'],
    certifications: ['KEPHIS', 'AFA/HCD license', 'MPS-ABC', 'IATA perishables'],
    buyerIntent: 'Kenyan flower supplier with cold-chain capability, destination-market certificates, and consistent weekly volume.',
    proof: ['Vase-life and grade detail', 'Cold-chain expectations', 'Seasonal buyer deadlines', 'Certificate visibility'],
  },
  {
    slug: 'avocado',
    name: 'Kenyan Hass Avocado',
    category: 'Avocado',
    title: 'Kenyan Hass avocado exporters for EU, UK, Gulf, and Asia',
    description: 'Find verified Kenyan Hass avocado exporters with GlobalGAP, KEPHIS, AFA/HCD, organic, grade, and season information.',
    image: 'https://images.unsplash.com/photo-1560155016-bd4879ae8f21?w=1200&q=85',
    regions: ['Muranga', 'Meru', 'Nakuru', 'Kirinyaga'],
    markets: ['Netherlands', 'United Kingdom', 'UAE', 'Germany', 'China'],
    certifications: ['KEPHIS', 'GlobalGAP', 'AFA/HCD license', 'Organic certification'],
    buyerIntent: 'Reliable Kenyan Hass avocado supplier with export-grade fruit, packhouse controls, and destination-market fit.',
    proof: ['Grade A/B definitions', 'Dry matter expectations', 'Season window', 'Market compliance requirements'],
  },
  {
    slug: 'macadamia',
    name: 'Kenyan Macadamia',
    category: 'Macadamia',
    title: 'Kenyan macadamia exporters for premium nut buyers',
    description: 'Source Kenyan macadamia with export-grade style, aflatoxin, KEPHIS, FDA, and premium market documentation guidance.',
    image: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=1200&q=85',
    regions: ['Meru', 'Embu', 'Kirinyaga', 'Muranga'],
    markets: ['United States', 'European Union', 'China', 'Japan', 'UAE'],
    certifications: ['KEPHIS', 'FDA registration', 'Aflatoxin testing', 'Food safety audit'],
    buyerIntent: 'Kenyan macadamia supplier with documented quality, residue testing, and market-specific export readiness.',
    proof: ['Style and grade language', 'Aflatoxin-risk clarity', 'Food-safety expectations', 'Premium buyer positioning'],
  },
  {
    slug: 'apparel',
    name: 'Kenyan Apparel',
    category: 'Apparel',
    title: 'Kenyan apparel exporters under AGOA and EPZ manufacturing',
    description: 'Discover Kenyan apparel exporters for US and EU buyers with AGOA, EPZ, KRA, QMS, and ethical audit documentation.',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=1200&q=85',
    regions: ['Nairobi', 'Athi River', 'Mombasa', 'EPZ zones'],
    markets: ['United States', 'United Kingdom', 'European Union', 'UAE'],
    certifications: ['AGOA certificate', 'KRA business certificate', 'QMS documents', 'SEDEX/SMETA'],
    buyerIntent: 'Kenyan apparel manufacturer with duty advantage, production capacity, and compliance documents.',
    proof: ['AGOA advantage', 'Factory-audit expectations', 'MOQ and production clarity', 'Buyer compliance language'],
  },
  {
    slug: 'leather',
    name: 'Kenyan Leather Goods',
    category: 'Leather',
    title: 'Kenyan leather goods exporters for premium global buyers',
    description: 'Find Kenyan leather exporters for full-grain, top-grain, suede, bags, belts, and footwear with HCDA, KBS, and REACH guidance.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=1200&q=85',
    regions: ['Athi River', 'Nairobi', 'Nakuru'],
    markets: ['UAE', 'European Union', 'United States', 'Japan', 'China'],
    certifications: ['HCDA certification', 'KBS quality mark', 'REACH compliance', 'Traceability documents'],
    buyerIntent: 'Kenyan leather supplier with verified tannery standards, material grade, and traceable sourcing.',
    proof: ['Grade definitions', 'Material-use clarity', 'Chemical compliance', 'Sustainable sourcing proof'],
  },
  {
    slug: 'spices',
    name: 'Kenyan Spices',
    category: 'Spices',
    title: 'Kenyan spice exporters for residue-tested global sourcing',
    description: 'Source Kenyan spices with KEPHIS, FDA, residue testing, origin traceability, and buyer-market compliance guidance.',
    image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=85',
    regions: ['Coast', 'Makueni', 'Meru', 'Kisii'],
    markets: ['European Union', 'United States', 'UAE', 'India', 'Japan'],
    certifications: ['KEPHIS', 'FDA registration', 'Residue testing', 'Food safety audit'],
    buyerIntent: 'Kenyan spice supplier with residue-tested product and food-grade export documentation.',
    proof: ['Residue-test expectations', 'Origin traceability', 'Food-safety language', 'Market-risk clarity'],
  },
  {
    slug: 'oils',
    name: 'Kenyan Fats and Oils',
    category: 'Fats and Oils',
    title: 'Kenyan fats and oils exporters for plant-derived oil buyers',
    description: 'Find Kenyan plant-derived oil exporters with KEPHIS, food safety, quality, packaging, and market compliance guidance.',
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=1200&q=85',
    regions: ['Nairobi', 'Mombasa', 'Western Kenya', 'Coast'],
    markets: ['East Africa', 'UAE', 'European Union', 'United States'],
    certifications: ['KEPHIS where applicable', 'KBS quality mark', 'Food safety audit', 'Batch testing'],
    buyerIntent: 'Kenyan oil supplier with product quality data, packaging controls, and repeatable supply.',
    proof: ['Batch quality language', 'Packaging detail', 'Market growth signal', 'Compliance checklist'],
  },
  {
    slug: 'livestock',
    name: 'Kenyan Live Animals',
    category: 'Live Animals',
    title: 'Kenyan livestock exporters for Gulf and regional buyers',
    description: 'Source Kenyan cattle, goats, sheep, and camels with KVA health certificate, Halal, vaccination, and transport compliance guidance.',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=1200&q=85',
    regions: ['Garissa', 'Wajir', 'Mandera', 'Kajiado', 'Narok'],
    markets: ['Saudi Arabia', 'UAE', 'Kuwait', 'Bahrain', 'Qatar'],
    certifications: ['KVA health certificate', 'Halal certification', 'Vaccination records', 'IATA live animals'],
    buyerIntent: 'Kenyan livestock supplier with disease-free status, Halal documentation, and Gulf market logistics readiness.',
    proof: ['Breed and weight detail', 'Health-certificate clarity', 'Eid timing', 'Transport documentation'],
  },
];

export type KnowledgeArticle = {
  slug: string;
  title: string;
  description: string;
  productSlug?: string;
  sections: Array<{ heading: string; body: string }>;
};

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'how-to-export-avocado-from-kenya-to-uae',
    title: 'How to export avocado from Kenya to UAE',
    description: 'A buyer-focused guide to Kenyan Hass avocado export requirements, seasonality, documents, and supplier verification for UAE trade.',
    productSlug: 'avocado',
    sections: [
      { heading: 'What buyers check first', body: 'UAE buyers look for export-grade Hass fruit, packhouse control, KEPHIS phytosanitary documents, AFA/HCD licensing, and clear harvest windows.' },
      { heading: 'Documents to prepare', body: 'A seller should show KEPHIS certificate readiness, AFA/HCD export license, GlobalGAP where premium retailers are involved, and invoice/packing list discipline.' },
      { heading: 'How MuftahX helps', body: 'MuftahX turns the seller profile into a verification file: product photos, document reference, risk score, grade language, market fit, and direct buyer inquiry.' },
    ],
  },
  {
    slug: 'how-to-find-verified-kenyan-coffee-suppliers',
    title: 'How to find verified Kenyan coffee suppliers',
    description: 'A practical guide for buyers sourcing Kenyan AA coffee with origin, grade, compliance, and supplier proof.',
    productSlug: 'coffee',
    sections: [
      { heading: 'Start with grade and origin', body: 'Serious buyers search for AA, AB, or peaberry coffee tied to regions such as Kirinyaga, Nyeri, Muranga, and Embu.' },
      { heading: 'Check export readiness', body: 'Coffee buyers should confirm NCE/direct export route, KEPHIS certificate readiness, FDA registration for US-bound coffee, and transparent seller identity.' },
      { heading: 'What proof matters', body: 'A polished website is not enough. Buyers need origin, grade, available volume, certifications, price benchmark, and contact route.' },
    ],
  },
  {
    slug: 'kenya-export-certificates-kephis-globalgap-afa-fda',
    title: 'Kenya export certificates: KEPHIS, GlobalGAP, AFA/HCD, and FDA',
    description: 'Understand which export certificates matter for Kenyan agricultural suppliers and how buyers should read them.',
    sections: [
      { heading: 'KEPHIS', body: 'KEPHIS is central for plant and phytosanitary export documents. Buyers should expect certificate visibility per consignment or product type.' },
      { heading: 'GlobalGAP', body: 'GlobalGAP signals farm-practice control and is especially important for EU supermarket and premium produce buyers.' },
      { heading: 'AFA/HCD and FDA', body: 'AFA/HCD applies to Kenyan horticultural exports, while FDA registration is important for US food-market entry.' },
    ],
  },
  {
    slug: 'how-ai-search-finds-b2b-export-suppliers',
    title: 'How AI search finds B2B export suppliers',
    description: 'Why decision-makers search with contextual questions and how MuftahX content is structured for AI-first discovery.',
    sections: [
      { heading: 'Executives search differently', body: 'Decision-makers ask contextual questions such as reliable suppliers, certifications, destination markets, volume, and proof.' },
      { heading: 'Authority beats fluff', body: 'AI and search systems need clear entities: product, origin, certificate, buyer market, verification status, and specific use case.' },
      { heading: 'MuftahX structure', body: 'Product pages, knowledge pages, schema markup, and verification data create a discoverable trust layer around Kenyan exports.' },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find(product => product.slug === slug);
}

export function getArticle(slug: string) {
  return knowledgeArticles.find(article => article.slug === slug);
}
