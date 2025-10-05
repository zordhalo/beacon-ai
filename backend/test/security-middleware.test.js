/**
 * Security Middleware Test
 * Verifies that helmet, rate limiting, and request size limits are properly configured
 */
import dotenv from 'dotenv';
dotenv.config();

console.log('🔒 Testing Security Middleware Configuration...\n');

// Test 1: Verify index.js imports security middleware
console.log('1️⃣ Checking Security Middleware Imports...');
try {
  const fs = await import('fs');
  const indexContent = fs.readFileSync('./index.js', 'utf8');
  
  const hasHelmet = indexContent.includes('import helmet');
  const hasRateLimit = indexContent.includes('import rateLimit') || indexContent.includes('express-rate-limit');
  const hasRequestLimit = indexContent.includes("limit: '1mb'");
  
  if (hasHelmet) {
    console.log('✅ Helmet middleware imported');
  } else {
    console.log('❌ Helmet middleware NOT imported');
  }
  
  if (hasRateLimit) {
    console.log('✅ Rate limiting middleware imported');
  } else {
    console.log('❌ Rate limiting middleware NOT imported');
  }
  
  if (hasRequestLimit) {
    console.log('✅ Request size limit configured (1mb)');
  } else {
    console.log('❌ Request size limit NOT configured');
  }
  
  if (hasHelmet && hasRateLimit && hasRequestLimit) {
    console.log('\n✅ All security middleware properly configured!');
  } else {
    console.log('\n❌ Some security middleware is missing');
  }
} catch (error) {
  console.log('❌ Failed to verify security middleware:', error.message);
}

// Test 2: Verify middleware configuration
console.log('\n2️⃣ Checking Middleware Configuration...');
try {
  const fs = await import('fs');
  const indexContent = fs.readFileSync('./index.js', 'utf8');
  
  const hasHelmetUse = indexContent.includes('app.use(helmet())');
  const hasRateLimiterConfig = indexContent.includes('windowMs: 15 * 60 * 1000');
  const hasMaxRequests = indexContent.includes('max: 100');
  
  if (hasHelmetUse) {
    console.log('✅ Helmet properly applied to app');
  } else {
    console.log('❌ Helmet NOT properly applied');
  }
  
  if (hasRateLimiterConfig && hasMaxRequests) {
    console.log('✅ Rate limiter properly configured (100 requests per 15 minutes)');
  } else {
    console.log('❌ Rate limiter NOT properly configured');
  }
} catch (error) {
  console.log('❌ Failed to verify middleware configuration:', error.message);
}

console.log('\n🎉 Security middleware test completed!');
