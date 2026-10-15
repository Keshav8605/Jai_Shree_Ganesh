import React from "react";

// ===== TEDDY BEAR =====
export const TeddyBear: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Ears */}
    <circle cx="60" cy="45" r="28" fill="#C4956A" />
    <circle cx="60" cy="45" r="18" fill="#E8C4A0" />
    <circle cx="140" cy="45" r="28" fill="#C4956A" />
    <circle cx="140" cy="45" r="18" fill="#E8C4A0" />
    {/* Head */}
    <ellipse cx="100" cy="90" rx="55" ry="52" fill="#D4A574" />
    {/* Face area */}
    <ellipse cx="100" cy="100" rx="35" ry="30" fill="#E8C4A0" />
    {/* Eyes */}
    <circle cx="82" cy="85" r="5" fill="#3D2515" />
    <circle cx="118" cy="85" r="5" fill="#3D2515" />
    <circle cx="84" cy="83" r="2" fill="white" />
    <circle cx="120" cy="83" r="2" fill="white" />
    {/* Nose */}
    <ellipse cx="100" cy="97" rx="7" ry="5" fill="#3D2515" />
    {/* Mouth */}
    <path
      d="M93 103 Q100 110 107 103"
      stroke="#3D2515"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Blush */}
    <ellipse cx="72" cy="100" rx="10" ry="6" fill="#FFB5C5" opacity="0.5" />
    <ellipse cx="128" cy="100" rx="10" ry="6" fill="#FFB5C5" opacity="0.5" />
    {/* Body */}
    <ellipse cx="100" cy="160" rx="45" ry="38" fill="#D4A574" />
    {/* Belly */}
    <ellipse cx="100" cy="162" rx="28" ry="25" fill="#E8C4A0" />
    {/* Arms */}
    <ellipse
      cx="55"
      cy="150"
      rx="14"
      ry="22"
      fill="#D4A574"
      transform="rotate(-15,55,150)"
    />
    <ellipse
      cx="145"
      cy="150"
      rx="14"
      ry="22"
      fill="#D4A574"
      transform="rotate(15,145,150)"
    />
    {/* Heart */}
    <path
      d="M92 155 C92 150, 86 146, 86 150 C86 155, 92 162, 100 168 C108 162, 114 155, 114 150 C114 146, 108 150, 108 155 C108 160, 100 168, 100 168 C100 168, 92 160, 92 155Z"
      fill="#FF5C93"
    />
  </svg>
);

// ===== PANDA =====
export const Panda: React.FC<{ size?: number; className?: string }> = ({
  size = 120,
  className = "",
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Ears */}
    <circle cx="60" cy="42" r="25" fill="#3D3D3D" />
    <circle cx="140" cy="42" r="25" fill="#3D3D3D" />
    {/* Head */}
    <ellipse cx="100" cy="88" rx="52" ry="50" fill="white" />
    {/* Eye patches */}
    <ellipse
      cx="78" cy="82" rx="18" ry="16"
      fill="#3D3D3D"
      transform="rotate(-5,78,82)"
    />
    <ellipse
      cx="122" cy="82" rx="18" ry="16"
      fill="#3D3D3D"
      transform="rotate(5,122,82)"
    />
    {/* Eyes */}
    <circle cx="78" cy="82" r="7" fill="white" />
    <circle cx="78" cy="83" r="4" fill="#1a1a1a" />
    <circle cx="80" cy="81" r="1.5" fill="white" />
    <circle cx="122" cy="82" r="7" fill="white" />
    <circle cx="122" cy="83" r="4" fill="#1a1a1a" />
    <circle cx="124" cy="81" r="1.5" fill="white" />
    {/* Nose */}
    <ellipse cx="100" cy="96" rx="6" ry="4" fill="#3D3D3D" />
    {/* Mouth */}
    <path
      d="M94 101 Q100 107 106 101"
      stroke="#3D3D3D"
      strokeWidth="1.8"
      fill="none"
      strokeLinecap="round"
    />
    {/* Blush */}
    <ellipse cx="68" cy="97" rx="9" ry="5" fill="#FFB5C5" opacity="0.6" />
    <ellipse cx="132" cy="97" rx="9" ry="5" fill="#FFB5C5" opacity="0.6" />
    {/* Body */}
    <ellipse cx="100" cy="158" rx="42" ry="38" fill="white" />
    {/* Arms */}
    <ellipse
      cx="58"
      cy="148"
      rx="14"
      ry="22"
      fill="#3D3D3D"
      transform="rotate(-10,58,148)"
    />
    <ellipse
      cx="142"
      cy="148"
      rx="14"
      ry="22"
      fill="#3D3D3D"
      transform="rotate(10,142,148)"
    />
    {/* Belly area */}
    <ellipse cx="100" cy="160" rx="25" ry="22" fill="#F5F5F5" />
  </svg>
);

// ===== CUDDLING COUPLE (Teddy + Panda) =====
export const CuddlingCouple: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 200, className = "" }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 300 200"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* TEDDY (left) */}
    <g transform="translate(60, 20) scale(0.8)">
      {/* Ears */}
      <circle cx="55" cy="32" r="20" fill="#C4956A" />
      <circle cx="55" cy="32" r="12" fill="#E8C4A0" />
      <circle cx="120" cy="32" r="20" fill="#C4956A" />
      <circle cx="120" cy="32" r="12" fill="#E8C4A0" />
      {/* Head */}
      <ellipse cx="88" cy="68" rx="42" ry="40" fill="#D4A574" />
      {/* Face */}
      <ellipse cx="88" cy="76" rx="27" ry="22" fill="#E8C4A0" />
      {/* Eyes */}
      <circle cx="76" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="100" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="77.5" cy="63.5" r="1.2" fill="white" />
      <circle cx="101.5" cy="63.5" r="1.2" fill="white" />
      {/* Nose & mouth */}
      <ellipse cx="88" cy="74" rx="5" ry="3.5" fill="#3D2515" />
      <path d="M82 78 Q88 83 94 78" stroke="#3D2515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="66" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      <ellipse cx="110" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      {/* Body */}
      <ellipse cx="88" cy="130" rx="35" ry="30" fill="#D4A574" />
      <ellipse cx="88" cy="132" rx="22" ry="20" fill="#E8C4A0" />
    </g>

    {/* PANDA (right, slightly overlapping) */}
    <g transform="translate(130, 25) scale(0.8)">
      {/* Ears */}
      <circle cx="50" cy="30" r="18" fill="#3D3D3D" />
      <circle cx="115" cy="30" r="18" fill="#3D3D3D" />
      {/* Head */}
      <ellipse cx="82" cy="63" rx="40" ry="38" fill="white" />
      {/* Eye patches */}
      <ellipse cx="66" cy="58" rx="14" ry="12" fill="#3D3D3D" transform="rotate(-5,66,58)" />
      <ellipse cx="98" cy="58" rx="14" ry="12" fill="#3D3D3D" transform="rotate(5,98,58)" />
      {/* Eyes */}
      <circle cx="66" cy="58" r="5" fill="white" />
      <circle cx="66" cy="59" r="3" fill="#1a1a1a" />
      <circle cx="68" cy="57" r="1" fill="white" />
      <circle cx="98" cy="58" r="5" fill="white" />
      <circle cx="98" cy="59" r="3" fill="#1a1a1a" />
      <circle cx="100" cy="57" r="1" fill="white" />
      {/* Nose & mouth */}
      <ellipse cx="82" cy="70" rx="4.5" ry="3" fill="#3D3D3D" />
      <path d="M77 74 Q82 79 87 74" stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Blush */}
      <ellipse cx="56" cy="72" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      <ellipse cx="108" cy="72" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      {/* Body */}
      <ellipse cx="82" cy="125" rx="32" ry="28" fill="white" />
      <ellipse cx="82" cy="127" rx="20" ry="18" fill="#F5F5F5" />
      {/* Arm reaching toward teddy */}
      <ellipse
        cx="48" cy="115" rx="12" ry="18"
        fill="#3D3D3D"
        transform="rotate(-20,48,115)"
      />
    </g>

    {/* Small heart between them */}
    <g transform="translate(148, 75)">
      <path
        d="M0 6 C0 2, -6 -1, -6 3 C-6 7, 0 12, 0 12 C0 12, 6 7, 6 3 C6 -1, 0 2, 0 6Z"
        fill="#FF5C93"
      />
    </g>

    {/* Floating hearts */}
    <g opacity="0.6">
      <path d="M40 30 C40 28, 37 26, 37 28 C37 30, 40 33, 40 33 C40 33, 43 30, 43 28 C43 26, 40 28, 40 30Z" fill="#FFA0B8" />
      <path d="M250 20 C250 18, 247 16, 247 18 C247 20, 250 23, 250 23 C250 23, 253 20, 253 18 C253 16, 250 18, 250 20Z" fill="#FF5C93" />
      <path d="M270 60 C270 58, 267 56, 267 58 C267 60, 270 63, 270 63 C270 63, 273 60, 273 58 C273 56, 270 58, 270 60Z" fill="#FFA0B8" />
      <path d="M20 70 C20 68, 17 66, 17 68 C17 70, 20 73, 20 73 C20 73, 23 70, 23 68 C23 66, 20 68, 20 70Z" fill="#FFE4EC" />
    </g>
  </svg>
);

// ===== PANDA WITH PHONE =====
export const PandaWithPhone: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 150, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 200 200"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Ears */}
    <circle cx="60" cy="38" r="22" fill="#3D3D3D" />
    <circle cx="140" cy="38" r="22" fill="#3D3D3D" />
    {/* Head */}
    <ellipse cx="100" cy="78" rx="48" ry="46" fill="white" />
    {/* Eye patches */}
    <ellipse cx="80" cy="72" rx="16" ry="14" fill="#3D3D3D" transform="rotate(-5,80,72)" />
    <ellipse cx="120" cy="72" rx="16" ry="14" fill="#3D3D3D" transform="rotate(5,120,72)" />
    {/* Eyes - cute sparkly */}
    <circle cx="80" cy="72" r="6" fill="white" />
    <circle cx="80" cy="73" r="3.5" fill="#1a1a1a" />
    <circle cx="82" cy="71" r="1.5" fill="white" />
    <circle cx="120" cy="72" r="6" fill="white" />
    <circle cx="120" cy="73" r="3.5" fill="#1a1a1a" />
    <circle cx="122" cy="71" r="1.5" fill="white" />
    {/* Nose */}
    <ellipse cx="100" cy="86" rx="5" ry="3.5" fill="#3D3D3D" />
    {/* Mouth - nervous */}
    <path d="M95 91 Q100 89 105 91" stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    {/* Blush */}
    <ellipse cx="68" cy="88" rx="8" ry="5" fill="#FFB5C5" opacity="0.6" />
    <ellipse cx="132" cy="88" rx="8" ry="5" fill="#FFB5C5" opacity="0.6" />
    {/* Body */}
    <ellipse cx="100" cy="148" rx="38" ry="35" fill="white" />
    {/* Arms */}
    <ellipse cx="60" cy="140" rx="12" ry="20" fill="#3D3D3D" transform="rotate(-5,60,140)" />
    <ellipse cx="140" cy="140" rx="12" ry="20" fill="#3D3D3D" transform="rotate(5,140,140)" />
    {/* Phone in paws */}
    <rect x="86" y="130" width="28" height="40" rx="4" fill="#555" />
    <rect x="89" y="133" width="22" height="32" rx="2" fill="#88CCFF" />
    {/* Heart on phone screen */}
    <path
      d="M100 143 C100 140, 95 138, 95 141 C95 144, 100 149, 100 149 C100 149, 105 144, 105 141 C105 138, 100 140, 100 143Z"
      fill="#FF5C93"
    />
    {/* Belly */}
    <ellipse cx="100" cy="150" rx="22" ry="20" fill="#F5F5F5" />
  </svg>
);

// ===== COUPLE HOLDING HANDS =====
export const CoupleHolding: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 200, className = "" }) => (
  <svg
    width={size}
    height={size * 0.55}
    viewBox="0 0 300 160"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* TEDDY (left) */}
    <g transform="translate(40, 10) scale(0.65)">
      <circle cx="55" cy="32" r="20" fill="#C4956A" />
      <circle cx="55" cy="32" r="12" fill="#E8C4A0" />
      <circle cx="120" cy="32" r="20" fill="#C4956A" />
      <circle cx="120" cy="32" r="12" fill="#E8C4A0" />
      <ellipse cx="88" cy="68" rx="42" ry="40" fill="#D4A574" />
      <ellipse cx="88" cy="76" rx="27" ry="22" fill="#E8C4A0" />
      <circle cx="76" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="100" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="77.5" cy="63.5" r="1.2" fill="white" />
      <circle cx="101.5" cy="63.5" r="1.2" fill="white" />
      <ellipse cx="88" cy="74" rx="5" ry="3.5" fill="#3D2515" />
      <path d="M82 78 Q88 83 94 78" stroke="#3D2515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="66" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      <ellipse cx="110" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      <ellipse cx="88" cy="130" rx="35" ry="30" fill="#D4A574" />
      <ellipse cx="88" cy="132" rx="22" ry="20" fill="#E8C4A0" />
      {/* Right arm extended */}
      <ellipse cx="125" cy="120" rx="12" ry="18" fill="#D4A574" transform="rotate(20,125,120)" />
    </g>

    {/* PANDA (right) */}
    <g transform="translate(150, 15) scale(0.65)">
      <circle cx="50" cy="28" r="18" fill="#3D3D3D" />
      <circle cx="115" cy="28" r="18" fill="#3D3D3D" />
      <ellipse cx="82" cy="60" rx="40" ry="38" fill="white" />
      <ellipse cx="66" cy="55" rx="14" ry="12" fill="#3D3D3D" transform="rotate(-5,66,55)" />
      <ellipse cx="98" cy="55" rx="14" ry="12" fill="#3D3D3D" transform="rotate(5,98,55)" />
      <circle cx="66" cy="55" r="5" fill="white" />
      <circle cx="66" cy="56" r="3" fill="#1a1a1a" />
      <circle cx="68" cy="54" r="1" fill="white" />
      <circle cx="98" cy="55" r="5" fill="white" />
      <circle cx="98" cy="56" r="3" fill="#1a1a1a" />
      <circle cx="100" cy="54" r="1" fill="white" />
      <ellipse cx="82" cy="67" rx="4.5" ry="3" fill="#3D3D3D" />
      <path d="M77 71 Q82 76 87 71" stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="56" cy="69" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      <ellipse cx="108" cy="69" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      <ellipse cx="82" cy="122" rx="32" ry="28" fill="white" />
      <ellipse cx="82" cy="124" rx="20" ry="18" fill="#F5F5F5" />
      {/* Left arm extended */}
      <ellipse cx="48" cy="115" rx="12" ry="18" fill="#3D3D3D" transform="rotate(-20,48,115)" />
    </g>

    {/* Hands meeting */}
    <circle cx="150" cy="95" r="6" fill="#E8C4A0" />
    <circle cx="148" cy="93" r="5" fill="white" />

    {/* Heart above hands */}
    <path
      d="M150 78 C150 74, 144 71, 144 75 C144 79, 150 85, 150 85 C150 85, 156 79, 156 75 C156 71, 150 74, 150 78Z"
      fill="#FF5C93"
    />
  </svg>
);

// ===== HUGGING COUPLE =====
export const HuggingCouple: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 200, className = "" }) => (
  <svg
    width={size}
    height={size * 0.8}
    viewBox="0 0 240 200"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* TEDDY */}
    <g transform="translate(30, 15) scale(0.75)">
      <circle cx="55" cy="32" r="20" fill="#C4956A" />
      <circle cx="55" cy="32" r="12" fill="#E8C4A0" />
      <circle cx="120" cy="32" r="20" fill="#C4956A" />
      <circle cx="120" cy="32" r="12" fill="#E8C4A0" />
      <ellipse cx="88" cy="68" rx="42" ry="40" fill="#D4A574" />
      <ellipse cx="88" cy="76" rx="27" ry="22" fill="#E8C4A0" />
      <circle cx="76" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="100" cy="65" r="3.5" fill="#3D2515" />
      <circle cx="77.5" cy="63.5" r="1.2" fill="white" />
      <circle cx="101.5" cy="63.5" r="1.2" fill="white" />
      <ellipse cx="88" cy="74" rx="5" ry="3.5" fill="#3D2515" />
      <path d="M82 78 Q88 83 94 78" stroke="#3D2515" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <ellipse cx="66" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      <ellipse cx="110" cy="76" rx="7" ry="4" fill="#FFB5C5" opacity="0.5" />
      <ellipse cx="88" cy="130" rx="35" ry="30" fill="#D4A574" />
      <ellipse cx="88" cy="132" rx="22" ry="20" fill="#E8C4A0" />
      {/* Right arm hugging */}
      <ellipse cx="130" cy="120" rx="13" ry="22" fill="#D4A574" transform="rotate(25,130,120)" />
    </g>

    {/* PANDA */}
    <g transform="translate(100, 18) scale(0.75)">
      <circle cx="50" cy="28" r="18" fill="#3D3D3D" />
      <circle cx="115" cy="28" r="18" fill="#3D3D3D" />
      <ellipse cx="82" cy="60" rx="40" ry="38" fill="white" />
      <ellipse cx="66" cy="55" rx="14" ry="12" fill="#3D3D3D" transform="rotate(-5,66,55)" />
      <ellipse cx="98" cy="55" rx="14" ry="12" fill="#3D3D3D" transform="rotate(5,98,55)" />
      <circle cx="66" cy="55" r="5" fill="white" />
      <circle cx="66" cy="56" r="3" fill="#1a1a1a" />
      <circle cx="68" cy="54" r="1" fill="white" />
      <circle cx="98" cy="55" r="5" fill="white" />
      <circle cx="98" cy="56" r="3" fill="#1a1a1a" />
      <circle cx="100" cy="54" r="1" fill="white" />
      <ellipse cx="82" cy="67" rx="4.5" ry="3" fill="#3D3D3D" />
      <path d="M77 71 Q82 76 87 71" stroke="#3D3D3D" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Closed happy eyes */}
      <ellipse cx="56" cy="69" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      <ellipse cx="108" cy="69" rx="7" ry="4" fill="#FFB5C5" opacity="0.6" />
      <ellipse cx="82" cy="122" rx="32" ry="28" fill="white" />
      <ellipse cx="82" cy="124" rx="20" ry="18" fill="#F5F5F5" />
      {/* Left arm hugging */}
      <ellipse cx="42" cy="115" rx="13" ry="22" fill="#3D3D3D" transform="rotate(-25,42,115)" />
    </g>

    {/* Hearts around */}
    <path d="M120 10 C120 6, 114 3, 114 7 C114 11, 120 17, 120 17 C120 17, 126 11, 126 7 C126 3, 120 6, 120 10Z" fill="#FF5C93" opacity="0.8" />
    <path d="M50 5 C50 3, 47 1, 47 3 C47 5, 50 8, 50 8 C50 8, 53 5, 53 3 C53 1, 50 3, 50 5Z" fill="#FFA0B8" opacity="0.6" />
    <path d="M200 15 C200 13, 197 11, 197 13 C197 15, 200 18, 200 18 C200 18, 203 15, 203 13 C203 11, 200 13, 200 15Z" fill="#FFA0B8" opacity="0.6" />
  </svg>
);

// ===== HEART SVG =====
export const HeartIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  filled?: boolean;
}> = ({ size = 24, color = "#FF5C93", className = "", filled = true }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={filled ? color : "none"}
    stroke={color}
    strokeWidth="2"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
);

// ===== ENVELOPE SVG =====
export const EnvelopeIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  isOpen?: boolean;
}> = ({ size = 80, color = "#FFE4EC", className = "", isOpen = false }) => (
  <svg
    width={size}
    height={size * 0.7}
    viewBox="0 0 100 70"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Envelope body */}
    <rect x="5" y="20" width="90" height="45" rx="4" fill={color} stroke="#FFA0B8" strokeWidth="1.5" />
    {/* Envelope flap */}
    <path
      d={
        isOpen
          ? "M5 20 L50 -5 L95 20"
          : "M5 20 L50 48 L95 20"
      }
      fill={isOpen ? "#FFF2F6" : color}
      stroke="#FFA0B8"
      strokeWidth="1.5"
      strokeLinejoin="round"
      style={{
        transition: "d 0.6s ease",
        transformOrigin: "50% 20px",
      }}
    />
    {/* Heart seal */}
    {!isOpen && (
      <path
        d="M50 38 C50 35, 45 33, 45 36 C45 39, 50 43, 50 43 C50 43, 55 39, 55 36 C55 33, 50 35, 50 38Z"
        fill="#FF5C93"
      />
    )}
    {/* Lines suggesting letter inside */}
    {isOpen && (
      <g>
        <line x1="25" y1="35" x2="75" y2="35" stroke="#FFA0B8" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="42" x2="65" y2="42" stroke="#FFA0B8" strokeWidth="1" opacity="0.5" />
        <line x1="25" y1="49" x2="55" y2="49" stroke="#FFA0B8" strokeWidth="1" opacity="0.5" />
      </g>
    )}
  </svg>
);

// ===== GIFT BOX SVG =====
export const GiftBoxIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
  isOpen?: boolean;
}> = ({ size = 100, color = "#FFE4EC", className = "", isOpen = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Box body */}
    <rect x="15" y="45" width="70" height="45" rx="5" fill={color} stroke="#FFA0B8" strokeWidth="2" />
    {/* Vertical ribbon */}
    <rect x="45" y="45" width="10" height="45" fill="#FF5C93" opacity="0.6" />
    {/* Horizontal ribbon */}
    <rect x="15" y="60" width="70" height="10" fill="#FF5C93" opacity="0.6" />
    {/* Box lid */}
    <g
      style={{
        transformOrigin: "50px 45px",
        transform: isOpen ? "rotateX(-120deg) translateY(-12px)" : "none",
        transition: "transform 0.5s ease",
      }}
    >
      <rect x="10" y="35" width="80" height="15" rx="4" fill={color} stroke="#FFA0B8" strokeWidth="2" />
      <rect x="42" y="35" width="16" height="15" fill="#FF5C93" opacity="0.6" />
    </g>
    {/* Bow */}
    {!isOpen && (
      <g>
        <ellipse cx="42" cy="32" rx="12" ry="8" fill="#FF5C93" transform="rotate(-15,42,32)" />
        <ellipse cx="58" cy="32" rx="12" ry="8" fill="#FF5C93" transform="rotate(15,58,32)" />
        <circle cx="50" cy="35" r="5" fill="#E8437F" />
      </g>
    )}
    {/* Star bursts when open */}
    {isOpen && (
      <g opacity="0.8">
        <text x="35" y="25" fontSize="14">✨</text>
        <text x="55" y="18" fontSize="12">💗</text>
        <text x="25" y="20" fontSize="10">⭐</text>
        <text x="65" y="28" fontSize="10">✨</text>
      </g>
    )}
  </svg>
);

// ===== FLOWER =====
export const FlowerIcon: React.FC<{
  size?: number;
  className?: string;
}> = ({ size = 40, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    fill="none"
    className={className}
    aria-hidden="true"
  >
    {/* Petals */}
    <ellipse cx="20" cy="12" rx="6" ry="8" fill="#FFA0B8" opacity="0.8" />
    <ellipse cx="20" cy="28" rx="6" ry="8" fill="#FFA0B8" opacity="0.8" />
    <ellipse cx="12" cy="20" rx="8" ry="6" fill="#FFA0B8" opacity="0.8" />
    <ellipse cx="28" cy="20" rx="8" ry="6" fill="#FFA0B8" opacity="0.8" />
    <ellipse cx="13" cy="13" rx="6" ry="7" fill="#FFB5C5" opacity="0.6" transform="rotate(-45,13,13)" />
    <ellipse cx="27" cy="13" rx="6" ry="7" fill="#FFB5C5" opacity="0.6" transform="rotate(45,27,13)" />
    <ellipse cx="13" cy="27" rx="6" ry="7" fill="#FFB5C5" opacity="0.6" transform="rotate(45,13,27)" />
    <ellipse cx="27" cy="27" rx="6" ry="7" fill="#FFB5C5" opacity="0.6" transform="rotate(-45,27,27)" />
    {/* Center */}
    <circle cx="20" cy="20" r="5" fill="#FFE4EC" />
    <circle cx="20" cy="20" r="3" fill="#FF5C93" />
  </svg>
);

// ===== SPARKLE STAR =====
export const SparkleIcon: React.FC<{
  size?: number;
  color?: string;
  className?: string;
}> = ({ size = 16, color = "#FFA0B8", className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    className={className}
    aria-hidden="true"
  >
    <path d="M12 0L14.59 8.41L23 12L14.59 15.59L12 24L9.41 15.59L1 12L9.41 8.41L12 0Z" />
  </svg>
);
