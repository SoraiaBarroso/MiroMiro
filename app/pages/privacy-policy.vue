<script setup lang="ts">
// SEO Meta
const { setSeoMeta, setBreadcrumbs } = useSeo()

setSeoMeta({
  title: 'Privacy Policy',
  description: 'MiroMiro Privacy Policy. Learn how we collect, use, and protect your data. GDPR and CCPA compliant. We never sell your personal information.',
  keywords: ['privacy policy', 'data protection', 'gdpr', 'ccpa', 'miromiro privacy']
})

setBreadcrumbs([
  { name: 'Home', url: '/' },
  { name: 'Privacy Policy', url: '/privacy-policy' }
])
</script>

<template>
    <UPage>
        <UPageSection
            :ui="{container: '!gap-4 max-w-4xl'}"
        >
                <h1 class="text-highlighted font-semibold text-3xl">Privacy Policy for MiroMiro</h1>
                <p><strong>Last Updated:</strong> January 20, 2025</p>

                <h2 class="text-highlighted font-semibold text-2xl">Introduction</h2>
                <p>MiroMiro ("we", "our", or "us") is a Chrome browser extension that helps designers and developers capture and download visual assets from websites. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our extension.</p>

                <h2 class="text-highlighted font-semibold text-2xl">Information We Collect</h2>

                <h3 class="text-highlighted font-semibold text-xl">Personal Information</h3>
                <p>When you use MiroMiro, we may collect the following personal information:</p>
                <ul>
                    <li><strong>Authentication Information</strong>: Email address, name, and profile information obtained through OAuth authentication providers (Google, GitHub, etc.)</li>
                    <li><strong>Account Data</strong>: User ID, authentication tokens (access and refresh tokens), and session data</li>
                    <li><strong>Usage Metrics</strong>: Asset extraction counts, contrast check counts, Lottie extraction counts, and design system extraction counts to enforce usage limits based on your subscription tier</li>
                </ul>

                <h3 class="text-highlighted font-semibold text-xl">Automatically Collected Information</h3>
                <ul>
                    <li><strong>Web Browsing Data</strong>: URLs of websites you visit while the extension is active, used to capture and catalog network resources (images, fonts, videos, stylesheets)</li>
                    <li><strong>Captured Content</strong>: Visual assets (images, SVGs, fonts, videos), color palettes, typography information, and DOM elements that you choose to capture using the extension</li>
                    <li><strong>Technical Data</strong>: Browser type, extension version, and error logs for debugging purposes</li>
                </ul>

                <h2 class="text-highlighted font-semibold text-2xl">How We Use Your Information</h2>
                <p>We use the collected information for the following purposes:</p>
                <ol>
                    <li><strong>Authentication & Account Management</strong>: To create and manage your account, maintain your session, and verify your identity</li>
                    <li><strong>Core Functionality</strong>: To enable asset capture, inspector mode, and download features</li>
                    <li><strong>Usage Limits & Billing</strong>: To track your usage against subscription tier limits (Free, Starter, Pro) and manage premium features</li>
                    <li><strong>Service Improvement</strong>: To analyze usage patterns, fix bugs, and improve the extension's performance</li>
                    <li><strong>Customer Support</strong>: To respond to your inquiries and provide technical assistance</li>
                    <li><strong>Legal Compliance</strong>: To comply with applicable laws, regulations, and legal processes</li>
                </ol>

                <h2 class="text-highlighted font-semibold text-2xl">Data Storage and Security</h2>
                <ul>
                    <li><strong>Storage Provider</strong>: Your data is stored securely using Supabase, a trusted backend-as-a-service provider</li>
                    <li><strong>Local Storage</strong>: Authentication tokens and session data are stored locally in your browser using Chrome's storage API</li>
                    <li><strong>Security Measures</strong>: We implement industry-standard security measures including encryption for data transmission (HTTPS/WSS), secure token storage, and access controls</li>
                    <li><strong>Data Retention</strong>: We retain your personal information for as long as your account is active or as needed to provide you services. You may request deletion of your account at any time</li>
                </ul>

                <h2 class="text-highlighted font-semibold text-2xl">Data Sharing and Disclosure</h2>
                <p>We do NOT sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
                <ul>
                    <li><strong>Service Providers</strong>: With Supabase (backend infrastructure) to provide core functionality</li>
                    <li><strong>Legal Requirements</strong>: When required by law, court order, or government regulation</li>
                    <li><strong>Business Transfers</strong>: In connection with any merger, sale of company assets, or acquisition (users will be notified)</li>
                    <li><strong>With Your Consent</strong>: When you explicitly authorize us to share specific information</li>
                </ul>

                <h2 class="text-highlighted font-semibold text-2xl">Your Rights and Choices</h2>
                <p>Depending on your location, you may have the following rights:</p>

                <h3 class="text-highlighted font-semibold text-xl">General Rights</h3>
                <ul>
                    <li><strong>Access</strong>: Request a copy of the personal information we hold about you</li>
                    <li><strong>Correction</strong>: Request correction of inaccurate or incomplete information</li>
                    <li><strong>Deletion</strong>: Request deletion of your account and associated data</li>
                    <li><strong>Opt-Out</strong>: Disable the extension or uninstall it at any time</li>
                    <li><strong>Data Portability</strong>: Request your data in a structured, machine-readable format</li>
                </ul>

                <h3 class="text-highlighted font-semibold text-xl">How to Exercise Your Rights</h3>
                <p>To exercise any of these rights, please contact us at sorilc@hotmail.com. We will respond to your request within 30 days.</p>

                <h2 class="text-highlighted font-semibold text-2xl">GDPR Compliance (European Users)</h2>
                <p>If you are located in the European Economic Area (EEA), you have additional rights under the General Data Protection Regulation (GDPR):</p>
                <ul>
                    <li><strong>Legal Basis for Processing</strong>: We process your data based on (1) your consent, (2) contract performance, or (3) legitimate business interests</li>
                    <li><strong>Right to Object</strong>: You may object to processing based on legitimate interests</li>
                    <li><strong>Right to Lodge a Complaint</strong>: You may file a complaint with your local data protection authority</li>
                    <li><strong>Data Transfers</strong>: Your data may be transferred to and processed in countries outside the EEA. We ensure adequate safeguards are in place</li>
                </ul>

                <h2 class="text-highlighted font-semibold text-2xl">CCPA/CPRA Compliance (California Users)</h2>
                <p>If you are a California resident, you have rights under the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA):</p>
                <ul>
                    <li><strong>Right to Know</strong>: What personal information we collect, use, disclose, and sell</li>
                    <li><strong>Right to Delete</strong>: Request deletion of your personal information</li>
                    <li><strong>Right to Opt-Out</strong>: We do NOT sell your personal information</li>
                    <li><strong>Right to Non-Discrimination</strong>: We will not discriminate against you for exercising your privacy rights</li>
                    <li><strong>Shine the Light</strong>: Request information about data shared with third parties for their direct marketing purposes</li>
                </ul>
                <p><strong>California Privacy Notice</strong>: In the past 12 months, we have collected the following categories of personal information: identifiers (email, name, user ID), internet activity (browsing history, captured content), and usage data. We do not sell personal information.</p>

                <h2 class="text-highlighted font-semibold text-2xl">CalOPPA Compliance</h2>
                <p>In accordance with the California Online Privacy Protection Act (CalOPPA):</p>
                <ul>
                    <li>We do not track users across third-party websites and therefore do not respond to Do Not Track (DNT) signals</li>
                    <li>Third parties cannot collect personally identifiable information about your online activities over time and across different websites when you use our extension</li>
                </ul>

                <h2 class="text-highlighted font-semibold text-2xl">Children's Privacy (COPPA)</h2>
                <p>MiroMiro is not intended for use by children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that we have collected information from a child under 13, we will delete it immediately. If you believe we have collected information from a child under 13, please contact us.</p>

                <h2 class="text-highlighted font-semibold text-2xl">Third-Party Services</h2>
                <p>Our extension integrates with the following third-party services:</p>
                <ul>
                    <li><strong>Supabase</strong>: Backend infrastructure and authentication (<a href="https://supabase.com/privacy">Supabase Privacy Policy</a>)</li>
                    <li><strong>OAuth Providers</strong>: Google, GitHub, or other authentication providers you choose to use</li>
                </ul>
                <p>These third parties have their own privacy policies governing their use of your information.</p>

                <h2 class="text-highlighted font-semibold text-2xl">Cookies and Tracking Technologies</h2>
                <p>MiroMiro uses local browser storage (chrome.storage API) to store authentication tokens and user preferences. We do not use cookies or third-party tracking technologies for advertising or analytics purposes.</p>

                <h2 class="text-highlighted font-semibold text-2xl">Changes to This Privacy Policy</h2>
                <p>We may update this Privacy Policy from time to time. We will notify you of any material changes by:</p>
                <ul>
                    <li>Updating the "Last Updated" date at the top of this policy</li>
                    <li>Displaying a notification in the extension (for significant changes)</li>
                    <li>Sending an email to your registered email address (for material changes)</li>
                </ul>
                <p>Your continued use of MiroMiro after changes are posted constitutes your acceptance of the revised Privacy Policy.</p>

                <h2 class="text-highlighted font-semibold text-2xl">International Data Transfers</h2>
                <p>Your information may be transferred to and processed in countries other than your country of residence. These countries may have data protection laws that differ from your jurisdiction. We ensure appropriate safeguards are in place to protect your information in accordance with this Privacy Policy.</p>

                <h2 class="text-highlighted font-semibold text-2xl">Contact Us</h2>
                <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
                <p><strong>Email</strong>: sorilc@hotmail.com</p>
                <hr>

                <h2 class="text-highlighted font-semibold text-2xl">Summary of Your Privacy Rights</h2>
                <p><strong>You have the right to:</strong></p>
                <ul>
                    <li>Know what data we collect and how we use it</li>
                    <li>Access your personal information</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Opt-out of data collection by uninstalling the extension</li>
                    <li>Not be discriminated against for exercising your rights</li>
                </ul>

                <p><strong>We commit to:</strong></p>
                <ul>
                    <li>Never sell your personal information</li>
                    <li>Use your data only for the extension's core functionality</li>
                    <li>Protect your data with industry-standard security measures</li>
                    <li>Respect your privacy choices</li>
                    <li>Be transparent about our data practices</li>
                </ul>

                <p>Thank you for trusting MiroMiro with your information.</p>
        </UPageSection>
    </UPage>
</template>