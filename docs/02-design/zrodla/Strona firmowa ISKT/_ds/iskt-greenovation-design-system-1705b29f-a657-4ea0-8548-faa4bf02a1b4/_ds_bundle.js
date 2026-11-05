/* @ds-bundle: {"format":4,"namespace":"ISKTGreenovationDesignSystem_1705b2","components":[{"name":"Icon","sourcePath":"components/brand/Icon.jsx"},{"name":"Logo","sourcePath":"components/brand/Logo.jsx"},{"name":"Badge","sourcePath":"components/content/Badge.jsx"},{"name":"Card","sourcePath":"components/content/Card.jsx"},{"name":"SectionHeading","sourcePath":"components/content/SectionHeading.jsx"},{"name":"ServiceCard","sourcePath":"components/content/ServiceCard.jsx"},{"name":"StatCard","sourcePath":"components/content/StatCard.jsx"},{"name":"Tag","sourcePath":"components/content/Tag.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Textarea","sourcePath":"components/forms/Textarea.jsx"}],"sourceHashes":{"components/brand/Icon.jsx":"afe309f609d5","components/brand/Logo.jsx":"ae9de105afa4","components/content/Badge.jsx":"7cee07faea1a","components/content/Card.jsx":"1e1150454b43","components/content/SectionHeading.jsx":"1812e2f74a79","components/content/ServiceCard.jsx":"f57cf9b4ddd3","components/content/StatCard.jsx":"ce5cf4f09b87","components/content/Tag.jsx":"f3444bcf6f82","components/forms/Button.jsx":"00adb23a0c06","components/forms/Checkbox.jsx":"54a27e1c9cb0","components/forms/IconButton.jsx":"5f49d4fcb73b","components/forms/Input.jsx":"0610c52b018e","components/forms/Radio.jsx":"f8e71b532b42","components/forms/Select.jsx":"53b3c8c4899f","components/forms/Switch.jsx":"fc6f749958c0","components/forms/Textarea.jsx":"8909ddbb7e4f","ui_kits/website/About.jsx":"ee7b992a0b93","ui_kits/website/Contact.jsx":"65735bda441c","ui_kits/website/Footer.jsx":"bbdf6708717b","ui_kits/website/Hero.jsx":"8dc1ab520149","ui_kits/website/Nav.jsx":"55de3abd86f3","ui_kits/website/Services.jsx":"3794cdd65d45","ui_kits/website/WhyUs.jsx":"2c94a9949e01"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ISKTGreenovationDesignSystem_1705b2 = window.ISKTGreenovationDesignSystem_1705b2 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/brand/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Icon — thin wrapper around Lucide (the icon set used across the ISKT site).
 * Requires the Lucide UMD script on the page:
 *   <script src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js"></script>
 * Renders <i data-lucide="name"> and asks Lucide to swap it for an inline SVG.
 */
function Icon({
  name,
  size = 20,
  color = 'currentColor',
  strokeWidth = 2,
  style = {},
  ...rest
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (window.lucide && window.lucide.createIcons) window.lucide.createIcons();
  });
  return /*#__PURE__*/React.createElement("i", _extends({
    ref: ref,
    "data-lucide": name,
    style: {
      display: 'inline-flex',
      width: size,
      height: size,
      color,
      ...style
    },
    "data-icon-stroke": strokeWidth
  }, rest));
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Icon.jsx", error: String((e && e.message) || e) }); }

// components/brand/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Logo — the ISKT brand mark. Pass `src` (path to the copied
 * assets/iskt-logo-transparent.png) to render the real globe mark; otherwise a
 * typographic "ISKT" wordmark in brand green is shown as a safe fallback.
 */
function Logo({
  src,
  height = 40,
  showText = true,
  // when using the image mark, also show "ISKT" text
  color,
  // wordmark colour override
  onDark = false,
  style = {},
  ...rest
}) {
  const textColor = color || (onDark ? '#fff' : 'var(--green-700)');
  const wordmark = /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: height * 0.62,
      letterSpacing: '-0.02em',
      lineHeight: 1,
      color: textColor
    }
  }, "ISKT");
  if (!src) {
    return /*#__PURE__*/React.createElement("span", _extends({
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        ...style
      }
    }, rest), wordmark);
  }
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("img", {
    src: src,
    alt: "ISKT Greenovation",
    style: {
      height,
      width: 'auto',
      display: 'block'
    }
  }), showText && wordmark);
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/brand/Logo.jsx", error: String((e && e.message) || e) }); }

// components/content/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Badge — small status/label pill. Solid or soft (tinted) tone. */
function Badge({
  children,
  tone = 'green',
  soft = true,
  style = {},
  ...rest
}) {
  const tones = {
    green: {
      solid: ['#fff', 'var(--green-700)'],
      soft: ['var(--green-800)', 'var(--green-100)']
    },
    lime: {
      solid: ['#fff', 'var(--green-500)'],
      soft: ['var(--green-800)', 'var(--green-50)']
    },
    neutral: {
      solid: ['#fff', 'var(--neutral-700)'],
      soft: ['var(--neutral-700)', 'var(--neutral-200)']
    },
    success: {
      solid: ['#fff', 'var(--success-500)'],
      soft: ['var(--success-500)', 'var(--success-50)']
    },
    warning: {
      solid: ['#fff', 'var(--warning-500)'],
      soft: ['#8a6408', 'var(--warning-50)']
    },
    error: {
      solid: ['#fff', 'var(--error-500)'],
      soft: ['var(--error-500)', 'var(--error-50)']
    },
    info: {
      solid: ['#fff', 'var(--info-500)'],
      soft: ['var(--info-500)', 'var(--info-50)']
    }
  };
  const [color, bg] = (tones[tone] || tones.green)[soft ? 'soft' : 'solid'];
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.25rem 0.65rem',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-xs)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-wide)',
      lineHeight: 1.4,
      color,
      background: bg,
      whiteSpace: 'nowrap',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Badge.jsx", error: String((e && e.message) || e) }); }

// components/content/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Card — surface container. Soft radius, subtle border + shadow; lifts on hover when interactive. */
function Card({
  children,
  variant = 'default',
  // 'default' | 'subtle' | 'brand' | 'dark' | 'outline'
  padding = 'md',
  // 'sm' | 'md' | 'lg'
  interactive = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const pads = {
    sm: 'var(--space-5)',
    md: 'var(--space-8)',
    lg: 'var(--space-10)'
  };
  const variants = {
    default: {
      background: 'var(--surface-card)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)'
    },
    subtle: {
      background: 'var(--surface-subtle)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-subtle)'
    },
    brand: {
      background: 'var(--surface-muted)',
      color: 'var(--text-primary)',
      border: '1px solid var(--green-200)'
    },
    dark: {
      background: 'var(--ink-900)',
      color: 'var(--text-on-dark)',
      border: '1px solid var(--ink-700)'
    },
    outline: {
      background: 'transparent',
      color: 'var(--text-primary)',
      border: '1.5px solid var(--border-default)'
    }
  };
  const v = variants[variant] || variants.default;
  return /*#__PURE__*/React.createElement("div", _extends({
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      ...v,
      padding: pads[padding] || pads.md,
      borderRadius: 'var(--radius-lg)',
      boxShadow: interactive && hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: interactive && hover ? 'translateY(-4px)' : 'none',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      cursor: interactive ? 'pointer' : 'default',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Card.jsx", error: String((e && e.message) || e) }); }

// components/content/SectionHeading.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** SectionHeading — eyebrow + title + subtitle block that opens each page section. */
function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  onDark = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-3)',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      maxWidth: align === 'center' ? '720px' : 'none',
      marginInline: align === 'center' ? 'auto' : 0,
      ...style
    }
  }, rest), eyebrow && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-semibold)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: onDark ? 'var(--green-300)' : 'var(--green-600)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 2,
      background: 'currentColor',
      borderRadius: 2
    }
  }), eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: 'var(--text-3xl)',
      fontWeight: 'var(--fw-extrabold)',
      letterSpacing: 'var(--ls-tight)',
      lineHeight: 'var(--lh-tight)',
      color: onDark ? 'var(--text-on-dark)' : 'var(--text-primary)'
    }
  }, title), subtitle && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--lh-relaxed)',
      color: onDark ? 'var(--neutral-300)' : 'var(--text-secondary)'
    }
  }, subtitle));
}
Object.assign(__ds_scope, { SectionHeading });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/SectionHeading.jsx", error: String((e && e.message) || e) }); }

// components/content/ServiceCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ServiceCard — the "Nasze Kompetencje" tile: rounded icon chip, title, description.
 * Lifts and the icon chip fills green on hover. Pass a Lucide icon as `icon`.
 */
function ServiceCard({
  icon,
  title,
  description,
  href,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", _extends({
    href: href || '#',
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)',
      padding: 'var(--space-8)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--surface-card)',
      border: '1px solid var(--border-subtle)',
      boxShadow: hover ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
      transform: hover ? 'translateY(-4px)' : 'none',
      textDecoration: 'none',
      color: 'inherit',
      transition: 'box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-base) var(--ease-standard)',
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 'var(--radius-md)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: hover ? 'var(--green-700)' : 'var(--green-50)',
      color: hover ? '#fff' : 'var(--green-700)',
      transition: 'background var(--dur-base) var(--ease-standard), color var(--dur-base) var(--ease-standard)'
    }
  }, icon), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontSize: 'var(--text-xl)',
      fontWeight: 'var(--fw-bold)',
      letterSpacing: 'var(--ls-tight)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-base)',
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, description));
}
Object.assign(__ds_scope, { ServiceCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/ServiceCard.jsx", error: String((e && e.message) || e) }); }

// components/content/StatCard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** StatCard — big number + label, as on the ISKT "Kim jesteśmy?" band (100+, 50+, 15+, 24/7). */
function StatCard({
  value,
  label,
  align = 'center',
  onDark = false,
  style = {},
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.25rem',
      alignItems: align === 'center' ? 'center' : 'flex-start',
      textAlign: align,
      ...style
    }
  }, rest), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'var(--font-sans)',
      fontWeight: 'var(--fw-extrabold)',
      fontSize: 'var(--text-4xl)',
      lineHeight: 1,
      letterSpacing: 'var(--ls-tighter)',
      color: onDark ? 'var(--green-300)' : 'var(--green-700)'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      letterSpacing: 'var(--ls-wide)',
      color: onDark ? 'var(--neutral-300)' : 'var(--text-secondary)'
    }
  }, label));
}
Object.assign(__ds_scope, { StatCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/StatCard.jsx", error: String((e && e.message) || e) }); }

// components/content/Tag.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Tag — outlined chip for categories/filters, optionally removable. */
function Tag({
  children,
  onRemove,
  active = false,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.4rem',
      padding: '0.35rem 0.8rem',
      borderRadius: 'var(--radius-pill)',
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      color: active ? '#fff' : 'var(--green-800)',
      background: active ? 'var(--green-700)' : hover ? 'var(--green-50)' : 'transparent',
      border: `1.5px solid ${active ? 'var(--green-700)' : 'var(--green-200)'}`,
      cursor: 'pointer',
      transition: 'background var(--dur-fast) var(--ease-standard)',
      ...style
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, rest), children, onRemove && /*#__PURE__*/React.createElement("button", {
    onClick: e => {
      e.stopPropagation();
      onRemove(e);
    },
    "aria-label": "Usu\u0144",
    style: {
      border: 'none',
      background: 'transparent',
      cursor: 'pointer',
      padding: 0,
      lineHeight: 0,
      color: 'inherit',
      display: 'inline-flex',
      opacity: 0.7
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }))));
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Tag.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * ISKT Button — primary action control. Pill-ish radius, forest-green primary,
 * leaf-lime and outline/ghost variants. Fully self-contained (inline styles + token vars).
 */
function Button({
  children,
  variant = 'primary',
  // 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  iconLeft = null,
  iconRight = null,
  fullWidth = false,
  disabled = false,
  type = 'button',
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [active, setActive] = React.useState(false);
  const sizes = {
    sm: {
      padding: '0.5rem 1rem',
      fontSize: 'var(--text-sm)',
      gap: '0.4rem',
      height: '38px'
    },
    md: {
      padding: '0.7rem 1.4rem',
      fontSize: 'var(--text-base)',
      gap: '0.5rem',
      height: '46px'
    },
    lg: {
      padding: '0.95rem 1.9rem',
      fontSize: 'var(--text-lg)',
      gap: '0.6rem',
      height: '56px'
    }
  };
  const palettes = {
    primary: {
      bg: 'var(--green-700)',
      bgHover: 'var(--green-800)',
      color: '#fff',
      border: '1px solid var(--green-700)',
      shadow: 'var(--shadow-brand)'
    },
    secondary: {
      bg: 'var(--green-500)',
      bgHover: 'var(--green-600)',
      color: '#fff',
      border: '1px solid var(--green-500)',
      shadow: 'var(--shadow-sm)'
    },
    outline: {
      bg: 'transparent',
      bgHover: 'var(--green-50)',
      color: 'var(--green-700)',
      border: '1.5px solid var(--green-700)',
      shadow: 'none'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--green-50)',
      color: 'var(--green-700)',
      border: '1px solid transparent',
      shadow: 'none'
    },
    dark: {
      bg: 'var(--ink-900)',
      bgHover: 'var(--ink-700)',
      color: '#fff',
      border: '1px solid var(--ink-900)',
      shadow: 'var(--shadow-md)'
    }
  };
  const p = palettes[variant] || palettes.primary;
  const s = sizes[size] || sizes.md;
  const st = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s.gap,
    height: s.height,
    padding: s.padding,
    fontFamily: 'var(--font-sans)',
    fontSize: s.fontSize,
    fontWeight: 'var(--fw-semibold)',
    letterSpacing: 'var(--ls-tight)',
    lineHeight: 1,
    color: p.color,
    background: hover && !disabled ? p.bgHover : p.bg,
    border: p.border,
    borderRadius: 'var(--radius-pill)',
    boxShadow: hover && !disabled ? p.shadow : p.shadow === 'none' ? 'none' : 'var(--shadow-xs)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    width: fullWidth ? '100%' : 'auto',
    transform: active && !disabled ? 'translateY(1px) scale(0.99)' : 'none',
    transition: 'background var(--dur-fast) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
    ...style
  };
  return /*#__PURE__*/React.createElement("button", _extends({
    type: type,
    disabled: disabled,
    onClick: onClick,
    style: st,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => {
      setHover(false);
      setActive(false);
    },
    onMouseDown: () => setActive(true),
    onMouseUp: () => setActive(false)
  }, rest), iconLeft, children, iconRight);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Checkbox — custom-styled box with a leaf-green checked state. */
function Checkbox({
  label,
  checked,
  defaultChecked,
  disabled = false,
  id,
  onChange,
  style = {},
  ...rest
}) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: 'var(--radius-xs)',
      border: `1.5px solid ${isChecked ? 'var(--green-700)' : 'var(--border-strong)'}`,
      background: isChecked ? 'var(--green-700)' : 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background var(--dur-fast) var(--ease-standard), border-color var(--dur-fast) var(--ease-standard)'
    }
  }, isChecked && /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#fff",
    strokeWidth: "3.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "20 6 9 17 4 12"
  }))), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    checked: isChecked,
    disabled: disabled,
    onChange: e => {
      if (checked === undefined) setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * IconButton — square, icon-only control (nav toggles, close, scroll-to-top).
 * Pass a Lucide icon (or any node) as children.
 */
function IconButton({
  children,
  variant = 'primary',
  // 'primary' | 'outline' | 'ghost' | 'dark'
  size = 'md',
  // 'sm' | 'md' | 'lg'
  round = false,
  // pill/circle vs soft-square
  disabled = false,
  ariaLabel,
  onClick,
  style = {},
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const dims = {
    sm: 36,
    md: 44,
    lg: 52
  }[size] || 44;
  const palettes = {
    primary: {
      bg: 'var(--green-700)',
      bgHover: 'var(--green-800)',
      color: '#fff',
      border: '1px solid var(--green-700)'
    },
    outline: {
      bg: 'transparent',
      bgHover: 'var(--green-50)',
      color: 'var(--green-700)',
      border: '1.5px solid var(--border-default)'
    },
    ghost: {
      bg: 'transparent',
      bgHover: 'var(--green-50)',
      color: 'var(--green-700)',
      border: '1px solid transparent'
    },
    dark: {
      bg: 'var(--ink-900)',
      bgHover: 'var(--ink-700)',
      color: '#fff',
      border: '1px solid var(--ink-900)'
    }
  };
  const p = palettes[variant] || palettes.primary;
  return /*#__PURE__*/React.createElement("button", _extends({
    "aria-label": ariaLabel,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: dims,
      height: dims,
      color: p.color,
      background: hover && !disabled ? p.bgHover : p.bg,
      border: p.border,
      borderRadius: round ? 'var(--radius-pill)' : 'var(--radius-md)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      transition: 'background var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard)',
      ...style
    }
  }, rest), children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Input — labelled text field with optional leading icon, hint & error. */
function Input({
  label,
  hint,
  error,
  id,
  type = 'text',
  placeholder,
  value,
  defaultValue,
  iconLeft = null,
  disabled = false,
  required = false,
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--error-500)' : focus ? 'var(--green-600)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)',
      color: 'var(--text-primary)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-500)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.55rem',
      background: disabled ? 'var(--neutral-100)' : 'var(--surface-card)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      padding: '0 0.9rem',
      height: '46px',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, iconLeft && /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      color: 'var(--neutral-500)'
    }
  }, iconLeft), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: type,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      flex: 1,
      border: 'none',
      outline: 'none',
      background: 'transparent',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      height: '100%'
    }
  }, rest))), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--error-500)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Radio — single option in a group. Use `name` to group. */
function Radio({
  label,
  checked,
  defaultChecked,
  disabled = false,
  id,
  name,
  value,
  onChange,
  style = {},
  ...rest
}) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const isChecked = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.6rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 20,
      height: 20,
      flexShrink: 0,
      borderRadius: '50%',
      border: `1.5px solid ${isChecked ? 'var(--green-700)' : 'var(--border-strong)'}`,
      background: 'var(--surface-card)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'border-color var(--dur-fast) var(--ease-standard)'
    }
  }, isChecked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: '50%',
      background: 'var(--green-700)'
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "radio",
    name: name,
    value: value,
    checked: isChecked,
    disabled: disabled,
    onChange: e => {
      if (checked === undefined) setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Select — native dropdown styled to match Input, with a leaf-green chevron. */
function Select({
  label,
  hint,
  error,
  id,
  value,
  defaultValue,
  disabled = false,
  required = false,
  options = [],
  placeholder,
  onChange,
  style = {},
  children,
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--error-500)' : focus ? 'var(--green-600)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-500)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("select", _extends({
    id: inputId,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      height: '46px',
      padding: '0 2.4rem 0 0.9rem',
      appearance: 'none',
      WebkitAppearance: 'none',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      background: disabled ? 'var(--neutral-100)' : 'var(--surface-card)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, rest), placeholder && /*#__PURE__*/React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder), options.map(o => {
    const val = typeof o === 'string' ? o : o.value;
    const lbl = typeof o === 'string' ? o : o.label;
    return /*#__PURE__*/React.createElement("option", {
      key: val,
      value: val
    }, lbl);
  }), children), /*#__PURE__*/React.createElement("span", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      right: '0.9rem',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: 'var(--green-600)',
      fontSize: '0.7rem'
    }
  }, "\u25BE")), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--error-500)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Switch — on/off toggle. Green track when on. */
function Switch({
  label,
  checked,
  defaultChecked,
  disabled = false,
  id,
  onChange,
  style = {},
  ...rest
}) {
  const inputId = id || React.useId();
  const [internal, setInternal] = React.useState(!!defaultChecked);
  const on = checked !== undefined ? checked : internal;
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.65rem',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      width: 44,
      height: 26,
      borderRadius: 'var(--radius-pill)',
      flexShrink: 0,
      background: on ? 'var(--green-600)' : 'var(--neutral-300)',
      transition: 'background var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      top: 3,
      left: on ? 21 : 3,
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transition: 'left var(--dur-base) var(--ease-out)'
    }
  })), /*#__PURE__*/React.createElement("input", _extends({
    id: inputId,
    type: "checkbox",
    role: "switch",
    checked: on,
    disabled: disabled,
    onChange: e => {
      if (checked === undefined) setInternal(e.target.checked);
      onChange && onChange(e);
    },
    style: {
      position: 'absolute',
      opacity: 0,
      width: 0,
      height: 0
    }
  }, rest)), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/forms/Textarea.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Textarea — multi-line field, same visual language as Input. */
function Textarea({
  label,
  hint,
  error,
  id,
  placeholder,
  value,
  defaultValue,
  rows = 4,
  disabled = false,
  required = false,
  onChange,
  style = {},
  ...rest
}) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  const borderColor = error ? 'var(--error-500)' : focus ? 'var(--green-600)' : 'var(--border-default)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.4rem',
      width: '100%',
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("label", {
    htmlFor: inputId,
    style: {
      fontSize: 'var(--text-sm)',
      fontWeight: 'var(--fw-medium)'
    }
  }, label, required && /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--error-500)',
      marginLeft: 2
    }
  }, "*")), /*#__PURE__*/React.createElement("textarea", _extends({
    id: inputId,
    rows: rows,
    placeholder: placeholder,
    value: value,
    defaultValue: defaultValue,
    disabled: disabled,
    required: required,
    onChange: onChange,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      width: '100%',
      resize: 'vertical',
      padding: '0.75rem 0.9rem',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)',
      background: disabled ? 'var(--neutral-100)' : 'var(--surface-card)',
      border: `1.5px solid ${borderColor}`,
      borderRadius: 'var(--radius-md)',
      outline: 'none',
      boxShadow: focus ? '0 0 0 3px var(--focus-ring)' : 'none',
      transition: 'border-color var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard)'
    }
  }, rest)), (hint || error) && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-xs)',
      color: error ? 'var(--error-500)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Textarea });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Textarea.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/About.jsx
try { (() => {
// ISKT website — "Kim jesteśmy?" about band + stats.
const {
  SectionHeading,
  StatCard
} = window.ISKTGreenovationDesignSystem_1705b2;
function About() {
  const stats = [['100+', 'Projektów'], ['50+', 'Klientów'], ['15+', 'Lat'], ['24/7', 'Wsparcie']];
  return /*#__PURE__*/React.createElement("section", {
    id: "about",
    style: {
      padding: 'var(--section-pad-y) var(--container-pad)',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.1fr 1fr',
      gap: 'var(--space-16)',
      alignItems: 'center'
    },
    className: "iskt-about-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    eyebrow: "O nas",
    title: "Kim jeste\u015Bmy?",
    subtitle: "ISKT Greenovation to zesp\xF3\u0142 ekspert\xF3w \u0142\u0105cz\u0105cych pasj\u0119 do innowacji technologicznych."
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-secondary)',
      fontSize: 'var(--text-lg)',
      lineHeight: 'var(--lh-relaxed)',
      marginTop: 'var(--space-4)'
    }
  }, "Wspieramy organizacje w transformacji cyfrowej, wdra\u017Caniu rozwi\u0105za\u0144 AI i strategiach ESG.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)',
      padding: 'var(--space-8)',
      borderRadius: 'var(--radius-xl)',
      background: 'var(--surface-muted)',
      border: '1px solid var(--green-200)'
    }
  }, stats.map(([v, l]) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      background: '#fff',
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-xs)',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(StatCard, {
    value: v,
    label: l
  })))))));
}
window.About = About;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/About.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Contact.jsx
try { (() => {
// ISKT website — contact section with details + working (fake) form.
const {
  SectionHeading,
  Input,
  Textarea,
  Button,
  Icon,
  Card
} = window.ISKTGreenovationDesignSystem_1705b2;
function Contact() {
  const [sent, setSent] = React.useState(false);
  const details = [['mail', 'Email', 'biuro@iskt.pl'], ['phone', 'Telefon', '+48 504 083 825'], ['map-pin', 'Lokalizacja', 'Żory, Polska']];
  return /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      padding: 'var(--section-pad-y) var(--container-pad)',
      background: 'var(--surface-page)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Kontakt",
    title: "Skontaktuj si\u0119 z nami",
    subtitle: "Porozmawiajmy o Twoim projekcie"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '0.9fr 1.1fr',
      gap: 'var(--space-12)',
      marginTop: 'var(--space-12)'
    },
    className: "iskt-contact-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, details.map(([icon, label, val]) => /*#__PURE__*/React.createElement("div", {
    key: label,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--green-50)',
      color: 'var(--green-700)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 22
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-sm)',
      color: 'var(--text-muted)'
    }
  }, label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 'var(--text-lg)',
      fontWeight: 'var(--fw-semibold)'
    }
  }, val))))), /*#__PURE__*/React.createElement(Card, {
    padding: "lg"
  }, sent ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      padding: 'var(--space-10) 0'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      color: 'var(--green-600)'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "circle-check-big",
    size: 48
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      marginTop: 'var(--space-4)'
    }
  }, "Dzi\u0119kujemy!"), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--text-secondary)',
      margin: 0
    }
  }, "Odezwiemy si\u0119 najszybciej jak to mo\u017Cliwe.")) : /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setSent(true);
    },
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 'var(--space-4)'
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Imi\u0119 i nazwisko",
    placeholder: "Jan Kowalski",
    required: true
  }), /*#__PURE__*/React.createElement(Input, {
    label: "Email",
    type: "email",
    placeholder: "jan@firma.pl",
    required: true
  })), /*#__PURE__*/React.createElement(Textarea, {
    label: "Wiadomo\u015B\u0107",
    rows: 4,
    placeholder: "Opisz sw\xF3j projekt\u2026",
    required: true
  }), /*#__PURE__*/React.createElement(Button, {
    type: "submit",
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "send",
      size: 18
    })
  }, "Wy\u015Blij wiadomo\u015B\u0107"))))));
}
window.Contact = Contact;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Contact.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Footer.jsx
try { (() => {
// ISKT website — footer.
const {
  Logo
} = window.ISKTGreenovationDesignSystem_1705b2;
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--ink-900)',
      color: 'var(--neutral-300)',
      padding: 'var(--space-16) var(--container-pad) var(--space-8)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1.6fr 1fr 1fr',
      gap: 'var(--space-12)'
    },
    className: "iskt-footer-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Logo, {
    src: "../../assets/iskt-logo-transparent.png",
    height: 40,
    onDark: true,
    color: "#fff"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 'var(--space-4)',
      maxWidth: 360,
      lineHeight: 'var(--lh-relaxed)'
    }
  }, "Innowacje technologiczne w harmonii ze zr\xF3wnowa\u017Conym rozwojem.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      color: '#fff',
      fontSize: 'var(--text-base)',
      margin: '0 0 var(--space-4)'
    }
  }, "Nasze us\u0142ugi"), ['Projekty B+R', 'ESG i Zrównoważony Rozwój', 'AI i Transformacja Cyfrowa', 'Wsparcie Startupów'].map(s => /*#__PURE__*/React.createElement("div", {
    key: s,
    style: {
      padding: '0.3rem 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "#services",
    style: {
      color: 'var(--neutral-300)'
    }
  }, s)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h4", {
    style: {
      color: '#fff',
      fontSize: 'var(--text-base)',
      margin: '0 0 var(--space-4)'
    }
  }, "Kontakt"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.3rem 0'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "mailto:biuro@iskt.pl",
    style: {
      color: 'var(--neutral-300)'
    }
  }, "biuro@iskt.pl")), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.3rem 0'
    }
  }, "NIP: 6511752112"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.3rem 0'
    }
  }, "REGON: 543251405"), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0.3rem 0'
    }
  }, "\u017Bory, Polska"))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 'var(--space-12)',
      paddingTop: 'var(--space-6)',
      borderTop: '1px solid var(--ink-700)',
      fontSize: 'var(--text-sm)',
      color: 'var(--neutral-500)'
    }
  }, "\xA9 2025 ISKT Greenovation Sp. z o.o. Wszystkie prawa zastrze\u017Cone.")));
}
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Hero.jsx
try { (() => {
// ISKT website — hero. Centred, green wash, the globe mark, gradient CTA.
const {
  Button,
  Icon,
  Badge
} = window.ISKTGreenovationDesignSystem_1705b2;
function Hero({
  onNav
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: 'var(--gradient-wash)',
      padding: 'calc(var(--section-pad-y) + 1rem) var(--container-pad) var(--section-pad-y)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      top: '-18%',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 620,
      height: 620,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(84,132,29,0.16), transparent 62%)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'var(--space-6)'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/iskt-logo-transparent.png",
    alt: "",
    style: {
      height: 132,
      width: 'auto',
      filter: 'drop-shadow(0 12px 28px rgba(30,85,29,0.22))'
    }
  }), /*#__PURE__*/React.createElement(Badge, {
    tone: "lime"
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "sprout",
    size: 14
  }), "\xA0Innowacje w harmonii z natur\u0105"), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
      fontWeight: 'var(--fw-extrabold)',
      letterSpacing: 'var(--ls-tighter)',
      lineHeight: 1.02
    }
  }, "Innowacje w Harmonii", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'var(--gradient-brand)',
      WebkitBackgroundClip: 'text',
      backgroundClip: 'text',
      color: 'transparent'
    }
  }, "z Natur\u0105")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: 620,
      fontSize: 'var(--text-xl)',
      lineHeight: 'var(--lh-relaxed)',
      color: 'var(--text-secondary)'
    }
  }, "\u0141\u0105czymy technologie przysz\u0142o\u015Bci ze zr\xF3wnowa\u017Conym rozwojem, tworz\u0105c rozwi\u0105zania dla odpowiedzialnego biznesu."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: '0.9rem',
      flexWrap: 'wrap',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    iconRight: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    }),
    onClick: () => onNav && onNav('services')
  }, "Poznaj nasze us\u0142ugi"), /*#__PURE__*/React.createElement(Button, {
    size: "lg",
    variant: "outline",
    onClick: () => onNav && onNav('contact')
  }, "Skontaktuj si\u0119"))));
}
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
// ISKT website — top navigation bar. Sticky, blurs on scroll, mobile menu toggle.
const {
  Button,
  Logo,
  IconButton,
  Icon
} = window.ISKTGreenovationDesignSystem_1705b2;
function Nav({
  onNav
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  React.useEffect(() => {
    const el = document.querySelector('[data-site-scroll]') || window;
    const t = el === window ? window : el;
    const onScroll = () => setScrolled((t.scrollTop || window.scrollY) > 20);
    t.addEventListener('scroll', onScroll);
    return () => t.removeEventListener('scroll', onScroll);
  }, []);
  const links = [['about', 'O nas'], ['services', 'Usługi'], ['contact', 'Kontakt']];
  const go = id => {
    setOpen(false);
    onNav && onNav(id);
  };
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: scrolled ? 'rgba(255,255,255,0.82)' : 'transparent',
      backdropFilter: scrolled ? 'saturate(180%) blur(12px)' : 'none',
      borderBottom: scrolled ? '1px solid var(--border-subtle)' : '1px solid transparent',
      transition: 'background var(--dur-base) var(--ease-standard), border-color var(--dur-base) var(--ease-standard)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto',
      padding: '0.9rem var(--container-pad)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    src: "../../assets/iskt-logo-transparent.png",
    height: 40
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '2rem'
    },
    className: "iskt-desktop-nav"
  }, links.map(([id, label]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    onClick: () => go(id),
    style: {
      cursor: 'pointer',
      fontWeight: 'var(--fw-medium)',
      fontSize: 'var(--text-base)',
      color: 'var(--text-primary)'
    }
  }, label)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    onClick: () => go('contact')
  }, "Skontaktuj si\u0119")), /*#__PURE__*/React.createElement("div", {
    className: "iskt-mobile-nav",
    style: {
      display: 'none'
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    ariaLabel: "Menu",
    variant: "ghost",
    onClick: () => setOpen(o => !o)
  }, /*#__PURE__*/React.createElement(Icon, {
    name: open ? 'x' : 'menu'
  })))), open && /*#__PURE__*/React.createElement("div", {
    className: "iskt-mobile-nav",
    style: {
      display: 'none',
      flexDirection: 'column',
      gap: '0.25rem',
      padding: '0.5rem var(--container-pad) 1.25rem',
      background: '#fff',
      borderBottom: '1px solid var(--border-subtle)'
    }
  }, links.map(([id, label]) => /*#__PURE__*/React.createElement("a", {
    key: id,
    onClick: () => go(id),
    style: {
      cursor: 'pointer',
      padding: '0.6rem 0',
      fontWeight: 'var(--fw-medium)'
    }
  }, label)), /*#__PURE__*/React.createElement(Button, {
    size: "sm",
    fullWidth: true,
    onClick: () => go('contact'),
    style: {
      marginTop: '0.5rem'
    }
  }, "Skontaktuj si\u0119")));
}
window.Nav = Nav;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Services.jsx
try { (() => {
// ISKT website — "Nasze Kompetencje" services grid.
const {
  SectionHeading,
  ServiceCard,
  Icon
} = window.ISKTGreenovationDesignSystem_1705b2;
function Services() {
  const items = [['flask-conical', 'Projekty B+R', 'Innowacyjne rozwiązania badawczo-rozwojowe wspierające rozwój Twojej organizacji.'], ['recycle', 'ESG i Zrównoważony Rozwój', 'Strategie i wdrożenia praktyk odpowiedzialnego biznesu zgodnych z normami środowiskowymi.'], ['cpu', 'AI i Transformacja Cyfrowa', 'Implementacja sztucznej inteligencji i nowoczesnych technologii w procesach biznesowych.'], ['rocket', 'Startupy', 'Kompleksowe wsparcie dla startupów – od pomysłu po skalowanie biznesu.'], ['code-xml', 'Rozwój Oprogramowania', 'Tworzenie dedykowanych rozwiązań software\u2019owych dopasowanych do potrzeb Twojej firmy.'], ['graduation-cap', 'Szkolenia', 'Profesjonalne szkolenia z zakresu technologii, innowacji i zrównoważonego rozwoju.']];
  return /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      padding: 'var(--section-pad-y) var(--container-pad)',
      background: 'var(--surface-subtle)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    eyebrow: "Us\u0142ugi",
    title: "Nasze Kompetencje",
    subtitle: "Kompleksowe rozwi\u0105zania dla nowoczesnego biznesu"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-12)'
    },
    className: "iskt-services-grid"
  }, items.map(([icon, title, desc]) => /*#__PURE__*/React.createElement(ServiceCard, {
    key: title,
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: icon,
      size: 26
    }),
    title: title,
    description: desc
  })))));
}
window.Services = Services;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Services.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/WhyUs.jsx
try { (() => {
// ISKT website — "Dlaczego warto" dark band with three pillars.
const {
  SectionHeading,
  Icon
} = window.ISKTGreenovationDesignSystem_1705b2;
function WhyUs() {
  const pillars = [['sparkles', 'Innowacyjność', 'Najnowsze technologie'], ['leaf', 'Zrównoważenie', 'Odpowiedzialny rozwój'], ['shield-check', 'Ekspertyza', 'Doświadczony zespół']];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      padding: 'var(--section-pad-y) var(--container-pad)',
      background: 'var(--ink-900)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      right: '-8%',
      top: '-20%',
      width: 460,
      height: 460,
      borderRadius: '50%',
      background: 'radial-gradient(circle, rgba(84,132,29,0.22), transparent 60%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      maxWidth: 'var(--container-max)',
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 720
    }
  }, /*#__PURE__*/React.createElement(SectionHeading, {
    align: "left",
    onDark: true,
    eyebrow: "Dlaczego my",
    title: "Dlaczego warto z nami wsp\xF3\u0142pracowa\u0107?",
    subtitle: "Po\u0142\u0105czenie technologicznej ekspertyzy z odpowiedzialno\u015Bci\u0105 za \u015Brodowisko \u2014 rozwi\u0105zania, kt\xF3re zwi\u0119kszaj\u0105 efektywno\u015B\u0107 i dbaj\u0105 o przysz\u0142o\u015B\u0107 planety."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 'var(--space-6)',
      marginTop: 'var(--space-12)'
    },
    className: "iskt-why-grid"
  }, pillars.map(([icon, title, desc]) => /*#__PURE__*/React.createElement("div", {
    key: title,
    style: {
      padding: 'var(--space-8)',
      borderRadius: 'var(--radius-lg)',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid var(--ink-700)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 52,
      height: 52,
      borderRadius: 'var(--radius-md)',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--green-700)',
      color: '#fff'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: icon,
    size: 24
  })), /*#__PURE__*/React.createElement("h3", {
    style: {
      color: '#fff',
      margin: 'var(--space-5) 0 var(--space-2)',
      fontSize: 'var(--text-xl)'
    }
  }, title), /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'var(--neutral-300)',
      margin: 0
    }
  }, desc))))));
}
window.WhyUs = WhyUs;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/WhyUs.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.SectionHeading = __ds_scope.SectionHeading;

__ds_ns.ServiceCard = __ds_scope.ServiceCard;

__ds_ns.StatCard = __ds_scope.StatCard;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Textarea = __ds_scope.Textarea;

})();
