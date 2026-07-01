import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "./pricing.scss";

const pricingConfig = {
  billing: {
    discountLabel: "Save 20%",
  },
  tiers: [
    {
      id: "free",
      name: "Free",
      description: "For casual hosts getting started.",
      theme: "dark",
      price: { monthly: 0, yearly: 0 },
      cta: { label: "Get Started", variant: "ghost", to: "/signup" },
      badge: null,
    },
    {
      id: "pro",
      name: "Pro",
      description: "For creators running regular events.",
      theme: "light",
      price: { monthly: 12, yearly: 9.6 },
      cta: { label: "Upgrade Now", variant: "gradient", to: "/dashboard/billing" },
      badge: "Most Popular",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      description: "For teams that need custom scale.",
      theme: "dark",
      price: { monthly: null, yearly: null, label: "Custom" },
      cta: { label: "Contact Us", variant: "ghost", href: "mailto:support@memois.com" },
      badge: null,
    },
  ],
  features: [
    {
      id: "face",
      label: "Face recognition",
      values: {
        free: "100 scans",
        pro: "Unlimited",
        enterprise: "Unlimited",
      },
    },
    {
      id: "upload",
      label: "Photo/video uploads",
      values: {
        free: "2GB",
        pro: "100GB",
        enterprise: "Unlimited",
      },
    },
    {
      id: "events",
      label: "Event creation",
      values: {
        free: "3 events",
        pro: "Unlimited",
        enterprise: "Unlimited",
      },
    },
    {
      id: "storage",
      label: "Storage capacity",
      values: {
        free: "2GB",
        pro: "100GB",
        enterprise: "Custom",
      },
    },
    {
      id: "support",
      label: "Priority support",
      values: {
        free: false,
        pro: true,
        enterprise: true,
      },
    },
  ],
  allPlans: [
    { id: "ssl", label: "SSL security", icon: "bx-lock-alt" },
    { id: "uptime", label: "24/7 uptime", icon: "bx-timer" },
    { id: "mobile", label: "Mobile access", icon: "bx-mobile-alt" },
    { id: "sharing", label: "Private sharing", icon: "bx-share-alt" },
  ],
  faqs: [
    {
      id: "billing",
      question: "Can I switch plans anytime?",
      answer:
        "Yes. You can upgrade or downgrade at any time. Changes take effect immediately on your next billing cycle.",
    },
    {
      id: "yearly",
      question: "How does yearly billing work?",
      answer:
        "Yearly billing charges once per year and includes a 20% discount compared to monthly pricing.",
    },
    {
      id: "limits",
      question: "What happens if I hit my plan limits?",
      answer:
        "We’ll notify you when you’re close to a limit so you can upgrade or manage your usage.",
    },
    {
      id: "enterprise",
      question: "Do you offer custom enterprise plans?",
      answer:
        "Yes. We can tailor storage, usage, and support to your team’s needs.",
    },
    {
      id: "trial",
      question: "Is there a free trial for Pro?",
      answer:
        "Contact us and we’ll help you evaluate Memois with a tailored trial setup.",
    },
  ],
};

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(pricingConfig.faqs[0]?.id || null);

  const toggleBilling = () => {
    setBillingCycle((current) =>
      current === "monthly" ? "yearly" : "monthly"
    );
  };

  const pricingTiers = useMemo(
    () =>
      pricingConfig.tiers.map((tier) => {
        if (tier.price.label) {
          return { ...tier, displayPrice: tier.price.label };
        }
        const value =
          billingCycle === "monthly" ? tier.price.monthly : tier.price.yearly;
        return { ...tier, displayPrice: value };
      }),
    [billingCycle]
  );

  return (
    <section className="pricing-page">
      <div className="pricing-hero">
        <div className="pricing-hero-copy">
          <h1>
            Flexible pricing for every <span>event memory</span> team.
          </h1>
          <p>
            Start free, then scale to Pro or Enterprise when you’re ready for
            higher limits and dedicated support.
          </p>
        </div>
        <div className="billing-toggle">
          <span className={billingCycle === "monthly" ? "active" : ""}>
            Monthly
          </span>
          <button
            type="button"
            className={`toggle-switch ${
              billingCycle === "yearly" ? "is-yearly" : ""
            }`}
            onClick={toggleBilling}
            aria-label="Toggle yearly billing"
          >
            <span className="toggle-knob"></span>
          </button>
          <span className={billingCycle === "yearly" ? "active" : ""}>
            Yearly
          </span>
          {billingCycle === "yearly" && (
            <span className="billing-badge">{pricingConfig.billing.discountLabel}</span>
          )}
        </div>
      </div>

      <div className="pricing-grid">
        {pricingTiers.map((tier) => (
          <article
            key={tier.id}
            className={`pricing-card ${tier.theme} ${
              tier.id === "pro" ? "highlight" : ""
            }`}
          >
            {tier.badge && <div className="pricing-badge">{tier.badge}</div>}
            <div className="card-header">
              <h2>{tier.name}</h2>
              <p>{tier.description}</p>
            </div>
            <div className="card-price">
              {typeof tier.displayPrice === "number" ? (
                <>
                  <span className="price-value">${tier.displayPrice}</span>
                  <span className="price-cycle">
                    /{billingCycle === "monthly" ? "month" : "month"}
                  </span>
                </>
              ) : (
                <span className="price-value">{tier.displayPrice}</span>
              )}
            </div>
            {tier.cta.href ? (
              <a
                className={`card-cta ${tier.cta.variant}`}
                href={tier.cta.href}
              >
                {tier.cta.label}
              </a>
            ) : (
              <Link
                className={`card-cta ${tier.cta.variant}`}
                to={tier.cta.to}
              >
                {tier.cta.label}
              </Link>
            )}
            <ul className="feature-list">
              {pricingConfig.features.map((feature) => {
                const value = feature.values[tier.id];
                const available = value !== false;
                return (
                  <li
                    key={feature.id}
                    className={available ? "" : "muted"}
                  >
                    <span className="check">
                      {available ? "✅" : "❌"}
                    </span>
                    <span className="feature-text">
                      {feature.label}
                      {available && typeof value === "string" && (
                        <span className="feature-value"> · {value}</span>
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          </article>
        ))}
      </div>

      <div className="pricing-faq">
        <div className="faq-header">
          <h2>Frequently asked questions</h2>
          <p>Everything you need to know about plans and billing.</p>
        </div>
        <div className="faq-list">
          {pricingConfig.faqs.map((faq) => {
            const isOpen = openFaq === faq.id;
            return (
              <button
                key={faq.id}
                type="button"
                className={`faq-item ${isOpen ? "open" : ""}`}
                onClick={() => setOpenFaq(isOpen ? null : faq.id)}
              >
                <div className="faq-question">
                  <span>{faq.question}</span>
                  <i className={`bx ${isOpen ? "bx-minus" : "bx-plus"}`}></i>
                </div>
                {isOpen && <div className="faq-answer">{faq.answer}</div>}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
