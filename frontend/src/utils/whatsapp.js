/**
 * WhatsApp integration utility for PlayVaultKLB
 * Ensures all booking and inquiry redirects construct properly formatted and encoded WhatsApp links.
 * Formats every message with bold headers, emojis, and complete itemized details so the admin
 * instantly knows exactly what game, plan, duration, price, and delivery area the customer wants.
 */

const DEFAULT_PHONE = '8904004036';
const DEFAULT_COUNTRY_CODE = '91';

export const cleanPhoneNumber = (phone = DEFAULT_PHONE, countryCode = DEFAULT_COUNTRY_CODE) => {
  const digits = String(phone).replace(/[^0-9]/g, '');
  if (digits.startsWith(countryCode)) {
    return digits;
  }
  return `${countryCode}${digits}`;
};

export const createWhatsAppUrl = (phone, message) => {
  const targetNumber = cleanPhoneNumber(phone);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${targetNumber}?text=${encodedText}`;
};

/**
 * Generate URL for booking a specific Game with duration, price, controllers, and location details
 */
export const getGameBookingUrl = ({
  gameTitle,
  duration = '1 Hour',
  price = 50,
  platform = 'PS5',
  controllers = '1 DualSense Wireless Controller',
  customerName = '',
  deliveryArea = '',
  phone = DEFAULT_PHONE,
}) => {
  const formattedPrice = typeof price === 'number' ? price.toLocaleString('en-IN') : price;

  const lines = [
    `🎮 *PLAYVAULT KLB - PS5 GAME RENTAL REQUEST* 🎮`,
    ``,
    `Hello! I would like to book a PlayStation 5 console rental with the following details:`,
    ``,
    `🕹️ *Game Selected:* ${gameTitle}`,
    `⚡ *Platform:* ${platform} (Sony PlayStation 5)`,
    `⏱️ *Rental Duration:* ${duration}`,
    `💰 *Rental Amount:* ₹${formattedPrice}`,
    `🎮 *Controllers:* ${controllers}`,
    customerName ? `👤 *Customer Name:* ${customerName}` : '',
    deliveryArea ? `📍 *Delivery Area:* ${deliveryArea}, Kalaburagi` : `📍 *Location:* Kalaburagi, Karnataka`,
    ``,
    `📦 *Package Inclusions:*`,
    `  ✓ PS5 4K HDR Ultra-Fast Console`,
    `  ✓ ${controllers}`,
    `  ✓ High-Speed HDMI 2.1 & Power Cables`,
    `  ✓ Free Doorstep Delivery & Setup in Kalaburagi`,
    ``,
    `Please confirm if this console and game are available for delivery!`,
  ].filter(Boolean).join('\n');

  return createWhatsAppUrl(phone, lines);
};

/**
 * Generate URL for booking a Rental Plan (e.g. 1-Day, 2-Days, 3-Days, 1-Week)
 */
export const getPlanBookingUrl = (plan, phone = DEFAULT_PHONE, customerName = '', deliveryArea = '') => {
  const formattedPrice = typeof plan.price === 'number' ? plan.price.toLocaleString('en-IN') : plan.price;
  const inclusionsList = Array.isArray(plan.inclusions) && plan.inclusions.length > 0
    ? plan.inclusions.map((inc) => `  ✓ ${inc}`).join('\n')
    : [
        '  ✓ PlayStation 5 Ultra HD 4K Console',
        '  ✓ 1 DualSense Wireless Controller',
        '  ✓ 24/7 Support Included',
        '  ✓ GTA VI / Top Games Included',
        '  ✓ Free Doorstep Setup in Kalaburagi',
      ].join('\n');

  const lines = [
    `🎮 *PLAYVAULT KLB - RENTAL PACKAGE BOOKING* 🎮`,
    ``,
    `Hello! I would like to book the following PlayStation 5 Rental Plan:`,
    ``,
    `📦 *Plan Selected:* ${plan.name}`,
    `⏱️ *Total Duration:* ${plan.durationHours} Hours (${plan.durationLabel || `${plan.durationHours} hrs`})`,
    `💰 *Plan Price:* ₹${formattedPrice}`,
    plan.originalPrice ? `🏷️ *Standard Price:* ₹${plan.originalPrice.toLocaleString('en-IN')}` : '',
    customerName ? `👤 *Customer Name:* ${customerName}` : '',
    deliveryArea ? `📍 *Delivery Landmark:* ${deliveryArea}, Kalaburagi` : `📍 *Location:* Kalaburagi, Karnataka`,
    ``,
    `🎁 *Included In This Package:*`,
    inclusionsList,
    ``,
    `Please confirm console availability and delivery time for Kalaburagi!`,
  ].filter(Boolean).join('\n');

  return createWhatsAppUrl(phone, lines);
};

/**
 * Generate URL for general inquiry from Hero / Nav / Contact section
 */
export const getGeneralInquiryUrl = (customNote = '', phone = DEFAULT_PHONE) => {
  const lines = [
    `🎮 *PLAYVAULT KLB - PS5 RENTAL INQUIRY* 🎮`,
    ``,
    customNote.trim() || `Hello! I am interested in renting a PlayStation 5 console in Kalaburagi.`,
    ``,
    `📍 *Location:* Kalaburagi (Gulbarga), Karnataka`,
    `🕹️ *Hardware:* PlayStation 5 + DualSense Wireless Controller`,
    ``,
    `Please share currently available console slots, pricing plans, and the full game catalogue!`,
  ].join('\n');

  return createWhatsAppUrl(phone, lines);
};
