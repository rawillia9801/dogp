export type PlanKey = "starter" | "pro" | "elite";

export type Plan = {
  code: PlanKey;
  name: string;
  price: number;
  popular?: boolean;
  limits: {
    dogs: number | "Unlimited";
    litters: number | "Unlimited";
    users: number | "Unlimited";
  };
  highlights: string[];
};

export const plans: Plan[] = [
  {
    code: "starter",
    name: "Starter",
    price: 29,
    limits: {
      dogs: 20,
      litters: 3,
      users: 1,
    },
    highlights: [
      "Dashboard, dogs, litters, and puppies",
      "Breeding program workspace",
      "Basic dashboard and settings",
    ],
  },
  {
    code: "pro",
    name: "Professional",
    price: 79,
    popular: true,
    limits: {
      dogs: 75,
      litters: 12,
      users: 4,
    },
    highlights: [
      "Everything in Starter",
      "Buyers, applications, and payments",
      "Documents, transportation, and automation",
    ],
  },
  {
    code: "elite",
    name: "Premium",
    price: 149,
    limits: {
      dogs: "Unlimited",
      litters: "Unlimited",
      users: "Unlimited",
    },
    highlights: [
      "Everything in Professional",
      "AI Documents and Website Builder",
      "ChiChi AI and premium workflows",
      "Expanded limits and multi-user operations",
    ],
  },
];

export const comparisonRows = [
  ["Dogs limit", "20", "75", "Unlimited"],
  ["Litters limit", "3", "12", "Unlimited"],
  ["Users", "1", "4", "Unlimited"],
  ["Breeding workspace", "Included", "Included", "Included"],
  ["Buyer operations", "-", "Included", "Included"],
  ["Payments and documents", "-", "Included", "Included"],
  ["Automation notices", "-", "Included", "Included"],
  ["AI tools", "-", "-", "Included"],
];
