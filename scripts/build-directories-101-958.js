#!/usr/bin/env node

/**
 * Directory Expansion Script: Build entries 101-180 (first batch)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load existing directories
const directoriesPath = path.join(__dirname, '../data/directories.json');
const existing = JSON.parse(fs.readFileSync(directoriesPath, 'utf-8'));

console.log(`✅ Loaded ${existing.length} existing directories (ranks 1-${existing[existing.length-1].rank})`);

// Directories 101-180: First expansion batch
const newDirectories = [
  // 101-120: Healthcare + Wellness
  {
    "rank": 101,
    "name": "Healthgrades",
    "url": "https://www.healthgrades.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.healthgrades.com",
    "category": "health_wellness",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 102,
    "name": "ZocDoc",
    "url": "https://www.zocdoc.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "health_wellness",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 103,
    "name": "Vitals",
    "url": "https://www.vitals.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "health_wellness",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 104,
    "name": "Avvo (Legal Services)",
    "url": "https://www.avvo.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "professional_services",
    "isFree": true,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 105,
    "name": "Justia",
    "url": "https://www.justia.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "professional_services",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 106,
    "name": "NOLO",
    "url": "https://www.nolo.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "professional_services",
    "isFree": true,
    "estimatedMonthlyViews": 60000
  },
  {
    "rank": 107,
    "name": "Psychology Today",
    "url": "https://www.psychologytoday.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "professional_services",
    "isFree": true,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 108,
    "name": "DayCare.com",
    "url": "https://www.daycare.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "health_wellness",
    "isFree": true,
    "estimatedMonthlyViews": 90000
  },
  {
    "rank": 109,
    "name": "GreatSchools.org",
    "url": "https://www.greatschools.org",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "education",
    "isFree": true,
    "estimatedMonthlyViews": 180000
  },
  {
    "rank": 110,
    "name": "Niche Schools",
    "url": "https://www.niche.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "education",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 111,
    "name": "Dun & Bradstreet (D&B)",
    "url": "https://www.dnb.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.dnb.com",
    "category": "business_registry",
    "isFree": false,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 112,
    "name": "Mergermarket",
    "url": "https://www.mergermarket.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "b2b_database",
    "isFree": false,
    "estimatedMonthlyViews": 40000
  },
  {
    "rank": 113,
    "name": "Owler",
    "url": "https://www.owler.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://owler.com/api",
    "category": "company_database",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 114,
    "name": "OpenCorporates",
    "url": "https://opencorporates.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://api.opencorporates.com",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 70000
  },
  {
    "rank": 115,
    "name": "Inc.com Companies",
    "url": "https://www.inc.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "business_directory",
    "isFree": true,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 116,
    "name": "Forbes Company Directory",
    "url": "https://www.forbes.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "business_directory",
    "isFree": true,
    "estimatedMonthlyViews": 90000
  },
  {
    "rank": 117,
    "name": "Hoover's (D&B subsidiary)",
    "url": "https://www.hoovers.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "b2b_database",
    "isFree": false,
    "estimatedMonthlyViews": 60000
  },
  {
    "rank": 118,
    "name": "SIC Code Directory",
    "url": "https://www.osha.gov/sicmanual/",
    "submissionMethod": "manual",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.census.gov/naics/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 50000
  },
  {
    "rank": 119,
    "name": "NAICS Directory",
    "url": "https://www.census.gov/naics/",
    "submissionMethod": "manual",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.census.gov/naics/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 40000
  },
  {
    "rank": 120,
    "name": "Chamber of Commerce National",
    "url": "https://www.uschamber.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "business_directory",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 121,
    "name": "PGA Tour (Golf)",
    "url": "https://www.pgatour.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.pgatour.com",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 122,
    "name": "USGA (Golf Courses)",
    "url": "https://www.usga.org",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 123,
    "name": "Golf Digest Course Finder",
    "url": "https://www.golfdigest.com/courses",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 124,
    "name": "CourseDatabase.com",
    "url": "https://www.coursedatabase.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 60000
  },
  {
    "rank": 125,
    "name": "All Top Gyms",
    "url": "https://www.alltopgyms.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 40000
  },
  {
    "rank": 126,
    "name": "ClassPass",
    "url": "https://classpass.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.classpass.com",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 127,
    "name": "Mindbody (Fitness Software)",
    "url": "https://www.mindbody.io",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.mindbody.io",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 128,
    "name": "Peloton Digital (Fitness)",
    "url": "https://www.pelotoncycle.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://api.onepeloton.com",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 129,
    "name": "Eventbrite (Events)",
    "url": "https://www.eventbrite.com",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.eventbrite.com/platform/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 400000
  },
  {
    "rank": 130,
    "name": "Meetup.com",
    "url": "https://www.meetup.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.meetup.com/api/",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 131,
    "name": "California Secretary of State",
    "url": "https://www.sos.ca.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sos.ca.gov/business-programs/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 132,
    "name": "New York Secretary of State",
    "url": "https://www.dos.ny.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.dos.ny.gov/business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 90000
  },
  {
    "rank": 133,
    "name": "Texas Secretary of State",
    "url": "https://www.sos.texas.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sos.texas.gov/business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 134,
    "name": "Florida Secretary of State",
    "url": "https://www.flhsmv.gov/",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sunbiz.org/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 70000
  },
  {
    "rank": 135,
    "name": "Illinois Secretary of State",
    "url": "https://www.sos.illinois.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sos.illinois.gov/business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 65000
  },
  {
    "rank": 136,
    "name": "Pennsylvania Secretary of State",
    "url": "https://www.dos.pa.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.dos.pa.gov/Business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 60000
  },
  {
    "rank": 137,
    "name": "Ohio Secretary of State",
    "url": "https://www.sos.state.oh.us",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sos.state.oh.us/business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 55000
  },
  {
    "rank": 138,
    "name": "Georgia Secretary of State",
    "url": "https://sos.ga.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://sos.ga.gov/corporations",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 50000
  },
  {
    "rank": 139,
    "name": "North Carolina Secretary of State",
    "url": "https://www.sosnc.gov",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.sosnc.gov/business/",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 45000
  },
  {
    "rank": 140,
    "name": "Michigan Secretary of State",
    "url": "https://www.michigan.gov/sos",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.michigan.gov/sos/0,4670,7-127-1633_1635---,00.html",
    "category": "business_registry",
    "isFree": true,
    "estimatedMonthlyViews": 40000
  },
  {
    "rank": 141,
    "name": "Zillow",
    "url": "https://www.zillow.com",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.zillow.com/howto/api/",
    "category": "real_estate",
    "isFree": false,
    "estimatedMonthlyViews": 600000
  },
  {
    "rank": 142,
    "name": "Redfin",
    "url": "https://www.redfin.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://api.redfin.com",
    "category": "real_estate",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 143,
    "name": "Realtor.com",
    "url": "https://www.realtor.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.realtor.com",
    "category": "real_estate",
    "isFree": false,
    "estimatedMonthlyViews": 300000
  },
  {
    "rank": 144,
    "name": "Trulia (Zillow subsidiary)",
    "url": "https://www.trulia.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "real_estate",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 145,
    "name": "MLS (Multiple Listing Service)",
    "url": "https://www.realtor.com/mls",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.realtor.com/mls",
    "category": "real_estate",
    "isFree": false,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 146,
    "name": "PropertyShark",
    "url": "https://www.propertyshark.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "real_estate",
    "isFree": true,
    "estimatedMonthlyViews": 50000
  },
  {
    "rank": 147,
    "name": "ParkWhiz (Parking)",
    "url": "https://www.parkwhiz.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 148,
    "name": "Parkopedia (Parking)",
    "url": "https://www.parkopedia.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.parkopedia.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 60000
  },
  {
    "rank": 149,
    "name": "Vrbo (Vacation Rental)",
    "url": "https://www.vrbo.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.vrbo.com/about-vrbo",
    "category": "accommodation",
    "isFree": false,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 150,
    "name": "Kelley Blue Book (KBB)",
    "url": "https://www.kbb.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.kbb.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 400000
  },
  {
    "rank": 151,
    "name": "Edmunds",
    "url": "https://www.edmunds.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.edmunds.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 300000
  },
  {
    "rank": 152,
    "name": "Cars.com",
    "url": "https://www.cars.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.cars.com/api",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 153,
    "name": "Autotrader.com",
    "url": "https://www.autotrader.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.autotrader.com",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 154,
    "name": "CarGurus",
    "url": "https://www.cargurus.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.cargurus.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 180000
  },
  {
    "rank": 155,
    "name": "ClassicCars.com",
    "url": "https://www.classiccars.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 50000
  },
  {
    "rank": 156,
    "name": "NADA Guides (Vehicle Values)",
    "url": "https://www.nadaguides.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.nadaguides.com/api",
    "category": "niche",
    "isFree": false,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 157,
    "name": "JD Power",
    "url": "https://www.jdpower.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 158,
    "name": "CarMax",
    "url": "https://www.carmax.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.carmax.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 159,
    "name": "RepairPal (Auto Repair)",
    "url": "https://www.repairpal.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.repairpal.com/api",
    "category": "niche",
    "isFree": true,
    "estimatedMonthlyViews": 90000
  },
  {
    "rank": 160,
    "name": "G2.com (Software Reviews)",
    "url": "https://www.g2.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.g2.com/api",
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 300000
  },
  {
    "rank": 161,
    "name": "Capterra (Software Reviews)",
    "url": "https://www.capterra.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.capterra.com/api",
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 162,
    "name": "GetApp",
    "url": "https://www.getapp.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 163,
    "name": "Slant (Technology Recommendations)",
    "url": "https://www.slant.co",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 80000
  },
  {
    "rank": 164,
    "name": "AlternativeTo",
    "url": "https://alternativeto.net",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://alternativeto.net/api",
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 165,
    "name": "Product Hunt",
    "url": "https://www.producthunt.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://api.producthunt.com",
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 166,
    "name": "TechRadar",
    "url": "https://www.techradar.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 180000
  },
  {
    "rank": 167,
    "name": "CNET Reviews",
    "url": "https://www.cnet.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 168,
    "name": "PCWorld",
    "url": "https://www.pcworld.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 169,
    "name": "AndroidAuthority",
    "url": "https://www.androidauthority.com",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "review_platform",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 170,
    "name": "Instagram Business",
    "url": "https://www.instagram.com/business",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://developers.facebook.com/docs/instagram",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 400000
  },
  {
    "rank": 171,
    "name": "TikTok Business",
    "url": "https://www.tiktok.com/business",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.tiktok.com",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 300000
  },
  {
    "rank": 172,
    "name": "Twitter/X Business",
    "url": "https://business.twitter.com",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://developer.twitter.com",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 250000
  },
  {
    "rank": 173,
    "name": "Telegram Business",
    "url": "https://telegram.org",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://core.telegram.org/api",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 174,
    "name": "Snapchat Business",
    "url": "https://www.snapchat.com/business",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://kit.snapchat.com",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 150000
  },
  {
    "rank": 175,
    "name": "Reddit",
    "url": "https://www.reddit.com",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://www.reddit.com/dev/api",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 400000
  },
  {
    "rank": 176,
    "name": "Nextdoor Business",
    "url": "https://business.nextdoor.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://business.nextdoor.com/api",
    "category": "local_services",
    "isFree": false,
    "estimatedMonthlyViews": 100000
  },
  {
    "rank": 177,
    "name": "Pinterest Business",
    "url": "https://www.pinterest.com/business",
    "submissionMethod": "api",
    "apiAvailable": true,
    "apiDocsUrl": "https://developers.pinterest.com",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 200000
  },
  {
    "rank": 178,
    "name": "YouTube Creator",
    "url": "https://www.youtube.com/creator",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developers.google.com/youtube",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 500000
  },
  {
    "rank": 179,
    "name": "Quora Business",
    "url": "https://www.quora.com/business",
    "submissionMethod": "form",
    "apiAvailable": false,
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 120000
  },
  {
    "rank": 180,
    "name": "WeChat Official Account",
    "url": "https://mp.weixin.qq.com",
    "submissionMethod": "form",
    "apiAvailable": true,
    "apiDocsUrl": "https://developers.weixin.qq.com",
    "category": "social_media",
    "isFree": true,
    "estimatedMonthlyViews": 300000
  }
];

// Append new directories
const allDirectories = [...existing, ...newDirectories];

console.log(`\n📊 Building directories 101-180...`);
console.log(`Total entries: ${allDirectories.length}`);

// Validate JSON integrity
let isValid = true;
const requiredFields = ['rank', 'name', 'url', 'submissionMethod', 'apiAvailable', 'category', 'isFree', 'estimatedMonthlyViews'];

for (let i = 0; i < allDirectories.length; i++) {
  const dir = allDirectories[i];
  
  // Check required fields
  for (const field of requiredFields) {
    if (!(field in dir)) {
      console.error(`❌ Entry ${i + 1} (rank ${dir.rank}) missing field: ${field}`);
      isValid = false;
    }
  }
  
  // Validate URL format
  if (!dir.url.startsWith('https://') && !dir.url.startsWith('http://')) {
    console.error(`❌ Entry rank ${dir.rank} has invalid URL: ${dir.url}`);
    isValid = false;
  }
  
  // Validate submission method
  const validMethods = ['api', 'form', 'manual', 'email', 'phone'];
  if (!validMethods.includes(dir.submissionMethod)) {
    console.error(`❌ Entry rank ${dir.rank} has invalid submissionMethod: ${dir.submissionMethod}`);
    isValid = false;
  }
}

if (!isValid) {
  console.error('\n❌ Validation failed. Fix errors above before saving.');
  process.exit(1);
}

console.log(`✅ All ${allDirectories.length} entries validated successfully`);

// Write to file
fs.writeFileSync(directoriesPath, JSON.stringify(allDirectories, null, 2));
console.log(`\n✅ Saved ${allDirectories.length} directories to data/directories.json`);
console.log(`📈 Progress: Entries 1-180 complete. Entries 181-958 still needed.`);
