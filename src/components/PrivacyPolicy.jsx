import React, { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';

const PrivacyPolicy = ({ isOpen, onClose }) => {
  const isNativeApp = Capacitor.isNativePlatform();
  const containerClass = isNativeApp ? 'container native-app' : 'container';

  useEffect(() => {
    // Dynamically render the email address for obfuscation
    const email = 'privacy' + '@' + 'atlasdiscoveryworkshop' + '.' + 'com';
    const el = document.getElementById('obfuscated-email');
    if (el) {
      el.textContent = email;
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="privacy-policy-overlay" onClick={onClose}>
      <div className="privacy-policy-content" onClick={(e) => e.stopPropagation()}>
        <div className="privacy-policy-header">
          <h2>Privacy Policy for Guessy Flaggy</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="privacy-policy-body">
          <p><strong>Effective Date:</strong> 19th June 2025</p>
          
          <p>This Privacy Policy describes how Atlas Discovery Workshop Pty Ltd ("we", "us", or "our") collects, uses, and discloses your information when you use our mobile application, Guessy Flaggy (the "Service").</p>

          <h3>1. Information We Collect</h3>
          <p>We collect several different types of information for various purposes to provide and improve our Service to you.</p>

          <h4>Types of Data Collected</h4>
          
          <h5>a) Personal Data</h5>
          <p>While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data"). Personally identifiable information may include, but is not limited to:</p>
          <ul>
            <li>Your name</li>
            <li>In-game achievements including scores</li>
            <li>Usage Data (see below)</li>
          </ul>

          <h5>b) Usage Data</h5>
          <p>We may also collect information about how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as game scores, difficulty levels selected, time spent playing the game, and anonymous analytics data to help us improve the app experience.</p>

          <h5>c) Advertising ID</h5>
          <p>Our app may access your device's advertising identifier (AAID/IDFA) for analytics purposes through Firebase Analytics. This helps us understand app usage patterns and improve the user experience. The advertising ID is used anonymously and is not linked to your personal information.</p>

          <h3>2. Use of Data</h3>
          <p>Atlas Discovery Workshop Pty Ltd uses the collected data for various purposes:</p>
          <ul>
            <li>To provide and maintain the Service</li>
            <li>To notify you about changes to our Service</li>
            <li>To allow you to participate in interactive features of our Service when you choose to do so</li>
            <li>To provide customer care and support</li>
            <li>To provide analysis or valuable information so that we can improve the Service</li>
            <li>To monitor the usage of the Service</li>
            <li>To detect, prevent and address technical issues</li>
            <li>To display leaderboard statistics</li>
          </ul>
          
          <h4>Content Filtering</h4>
          <p>To maintain a family-friendly environment, our app includes content filtering for player names on the leaderboard using the professional "bad-words" library. While all player names are stored in our database, names containing inappropriate content are displayed as "Anonymous Player" on the leaderboard. This filtering helps ensure a positive experience for all users while preserving the integrity of the leaderboard data.</p>

          <h3>3. Transfer Of Data</h3>
          <p>Your information, including Personal Data, may be transferred to — and maintained on — computers located outside of your state, province, country or other governmental jurisdiction where the data protection laws may differ than those from your jurisdiction.</p>
          
          <p>If you are located outside Australia and choose to provide information to us, please note that we transfer the data, including Personal Data, to Australia and process it there.</p>
          
          <p>Your consent to this Privacy Policy followed by your submission of such information represents your agreement to that transfer.</p>
          
          <p>Atlas Discovery Workshop Pty Ltd will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this Privacy Policy and no transfer of your Personal Data will take place to an organization or a country unless there are adequate controls in place including the security of your data and other personal information.</p>

          <h3>4. Disclosure Of Data</h3>
          
          <h5>a) Business Transaction</h5>
          <p>If Atlas Discovery Workshop Pty Ltd is involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.</p>

          <h5>b) Legal Requirements</h5>
          <p>Atlas Discovery Workshop Pty Ltd may disclose your Personal Data in the good faith belief that such action is necessary to:</p>
          <ul>
            <li>To comply with a legal obligation</li>
            <li>To protect and defend the rights or property of Atlas Discovery Workshop Pty Ltd</li>
            <li>To prevent or investigate possible wrongdoing in connection with the Service</li>
            <li>To protect the personal safety of users of the Service or the public</li>
            <li>To protect against legal liability</li>
          </ul>

          <h3>5. Security Of Data</h3>
          <p>The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.</p>

          <h3>6. Cookies and Tracking Technologies</h3>
          <p>Our app does not use cookies or similar tracking technologies. We use local storage only to backup high scores when our database is temporarily unavailable.</p>

          <h3>7. Service Providers</h3>
          <p>We may employ third party companies and individuals to facilitate our Service ("Service Providers"), to provide the Service on our behalf, to perform Service-related services or to assist us in analyzing how our Service is used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</p>

          <ul>
            <li><strong>Supabase:</strong> We use Supabase to store and manage high scores and player data. Supabase's privacy policy can be found at <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">https://supabase.com/privacy</a>.</li>
            <li><strong>FlagCDN:</strong> We use FlagCDN (flagcdn.com) to display flag images in our game. This service receives country codes to provide the appropriate flag images.</li>
            <li><strong>Vercel:</strong> Our web application is hosted on Vercel. Vercel's privacy policy can be found at <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer">https://vercel.com/legal/privacy-policy</a>.</li>
            <li><strong>Firebase:</strong> We use Google Firebase for analytics and crash reporting. Firebase collects anonymous usage data, crash reports, and may access your device's advertising identifier to help us improve the app. Firebase's privacy policy can be found at <a href="https://firebase.google.com/support/privacy" target="_blank" rel="noopener noreferrer">https://firebase.google.com/support/privacy</a>.</li>
          </ul>

          <p>These third-party services have their own privacy policies, and we encourage you to review them. We do not control these third-party services and are not responsible for their privacy practices.</p>

          <h3>8. Links To Other Sites</h3>
          <p>Our Service may contain links to other sites that are not operated by us. If you click on a third party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit.</p>
          
          <p>We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services.</p>

          <h3>9. Children's Privacy</h3>
          <p>Our Service is not directed to, nor does it knowingly collect personal information from, children under the age of 13. If you are under 13, please do not use our Service or provide any personal information to us.</p>
          
          <p>If you are a parent or guardian and you believe that your child has provided us with Personal Data, please contact us. If we become aware that we have collected Personal Data from children without verification of parental consent, we take steps to remove that information from our servers. We encourage parents and guardians to monitor their children's online activity and to use parental control tools available from online services and software providers to help create a child-friendly online environment.</p>

          <h3>10. Changes To This Privacy Policy</h3>
          <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.</p>
          
          <p>You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.</p>

          <h3>11. Contact Us</h3>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <p>
            By email: <span id="obfuscated-email"></span>
            <noscript>privacy [at] atlasdiscoveryworkshop [dot] com</noscript>
          </p>
        </div>

        <div className="privacy-policy-footer">
          <button className="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 