// Script to update all translation keys
// Run with: node scripts/update-translations.js

const fs = require('fs');
const path = require('path');

// Read Arabic translations
const arPath = path.join(__dirname, '../src/lib/i18n/translations/ar.json');
const arData = JSON.parse(fs.readFileSync(arPath, 'utf8'));

// Read English translations
const enPath = path.join(__dirname, '../src/lib/i18n/translations/en.json');
const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));

// Update Arabic translations
function updateArabic(data) {
  // Update Last Mile to Package Delivery
  if (data.services?.items?.lastMile) {
    data.services.items.lastMile.title = "توصيل الطرود";
  }
  if (data.services?.lastMile) {
    data.services.lastMile = "توصيل الطرود";
  }
  if (data.lastMile) {
    data.lastMile.title = "توصيل الطرود";
    data.lastMile.whyChoose = "لماذا تختار خدمة توصيل الطرود من تي دي؟";
    data.lastMile.whyChooseDesc = "خدمة توصيل الطرود لدينا مصممة خصيصاً للسوق السعودي، مع فهم عميق للتحديات المحلية وتوقعات العملاء.";
    data.lastMile.ctaDesc = "احصل على عرض سعر مخصص لخدمة توصيل الطرود المصممة خصيصاً لاحتياجات عملك.";
    data.lastMile.faq.q1 = "ما هو توصيل الطرود؟";
    data.lastMile.faq.a1 = "توصيل الطرود هو المرحلة النهائية من عملية التوصيل حيث يتم نقل الشحنة من مركز التوزيع إلى عتبة باب العميل النهائي. نحن نضمن توصيل سريع وموثوق مع تتبع في الوقت الفعلي.";
  }
  
  // Remove "thousands"
  if (data.cta?.description) {
    data.cta.description = data.cta.description.replace('الآلاف من', '');
    data.cta.description = data.cta.description.replace('آلاف', '');
  }
  
  // Update 99.2% to 93%
  if (data.about?.stats) {
    const statsText = JSON.stringify(data.about.stats);
    data.about.stats = JSON.parse(statsText.replace('99.2', '93'));
  }
  
  // Update footer description
  if (data.footer?.description) {
    data.footer.description = "شريكك الموثوق في الخدمات اللوجستية. نقدم خدمات لوجستية متكاملة بأعلى معايير الجودة والأمان.";
  }
  
  return data;
}

// Update English translations
function updateEnglish(data) {
  // Update Last Mile to Package Delivery
  if (data.services?.items?.lastMile) {
    data.services.items.lastMile.title = "Package Delivery";
  }
  if (data.services?.lastMile) {
    data.services.lastMile = "Package Delivery";
  }
  if (data.lastMile) {
    data.lastMile.title = "Package Delivery";
    data.lastMile.whyChoose = "Why Choose TD Package Delivery?";
    data.lastMile.whyChooseDesc = "Our package delivery service is specifically designed for the Saudi market, with deep understanding of local challenges and customer expectations.";
    data.lastMile.ctaDesc = "Get a customized quote for package delivery service designed specifically for your business needs.";
    data.lastMile.faq.q1 = "What is package delivery?";
    data.lastMile.faq.a1 = "Package delivery is the final stage of the delivery process where the shipment is transported from the distribution center to the end customer's doorstep. We ensure fast and reliable delivery with real-time tracking.";
  }
  
  // Remove "thousands"
  if (data.cta?.description) {
    data.cta.description = data.cta.description.replace('thousands of ', '');
    data.cta.description = data.cta.description.replace('thousands', '');
  }
  
  // Update 99.2% to 93%
  if (data.about?.stats) {
    const statsText = JSON.stringify(data.about.stats);
    data.about.stats = JSON.parse(statsText.replace('99.2', '93'));
  }
  
  // Update footer description
  if (data.footer?.description) {
    data.footer.description = "Your trusted partner in logistics services. We provide integrated logistics services with the highest standards of quality and safety.";
  }
  
  return data;
}

// Apply updates
const updatedAr = updateArabic(arData);
const updatedEn = updateEnglish(enData);

// Write back
fs.writeFileSync(arPath, JSON.stringify(updatedAr, null, 2), 'utf8');
fs.writeFileSync(enPath, JSON.stringify(updatedEn, null, 2), 'utf8');

console.log('✅ Translations updated successfully!');
