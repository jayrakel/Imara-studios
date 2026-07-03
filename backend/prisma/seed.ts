import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Imara Studios database...');

  // ─── Super Admin User ────────────────────────────────────────────
  const adminPassword = await bcrypt.hash('ImaraAdmin2024!', 12);
  await prisma.user.upsert({
    where: { email: 'admin@imarastudios.com' },
    update: {},
    create: {
      email: 'admin@imarastudios.com',
      passwordHash: adminPassword,
      name: 'Imara Admin',
      role: 'SUPER_ADMIN',
    }
  });
  console.log('✅ Super admin created: admin@imarastudios.com / ImaraAdmin2024!');
  console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');

  // ─── Default Settings ────────────────────────────────────────────
  const defaultSettings = [
    { key: 'auditions_open', value: 'false', label: 'Choir Auditions Open' },
    { key: 'site_maintenance', value: 'false', label: 'Site Maintenance Mode' },
    { key: 'bookings_enabled', value: 'true', label: 'Bookings Enabled' },
  ];
  for (const s of defaultSettings) {
    await prisma.setting.upsert({ where: { key: s.key }, update: {}, create: s });
  }
  console.log('✅ Default settings seeded');

  // ─── Default Content Blocks ──────────────────────────────────────
  const contentBlocks = [
    // Homepage
    { key: 'home.hero.tagline', value: 'Where Sound Meets Vision', label: 'Hero Tagline', group: 'homepage', type: 'text' },
    { key: 'home.hero.subtitle', value: 'Premium recording, production & performance — all under one roof.', label: 'Hero Subtitle', group: 'homepage', type: 'text' },
    // Pricing — Music Recording
    { key: 'pricing.recording.hourly', value: '5,000', label: 'Recording: Hourly Rate (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.recording.day_rate', value: '35,000', label: 'Recording: Day Rate (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.recording.vocal_package', value: '15,000', label: 'Recording: Dry Vocal Package (KES)', group: 'pricing', type: 'number' },
    // Pricing — Music Production
    { key: 'pricing.production.full_track', value: '25,000', label: 'Production: Full Track (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.production.mixing_mastering', value: '12,000', label: 'Production: Mix & Master per stem (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.production.songwriting', value: '30,000', label: 'Production: Custom Songwriting (KES)', group: 'pricing', type: 'number' },
    // Pricing — Vocal Training
    { key: 'pricing.vocal.single_session', value: '3,500', label: 'Vocal: Single Session (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.vocal.beginner_4week', value: '12,000', label: 'Vocal: 4-Week Beginner Package (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.vocal.advanced_block', value: '18,000', label: 'Vocal: Advanced Block (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.vocal.group_coaching', value: '8,000', label: 'Vocal: Group Coaching (KES)', group: 'pricing', type: 'number' },
    // Pricing — Video Shooting
    { key: 'pricing.video_shoot.in_studio', value: '20,000', label: 'Video: In-Studio Capture (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.video_shoot.half_day', value: '35,000', label: 'Video: On-Location Half Day (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.video_shoot.full_day', value: '60,000', label: 'Video: On-Location Full Day (KES)', group: 'pricing', type: 'number' },
    // Pricing — Video Production
    { key: 'pricing.video_post.basic_edit', value: '15,000', label: 'Video Post: Basic Edit (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.video_post.concept_mv', value: '80,000', label: 'Video Post: Concept Music Video (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.video_post.social_cutdowns', value: '8,000', label: 'Video Post: Social Cutdowns (KES)', group: 'pricing', type: 'number' },
    // Choir Hire
    { key: 'pricing.choir.wedding', value: '50,000', label: 'Choir: Wedding Package (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.choir.corporate', value: '70,000', label: 'Choir: Corporate Event (KES)', group: 'pricing', type: 'number' },
    { key: 'pricing.choir.studio_session', value: '45,000', label: 'Choir: Studio Session Vocals (KES)', group: 'pricing', type: 'number' },
    // Contact
    { key: 'contact.phone', value: '+254 700 000 000', label: 'Contact Phone', group: 'contact', type: 'text' },
    { key: 'contact.email', value: 'hello@imarastudios.com', label: 'Contact Email', group: 'contact', type: 'text' },
    { key: 'contact.address', value: 'Nakuru, Kenya', label: 'Address', group: 'contact', type: 'text' },
    { key: 'social.instagram', value: 'https://instagram.com/imarastudios', label: 'Instagram URL', group: 'social', type: 'text' },
    { key: 'social.youtube', value: 'https://youtube.com/@imarastudios', label: 'YouTube URL', group: 'social', type: 'text' },
    { key: 'social.facebook', value: 'https://facebook.com/imarastudios', label: 'Facebook URL', group: 'social', type: 'text' },
  ];

  for (const block of contentBlocks) {
    await prisma.contentBlock.upsert({ where: { key: block.key }, update: {}, create: block });
  }
  console.log(`✅ ${contentBlocks.length} content blocks seeded`);

  // ─── Sample upcoming events ──────────────────────────────────────
  const events = [
    { title: 'Imara Choir Christmas Concert', description: 'A magical evening of festive choral performances. Join us for a night to remember.', venue: 'Alliance Française, Nakuru', eventDate: new Date('2026-12-20T19:00:00'), isPublic: true },
    { title: 'Corporate Gala — TBA', description: 'Private corporate performance. Date blocked for planning.', venue: 'TBA', eventDate: new Date('2026-08-15T18:00:00'), isBlocked: true, isPublic: false },
    { title: 'Studio Open Day', description: 'Explore the studio, meet the team, and hear the choir live.', venue: 'Imara Studios, Nakuru', eventDate: new Date('2026-09-06T10:00:00'), isPublic: true },
  ];
  for (const e of events) {
    await prisma.event.create({ data: e }).catch(() => { });
  }
  console.log('✅ Sample events seeded');

  console.log('\n🎙️  Database seeded successfully!');
  console.log('   Admin login: admin@imarastudios.com / ImaraAdmin2024!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
