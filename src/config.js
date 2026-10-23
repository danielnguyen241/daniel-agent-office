// Edit agents, rooms and status messages here.
// Room fields: id, name, color, floor, x/z (center), w/d (size), agents:[[handle, role]], optional flags rack|mic|studio.
export const DEPTS=[
 {id:'hq',name:'HQ & Operations',color:'#e9a86b',floor:'#f7e3cf',x:2.5,z:6,w:10,d:10,agents:[
  ['@daily-task-master','Collects work logs, scores deep-work, syncs the master Google Sheet'],
  ['@discord-uptime-sentinel','Watches client sites and fires Discord uptime alerts']]},
 {id:'tech',name:'Technical SEO Lab',color:'#7fb3a3',floor:'#dcefe8',x:-10,z:-6,w:10,d:10,rack:true,agents:[
  ['@shopify-liquid-engineer','Builds & fixes Shopify Liquid themes for SEO'],
  ['@product-schema-architect','Generates Product / Offer structured data'],
  ['@screaming-frog-crawler','Runs crawls, surfaces technical issues'],
  ['@gsc-index-auditor','Audits Search Console indexing & coverage']]},
 {id:'auth',name:'Authority & Entity Room',color:'#b39ddb',floor:'#ebe4f6',x:.25,z:-6,w:9.5,d:10,mic:true,agents:[
  ['@tier1-backlink-engine','Plans and tracks tier-1 backlink & entity stacking'],
  ['@podcast-audio-syndicator','Turns content into podcasts and syndicates them'],
  ['@semrush-deep-auditor','Deep Semrush audits: traffic, authority, tiering']]},
 {id:'geo',name:'GEO Content Studio',color:'#f29e9e',floor:'#f9e1df',x:-9,z:6,w:12,d:10,agents:[
  ['@geo-blog-writer','Writes AI-search (GEO) optimised blog posts'],
  ['@serp-outline-architect','Builds outlines from live SERP analysis'],
  ['@wordpress-headless-publisher','Publishes to headless WordPress'],
  ['@blog-featured-image-artist','Creates featured images for every post']]},
 {id:'media',name:'Media Lab',color:'#e6c35c',floor:'#f6eccb',x:10.25,z:-6,w:9.5,d:10,studio:true,agents:[
  ['@chatcut-timeline-editor','Edits video timelines in ChatCut']]},
];

// Rotating status bubbles per room id
export const ACT={hq:['Syncing master sheet…','Scoring deep work…','Checking uptime…','Posting Discord alert…'],tech:['Crawling site…','Fixing Liquid theme…','Validating schema…','Checking index…'],
 auth:['Pitching tier-1 links…','Exporting podcast…','Running Semrush audit…','Mapping entities…'],geo:['Writing draft…','Outlining from SERP…','Publishing to WP…','Generating hero image…'],media:['Rendering video…','Cutting timeline…','Syncing captions…']};
