// Ad configuration for different pages and positions
export const AD_SLOTS = {
  // Computer Networks page
  CN_TOP_BANNER: '1234567890',
  CN_SIDEBAR: '1234567891', 
  CN_BOTTOM_BANNER: '1234567892',
  
  // Design & Analysis of Algorithms page
  DAA_TOP_BANNER: '1234567893',
  DAA_SIDEBAR: '1234567894',
  DAA_BOTTOM_BANNER: '1234567895',
  
  // Operating Systems page
  OS_TOP_BANNER: '1234567896',
  OS_SIDEBAR: '1234567897',
  OS_BOTTOM_BANNER: '1234567898',
  
  // Automata Theory page
  AUTO_TOP_BANNER: '1234567899',
  AUTO_SIDEBAR: '1234567900',
  AUTO_BOTTOM_BANNER: '1234567901',
  
  // Homepage
  HOME_HERO: '1234567902',
  HOME_SIDEBAR: '1234567903',
  HOME_FOOTER: '1234567904',
};

export const AD_CONFIG = {
  // Your AdSense publisher ID (get this from Google AdSense)
  PUBLISHER_ID: 'ca-pub-XXXXXXXXXXXXXXXX',
  
  // Ad refresh interval (in seconds) - don't make this too frequent
  REFRESH_INTERVAL: 30,
  
  // Minimum page view time before showing ads (in seconds)
  MIN_VIEW_TIME: 5,
  
  // Ad positions that perform best for educational content
  HIGH_PERFORMING_POSITIONS: [
    'top-banner',
    'sidebar',
    'in-content',
    'bottom-banner'
  ],
  
  // Revenue optimization settings
  REVENUE_SETTINGS: {
    // Show more ads to users from high-paying countries
    HIGH_VALUE_COUNTRIES: ['US', 'UK', 'CA', 'AU', 'DE'],
    
    // Limit ads for users from low-paying regions
    REDUCED_ADS_COUNTRIES: ['IN', 'BD', 'PK'],
    
    // Premium ad positions for returning users
    PREMIUM_POSITIONS_FOR_RETURNING: true,
  }
};

// Sponsored content opportunities
export const SPONSORED_OPPORTUNITIES = {
  // Educational platforms that might sponsor
  EDUCATION_SPONSORS: [
    'Udemy', 'Coursera', 'edX', 'Pluralsight', 
    'LinkedIn Learning', 'Skillshare'
  ],
  
  // Tech companies for algorithm/CS content
  TECH_SPONSORS: [
    'LeetCode', 'HackerRank', 'CodeChef', 
    'GeeksforGeeks', 'InterviewBit'
  ],
  
  // Book publishers
  BOOK_SPONSORS: [
    'O\'Reilly', 'Manning', 'Packt Publishing',
    'No Starch Press', 'Addison-Wesley'
  ],
  
  // Rate card for sponsored content
  RATES: {
    'sponsored-blog-post': '$500-1500',
    'banner-placement-month': '$200-800',
    'newsletter-mention': '$100-400',
    'course-review': '$300-1000'
  }
};
