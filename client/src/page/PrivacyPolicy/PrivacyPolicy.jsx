import React from "react";
import "./privacypolicy.scss";
const PrivacyPolicy = () => {
  return (
    <section className="privacy-policy">
      <div className="main-content">
        <div className="heading">Privacy Policy</div>
        <div className="text-content">
          <p className="text">Effective Date: June 5, 2024</p>
          <p className="text">
            Welcome to Mêmois! This Privacy Policy explains how Mêmois LLC
            ("we", "us", "our") collects, uses, and protects your personal
            information when you use our website, mobile application, and
            related services (collectively, the "Service").
          </p>
          <div className="sub-text">Information We Collect</div>

          <div className="sub-heading">Personal Information</div>
          <li className="text">
            <span>Account Information: </span>When you create an account, we
            collect your name, email address, username, and password.
          </li>
          <li className="text">
            <span>Profile Information: </span>You may choose to provide
            additional information such as your profile picture, location, and
            bio.
          </li>
          <li className="text">
            <span>Payment Information: </span>If you make purchases through the
            Service, we collect payment details such as credit card information.
          </li>
          <li className="text">
            <span>Communication:</span>We collect information when you
            communicate with us or other users through the Service, including
            messages and feedback.
          </li>

          <div className="sub-heading">Usage Information</div>
          <li className="text">
            <span>Log Data:</span>We automatically collect information about
            your device, browser, IP address, and usage of the Service.
          </li>
          <li className="text">
            <span>Cookies and Similar Technologies:</span> We use cookies and
            similar tracking technologies to enhance your experience and analyze
            usage patterns.
          </li>

          <div className="sub-text ">Content</div>
          <li className="text">
            <span>User Content: </span> Photos, videos, and other content you
            upload to the Service.
          </li>
          <li className="text">
            <span>Metadata:</span> Information associated with your content,
            such as timestamps and location data.
          </li>

          <div className="sub-text">How We Use Your Information</div>
          <div className="sub-heading">
            We use your information for the following purposes:
          </div>
          <li className="text">Providing and improving the Service.</li>
          <li className="text">
            Communicating with you, including customer support and
            notifications.
          </li>
          <li className="text">
            Personalizing your experience and content recommendations.
          </li>
          <li className="text">
            Analyzing usage trends and optimizing the Service.
          </li>
          <li className="text">Preventing fraud and ensuring security.</li>

          <div className="sub-text">Data Sharing and Disclosure</div>
          <div className="sub-heading">We may share your information with:</div>
          <li className="text">
            <span>Service Providers:</span> Third-party companies and
            individuals who help us operate, analyze, and improve the Service.
          </li>
          <li className="text">
            <span>Business Partners:</span>With your consent, we may share
            information with trusted business partners for promotional purposes.
          </li>
          <li className="text">
            <span>Legal Compliance: </span>We may disclose information when
            required by law or to protect our rights and safety.
          </li>

          <div className="sub-text">Data Retention and Security</div>
          <p className="text">
            We retain your information as long as necessary for the purposes
            outlined in this Privacy Policy. We implement security measures to
            protect your data, but no method of transmission over the internet
            or electronic storage is 100% secure.
          </p>

          <div className="sub-heading">Your Choices and Rights</div>
          <li className="text">
            <span>Account Settings: </span>You can update and manage your
            account information through the Service.
          </li>
          <li className="text">
            <span>Communication Preferences: </span>You can choose to opt out of
            certain communications.
          </li>
          <li className="text">
            <span>Access and Deletion: </span> You can request access to,
            correction of, or deletion of your personal information.
          </li>

          <div className="sub-text">Children's Privacy</div>
          <p className="text">
            The Service is not intended for children under 13. If you believe we
            have collected information from a child under 13, please contact us
            immediately.
          </p>

          <div className="sub-text">Changes to this Privacy Policy</div>
          <p className="text">
            We may update this Privacy Policy from time to time. We will notify
            you of significant changes through the Service or other means.
          </p>

          <div className="sub-text">Contact Us</div>
          <div className="text">
            If you have questions about this Privacy Policy or our data
            practices, please contact us at memois@gmail.com.
          </div>

          <p className="text">
            By using the Mêmois Service, you consent to the collection and use
            of your information as described in this Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PrivacyPolicy;
